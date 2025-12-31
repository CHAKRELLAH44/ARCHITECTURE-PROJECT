import React from 'react';
import './ChartStatic.css';

// Simple static sparkline-like SVG chart (no external deps)
const ChartStatic = ({points = [10, 30, 20, 40, 35, 50, 45]}) => {
  const max = Math.max(...points);
  const step = 100 / (points.length - 1);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${100 - (p / max) * 100}`).join(' ');

  return (
    <div className="chart-wrapper" aria-hidden>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="chart-svg">
        <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export default ChartStatic;
