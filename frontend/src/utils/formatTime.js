// src/utils/formatTime.js

/**
 * Converts a time in seconds to a hh:mm:ss or mm:ss format.
 * @param {number} totalSeconds - The total seconds to format.
 * @returns {string} The formatted time string.
 */
export const formatTime = (totalSeconds) => {
  // Ensure we're working with a number
  const time = Number(totalSeconds);

  // Don't format invalid numbers
  if (isNaN(time)) {
    return "00:00";
  }

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  // Pad with leading zeros if necessary
  const paddedSeconds = seconds.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedHours = hours.toString().padStart(2, '0');

  if (hours > 0) {
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }
  
  return `${paddedMinutes}:${paddedSeconds}`;
};