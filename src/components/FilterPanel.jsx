import React, { useState, useEffect, useRef } from 'react';

// Popular job titles for autocomplete suggestions
const POPULAR_JOBS = [
  'Account Executive',
  'Sales Representative',
  'Software Engineer',
  'Product Manager',
  'Marketing Manager',
  'Data Scientist',
  'Customer Success Manager',
  'Business Development Representative',
  'Solutions Architect',
  'Project Manager',
  'UX Designer',
  'Technical Support',
  'Sales Manager',
  'Operations Manager',
];

const FilterPanel = ({ onApplyFilters, initialFilters }) => {
  const [company, setCompany] = useState(initialFilters?.company_query || '');
  const [job, setJob] = useState(initialFilters?.job_query || '');
  const [personId, setPersonId] = useState(initialFilters?.person_id || '');

  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionRef = useRef(null);
  const inputRef = useRef(null);

  // Filter job suggestions based on input
  useEffect(() => {
    if (job.trim() === '') {
      setFilteredSuggestions(POPULAR_JOBS);
    } else {
      const filtered = POPULAR_JOBS.filter(
        suggestion => suggestion.toLowerCase().includes(job.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
    setHighlightedIndex(-1);
  }, [job]);

  // Handle clicks outside suggestion box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target) &&
        inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const filters = {};

    // Add filters only if they have values
    if (company) filters.company_query = company;
    if (job) filters.job_query = job;
    if (personId) filters.person_id = personId;

    onApplyFilters(filters);
  };

  const handleJobChange = (e) => {
    setJob(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setJob(suggestion);
    setShowSuggestions(false);
    // Focus back on the input after selection
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // Handle keyboard navigation for the suggestions
    if (!showSuggestions) return;

    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prevIndex =>
        prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prevIndex =>
        prevIndex > 0 ? prevIndex - 1 : 0
      );
    }
    // Enter
    else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(filteredSuggestions[highlightedIndex]);
    }
    // Escape
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <h2 className="text-xl font-bold text-teal-900 mb-4">Filter Professionals</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-teal-800 mb-1">
              Company ID
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-700 focus:border-teal-700"
              placeholder="Enter company ID (e.g. 1035)"
            />
          </div>

          <div className="relative">
            <label htmlFor="job" className="block text-sm font-medium text-teal-800 mb-1">
              Job Title
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                id="job"
                value={job}
                onChange={handleJobChange}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-700 focus:border-teal-700"
                placeholder="Enter or select job title"
                autoComplete="off"
              />
              {job && (
                <button
                  type="button"
                  onClick={() => {
                    setJob('');
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                ref={suggestionRef}
                className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 overflow-hidden focus:outline-none animate-fadeIn"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="max-h-60 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`px-4 py-2.5 cursor-pointer transition-colors duration-150 flex items-center ${index === highlightedIndex
                        ? 'bg-teal-50 text-teal-700'
                        : 'hover:bg-gray-50 text-gray-800'
                        }`}
                    >
                      <svg
                        className={`w-4 h-4 mr-2 ${index === highlightedIndex ? 'text-teal-500' : 'text-gray-400'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                      <span className="font-medium">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="personId" className="block text-sm font-medium text-teal-800 mb-1">
              Person ID
            </label>
            <input
              type="text"
              id="personId"
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
              className={`w-full px-3 py-2 border ${personId ? 'border-teal-600 bg-teal-50' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-teal-700 focus:border-teal-700`}
              placeholder="Enter specific person ID"
            />
            <p className="mt-1 text-xs text-gray-500">
              If provided, other filters will be ignored
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-teal-800 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 transition-colors duration-200"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterPanel; 