import mongoose from "mongoose";

const BusSchema = mongoose.Schema({
   
    busName: {
        type: String,
        required: true
    },
    noOfSeats: {
        type: String,
        required: true
    },
    busOwnerName: {
        type: String,
    },


    routeNo: {
        type: String,
        required: true,
        ref: 'Route'
    },

    startLocation: {
        type:String,
    },

    endLocation:{
        type: String,
    },
    
    price:{
        type: String
    },

    schedule: [{
        date: { type: String, required: true },
        times: [{
            startTime: { type: String, required: true },
            endTime: { type: String, required: true }
        }]
    }],

    busNo: {
        type: String,
        required: true,
        unique:true,
    },
    busType: {
        type: String,
        required: true
    },
    driverName: {
        type: String,
        required: true
    },
    
    price: {
        type: String,
        required: true
    },
});

const Bus = mongoose.model("bus", BusSchema);

export default Bus;
