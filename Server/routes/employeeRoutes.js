// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import { authorizeRoles } from "../middleware/roleMiddleware.js";
// import {
//   getEmployees,
//   getEmployeeById,
//   createEmployee,
//   updateEmployee,
//   deleteEmployee,
// } from "../controllers/employeeController.js";

// const router = express.Router();

// router.use(protect);
// router.get("/", getEmployees);
// router.get("/:id", getEmployeeById);
// router.post("/", authorizeRoles("admin"), createEmployee);
// router.put("/:id", authorizeRoles("admin"), updateEmployee);
// router.delete("/:id", authorizeRoles("admin"), deleteEmployee);

// export default router;
