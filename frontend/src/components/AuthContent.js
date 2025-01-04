import React from 'react';
import { Sparkles, Zap, Trophy, TrendingUp, LineChart, Users } from 'lucide-react';

const AuthContent = ({ isLogin }) => {
  return (
    <div className="auth-content-side">
      <div className="auth-content-header">
        <Sparkles className="header-icon" size={24} color="#38BDF8" />
        <h1 className="animated-text">
          {isLogin ? "Welcome Back" : "Join Trend Analytica"}
        </h1>
      </div>
      
      <div className="feature-list">
        {[
          { icon: TrendingUp, text: "AI-driven trend analysis", color: "#38BDF8" },
          { icon: LineChart, text: "Real-time market insights", color: "#818CF8" },
          { icon: Users, text: "Expert collaboration", color: "#38BDF8" },
          { icon: Trophy, text: "Stay ahead of competition", color: "#818CF8" }
        ].map((feature, index) => (
          <div key={index} className="feature-item">
            <feature.icon size={20} color={feature.color} />
            <p className="animated-subtext" style={{ 
              animationDelay: `${0.3 * (index + 1)}s`,
              margin: 0
            }}>
              {feature.text}
            </p>
          </div>
        ))}
      </div>
      
      <div className="auth-content-footer">
        <Zap size={16} color="#38BDF8" />
        <span>Powering fashion's future</span>
      </div>
    </div>
  );
};

export default AuthContent;
