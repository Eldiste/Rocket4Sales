import React, { useState, useEffect, useCallback } from 'react';
import { fetchExperiences } from '../services/api';
import ProfessionalModal from './ProfessionalModal';
import IconLocation from './common/IconLocation';
import IconView from './common/IconView';
import ScoreBadge from './common/ScoreBadge';
import { formatWithNewlines } from '../utils/textFormatters';

const ProfessionalCard = ({ professional }) => {
    const {
        name,
        headline,
        location,
        bio,
        score,
        data_member_id
    } = professional;

    const [isExpanded, setIsExpanded] = useState(false);
    const [experiences, setExperiences] = useState([]);
    const [loadingExperiences, setLoadingExperiences] = useState(false);
    const [experienceError, setExperienceError] = useState(null);
    const [modalAnimation, setModalAnimation] = useState({ opacity: 0, scale: 0.9 });

    const loadExperiences = useCallback(async () => {
        try {
            setLoadingExperiences(true);
            setExperienceError(null);

            const result = await fetchExperiences({ person_id: data_member_id });
            setExperiences(result.data || []);
        } catch (err) {
            setExperienceError(err.message || 'Failed to load experiences');
        } finally {
            setLoadingExperiences(false);
        }
    }, [data_member_id]);

    // Load experiences when card is expanded
    useEffect(() => {
        if (isExpanded && experiences.length === 0 && !loadingExperiences) {
            loadExperiences();
        }

        // Animate modal in when expanded
        if (isExpanded) {
            // Small delay to allow the modal to be added to the DOM
            setTimeout(() => {
                setModalAnimation({ opacity: 1, scale: 1 });
            }, 50);
        } else {
            setModalAnimation({ opacity: 0, scale: 0.9 });
        }
    }, [isExpanded, experiences.length, loadingExperiences, loadExperiences]);

    const handleCardClick = () => {
        setIsExpanded(true);
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    };

    const handleCloseModal = (e) => {
        e?.stopPropagation(); // Prevent triggering card click

        // Animate out first
        setModalAnimation({ opacity: 0, scale: 0.9 });

        // Then close after animation finishes
        setTimeout(() => {
            setIsExpanded(false);
            // Restore body scrolling
            document.body.style.overflow = 'auto';
        }, 300);
    };

    return (
        <>
            <div
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer transform hover:scale-[1.02]"
                onClick={handleCardClick}
            >
                <div className="p-5 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-800 truncate max-w-[70%]">{name}</h3>
                        <ScoreBadge score={score} />
                    </div>

                    <div className="min-h-[3rem] mb-2">
                        <p className="text-gray-600 italic line-clamp-2">{headline || 'No headline available'}</p>
                    </div>

                    <p className="text-gray-500 text-sm mb-3 flex items-center">
                        <IconLocation className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{location || 'Location not specified'}</span>
                    </p>

                    <div className="min-h-[4.5rem] mb-4 flex-grow">
                        {bio ? (
                            <p className="text-gray-700 text-sm line-clamp-3">{formatWithNewlines(bio)}</p>
                        ) : (
                            <p className="text-gray-400 text-sm italic">No biography available</p>
                        )}
                    </div>

                    <div className="mt-auto">
                        <div className="flex items-center space-x-1 mb-2">
                            <IconView className="w-4 h-4 text-teal-600" />
                            <span className="text-teal-600 text-sm font-medium">Click to view details</span>
                        </div>
                        <div className="text-gray-400 text-xs">
                            ID: {data_member_id}
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <ProfessionalModal
                    professional={professional}
                    experiences={experiences}
                    loadingExperiences={loadingExperiences}
                    experienceError={experienceError}
                    modalAnimation={modalAnimation}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default ProfessionalCard; 