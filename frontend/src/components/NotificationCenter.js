import React, { useState } from 'react';
import { Bell } from 'lucide-react';

const NotificationCenter = () => {
  const [unreadCount, setUnreadCount] = useState(3);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="notification-container">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="notification-button"
      >
        <Bell className="notification-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
          </div>
          <div className="notification-list">
            <div className="notification-item">
              <p>New trend detected in your dashboard</p>
              <span className="notification-time">2 hours ago</span>
            </div>
            <div className="notification-item">
              <p>Analysis report is ready</p>
              <span className="notification-time">5 hours ago</span>
            </div>
          </div>
          <div className="notification-footer">
            <button 
              onClick={() => setUnreadCount(0)}
              className="mark-read-button"
            >
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;