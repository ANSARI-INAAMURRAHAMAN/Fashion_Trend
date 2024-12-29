import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TrendDiscovery from './pages/TrendDiscovery';
import TrendAnalysis from './pages/TrendAnalysis';
import Collaboration from './pages/Collaboration';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
            
                <Route path="/" element={<Home />} />
                <Route path="/trend-discovery" element={<TrendDiscovery />} />
                <Route path="/trend-analysis" element={<TrendAnalysis />} />
                <Route path="/collaboration" element={<Collaboration />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            </Routes>
        </Router>
    );
};

export default App;
