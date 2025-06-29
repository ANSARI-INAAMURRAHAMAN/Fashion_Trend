import { useEffect, useCallback } from 'react';
import { trendAnalysisService } from '../services/api';

export const useAnalyticsTracking = () => {
    const trackInteraction = useCallback(async (trendId, interactionType, metadata = {}) => {
        try {
            await trendAnalysisService.trackInteraction(trendId, interactionType, metadata);
        } catch (error) {
            // Silently handle tracking errors
            console.warn('Analytics tracking failed:', error);
        }
    }, []);

    const trackView = useCallback((trendId, duration = null) => {
        trackInteraction(trendId, 'view', { duration });
    }, [trackInteraction]);

    const trackLike = useCallback((trendId) => {
        trackInteraction(trendId, 'like');
    }, [trackInteraction]);

    const trackComment = useCallback((trendId) => {
        trackInteraction(trendId, 'comment');
    }, [trackInteraction]);

    const trackShare = useCallback((trendId, platform = null) => {
        trackInteraction(trendId, 'share', { platform });
    }, [trackInteraction]);

    const trackClick = useCallback((trendId, clickPosition) => {
        trackInteraction(trendId, 'click', { clickPosition });
    }, [trackInteraction]);

    return {
        trackView,
        trackLike,
        trackComment,
        trackShare,
        trackClick,
        trackInteraction
    };
};

export const useViewTracking = (trendId, isVisible = true) => {
    const { trackView } = useAnalyticsTracking();

    useEffect(() => {
        if (!trendId || !isVisible) return;

        const startTime = Date.now();
        trackView(trendId);

        return () => {
            const duration = Date.now() - startTime;
            if (duration > 1000) { // Only track if viewed for more than 1 second
                trackView(trendId, duration);
            }
        };
    }, [trendId, isVisible, trackView]);
};