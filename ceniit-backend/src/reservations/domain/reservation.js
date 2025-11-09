/**
 * @typedef {object} Reservation
 * @property {number} id
 * @property {number} resourceId
 * @property {number} userId
 * @property {Date} date
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} purpose
 * @property {string} [notes]
 * @property {string} status
 * @property {Date} createdAt
 * @property {string} [resourceName] - Joined field
 * @property {string} [userName] - Joined field
 */

/**
 * Factory function for creating a Reservation domain object.
 * @param {object} props
 * @returns {Reservation}
 */
export const createReservation = ({
  id,
  resource_id,
  user_id,
  date,
  start_time,
  end_time,
  purpose,
  notes,
  status,
  created_at,
  // Joined fields that can be attached
  resource_name,
  user_name,
}) => {
  return {
    id,
    resourceId: resource_id,
    userId: user_id,
    date,
    startTime: start_time,
    endTime: end_time,
    purpose,
    notes,
    status,
    createdAt: created_at,
    resourceName: resource_name,
    userName: user_name,
  };
};
