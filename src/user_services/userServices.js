import * as userRepo from '../user_repo/userRepo.js';

export async function getAllUsers(currentUser) {
  if (!currentUser) {
    const err = new Error('Authentication required');
    err.status = 401;
    throw err;
  }
  if (currentUser.role !== 'admin') {
    const err = new Error(
      'Access denied. Only admin can view all user accounts',
    );
    err.status = 403;
    throw err;
  }
  return await userRepo.getAllUsers();
}

export async function getUserById(id, currentUser) {
  if (!currentUser) {
    const err = new Error('Authentication required');
    err.status = 401;
    throw err;
  }
  if (isNaN(id) || id <= 0) {
    const err = new Error('User ID must be a positive integer');
    err.status = 400;
    throw err;
  }

  const user = await userRepo.getUserById(id);
  if (!user) {
    const err = new Error(`Cannot find user with id: ${id}`);
    err.status = 404;
    throw err;
  }
  if (currentUser.role !== 'admin' && currentUser.id !== user.id) {
    const err = new Error('You are not authorized to view this account');
    err.status = 403;
    throw err;
  }
  return user;
}

export async function createUser(data) {
  const { name, email, password, role } = data;
  if (!name || !email || !password) {
    const err = new Error('Missing fields');
    err.status = 400;
    throw err;
  }

  const existing = await userRepo.getUserByEmail(email);
  if (existing) {
    const err = new Error('Email already exists');
    err.status = 409;
    throw err;
  }
  return await userRepo.createUser({ name, email, password, role });
}

export async function updateUser(id, data, currentUser) {
  if (!currentUser) {
    const err = new Error('Authentication required');
    err.status = 401;
    throw err;
  }

  if (currentUser.role !== 'admin' && currentUser.id !== Number(id)) {
    const err = new Error('You are not authorized to update this account');
    err.status = 403;
    throw err;
  }

  const user = await userRepo.getUserById(id);
  if (!user) {
    const err = new Error(`Cannot find user with id: ${id}`);
    err.status = 404;
    throw err;
  }
  const updated = await userRepo.updateUser(id, data);
  return updated;
}

export async function deleteUser(id, currentUser) {
  if (!currentUser) {
    const err = new Error('Authentication required');
    err.status = 401;
    throw err;
  }
  if (currentUser.role !== 'admin' && currentUser.id !== Number(id)) {
    const err = new Error('You are not authorized to delete this account');
    err.status = 403;
    throw err;
  }

  const deleted = await userRepo.removeUser(id);
  if (!deleted) {
    const err = new Error(`Cannot find user with id: ${id}`);
    err.status = 404;
    throw err;
  }
  return {
    message: `User ${deleted.name} with ID ${deleted.id} deleted successfully`,
  };
}

export async function updateUserRole(id, newRole, currentUser) {
  if (!currentUser) {
    const err = new Error('Authentication required');
    err.status = 401;
    throw err;
  }
  if (currentUser.role !== 'admin') {
    const err = new Error('You are not authorized to update this account');
    err.status = 403;
    throw err;
  }

  const user = await userRepo.getUserById(id);
  if (!user) {
    const err = new Error(`Cannot find user with id: ${id}`);
    err.status = 404;
    throw err;
  }

  const updated = await userRepo.updateUser(id, { role: newRole });
  return {
    message: `User ${user.name} with id ${user.id} : role updated successfully`,
    updatedUser: updated,
  };
}
