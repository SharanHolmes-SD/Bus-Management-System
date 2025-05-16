import Driver from "../models/driverModel.js"
import { isAdmin } from "./userController.js"



export  function createDriver(req,res){

    if(!isAdmin(req)){
        res.json({
            message: "Please login as an admin to add drivers.!" 
        })
        return
    }

    const newDriverData = req.body

    const driver = new Driver(newDriverData)

    driver.save().then(()=>{
        res.json({
            message: "Driver added..!"
        })
    }).catch((error)=>{
        console.log(error)
        res.status(403).json({
            message: error
        })
    })

}