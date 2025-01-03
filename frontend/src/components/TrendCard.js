// src/components/TrendCard.js
import React, { useState, memo } from 'react';
import { TrendingUp, Map, Clock, Package, ChevronDown, ChevronUp, Share2, MessageSquare } from 'lucide-react';
import '../styles/TrendCard.css';

const TrendCard = ({ trend }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  
  const defaultImage = "/api/placeholder/400/300";

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            content: comment.trim(),
            trendId: trend._id,
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to add comment');
        }

        setComment('');
        // Update the comments array with the new comment
        trend.comments = [...(trend.comments || []), data.data];
        setShowComments(true);
      } catch (error) {
        console.error('Failed to post comment:', error);
        alert('Failed to post comment. Please try again.');
      }
    }
  };

  return (
    <div className="trend-card">
      <div className="trend-image-container">
        <img 
          src={trend.imageUrls?.[0] || defaultImage} 
          alt={trend.title} 
          className="trend-image" 
        />
        <div className="trend-score">
          <TrendingUp className="score-icon" />
          <span>{trend.popularity}</span>
        </div>
      </div>
      
      <div className="trend-content">
        <h3 className="trend-name">{trend.title}</h3>
        <div className="trend-details">
          <div className="detail-item">
            <Map className="detail-icon" />
            <span>{trend.region}</span>
          </div>
          <div className="detail-item">
            <Clock className="detail-icon" />
            <span>{trend.season}</span>
          </div>
          <div className="detail-item">
            <Package className="detail-icon" />
            <span>{trend.category}</span>
          </div>
        </div>

        <div className="trend-metrics">
          <div className="metric">
            <span className="metric-label">Engagement</span>
            <span className="metric-value">{trend.engagementRate}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Status</span>
            <span className="metric-value">{trend.status}</span>
          </div>
        </div>

        <button 
          className="expand-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </button>

        {isExpanded && (
          <div className="expanded-content">
            <p className="trend-description">{trend.description}</p>
            <div className="trend-tags">
              {(trend.tags ?? []).map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
            <div className="ai-predictions">
              <h4>AI Predictions</h4>
              <div className="prediction-metrics">
                <div className="prediction">
                  <span>Growth Potential</span>
                  <span>{trend.aiPredictions?.growthPotential}%</span>
                </div>
                <div className="prediction">
                  <span>Market Fit</span>
                  <span>{trend.aiPredictions?.marketFit}%</span>
                </div>
              </div>
            </div>

            <div className="collaboration-section">
              <div className="actions">
                <button 
                  className="action-button"
                  onClick={() => setShowShareModal(true)}
                >
                  <Share2 size={18} />
                  Share
                </button>
                <button 
                  className="action-button"
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageSquare size={18} />
                  Comments ({trend.comments?.length || 0})
                </button>
              </div>

              {showShareModal && (
                <div className="modal">
                  <div className="modal-content">
                    <h4>Share Trend</h4>
                    <input 
                      type="email" 
                      placeholder="Enter email addresses (comma separated)"
                      className="share-input"
                    />
                    <div className="modal-actions">
                      <button onClick={() => setShowShareModal(false)}>Cancel</button>
                      <button className="primary">Share</button>
                    </div>
                  </div>
                </div>
              )}

              {showComments && (
                <div className="comments-section">
                  <div className="comments-list">
                    {trend.comments?.map((comment, index) => (
                      <div key={index} className="comment">
                        <span className="comment-author">{comment.user.username}</span>
                        <p>{comment.content}</p>
                      </div>
                    ))}
                  </div>
                  <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                    />
                    <button type="submit">Send</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(TrendCard);
