import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import TrendDiscovery from './pages/TrendDiscovery';
import TrendAnalysis from './pages/TrendAnalysis';
import Collaboration from './pages/Collaboration';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
    const location = useLocation();
    const hideNavbarPaths = ['/login', '/signup'];

    return (
        <>
            {/* Conditionally render Navbar */}
            {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
            
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/trend-discovery"
                    element={
                        <ProtectedRoute>
                            <TrendDiscovery />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/trend-analysis"
                    element={
                        <ProtectedRoute>
                            <TrendAnalysis />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/collaboration"
                    element={
                        <ProtectedRoute>
                            <Collaboration />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
