import mongoose from "mongoose";

const DriverSchema = mongoose.Schema({

   Name : {
        type : String,
    },

    contactNo: {
        type: String,
    },

})

const Driver = mongoose.model("drivers", DriverSchema)

export default Driver;


// admin = admin@example.com   pass = 456