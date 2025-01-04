import React, { useState, useEffect, useCallback } from 'react';
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

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching profile...'); // Debug log
      const data = await userService.getProfile();
      console.log('Fetched profile data:', data); // Debug log
      if (!data) throw new Error('No data received');
      setUserData(data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError(error.message || 'Failed to load profile data');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEditProfile = async () => {
    if (isEditing) {
      try {
        setLoading(true);
        // Add your update profile logic here
        await userService.updateProfile(userData);
        setIsEditing(false);
        await fetchUserProfile();
      } catch (error) {
        setError('Failed to update profile');
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const refreshCounts = async () => {
    try {
      const counts = await userService.refreshCounts();
      setUserData(prev => ({
        ...prev,
        ...counts
      }));
    } catch (error) {
      console.error('Error refreshing counts:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    let mounted = true;
    
    const loadProfile = async () => {
      if (mounted) {
        await fetchUserProfile();
        await refreshCounts(); // Add this line
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [navigate, fetchUserProfile]);

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
      label: 'Trends Created', 
      value: userData?.trendsCount || 0, 
      icon: ActivitySquare 
    },
    { 
      label: 'Teams', 
      value: userData?.teamsCount || 0, 
      icon: User 
    },
    { 
      label: 'Comments', 
      value: userData?.commentsCount || 0, 
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
                  {userData?.username?.charAt(0)?.toUpperCase() || 'U'}
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
                    <h1 className="profile-name">{userData?.username || 'User'}</h1>
                    <p className="profile-role">{userData?.role || 'User'}</p>
                  </div>
                  <button 
                    className="edit-profile-button"
                    onClick={handleEditProfile}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
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
                      <p className="info-value">{userData?.email || 'No email provided'}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <Calendar size={20} className="info-icon" />
                    <div>
                      <p className="info-label">Joined</p>
                      <p className="info-value">
                        {userData?.createdAt ? formatDate(userData.createdAt) : 'Not available'}
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