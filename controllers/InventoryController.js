import Inventorys from "../models/inventory.js";
import { isAdmin } from "./userController.js";



// Create new inventory entry
export function createInventory(req, res) {
     if(!isAdmin(req)){
            res.json({
                message: "Please login as an admin to add inventory.!" 
            })
            return
        }
  try {
    const inventory = new Inventorys(req.body);
     inventory.save();
    res.status(201).json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all inventory entries
export async function getInventories(req, res)  {
  try {
    const inventories = await Inventorys.find();
    res.status(200).json(inventories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an inventory entry
export async function updateInventory(req, res){
  try {
    const inventory = await Inventorys.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an inventory entry
export async function deleteInventory(req, res){
  try {
    await Inventorys.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Inventory entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
