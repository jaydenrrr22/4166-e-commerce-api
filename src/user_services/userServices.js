import * as userRepo from '../user_repo/userRepo.js';

export async function getAllUsers(currentUser) {
  if (!currentUser) {
    throw {
      status: 401,
      message: 'Authentication Required.',
    };
  }
  if (currentUser.role !== 'admin') {
    throw {
      status: 403,
      message: 'Access denied. Only admin can view all user accounts',
    };
  }
  return await userRepo.getAllUsers();
}
