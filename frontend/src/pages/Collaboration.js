import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Users, MessageCircle } from 'lucide-react';
import TrendCard from '../components/TrendCard';
import '../styles/Collaboration.css';
import MeetingForm from '../components/MeetingForm';

const Collaboration = () => {
  const [activeTab, setActiveTab] = useState('trends');
  const [teamMeetings, setTeamMeetings] = useState([
    {
      id: 1,
      title: 'Trend Analysis Meeting',
      date: '2024-02-20',
      time: '10:00 AM',
      attendees: ['John', 'Sarah', 'Mike'],
    }
  ]);
  const [sharedTrends, setSharedTrends] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendsResponse, teamsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/trends/shared`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/teams`)
        ]);
        
        setSharedTrends(trendsResponse.data.data || []);
        const teamsData = teamsResponse.data.data || [];
        setTeams(teamsData);
        
        if (teamsData.length > 0) {
          setSelectedTeam(teamsData[0]);
        }
        
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Add error state handling if needed
      }
    };

    fetchData();
  }, []);

  const handleCreateMeeting = (meetingData) => {
    setTeamMeetings([...teamMeetings, { id: Date.now(), ...meetingData }]);
  };

  const fetchMeetings = async (teamId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/meetings/team/${teamId}`);
      setMeetings(response.data.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamChange = (teamId) => {
    const team = teams.find(t => t._id === teamId);
    setSelectedTeam(team);
    if (team) {
      fetchMeetings(team._id);
    }
  };

  useEffect(() => {
    if (selectedTeam) {
      fetchMeetings(selectedTeam._id);
    }
  }, [selectedTeam]);

  const handleMeetingCreated = (newMeeting) => {
    setMeetings(prev => [...prev, newMeeting]);
    setShowMeetingForm(false);
  };

  return (
    <div className="collaboration-container">
      <header className="collaboration-header">
        <h1 className="collaboration-title">Collaboration Hub</h1>
        <div className="header-actions">
          {selectedTeam && (
            <button 
              className="create-meeting-btn" 
              onClick={() => setShowMeetingForm(true)}
            >
              <Calendar size={18} />
              Create Meeting
            </button>
          )}
          <div className="team-selector">
            <select 
              className="team-select"
              value={selectedTeam?._id || ''}
              onChange={(e) => handleTeamChange(e.target.value)}
            >
              {teams.map(team => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {selectedTeam ? (
        <>
          <div className="collaboration-tabs">
            <button className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
                    onClick={() => setActiveTab('trends')}>
              <MessageCircle size={18} />
              Trend Discussions
            </button>
            <button className={`tab-btn ${activeTab === 'meetings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('meetings')}>
              <Calendar size={18} />
              Team Meetings
            </button>
            <button className={`tab-btn ${activeTab === 'teams' ? 'active' : ''}`}
                    onClick={() => setActiveTab('teams')}>
              <Users size={18} />
              Team Members
            </button>
          </div>

          <main className="collaboration-content">
            {activeTab === 'trends' && (
              <div className="trend-discussions">
                <div className="trend-grid">
                  {sharedTrends.map(trend => (
                    <TrendCard 
                      key={trend.id} 
                      trend={trend}
                      showCollaboration={true}
                      teamMembers={selectedTeam.members}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'meetings' && (
              <div className="meetings-section">
                <div className="meetings-header">
                  <h2>{selectedTeam.name} - Team Meetings</h2>
                </div>
                
                {isLoading ? (
                  <div className="loading">Loading meetings...</div>
                ) : (
                  <div className="meetings-list">
                    {meetings.map(meeting => (
                      <div key={meeting._id} className="meeting-card">
                        <div className="meeting-info">
                          <h3>{meeting.title}</h3>
                          <p>{new Date(meeting.date).toLocaleDateString()} at {meeting.time}</p>
                          {meeting.description && <p>{meeting.description}</p>}
                        </div>
                        <div className="meeting-attendees">
                          {meeting.attendees.map(attendee => (
                            <span key={attendee._id} className="attendee-badge">
                              {attendee.username}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {showMeetingForm && (
                  <MeetingForm
                    team={selectedTeam}
                    onClose={() => setShowMeetingForm(false)}
                    onMeetingCreated={handleMeetingCreated}
                  />
                )}
              </div>
            )}

            {activeTab === 'teams' && (
              <div className="team-members">
                <div className="team-section">
                  <h3>{selectedTeam.name} - Members</h3>
                  <div className="members-grid">
                    {selectedTeam.members.map(member => (
                      <div key={member.user._id} className="member-card">
                        <img 
                          src={member.user.avatar || '/default-avatar.png'} 
                          alt={member.user.username} 
                        />
                        <h4>{member.user.username}</h4>
                        <p>{member.role}</p>
                        {member.user._id === selectedTeam.createdBy._id && (
                          <span className="admin-badge">Team Admin</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </>
      ) : (
        <div className="no-team-message">
          <h2>No teams available</h2>
          <p>Join or create a team to start collaborating</p>
        </div>
      )}
    </div>
  );
};

export default Collaboration;