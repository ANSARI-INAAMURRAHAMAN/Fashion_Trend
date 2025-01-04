// components/TeamList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistance } from 'date-fns';
import '../styles/TeamList.css';

const TeamList = ({ onSelectTeam }) => {
  const [teams, setTeams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [joinError, setJoinError] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [initialTasks, setInitialTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchTeams();
    fetchAvailableUsers();
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch all teams without any filtering
      const response = await axios.get('/api/teams/all');
      setTeams(response.data.data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await axios.get('/api/teams/available-users');
      setAvailableUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addTask = () => {
    setInitialTasks([...initialTasks, {
      title: '',
      description: '',
      status: 'pending',
      assignedTo: ''
    }]);
  };

  const updateTask = (index, field, value) => {
    const updatedTasks = [...initialTasks];
    updatedTasks[index][field] = value;
    setInitialTasks(updatedTasks);
  };

  const createTeam = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Validate required fields
      if (!newTeam.name.trim() || !newTeam.description.trim()) {
        setError('Team name and description are required');
        return;
      }

      // Filter out empty tasks and ensure proper task structure
      const validTasks = initialTasks.filter(task => 
        task.title.trim() && task.description.trim()
      ).map(task => ({
        title: task.title.trim(),
        description: task.description.trim(),
        status: 'pending',
        assignedTo: task.assignedTo || null
      }));

      const response = await axios.post('/api/teams', {
        ...newTeam,
        members: selectedMembers,
        initialTasks: validTasks
      });

      if (response.data.success) {
        setShowCreateModal(false);
        setNewTeam({ name: '', description: '' });
        setSelectedMembers([]);
        setInitialTasks([]);
        fetchTeams();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error creating team';
      setError(errorMessage);
      console.error('Error creating team:', error);
    }
  };

  const joinTeam = async (teamId) => {
    setJoinError(null);
    try {
      const response = await axios.post(`/api/teams/${teamId}/join`);
      if (response.data.success) {
        fetchTeams();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error joining team';
      setJoinError(errorMessage);
      console.error('Error joining team:', error);
    }
  };

  // Update the renderTeamCard function to always show team details
  const renderTeamCard = (team) => {
    return (
      <div className="team-card" key={team._id}>
        <h3>{team.name}</h3>
        <p className="team-description">{team.description}</p>
        
        <div className="team-meta">
          <span className="team-creator">
            Created by: <strong>{team.createdBy && team.createdBy.username}</strong>
          </span>
          <span className="team-date">
            {team.createdAt && formatDistance(new Date(team.createdAt), new Date(), { addSuffix: true })}
          </span>
        </div>

        {/* Show all members regardless of user's membership */}
        <div className="member-section">
          <h4>Team Members ({team.members?.length || 0})</h4>
          <div className="member-tags">
            {team.members?.map(member => (
              member.user && (
                <span 
                  key={member.user._id} 
                  className={`member-tag ${member.role === 'admin' ? 'admin' : ''}`}
                >
                  {member.user.username}
                  {member.role === 'admin' && ' (Admin)'}
                </span>
              )
            ))}
          </div>
        </div>

        {/* Show tasks for all teams */}
        {team.initialTasks && team.initialTasks.length > 0 && (
          <div className="team-tasks">
            <h4>Active Tasks ({team.initialTasks.length})</h4>
            <div className="tasks-summary">
              {team.initialTasks.map(task => (
                <div key={task._id} className="task-item">
                  <span className="task-title">{task.title}</span>
                  <span className={`task-status ${task.status}`}>
                    {task.status}
                  </span>
                  <span className="task-assignee">
                    {task.assignedTo ? task.assignedTo.username : 'Unassigned'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="team-actions">
          {!team.members?.some(m => m.user._id === currentUser?._id) ? (
            <button 
              className="join-btn" 
              onClick={() => joinTeam(team._id)} 
              disabled={isLoading}
            >
              {isLoading ? 'Joining...' : 'Join Team'}
            </button>
          ) : (
            <button 
              className="view-workspace-btn"
              onClick={() => onSelectTeam(team._id)}
            >
              View Workspace
            </button>
          )}
        </div>
      </div>
    );
  };

  // Update the member selection handler
  const handleMemberSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map(option => option.value);
    setSelectedMembers(selectedIds);
  };

  return (
    <div className="team-list-container">
      <div className="team-header">
        <h2>Teams</h2>
        <button className="create-team-btn" onClick={() => setShowCreateModal(true)}>
          Create Team
        </button>
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Team</h3>
            <form onSubmit={createTeam}>
              <input
                type="text"
                placeholder="Team Name"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              />

              <div className="member-selection">
                <h4>Select Members</h4>
                <select
                  multiple
                  value={selectedMembers}
                  onChange={handleMemberSelection}
                  className="member-select"
                >
                  {availableUsers
                    .filter(user => user._id !== currentUser?._id) // Exclude current user
                    .map(user => (
                      <option key={user._id} value={user._id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                </select>
              </div>

              <div className="initial-tasks">
                <h4>Initial Tasks</h4>
                <button type="button" onClick={addTask}>Add Task</button>
                
                {initialTasks.map((task, index) => (
                  <div key={index} className="task-form">
                    <input
                      type="text"
                      placeholder="Task Title"
                      value={task.title}
                      onChange={(e) => updateTask(index, 'title', e.target.value)}
                    />
                    <textarea
                      placeholder="Task Description"
                      value={task.description}
                      onChange={(e) => updateTask(index, 'description', e.target.value)}
                    />
                    <select
                      value={task.assignedTo}
                      onChange={(e) => updateTask(index, 'assignedTo', e.target.value)}
                    >
                      <option value="">Assign to...</option>
                      {selectedMembers.map(memberId => {
                        const user = availableUsers.find(u => u._id === memberId);
                        return (
                          <option key={memberId} value={memberId}>
                            {user?.username} {/* Changed from user?.name to user?.username */}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ))}
              </div>

              {error && <p className="error-message">{error}</p>}

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="teams-grid">
        {isLoading ? (
          <p>Loading teams...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          teams.map((team) => renderTeamCard(team))
        )}
      </div>
    </div>
  );
};

export default TeamList;