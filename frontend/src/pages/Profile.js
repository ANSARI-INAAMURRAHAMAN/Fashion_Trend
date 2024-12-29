import React, { useState } from 'react';
import { ActivitySquare, User, Settings, Mail, Calendar, PenSquare } from 'lucide-react';
import '../styles/Profile.css';
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock user data - replace with your actual data source
  const userData = {
    name: "Alex Thompson",
    role: "Trend Analyst",
    email: "alex.thompson@example.com",
    joinDate: "January 2024",
    trendsAnalyzed: 156,
    collaborations: 23,
    accuracy: 94.2
  };

  const stats = [
    { label: "Trends Analyzed", value: userData.trendsAnalyzed, icon: ActivitySquare },
    { label: "Collaborations", value: userData.collaborations, icon: User },
    { label: "Accuracy Rate", value: `${userData.accuracy}%`, icon: ActivitySquare }
  ];

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Profile Header Card */}
        <div className="profile-header-wrapper">
          <div className="profile-header-blur"></div>
          <div className="profile-header-card">
            <div className="profile-header-content">
              {/* Avatar Section */}
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  {userData.name.charAt(0)}
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="edit-avatar-button"
                >
                  <PenSquare size={16} />
                </button>
              </div>

              {/* User Info Section */}
              <div className="profile-info-section">
                <div className="profile-info-header">
                  <div>
                    <h1 className="profile-name">{userData.name}</h1>
                    <p className="profile-role">{userData.role}</p>
                  </div>
                  <button className="edit-profile-button">
                    Edit Profile
                  </button>
                </div>

                {/* Stats Grid */}
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

        {/* Tabs Section */}
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

          {/* Tab Content */}
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
                      <p className="info-value">{userData.joinDate}</p>
                    </div>
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
                <h2 className="content-title">Settings</h2>
                <p className="placeholder-text">Settings options will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;