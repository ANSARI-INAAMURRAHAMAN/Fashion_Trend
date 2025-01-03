import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const MeetingForm = ({ team, onClose, onMeetingCreated }) => {
  const [meeting, setMeeting] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    description: '',
    duration: 60,
    attendees: [],
    agenda: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/meetings`, {
        ...meeting,
        teamId: team._id
      });
      
      if (response.data.success) {
        onMeetingCreated(response.data.data);
        onClose();
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  return (
    <div className="meeting-form-overlay">
      <div className="meeting-form">
        <div className="meeting-form-header">
          <h3>Schedule Team Meeting</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Meeting Title</label>
            <input
              type="text"
              required
              value={meeting.title}
              onChange={e => setMeeting({ ...meeting, title: e.target.value })}
              placeholder="e.g., Weekly Trend Review"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                required
                value={meeting.date}
                onChange={e => setMeeting({ ...meeting, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                required
                value={meeting.time}
                onChange={e => setMeeting({ ...meeting, time: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                required
                value={meeting.duration}
                onChange={e => setMeeting({ ...meeting, duration: e.target.value })}
                min="15"
                step="15"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={meeting.description}
              onChange={e => setMeeting({ ...meeting, description: e.target.value })}
              placeholder="Meeting description and objectives"
            />
          </div>

          <div className="form-group">
            <label>Agenda</label>
            <textarea
              value={meeting.agenda}
              onChange={e => setMeeting({ ...meeting, agenda: e.target.value })}
              placeholder="Meeting agenda items"
            />
          </div>

          <div className="form-group">
            <label>Select Attendees</label>
            <div className="attendees-grid">
              {team.members.map(member => (
                <label key={member.user._id} className="attendee-checkbox">
                  <input
                    type="checkbox"
                    checked={meeting.attendees.includes(member.user._id)}
                    onChange={e => {
                      const attendees = e.target.checked
                        ? [...meeting.attendees, member.user._id]
                        : meeting.attendees.filter(id => id !== member.user._id);
                      setMeeting({ ...meeting, attendees });
                    }}
                  />
                  <span>{member.user.username}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Schedule Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingForm;
