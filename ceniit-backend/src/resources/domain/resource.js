/**
 * @typedef {object} Resource
 * @property {number} id
 * @property {string} name
 * @property {string} [description]
 * @property {string} [location]
 * @property {string} status
 * @property {Date} createdAt
 */

/**
 * Factory function for creating a Resource domain object.
 * @param {object} props
 * @returns {Resource}
 */
export const createResource = ({
  id,
  name,
  description,
  location,
  status,
  created_at,
}) => {
  return {
    id,
    name,
    description,
    location,
    status,
    createdAt: created_at,
  };
};
