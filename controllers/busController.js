import Bus from "../models/busModel.js"
import Route from "../models/RouteModel.js";
import { isAdmin } from "./userController.js"



export async function createBus(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "Please login as an admin to add buses!"
        });
    }

    const newBusData = req.body;

    try {
        const route = await Route.findOne({ routeNo: newBusData.routeNo });
        
        if (!route) {
            return res.status(404).json({
                message: "Route not found!"
            });
        }

        
        const standardizedBusData = {
            ...newBusData,
            startLocation: route.startLocation,
            endLocation: route.endLocation,
            acprice: route. acPrice,
            nonacprice: route. nonAcPrice,
            schedule: newBusData.schedule.map((sched) => {
                const dateObj = new Date(sched.date);
                if (isNaN(dateObj.getTime())) {
                    throw new Error(`Invalid date format for schedule date: ${sched.date}`);
                }
                const formattedDate = dateObj.toISOString().split("T")[0]; 
                return {
                    ...sched,
                    date: formattedDate,
                    times: sched.times,
                };
            }),
        };

        const bus = new Bus(standardizedBusData);
        await bus.save();
        
        res.status(201).json({
            message: "Bus added successfully!",
            bus
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Failed to add bus",
            error: error.message
        });
    }
}


export async function getBusesByLocationAndDate(req, res) {
    const { startLocation, endLocation, date } = req.body;

    if (!startLocation || !endLocation || !date ) {
        return res.status(400).json({
            message: "startLocation, endLocation, and date are required!"
        });
    }

    try {
        const buses = await Bus.find({
            startLocation,
            endLocation,
            "schedule.date": date
        }).select("busName busNo busType startLocation endLocation schedule price driverName noOfSeats busOwnerName routeNo ");
        

        if (buses.length === 0) {
            return res.status(404).json({
                message: "No buses found for the given criteria!"
            });
        }

        res.status(200).json({
            message: "Buses retrieved successfully!",
            buses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to retrieve buses",
            error: error.message
        });
    }
}

export function geAlltBus(req,res){
    Bus.find({}).then((routes)=>{
        res.json(routes)
    })
}


export async function deleteBuses(req, res) {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                message: "Please login as an admin to delete buses!"
            });
        }

        const busId = req.params.busId;
        
        const deletedbuses = await Bus.findByIdAndDelete(busId);

        if (!deletedbuses) {
            return res.status(404).json({ message: "bus not found" });
        }

        res.json({ message: "bus deleted successfully" });
    } catch (error) {
        console.error("Error deleting Rout:", error);
        res.status(500).json({ message: "Error deleting bus", error });
    }
}