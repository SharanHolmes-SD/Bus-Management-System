import mongoose from "mongoose";

const RouteSchema = mongoose.Schema({

    routeNo: {
        type: String,
        required : true,
        unique: true
    },
    status : {
        type : String,
        default : "active"
    },

    startLocation : {
        type : String,
        required : true
    },
    endLocation : {
        type : String,
        required : true
    },

    distance : {
        type: String,
    },

    duration : {
        type : String,
    },
    
    acPrice: {
        type: String,
        required: true
      },

    nonAcPrice: {
        type: String,
        required: true
      },

    stops: [{
        type: String
    }],

})

const Route = mongoose.model("routes", RouteSchema)

export default Route;

