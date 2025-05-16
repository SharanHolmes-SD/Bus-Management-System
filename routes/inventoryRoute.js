import express from 'express';
import { createInventory, deleteInventory, getInventories, updateInventory } from '../controllers/InventoryController.js';

const InventoryRouter = express.Router();




InventoryRouter.post('/', createInventory);
InventoryRouter.get('/', getInventories);
InventoryRouter.put('/:id', updateInventory);
InventoryRouter.delete('/:id', deleteInventory);

export default InventoryRouter;