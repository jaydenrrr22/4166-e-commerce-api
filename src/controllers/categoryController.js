import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService.js';

export async function getAllCategoriesHandler(req, res) {
  const {
    id,
    name,
    sortBy = 'id',
    sortOrder = 'asc',
    limit = 10,
    offset = 0
  } = req.query;

  const filter = {};
  if (id) filter.id = parseInt(id);
  if (name) filter.name = name;
  filter.sortBy = sortBy;
  filter.sortOrder = sortOrder;
  filter.limit = parseInt(limit);
  filter.offset = parseInt(offset);

  let result = await getAllCategories(filter);
  res.status(200).json(result);
}

export async function getCategoryByIdHandler(req, res) {
  let id = parseInt(req.params.id);
  let category = await getCategoryById(id);
  res.status(200).json(category);
}

export async function createCategoryHandler(req, res) {
  let data = {
    name: req.body.name,
  };
  let newCategory = await createCategory(data);
  res.status(201).json(newCategory);
}

export async function updateCategoryHandler(req, res) {
  let id = parseInt(req.params.id);

  const updates = {};
  if (req.body.name) updates.name = req.body.name;

  const updatedCategory = await updateCategory(id, updates);
  res.status(200).json(updatedCategory);
}

export async function deleteCategoryHandler(req, res) {
  let id = parseInt(req.params.id);
  await deleteCategory(id);
  res.status(204).send();
}
