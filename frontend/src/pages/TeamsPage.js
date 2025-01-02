import React, { useState } from 'react';
import TeamList from '../components/TeamList';
import Workspace from '../components/Workspace';
import '../styles/shared.css';
import '../styles/teamsPage.css';

const TeamsPage = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <div className="teams-page">
      {selectedTeam ? (
        <Workspace 
          teamId={selectedTeam} 
          onBack={() => setSelectedTeam(null)}
        />
      ) : (
        <>
          <div className="teams-header">
            {/* <h1>Teams</h1> */}
          </div>
          
          <TeamList onSelectTeam={setSelectedTeam} />
        </>
      )}
    </div>
  );
};

export default TeamsPage;