import * as orderrepository from '../order_repositories/orderRepo.js';

export async function getAllOrders() {
  return orderrepository.findAll();
}