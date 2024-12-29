import React, { useState } from 'react';
import { Menu, TrendingUp, BarChart2, Users, User } from 'lucide-react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import '../styles/Navbar.css';
import NotificationCenter from './NotificationCenter';
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                        
                        <Link to="/collaboration" className="nav-link">
                            <Users className="nav-icon" />
                            <span>Collaborate</span>
                        </Link>
                        <Link to="/profile" className="nav-link">
                            <User className="nav-icon" />
                            <span>Profile</span>
                        </Link>

                        {/* Add Login and Signup Links */}
                        <Link to="/login" className="nav-link">
                            <span>Login</span>
                        </Link>
                        <Link to="/signup" className="nav-link">
                            <span>Signup</span>
                        </Link>
                        <Link to="/NotificationCenter" className="nav-link">
                            
                            <NotificationCenter />
                           
                        </Link>
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

                    {/* Add Login and Signup Links for Mobile */}
                    <Link to="/login" className="mobile-nav-link">
                        <span>Login</span>
                    </Link>
                    <Link to="/signup" className="mobile-nav-link">
                        <span>Signup</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
