import React from 'react';
import LoadingSpinner from './common/LoadingSpinner';
import { formatWithNewlines } from '../utils/textFormatters';

/**
 * Displays professional experiences section
 */
const ProfessionalExperiences = ({ experiences, loading, error }) => {
    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
                <p>{error}</p>
            </div>
        );
    }

    if (!experiences || experiences.length === 0) {
        return <p className="text-gray-500 italic">No experience data available</p>;
    }

    return (
        <div className="space-y-4">
            {experiences.map((exp, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex flex-wrap justify-between items-start">
                        <h4 className="font-medium text-gray-900">{exp.title || 'Unknown Position'}</h4>
                        <span className="text-gray-600">{exp.company_name || 'Unknown Company'}</span>
                    </div>
                    {exp.date_range && (
                        <p className="text-gray-500 text-sm mt-1">{exp.date_range}</p>
                    )}
                    {exp.description && (
                        <p className="text-gray-700 mt-2 text-sm">{formatWithNewlines(exp.description)}</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProfessionalExperiences; 