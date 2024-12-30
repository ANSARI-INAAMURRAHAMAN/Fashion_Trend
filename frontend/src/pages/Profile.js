import React, { useState, useEffect } from 'react';
import { ActivitySquare, User, Settings, Mail, Calendar, PenSquare, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import { userService } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const data = await userService.getProfile();
      setUserData(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchUserProfile}>Try Again</button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="error-container">
        <p>No profile data available</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Posts', 
      value: userData.postsCount || 0, 
      icon: ActivitySquare 
    },
    { 
      label: 'Followers', 
      value: userData.followersCount || 0, 
      icon: User 
    },
    { 
      label: 'Following', 
      value: userData.followingCount || 0, 
      icon: User 
    },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-header-wrapper">
          <div className="profile-header-blur"></div>
          <div className="profile-header-card">
            <div className="profile-header-content">
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  {userData.username?.charAt(0)?.toUpperCase()}
                </div>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="edit-avatar-button"
                  >
                    <PenSquare size={16} />
                  </button>
                )}
              </div>

              <div className="profile-info-section">
                <div className="profile-info-header">
                  <div>
                    <h1 className="profile-name">{userData.username}</h1>
                    <p className="profile-role">{userData.role || 'User'}</p>
                  </div>
                  <button 
                    className="edit-profile-button"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>

                <div className="stats-grid">
                  {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                      <div className="stat-header">
                        <stat.icon size={16} className="stat-icon" />
                        <span className="stat-label">{stat.label}</span>
                      </div>
                      <p className="stat-value">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tabs-section">
          <div className="tabs-list">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <User size={16} />
              <span>Overview</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <ActivitySquare size={16} />
              <span>Activity</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="content-card">
                <h2 className="content-title">Personal Information</h2>
                <div className="info-list">
                  <div className="info-item">
                    <Mail size={20} className="info-icon" />
                    <div>
                      <p className="info-label">Email</p>
                      <p className="info-value">{userData.email}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <Calendar size={20} className="info-icon" />
                    <div>
                      <p className="info-label">Joined</p>
                      <p className="info-value">
                        {formatDate(userData.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="logout-section">
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="content-card">
                <h2 className="content-title">Recent Activity</h2>
                <p className="placeholder-text">No recent activity to display.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="content-card">
                <h2 className="content-title">Account Settings</h2>
                <div className="settings-form">
                  {/* Add your settings form here */}
                  <p className="placeholder-text">Settings options will appear here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;