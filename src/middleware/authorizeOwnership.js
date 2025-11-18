import { getProductById } from "../services/productService.js";

export async function authorizeOwnership(req, res, next) {
    const productId = parseInt(req.params.id);
    const product = await getPostById(postId);

    if (product.userId !== req.user.id) {
        const error = new Error('Forbidden: insufficient permission');
        error.status = 403;
        return next(error);
    }
    return next();
}