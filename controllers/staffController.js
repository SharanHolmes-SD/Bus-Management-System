import Staff from "../models/salary.js";

export const createStaff = async (req, res) => {
  try {
    const { name, role, salary } = req.body;
    
    const newStaff = new Staff({
      name,
      role,
      salary: Number(salary),
      dateAdded: new Date()
    });

    const savedStaff = await newStaff.save();
    res.status(201).json(savedStaff);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};


export const getStaff = async (req, res) => {
  try {
    const staffMembers = await Staff.find().sort({ dateAdded: -1 });
    res.status(200).json(staffMembers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await Staff.findByIdAndDelete(id);
    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};