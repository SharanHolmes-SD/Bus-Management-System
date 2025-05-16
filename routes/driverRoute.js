import express from 'express';
import { createDriver } from '../controllers/driverController.js';


const driverRouter = express.Router();

driverRouter.post("/",createDriver)




export default driverRouter;