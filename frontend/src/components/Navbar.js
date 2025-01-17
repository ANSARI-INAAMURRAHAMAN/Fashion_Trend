import React, { useState } from 'react';
import { Menu, TrendingUp, BarChart2, Users, User, UserPlus, MessagesSquare, Leaf, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    
    // Check if we're on login or signup pages
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
    
    const renderAuthLinks = () => {
        if (isAuthPage) {
            return (
                <>
                    <Link to="/login" className="nav-link">
                        <span>Login</span>
                    </Link>
                    <Link to="/signup" className="nav-link">
                        <span>Signup</span>
                    </Link>
                </>
            );
        }
        
        return null; // Remove the logout button from the navbar
    };

    const renderMobileAuthLinks = () => {
        if (isAuthPage) {
            return (
                <>
                    <Link to="/login" className="mobile-nav-link">
                        <span>Login</span>
                    </Link>
                    <Link to="/signup" className="mobile-nav-link">
                        <span>Signup</span>
                    </Link>
                </>
            );
        }
        
        return null; // Remove the logout button from the mobile navbar
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-content">
                    {/* Logo and Brand */}
                    <Link to="/" className="navbar-brand">
                        <TrendingUp className="brand-icon" />
                        <span className="brand-text">Trend Analytics</span>
                    </Link>

                    {/* Mobile menu button */}
                    <div className="mobile-menu-button">
                        <button onClick={() => setIsOpen(!isOpen)}>
                            <Menu />
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="desktop-nav">
                        <Link to="/trend-discovery" className="nav-link">
                            <BarChart2 className="nav-icon" />
                            <span>Discover</span>
                        </Link>
                        <Link to="/trend-analysis" className="nav-link">
                            <TrendingUp className="nav-icon" />
                            <span>Analyze</span>
                        </Link>
                        <Link to="/teams" className="nav-link">
                            <UserPlus className="nav-icon" />
                            <span>Teams</span>
                        </Link>
                        <Link to="/collaboration" className="nav-link">
                            <MessagesSquare className="nav-icon" />
                            <span>Collaboration</span>
                        </Link>
                        <Link to="/profile" className="nav-link">
                            <User className="nav-icon" />
                            <span>Profile</span>
                        </Link>
                        <Link to="/sustainability" className="nav-link">
                            <Leaf className="nav-icon" />
                            <span>Sustainability</span>
                        </Link>
                        <Link to="/reports" className="nav-link">
                            <FileText className="nav-icon" />
                            <span>Reports</span>
                        </Link>

                        {/* Conditional Auth Links */}
                        {renderAuthLinks()}

                        {!isAuthPage && (
                            <Link to="/NotificationCenter" className="nav-link">
                                <NotificationCenter />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`mobile-nav ${isOpen ? 'active' : ''}`}>
                    <Link to="/trend-discovery" className="mobile-nav-link">
                        <BarChart2 className="nav-icon" />
                        <span>Discover</span>
                    </Link>
                    <Link to="/trend-analysis" className="mobile-nav-link">
                        <TrendingUp className="nav-icon" />
                        <span>Analyze</span>
                    </Link>
                    <Link to="/collaboration" className="mobile-nav-link">
                        <Users className="nav-icon" />
                        <span>Collaborate</span>
                    </Link>
                    <Link to="/profile" className="mobile-nav-link">
                        <User className="nav-icon" />
                        <span>Profile</span>
                    </Link>
                    <Link to="/teams" className="mobile-nav-link">
                        <UserPlus className="nav-icon" />
                        <span>Teams</span>
                    </Link>
                    <Link to="/sustainability" className="mobile-nav-link">
                        <Leaf className="nav-icon" />
                        <span>Sustainability</span>
                    </Link>
                    <Link to="/reports" className="mobile-nav-link">
                        <FileText className="nav-icon" />
                        <span>Reports</span>
                    </Link>

                    {/* Conditional Mobile Auth Links */}
                    {renderMobileAuthLinks()}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;