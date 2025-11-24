import { getProductById } from "../services/productService.js";
import { getOrderById } from "../services/orderServices.js";

export async function authorizeProductOwnership(req, res, next) {
  const productId = parseInt(req.params.id, 10);
  const product = await getProductById(productId);

  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    return next(error);
  }

  const isOwner = product.sellerId === req.user.id;
  const isAdmin = req.user.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    const error = new Error('Forbidden: insufficient permission');
    error.status = 403;
    return next(error);
  }

  return next();
}

export async function authorizeOrderOwnership(req, res, next) {
  const orderId = parseInt(req.params.id, 10);
  const order = await getOrderById(orderId);

  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    return next(error);
  }

  const isOwner = order.userId === req.user.id;
  const isAdmin = req.user.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    const error = new Error('Forbidden: insufficient permission');
    error.status = 403;
    return next(error);
  }

  return next();
}

export function authorizeUserOwnership(req, res, next) {
  if (req.user.role === 'ADMIN') {
    return next();
  }
  if (req.user.id === Number(req.params.id)) {
    return next();
  }
  return res
    .status(403)
    .json({ message: 'Forbidden: insufficient permission' });
}
