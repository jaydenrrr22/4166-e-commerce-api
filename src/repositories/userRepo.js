import prisma from '../config/db.js';

export async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return users;
}

export async function getUserById(id) {
  const users = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return users;
}

export async function createUser(user) {
  const newUser = await prisma.user.create({
    data: user,
  });
  return newUser;
}

export async function updateUser(id, user) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: user,
    });
    return updatedUser;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function removeUser(id) {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return deletedUser;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}
