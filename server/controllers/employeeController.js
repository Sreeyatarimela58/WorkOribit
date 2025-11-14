import Employee from "../models/Employee.js";
import User from "../models/User.js";
import { DEPARTMENTS } from "../utils/departments.js";

// ---------------------------
// GET ALL EMPLOYEES
// ---------------------------
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("managerId", "firstName lastName email");

    res.json(employees);
  } catch (err) {
    console.error("Get Employees Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// GET EMPLOYEE BY ID
// ---------------------------
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("managerId", "firstName lastName email");

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
  } catch (err) {
    console.error("Get Employee Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// CREATE EMPLOYEE
// ---------------------------
export const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      department,
      jobTitle,
      managerId,
      skills,
      location
    } = req.body;

    if (!firstName || !lastName || !email)
      return res.status(400).json({ message: "Missing required fields" });

    if (department && !DEPARTMENTS.includes(department)) {
      return res.status(400).json({ message: "Invalid department" });
    }

    const existing = await Employee.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Employee with this email exists" });

    // Validate manager if provided
    if (managerId) {
      const manager = await Employee.findById(managerId);
      if (!manager)
        return res.status(400).json({ message: "Invalid managerId" });
    }

    const newEmployee = await Employee.create({
      firstName,
      lastName,
      email,
      department,
      jobTitle,
      managerId: managerId || null,
      skills: skills || [],
      location
    });

    res.status(201).json(newEmployee);
  } catch (err) {
    console.error("Create Employee Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// UPDATE EMPLOYEE
// ---------------------------
export const updateEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      department,
      jobTitle,
      managerId,
      skills,
      location
    } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    if (department && !DEPARTMENTS.includes(department)) {
      return res.status(400).json({ message: "Invalid department" });
    }

    // Prevent self-assign as manager
    if (managerId && managerId === employee._id.toString()) {
      return res.status(400).json({ message: "Employee cannot be their own manager" });
    }

    // Validate manager
    if (managerId) {
      const manager = await Employee.findById(managerId);
      if (!manager)
        return res.status(400).json({ message: "Invalid managerId" });
    }

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        department,
        jobTitle,
        managerId: managerId || null,
        skills,
        location
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Update Employee Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------
// DELETE EMPLOYEE
// ---------------------------
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    // Block delete of managers with team
    const hasTeam = await Employee.findOne({ managerId: employee._id });
    if (hasTeam) {
      return res.status(400).json({
        message: "Cannot delete this employee because they manage other employees."
      });
    }

    // Delete associated login
    await User.deleteOne({ employeeId: employee._id });

    await employee.deleteOne();

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Delete Employee Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
