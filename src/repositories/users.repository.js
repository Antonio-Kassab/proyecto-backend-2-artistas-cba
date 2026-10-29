import { findByEmail, createUser } from '../dao/users.dao.js';

export const getUserByEmail = async (email) => {
  return findByEmail(email);
};

export const saveUser = async (userData) => {
  return createUser(userData);
};