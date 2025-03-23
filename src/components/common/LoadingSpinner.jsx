import React from 'react';

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the spinner ('sm', 'md', 'lg')
 * @param {string} props.color - Color class for the spinner border
 * @returns {JSX.Element} Loading spinner component
 */
const LoadingSpinner = ({ size = 'md', color = 'border-teal-600' }) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10'
    };

    return (
        <div className="flex justify-center py-4">
            <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 ${color}`}></div>
        </div>
    );
};

export default LoadingSpinner; 