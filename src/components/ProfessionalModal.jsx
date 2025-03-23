import React from 'react';
import IconLocation from './common/IconLocation';
import IconLinkedIn from './common/IconLinkedIn';
import ScoreBadge from './common/ScoreBadge';
import ProfessionalExperiences from './ProfessionalExperiences';
import { formatWithNewlines } from '../utils/textFormatters';

/**
 * Modal component for displaying professional details
 */
const ProfessionalModal = ({
  professional,
  experiences,
  loadingExperiences,
  experienceError,
  modalAnimation,
  onClose
}) => {
  const {
    name,
    headline,
    location,
    linkedin_url,
    bio,
    score,
    data_member_id
  } = professional;

  // Prevent clicks inside modal from closing it
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto transition-all duration-300 ease-in-out"
      onClick={onClose}
      style={{ opacity: modalAnimation.opacity }}
    >
      <div
        className="bg-white rounded-xl w-full max-w-3xl my-8 shadow-2xl relative overflow-hidden transition-all duration-300 ease-out"
        onClick={handleContentClick}
        style={{
          borderRadius: '1rem',
          transform: `scale(${modalAnimation.scale})`,
          opacity: modalAnimation.opacity
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-200 transition-colors duration-150 bg-gray-800/30 p-1 rounded-full"
          aria-label="Close details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>

        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 to-teal-700 p-6 text-white rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold mb-1 pr-10">{name}</h2>
            <p className="text-teal-100 opacity-90">{headline || ''}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between">
              <div className="flex items-center text-teal-100 mt-1">
                <IconLocation className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{location || 'Location not specified'}</span>
              </div>
              <ScoreBadge score={score} size="md" />
            </div>
          </div>
        </div>

        {/* Modal body - scrollable content */}
        <div className="p-6 overflow-y-auto max-h-[50vh] md:max-h-[60vh]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Biography</h3>
            {bio ? (
              <p className="text-gray-700">{formatWithNewlines(bio)}</p>
            ) : (
              <p className="text-gray-500 italic">No biography available</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Professional Experiences</h3>
            <ProfessionalExperiences
              experiences={experiences}
              loading={loadingExperiences}
              error={experienceError}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl">
          <div className="flex flex-wrap items-center justify-between">
            <a
              href={linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-white bg-teal-800 hover:bg-teal-700 font-medium rounded-lg text-sm px-4 py-2 transition-colors duration-200"
            >
              <IconLinkedIn className="w-4 h-4 mr-2 flex-shrink-0" />
              View LinkedIn Profile
            </a>
            <div className="text-gray-500 text-sm flex items-center mt-2 md:mt-0">
              <span className="font-medium mr-1">Member ID:</span>
              {data_member_id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalModal; 