import React from 'react';
import { formatWithFallback } from '../../utils/textFormatters';

/**
 * Score badge component
 * @param {Object} props - Component props
 * @param {number|string} props.score - The score value
 * @param {string} props.size - Size variant ('sm' or 'md')
 * @returns {JSX.Element} Score badge component
 */
const ScoreBadge = ({ score, size = 'sm' }) => {
    const sizeClasses = {
        sm: 'text-xs px-2.5 py-0.5',
        md: 'text-sm px-3 py-1'
    };

    return (
        <span className={`bg-teal-100 text-teal-800 font-semibold rounded-full whitespace-nowrap ${sizeClasses[size]}`}>
            Score: {formatWithFallback(score)}
        </span>
    );
};

export default ScoreBadge; 