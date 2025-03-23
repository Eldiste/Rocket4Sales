import React, { useRef, useCallback } from 'react';
import ProfessionalCard from './ProfessionalCard';
import LoadingSpinner from './common/LoadingSpinner';

const ProfessionalsList = ({ professionals, loading, error, loadMore, hasMore }) => {
  // Reference to use for the intersection observer
  const observer = useRef();

  // Last element ref callback for infinite scrolling
  const lastElementRef = useCallback(node => {
    if (loading) return;

    // Disconnect the previous observer if it exists
    if (observer.current) observer.current.disconnect();

    // Create a new IntersectionObserver
    observer.current = new IntersectionObserver(entries => {
      // If the last element is visible and we have more data to load
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    // Observe the last element if it exists
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
        <p className="font-medium">Error loading professionals</p>
        <p className="text-sm mt-1">{error.message || 'Please try again later'}</p>
      </div>
    );
  }

  if (professionals.length === 0 && !loading) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-700 p-8 rounded-lg text-center">
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <h3 className="text-lg font-semibold mb-2">No professionals found</h3>
        <p className="text-gray-500">Try adjusting your search filters or try a different query.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((professional, index) => (
          <div key={professional.data_member_id} ref={index === professionals.length - 1 ? lastElementRef : null}>
            <ProfessionalCard professional={professional} />
          </div>
        ))}
      </div>

      {loading && <LoadingSpinner size="lg" />}

      {!loading && !hasMore && professionals.length > 0 && (
        <div className="text-center py-8 text-gray-500 italic">
          No more professionals to load
        </div>
      )}
    </div>
  );
};

export default ProfessionalsList; 