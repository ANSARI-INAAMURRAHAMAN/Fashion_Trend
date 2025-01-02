// src/components/CreateTrendModal.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTrend } from '../redux/actions/trendActions';
import '../styles/CreateTrendModal.css';

const CreateTrendModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    season: '',
    category: '',
    region: '',
    imageUrls: [''],  // Array for multiple images
    status: 'Active',
    tags: [''],       // Array for multiple tags
    price: {
      min: '',
      max: ''
    },
    engagementRate: 0,
    aiPredictions: {
      growthPotential: '',
      marketFit: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Ensure field names match the backend expectations
      const submitData = {
        title: formData.title,
        description: formData.description,
        season: formData.season,
        category: formData.category,
        region: formData.region,
        imageUrls: formData.imageUrls, // Make sure we're using 'imageUrls' consistently
        status: formData.status,
        tags: formData.tags,
        price: formData.price,
        engagementRate: formData.engagementRate,
        aiPredictions: formData.aiPredictions
      };

      console.log('Submitting trend data:', submitData);
      await dispatch(createTrend(submitData));
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create trend');
      console.error('Error creating trend:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add handler for multiple images
  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData({ ...formData, imageUrls: newImageUrls });
  };

  // Add handler for tags
  const handleTagChange = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Trend</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Season</label>
            <select name="season" value={formData.season} onChange={handleChange} required>
              <option value="">Select Season</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Apparel">Apparel</option>
              <option value="Accessories">Accessories</option>
              <option value="Footwear">Footwear</option>
              <option value="Beauty">Beauty</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          <div className="form-group">
            <label>Region</label>
            <select name="region" value={formData.region} onChange={handleChange} required>
              <option value="">Select Region</option>
              <option value="Global">Global</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Image URLs */}
          <div className="form-group">
            <label>Image URLs</label>
            {formData.imageUrls.map((url, index) => (
              <input
                key={index}
                type="url"
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                placeholder="Enter image URL"
                required
              />
            ))}
            <button 
              type="button" 
              onClick={() => setFormData({ 
                ...formData, 
                imageUrls: [...formData.imageUrls, ''] 
              })}
            >
              Add Another Image
            </button>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label>Tags</label>
            {formData.tags.map((tag, index) => (
              <input
                key={index}
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                placeholder="Enter tag"
              />
            ))}
            <button 
              type="button" 
              onClick={() => setFormData({ 
                ...formData, 
                tags: [...formData.tags, ''] 
              })}
            >
              Add Tag
            </button>
          </div>

          {/* Price Range */}
          <div className="form-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                name="min"
                value={formData.price.min}
                onChange={(e) => setFormData({
                  ...formData,
                  price: { ...formData.price, min: e.target.value }
                })}
                placeholder="Min Price"
                required
              />
              <input
                type="number"
                name="max"
                value={formData.price.max}
                onChange={(e) => setFormData({
                  ...formData,
                  price: { ...formData.price, max: e.target.value }
                })}
                placeholder="Max Price"
                required
              />
            </div>
          </div>

          {/* Engagement Rate */}
          <div className="form-group">
            <label>Engagement Rate (%)</label>
            <input
              type="number"
              name="engagementRate"
              value={formData.engagementRate}
              onChange={handleChange}
              min="0"
              max="100"
              placeholder="Enter engagement rate"
              required
            />
          </div>

          {/* AI Predictions */}
          <div className="form-group">
            <label>AI Predictions</label>
            <div className="predictions-inputs">
              <div className="prediction-input">
                <label>Growth Potential (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.aiPredictions.growthPotential}
                  onChange={(e) => setFormData({
                    ...formData,
                    aiPredictions: {
                      ...formData.aiPredictions,
                      growthPotential: e.target.value
                    }
                  })}
                  placeholder="Growth potential"
                  required
                />
              </div>
              <div className="prediction-input">
                <label>Market Fit (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.aiPredictions.marketFit}
                  onChange={(e) => setFormData({
                    ...formData,
                    aiPredictions: {
                      ...formData.aiPredictions,
                      marketFit: e.target.value
                    }
                  })}
                  placeholder="Market fit"
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Create Trend</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrendModal;