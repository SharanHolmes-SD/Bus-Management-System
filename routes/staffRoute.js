import express from 'express';
import { createStaff, deleteStaff, getStaff } from '../controllers/staffController.js';


const staffRouter = express.Router();

staffRouter.post('/', createStaff);
staffRouter.get('/', getStaff);
staffRouter.delete('/:id', deleteStaff);




export default staffRouter;