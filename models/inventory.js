import mongoose from "mongoose";



const Inventory = mongoose.Schema({
  vehicleNumber:
   {
     type: String, 
     required: true 
}, 

  vehicleModel:
   { type:  String },
  yearOfManufacture: { type: Number },

  issueDescription: { type: String, required: true },
  priorityLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },

  sparePartName: { type: String },     
  quantityAvailable: { type: Number },  

  status: { type: String, enum: ['Active', 'Under Maintenance', 'Resolved'], default: 'Active' },
  reportedDate: { type: Date, default: Date.now }
});

const Inventorys = mongoose.model("inventory", Inventory)

export default Inventorys;