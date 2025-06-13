// raptor-suite/shared/utils.js

// Utility functions that can be shared between web, mobile, and functions.

/**
 * Generates a unique ID (simple timestamp-based).
 * For more robust unique IDs, consider libraries like 'uuid'.
 * @returns {string} A simple unique ID.
 */
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Formats a Date object into a readable string (e.g., "YYYY-MM-DD HH:MM:SS").
 * @param {Date} date The Date object to format.
 * @returns {string} The formatted date string.
 */
function formatDateTime(date) {
  if (!(date instanceof Date)) {
    return 'Invalid Date';
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Validates an email address format.
 * @param {string} email The email string to validate.
 * @returns {boolean} True if the email format is valid, false otherwise.
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if a user has an 'admin' role.
 * Assumes user object has a 'role' property.
 * @param {object} user The user object.
 * @returns {boolean} True if the user is an admin, false otherwise.
 */
function isAdmin(user) {
  return user && user.role === 'admin';
}

/**
 * Calculates remaining storage based on used and total limit.
 * @param {number} usedBytes - The amount of storage used in bytes.
 * @param {number} limitGB - The storage limit in Gigabytes.
 * @returns {string} A human-readable string of remaining storage.
 */
function getRemainingStorage(usedBytes, limitGB) {
  const usedGB = usedBytes / (1024 * 1024 * 1024);
  const remainingGB = limitGB - usedGB;
  if (remainingGB < 0) {
    return `Over limit by ${(-remainingGB).toFixed(2)} GB`;
  }
  return `${remainingGB.toFixed(2)} GB remaining`;
}


module.exports = {
  generateUniqueId,
  formatDateTime,
  isValidEmail,
  isAdmin,
  getRemainingStorage
};