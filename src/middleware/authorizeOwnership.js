import { getProductById } from "../services/productService.js";
import { getOrderById } from "../services/orderService.js";

export async function authorizeProductOwnership(req, res, next) {
  const productId = parseInt(req.params.id, 10);
  const product = await getProductById(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    return next(error);
  }

  const isOwner = product.userId === req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    const error = new Error("Forbidden: insufficient permission");
    error.status = 403;
    return next(error);
  }

  return next();
}

export async function authorizeOrderOwnership(req, res, next) {
  const orderId = parseInt(req.params.id, 10);
  const order = await getOrderById(orderId);

  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    return next(error);
  }

  const isOwner = order.userId === req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    const error = new Error("Forbidden: insufficient permission");
    error.status = 403;
    return next(error);
  }

  return next();
}