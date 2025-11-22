import prisma from '../config/db.js';

export async function getAll(filter) {
  const conditions = {};

  if (filter.id) {
    conditions.id = { equals: parseInt(filter.id) };
  }
  if (filter.name) {
    conditions.name = { equals: filter.name };
  }

  const categories = await prisma.category.findMany({
    where: conditions,
    select: {
      id: true,
      name: true
    },
    orderBy: { [filter.sortBy]: filter.sortOrder },
    take: filter.limit,
    skip: filter.offset,
  });

  return categories;
}

export async function getById(id) {
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true
    }
  });

  return category;
}

export async function create(category) {
  const newCategory = await prisma.category.create({
    data: category,
  });

  return newCategory;
}

export async function update(id, updates) {
  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updates
    });

    return updatedCategory;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function remove(id) {
  try {
    const deletedCategory = await prisma.category.delete({
      where: { id }
    });

    return deletedCategory;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function exists(id) {
  const result = await prisma.category.count({ where: { id } });
  return result > 0;
}

export async function nameExists(name) {
  const result = await prisma.category.count({ where: { name: name } });
  return result > 0;
}