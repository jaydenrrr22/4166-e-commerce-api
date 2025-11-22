import * as userServices from '../services/userServices.js';

export async function getAllUsersHandler(req, res) {
  try {
    const users = await userServices.getAllUsers(req.user);
    res.status(200).json(users);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getUserByIdHandler(req, res) {
  try {
    const user = await userServices.getUserById(Number(req.params.id));
    if (req.user.role !== 'ADMIN' && req.user.id !== Number(req.params.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function createUserHandler(req, res) {
  try {
    const newUser = await userServices.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function updateUserHandler(req, res) {
  try {
    if (req.user.role !== 'ADMIN' && req.user.id != Number(req.params.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updatedUser = await userServices.updateUser(
      Number(req.user.id),
      req.body,
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function updateUserRoleHandler(req, res) {
  try {
    const updatedUserRole = await userServices.updateUserRole(
      Number(req.user.id),
      req.body.role,
    );
    res.status(200).json(updatedUserRole);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function deleteUserHandler(req, res) {
  try {
    if (req.user.role !== 'ADMIN' && req.user.id !== Number(req.params.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const result = await userServices.deleteUser(Number(req.params.id));

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
