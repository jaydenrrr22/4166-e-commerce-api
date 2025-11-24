import {
  getAll,
  getById,
  create,
  update,
  remove,
} from '../repositories/categoryRepo.js';

export async function getAllCategories(filter) {
  return await getAll(filter);
}

export async function getCategoryById(id) {
  let result = await getById(id);
  if (result) return result;
  else {
    const error = new Error(`Cannot find category with id ${id}`);
    error.status = 404;
    throw error;
  }
}

export async function createCategory(data) {
  return await create(data);
}

export async function updateCategory(id, data) {
  const updatedCategory = await update(id, data);
  if (updatedCategory) return updatedCategory;
  else {
    const error = new Error(`Cannot find category with id ${id}`);
    error.status = 404;
    throw error;
  }
}

export async function deleteCategory(id) {
  const result = await remove(id);
  if (result) return;
  else {
    const error = new Error(`Cannot find category with id ${id}`);
    error.status = 404;
    throw error;
  }
}