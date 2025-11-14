// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import { authorizeRoles } from "../middleware/roleMiddleware.js";
// import {
//   getDepartments,
//   createDepartment,
//   updateDepartment,
//   deleteDepartment,
// } from "../controllers/departmentController.js";

// const router = express.Router();

// router.use(protect);
// router.get("/", getDepartments);
// router.post("/", authorizeRoles("admin"), createDepartment);
// router.put("/:id", authorizeRoles("admin"), updateDepartment);
// router.delete("/:id", authorizeRoles("admin"), deleteDepartment);

// export default router;
