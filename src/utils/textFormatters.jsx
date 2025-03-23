import React from 'react';

/**
 * Formats text with newlines by splitting on [nl] markers
 * @param {string} text - Text to format
 * @returns {React.ReactNode} Formatted text with proper line breaks
 */
export const formatWithNewlines = (text) => {
  if (!text) return '';
  return text.split('[nl]').map((part, index, array) => (
    <React.Fragment key={index}>
      {part}
      {index < array.length - 1 && <br />}
    </React.Fragment>
  ));
};

/**
 * Formats a value or returns a fallback
 * @param {any} value - The value to check
 * @param {string} fallback - Fallback value if main value is falsy
 * @returns {string} The value or fallback
 */
export const formatWithFallback = (value, fallback = '?') => {
  return value || fallback;
}; 