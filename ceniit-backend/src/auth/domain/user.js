/**
 * @typedef {object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} password - The hashed password
 * @property {string} role
 * @property {string} status
 * @property {Date} createdAt
 */

/**
 * Factory function to create a User object.
 * This ensures the object is consistent and decouples its creation from other parts of the application.
 * @param {object} props - The properties of the user.
 * @param {string} props.id
 * @param {string} props.name
 * @param {string} props.email
 * @param {string} props.password
 * @param {string} [props.role='user']
 * @param {string} [props.status='active']
 * @param {Date} props.created_at
 * @returns {User}
 */
export const createUser = ({ id, name, email, password, role = 'user', status = 'active', created_at }) => {
  // Domain validation can be added here in the future
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required to create a user.');
  }

  return {
    id,
    name,
    email,
    password,
    role,
    status,
    createdAt: created_at,
  };
};
