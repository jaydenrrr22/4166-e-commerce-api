import * as userServices from '../user_services/userServices.js';

export async function getAllUsers(req, res) {
  try {
    const users = await userServices.getAllUsers(req.user);
    res.status(200).json(users);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
