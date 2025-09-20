import React from 'react';

interface MetricToggleProps {
  label: string;
  value: string;
  isActive: boolean;
  color: string;
  onClick: () => void;
}

export function MetricToggle({ label, value, isActive, color, onClick }: MetricToggleProps) {
  return (
    <button
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5
        ${isActive 
          ? 'bg-gray-100 border border-gray-300 shadow-sm' 
          : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
        }`}
      onClick={onClick}
    >
      <span 
        className="w-3 h-3 rounded-full" 
        style={{ backgroundColor: isActive ? color : 'rgba(209, 213, 219, 0.5)' }}
      />
      {label}
    </button>
  );
}
