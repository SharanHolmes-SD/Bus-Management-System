import Route from "../models/RouteModel.js"
import { isAdmin } from "./userController.js"

export  function createRoute(req,res){

    if(!isAdmin(req)){
        res.json({
            message: "Please login as an admin to add buses.!" 
        })
        return
    }

    const newRouteData = req.body

    const routes = new Route(newRouteData)

    routes.save().then(()=>{
        res.json({
            message: "Route added..!"
        })
    }).catch((error)=>{
        console.log(error)
        res.status(403).json({
            message: error
        })
    })

}



export function getRoute(req,res){
    Route.find({}).then((routes)=>{
        res.json(routes)
    })
}


export async function deleteRoute(req, res) {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                message: "Please login as an admin to delete routes!"
            });
        }

        const routeId = req.params.routeId;
        
        const deletedRoutes = await Route.findByIdAndDelete(routeId);

        if (!deletedRoutes) {
            return res.status(404).json({ message: "Rout not found" });
        }

        res.json({ message: "Rout deleted successfully" });
    } catch (error) {
        console.error("Error deleting Rout:", error);
        res.status(500).json({ message: "Error deleting Rout", error });
    }
}