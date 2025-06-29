const TrendAnalytics = require('../models/trendAnalyticsModel');
const TrendInteraction = require('../models/trendInteractionModel');
const Trend = require('../models/trendModel');
const moment = require('moment');

class AnalyticsService {
    // Track user interaction with trends
    static async trackInteraction(userId, trendId, interactionType, metadata = {}) {
        try {
            const interaction = new TrendInteraction({
                userId,
                trendId,
                interactionType,
                metadata,
                sessionId: metadata.sessionId,
                userAgent: metadata.userAgent,
                ipAddress: metadata.ipAddress
            });
            
            await interaction.save();
            
            // Update real-time counters if needed
            if (interactionType === 'view') {
                await this.incrementTrendViews(trendId);
            }
            
            return interaction;
        } catch (error) {
            console.error('Error tracking interaction:', error);
            throw error;
        }
    }
    
    // Increment trend view counter
    static async incrementTrendViews(trendId) {
        try {
            await Trend.findByIdAndUpdate(
                trendId,
                { $inc: { views: 1 } },
                { upsert: false }
            );
        } catch (error) {
            console.error('Error incrementing views:', error);
        }
    }
    
    // Generate daily analytics for a trend
    static async generateDailyAnalytics(trendId, date = new Date()) {
        try {
            const startOfDay = moment(date).startOf('day').toDate();
            const endOfDay = moment(date).endOf('day').toDate();
            
            // Get all interactions for this trend on this day
            const interactions = await TrendInteraction.find({
                trendId,
                timestamp: { $gte: startOfDay, $lte: endOfDay }
            }).populate('userId', 'profile.age profile.gender profile.region');
            
            // Calculate metrics
            const metrics = this.calculateDailyMetrics(interactions);
            const demographics = this.calculateDemographics(interactions);
            const businessMetrics = await this.calculateBusinessMetrics(trendId, interactions);
            
            // Save or update daily analytics
            const analytics = await TrendAnalytics.findOneAndUpdate(
                { trendId, date: startOfDay },
                {
                    trendId,
                    date: startOfDay,
                    metrics,
                    demographics,
                    businessMetrics
                },
                { upsert: true, new: true }
            );
            
            return analytics;
        } catch (error) {
            console.error('Error generating daily analytics:', error);
            throw error;
        }
    }
    
    // Calculate daily metrics from interactions
    static calculateDailyMetrics(interactions) {
        const metrics = {
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            engagement: 0,
            popularityScore: 0,
            retentionRate: 0,
            growthRate: 0,
            revenue: 0,
            activeUsers: 0
        };
        
        const uniqueUsers = new Set();
        let totalEngagementActions = 0;
        
        interactions.forEach(interaction => {
            if (interaction.userId) {
                uniqueUsers.add(interaction.userId.toString());
            }
            
            switch (interaction.interactionType) {
                case 'view':
                    metrics.views++;
                    break;
                case 'like':
                    metrics.likes++;
                    totalEngagementActions++;
                    break;
                case 'comment':
                    metrics.comments++;
                    totalEngagementActions++;
                    break;
                case 'share':
                    metrics.shares++;
                    totalEngagementActions++;
                    break;
            }
        });
        
        metrics.activeUsers = uniqueUsers.size;
        metrics.engagement = metrics.views > 0 ? (totalEngagementActions / metrics.views) * 100 : 0;
        metrics.popularityScore = this.calculatePopularityScore(metrics);
        
        return metrics;
    }
    
    // Calculate demographics from interactions
    static calculateDemographics(interactions) {
        const regions = {};
        const ageGroups = {};
        const genders = {};
        
        interactions.forEach(interaction => {
            if (interaction.userId && interaction.userId.profile) {
                const { region, age, gender } = interaction.userId.profile;
                
                if (region) {
                    regions[region] = (regions[region] || 0) + 1;
                }
                
                if (age) {
                    const ageGroup = this.getAgeGroup(age);
                    ageGroups[ageGroup] = (ageGroups[ageGroup] || 0) + 1;
                }
                
                if (gender) {
                    genders[gender] = (genders[gender] || 0) + 1;
                }
            }
        });
        
        const total = interactions.length;
        
        return {
            regions: Object.entries(regions).map(([name, value]) => ({
                name,
                value,
                percentage: total > 0 ? (value / total) * 100 : 0
            })),
            ageGroups: Object.entries(ageGroups).map(([group, count]) => ({
                group,
                count,
                percentage: total > 0 ? (count / total) * 100 : 0
            })),
            genders: Object.entries(genders).map(([type, count]) => ({
                type,
                count,
                percentage: total > 0 ? (count / total) * 100 : 0
            }))
        };
    }
    
    // Calculate business metrics
    static async calculateBusinessMetrics(trendId, interactions) {
        // This would integrate with your business logic
        // For now, providing calculated estimates
        const baseMetrics = {
            predictedSales: Math.floor(Math.random() * 50000) + 10000,
            markdownRisk: this.calculateMarkdownRisk(interactions.length),
            profitMargin: Math.floor(Math.random() * 40) + 15,
            marketGrowth: Math.floor(Math.random() * 30) + 5
        };
        
        return baseMetrics;
    }
    
    // Get trend analytics for a date range
    static async getTrendAnalytics(trendId, startDate, endDate) {
        try {
            const analytics = await TrendAnalytics.find({
                trendId,
                date: {
                    $gte: moment(startDate).startOf('day').toDate(),
                    $lte: moment(endDate).endOf('day').toDate()
                }
            }).sort({ date: 1 });
            
            return analytics;
        } catch (error) {
            console.error('Error getting trend analytics:', error);
            throw error;
        }
    }
    
    // Get aggregated trend analytics
    static async getAggregatedAnalytics(trendId, period = '30d') {
        try {
            const endDate = new Date();
            const startDate = moment().subtract(parseInt(period), period.slice(-1)).toDate();
            
            const analytics = await this.getTrendAnalytics(trendId, startDate, endDate);
            
            if (analytics.length === 0) {
                return this.getDefaultAnalytics();
            }
            
            // Aggregate the data
            const aggregated = this.aggregateAnalytics(analytics);
            
            return {
                strengthIndicators: this.calculateStrengthIndicators(aggregated),
                evolutionData: this.formatEvolutionData(analytics),
                demographics: this.aggregateDemographics(analytics),
                businessImpact: this.aggregateBusinessMetrics(analytics)
            };
        } catch (error) {
            console.error('Error getting aggregated analytics:', error);
            throw error;
        }
    }
    
    // Helper methods
    static calculatePopularityScore(metrics) {
        const { views, likes, comments, shares, engagement } = metrics;
        return Math.floor((views * 0.1) + (likes * 0.3) + (comments * 0.4) + (shares * 0.5) + (engagement * 0.2));
    }
    
    static getAgeGroup(age) {
        if (age < 25) return '18-24';
        if (age < 35) return '25-34';
        if (age < 45) return '35-44';
        return '45+';
    }
    
    static calculateMarkdownRisk(interactionCount) {
        if (interactionCount > 1000) return 'low';
        if (interactionCount > 500) return 'medium';
        return 'high';
    }
    
    static getDefaultAnalytics() {
        return {
            strengthIndicators: {
                popularity: 0,
                longevity: 0,
                marketPenetration: 0,
                confidence: 0
            },
            evolutionData: [],
            demographics: {
                regions: [],
                ageGroups: []
            },
            businessImpact: {
                predictedSales: 0,
                markdownRisk: 'high',
                profitMargin: 0,
                marketGrowth: 0
            }
        };
    }
    
    static aggregateAnalytics(analytics) {
        return analytics.reduce((acc, day) => {
            Object.keys(day.metrics).forEach(key => {
                if (typeof day.metrics[key] === 'number') {
                    acc[key] = (acc[key] || 0) + day.metrics[key];
                }
            });
            return acc;
        }, {});
    }
    
    static calculateStrengthIndicators(aggregated) {
        return {
            popularity: Math.min(100, Math.floor(aggregated.popularityScore || 0)),
            longevity: Math.min(100, Math.floor((aggregated.views || 0) / 100)),
            marketPenetration: Math.min(100, Math.floor((aggregated.activeUsers || 0) / 10)),
            confidence: Math.min(100, Math.floor(aggregated.engagement || 0))
        };
    }
    
    static formatEvolutionData(analytics) {
        return analytics.slice(-12).map((day, index) => ({
            month: moment(day.date).format('MMM'),
            popularity: day.metrics.popularityScore || 0,
            engagement: day.metrics.engagement || 0,
            marketShare: Math.floor((day.metrics.activeUsers || 0) / 10)
        }));
    }
    
    static aggregateDemographics(analytics) {
        const regionMap = {};
        const ageGroupMap = {};
        
        analytics.forEach(day => {
            day.demographics.regions.forEach(region => {
                regionMap[region.name] = (regionMap[region.name] || 0) + region.value;
            });
            
            day.demographics.ageGroups.forEach(group => {
                ageGroupMap[group.group] = (ageGroupMap[group.group] || 0) + group.count;
            });
        });
        
        const totalRegions = Object.values(regionMap).reduce((sum, val) => sum + val, 0);
        const totalAgeGroups = Object.values(ageGroupMap).reduce((sum, val) => sum + val, 0);
        
        return {
            regions: Object.entries(regionMap).map(([name, value]) => ({
                name,
                value: totalRegions > 0 ? Math.floor((value / totalRegions) * 100) : 0
            })),
            ageGroups: Object.entries(ageGroupMap).map(([group, count]) => ({
                group,
                percentage: totalAgeGroups > 0 ? Math.floor((count / totalAgeGroups) * 100) : 0
            }))
        };
    }
    
    static aggregateBusinessMetrics(analytics) {
        const latest = analytics[analytics.length - 1];
        return latest ? latest.businessMetrics : {
            predictedSales: 0,
            markdownRisk: 'high',
            profitMargin: 0,
            marketGrowth: 0
        };
    }
}

module.exports = AnalyticsService;