// components/Workspace.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistance } from 'date-fns';
import '../styles/Workspace.css';

const Workspace = ({ teamId, onBack }) => {
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: ''
  });

  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchTeamData();
  }, [teamId]);

  const fetchTeamData = async () => {
    try {
      const [teamResponse, tasksResponse] = await Promise.all([
        axios.get(`/api/teams/${teamId}`),
        axios.get(`/api/teams/${teamId}/tasks`)
      ]);

      if (teamResponse.data.success) {
        setTeam(teamResponse.data.data);
        setTeamMembers(teamResponse.data.data.members || []);
      }
      if (tasksResponse.data.success) {
        setTasks(tasksResponse.data.data);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', { ...newTask, team: teamId });
      setShowCreateTask(false);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      fetchTeamData();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const response = await axios.patch(
        `/api/tasks/${taskId}`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        fetchTeamData();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error.response?.data?.message || 'Failed to update task status');
    }
  };

  const renderTaskCard = (task) => (
    <div key={task._id} className="task-card">
      <div className="task-header">
        <h4 className="task-title">{task.title}</h4>
        <span className={`status-badge status-${task.status}`}>
          {task.status.replace('-', ' ')}
        </span>
      </div>
      
      <p className="task-description">{task.description}</p>
      
      <div className="task-meta">
        <div className="assignee-info">
          <span className="meta-label">Assigned to:</span>
          <span className="assignee-name">
            {task.assignedTo ? task.assignedTo.username : 'Unassigned'}
          </span>
        </div>
        
        {task.dueDate && (
          <div className="due-date">
            <span className="meta-label">Due:</span>
            <span>{formatDistance(new Date(task.dueDate), new Date(), { addSuffix: true })}</span>
          </div>
        )}
      </div>

      <div className="task-actions">
        <select
          value={task.status}
          onChange={(e) => updateTaskStatus(task._id, e.target.value)}
          className="status-select"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="workspace-container">
      <div className="workspace-header">
        <button className="back-button" onClick={onBack}>← Back to Teams</button>
        <div className="header-content">
          {team && (
            <>
              <h2>{team.name}</h2>
              <p className="team-description">{team.description}</p>
              <div className="team-meta">
                <span>Created by: {team.createdBy?.username}</span>
                <span>{team.members?.length || 0} members</span>
              </div>
            </>
          )}
        </div>
        <button className="create-task-btn" onClick={() => setShowCreateTask(true)}>
          + New Task
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading workspace...</div>
      ) : error ? (
        <div className="error-state">Error: {error}</div>
      ) : (
        <div className="task-board">
          {['pending', 'in-progress', 'completed'].map((status) => (
            <div key={status} className="task-column">
              <div className="column-header">
                <h3>{status.replace('-', ' ').toUpperCase()}</h3>
                <span className="task-count">
                  {tasks.filter(task => task.status === status).length}
                </span>
              </div>
              <div className="task-list">
                {tasks
                  .filter((task) => task.status === status)
                  .map(renderTaskCard)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Task</h3>
            <form onSubmit={createTask}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <textarea
                  placeholder="Task Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select Assignee</option>
                  {teamMembers.map((member) => (
                    <option key={member.user._id} value={member.user._id}>
                      {member.user.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateTask(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;