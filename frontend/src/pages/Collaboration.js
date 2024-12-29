// FashionWorkspace.js
import React, { useState } from 'react';
import { MessageSquare, CheckSquare, Users, Share2, Bell, TrendingUp, ShoppingBag, Palette, Calendar } from 'lucide-react';
import '../styles/FashionWorkspace.css';

const FashionWorkspace = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const fashionTrends = [
    { 
      id: 1, 
      title: "Y2K Revival Spring'25",
      category: "Streetwear",
      status: "In Development",
      designer: "Emma Chen",
      buyer: "Michael Ross",
      planner: "Sarah Jones",
      comments: 15,
      tasks: 8,
      forecast: "High Demand",
      colorPalette: ["#FF6B6B", "#4ECDC4", "#45B7D1"]
    },
    { 
      id: 2, 
      title: "Sustainable Luxe Collection",
      category: "Luxury",
      status: "Planning",
      designer: "Alex Kim",
      buyer: "Rachel Green",
      planner: "Tom Ford",
      comments: 23,
      tasks: 12,
      forecast: "Medium Demand",
      colorPalette: ["#2C3E50", "#ECF0F1", "#27AE60"]
    },
    { 
      id: 3, 
      title: "Minimalist Office Wear",
      category: "Workwear",
      status: "Sourcing",
      designer: "David Wu",
      buyer: "Lisa Thompson",
      planner: "Mark Johnson",
      comments: 9,
      tasks: 5,
      forecast: "High Demand",
      colorPalette: ["#34495E", "#BDC3C7", "#7F8C8D"]
    }
  ];

  const teamComments = [
    { 
      id: 1, 
      user: "Emma Chen",
      role: "Designer",
      text: "Updated the color palette based on SS25 forecasts",
      time: "2h ago" 
    },
    { 
      id: 2, 
      user: "Michael Ross",
      role: "Buyer",
      text: "Sourcing sustainable fabrics from new vendor",
      time: "5h ago" 
    }
  ];

  const fashionTasks = [
    { 
      id: 1, 
      title: "Review SS25 Samples",
      assignee: "Emma Chen",
      role: "Designer",
      deadline: "Dec 30",
      status: "In Progress" 
    },
    { 
      id: 2, 
      title: "Cost Analysis",
      assignee: "Michael Ross",
      role: "Buyer",
      deadline: "Jan 5",
      status: "Pending" 
    },
    { 
      id: 3, 
      title: "Production Timeline",
      assignee: "Sarah Jones",
      role: "Planner",
      deadline: "Jan 3",
      status: "In Review" 
    }
  ];

  const getRoleIcon = (role) => {
    switch(role.toLowerCase()) {
      case 'designer':
        return <Palette className="role-icon designer" />;
      case 'buyer':
        return <ShoppingBag className="role-icon buyer" />;
      case 'planner':
        return <Calendar className="role-icon planner" />;
      default:
        return <Users className="role-icon" />;
    }
  };

  return (
    <div className="workspace">
      {/* Header */}
      <header className="workspace-header">
        <div className="header-title">
          <h1>Fashion Trend Workspace</h1>
          <p>Collaborate on upcoming collections and trends</p>
        </div>
        <div className="header-actions">
          <button className="notification-btn">
            <Bell />
            <span className="notification-dot"></span>
          </button>
          <button className="share-btn">
            <Share2 />
            Share
          </button>
        </div>
      </header>

      {/* Team Roles */}
      <div className="team-roles">
        <div className="role-tag designer">
          <Palette />
          <span>Designers</span>
        </div>
        <div className="role-tag buyer">
          <ShoppingBag />
          <span>Buyers</span>
        </div>
        <div className="role-tag planner">
          <Calendar />
          <span>Planners</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="workspace-nav">
        <button 
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <TrendingUp />
          Trends
        </button>
        <button 
          className={`nav-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          <MessageSquare />
          Feedback
        </button>
        <button 
          className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <CheckSquare />
          Timeline
        </button>
      </nav>

      {/* Main Content */}
      <div className="workspace-content">
        {/* Trends Section */}
        <div className="trends-section">
          {fashionTrends.map(trend => (
            <div key={trend.id} className="trend-card">
              <div className="trend-header">
                <div>
                  <h3>{trend.title}</h3>
                  <span className="category">{trend.category}</span>
                </div>
                <span className={`forecast ${trend.forecast === 'High Demand' ? 'high' : 'medium'}`}>
                  {trend.forecast}
                </span>
              </div>
              
              <div className="color-palette">
                {trend.colorPalette.map((color, index) => (
                  <div 
                    key={index}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="team-members">
                <div className="member designer">
                  <Palette />
                  <span>{trend.designer}</span>
                </div>
                <div className="member buyer">
                  <ShoppingBag />
                  <span>{trend.buyer}</span>
                </div>
                <div className="member planner">
                  <Calendar />
                  <span>{trend.planner}</span>
                </div>
              </div>

              <div className="trend-stats">
                <span>
                  <MessageSquare />
                  {trend.comments} Feedback
                </span>
                <span>
                  <CheckSquare />
                  {trend.tasks} Tasks
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="workspace-sidebar">
          {/* Comments Section */}
          <div className="sidebar-section">
            <h3>Recent Feedback</h3>
            <div className="comments-list">
              {teamComments.map(comment => (
                <div key={comment.id} className="comment-card">
                  <p>{comment.text}</p>
                  <div className="comment-meta">
                    <div className="comment-user">
                      {getRoleIcon(comment.role)}
                      <span>{comment.user}</span>
                    </div>
                    <span className="comment-time">{comment.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="sidebar-section">
            <h3>Timeline</h3>
            <div className="tasks-list">
              {fashionTasks.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-info">
                    <p className="task-title">{task.title}</p>
                    <div className="task-assignee">
                      {getRoleIcon(task.role)}
                      <span>{task.assignee}</span>
                    </div>
                  </div>
                  <div className="task-meta">
                    <span className={`task-status ${task.status.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </span>
                    <span className="task-deadline">Due: {task.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FashionWorkspace;