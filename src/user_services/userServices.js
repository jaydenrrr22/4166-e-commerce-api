import * as userRepo from '../user_repo/userRepo.js';

export async function getAllUsers() {
  return await userRepo.getAllUsers();
}

export async function getUserById(id) {
  const user = await userRepo.getUserById(id);
  if (!user) {
    const err = new Error(`Cannot find user with id: ${id}`);
    err.status = 404;
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

export async function updateUser(id, data) {
  const user = await userRepo.getUserById(id);
  if (!user) {
    const err = new Error(`Cannot find user with id: ${id}`);
    err.status = 404;
    throw err;
  }
  const updated = await userRepo.updateUser(id, data);
  return updated;
}

export async function deleteUser(id) {
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

export async function updateUserRole(id, newRole) {
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
