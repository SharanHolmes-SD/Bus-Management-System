import express from 'express';
import { createRoute, deleteRoute, getRoute } from '../controllers/routeController.js';


const routeRouter = express.Router();

routeRouter.post("/",createRoute)
routeRouter.get("/",getRoute)
routeRouter.delete("/:routeId",deleteRoute)




export default routeRouter;