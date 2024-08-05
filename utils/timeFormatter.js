import moment from 'moment';

/
  Formats a duration in milliseconds into a human-readable string.
 
  @param {number} milliseconds The duration in milliseconds.
  @returns {string} The formatted duration string.
 /
export const formatTime = (milliseconds) => {
  if (!milliseconds || isNaN(milliseconds)) {
    return '0:00';
  }

  return moment.duration(milliseconds).format('m:ss');
};