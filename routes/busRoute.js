import express from 'express';
import { createBus, deleteBuses, geAlltBus, getBusesByLocationAndDate } from '../controllers/busController.js';

const busRouter = express.Router();

busRouter.post("/",createBus)
busRouter.post("/selectedbus",getBusesByLocationAndDate)
busRouter.get("/getallBus",geAlltBus)
busRouter.delete("/:busId",deleteBuses)





export default busRouter;