/**
 * Utility functions for handling URLs and file paths
 */

// Default base URL for uploaded files (can be moved to config later)
const DEFAULT_BASE_URL = 'https://media.moclawr.com/portfolio-bucket/uploads/';

/**
 * Converts a filename or partial path to a full URL
 * @param {string} fileUrlOrName - Can be a full URL or just a filename
 * @param {string} baseUrl - Base URL to prepend (optional)
 * @returns {string} Full URL
 */
export const getFullImageUrl = (fileUrlOrName, baseUrl = DEFAULT_BASE_URL) => {
  if (!fileUrlOrName) return '';
  
  // If it's already a full URL, return as is
  if (fileUrlOrName.startsWith('http://') || fileUrlOrName.startsWith('https://')) {
    return fileUrlOrName;
  }
  
  // If it starts with '/', assume it's a relative path from root
  if (fileUrlOrName.startsWith('/')) {
    return `${baseUrl}${fileUrlOrName.slice(1)}`;
  }
  
  // Otherwise, treat as filename and prepend base URL
  return `${baseUrl}${fileUrlOrName}`;
};

/**
 * Extracts filename from a full URL or returns the original if it's already a filename
 * @param {string} urlOrFilename 
 * @returns {string} Just the filename
 */
export const getFilenameFromUrl = (urlOrFilename) => {
  if (!urlOrFilename) return '';
  
  // If it's a URL, extract filename
  if (urlOrFilename.startsWith('http://') || urlOrFilename.startsWith('https://')) {
    return urlOrFilename.split('/').pop() || '';
  }
  
  // If it's already a filename, return as is
  return urlOrFilename;
};

/**
 * Check if a string is a full URL
 * @param {string} str 
 * @returns {boolean}
 */
export const isFullUrl = (str) => {
  return str && (str.startsWith('http://') || str.startsWith('https://'));
};
