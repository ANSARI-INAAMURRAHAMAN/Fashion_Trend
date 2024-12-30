// src/components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Call the logout service to clear localStorage
        authService.logout();
        // Redirect to login page
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} className="logout-button">
            Logout
        </button>
    );
};

export default LogoutButton;