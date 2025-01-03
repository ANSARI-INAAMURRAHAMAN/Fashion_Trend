import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const Gauge = ({ value, title }) => {
    const getColor = (value) => {
        if (value >= 80) return '#4ade80';
        if (value >= 60) return '#facc15';
        return '#f87171';
    };

    return (
        <div style={{ width: '100%', maxWidth: '150px', margin: '0 auto' }}>
            <CircularProgressbar
                value={value}
                text={`${value}%`}
                styles={buildStyles({
                    textSize: '16px',
                    pathColor: getColor(value),
                    textColor: '#c9d1d9',
                    trailColor: '#1f2937',
                })}
            />
            <p style={{ 
                textAlign: 'center', 
                marginTop: '8px',
                color: '#8b949e',
                fontSize: '0.9rem'
            }}>
                {title}
            </p>
        </div>
    );
};
