// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import { authorizeRoles } from "../middleware/roleMiddleware.js";
// import {
//   assignOnboarding,
//   getEmployeeOnboarding,
//   updateTaskStatus,
//   approveTask,
//   getOnboardingStatus,
// } from "../controllers/onboardingController.js";

// const router = express.Router();

// router.use(protect);
// router.post("/:employeeId/assign", authorizeRoles("admin"), assignOnboarding);
// router.get("/:employeeId", getEmployeeOnboarding);
// router.put("/:employeeId/item/:key", authorizeRoles("employee", "manager"), updateTaskStatus);
// router.post("/:employeeId/item/:key/approve", authorizeRoles("manager"), approveTask);
// router.get("/:employeeId/status", getOnboardingStatus);

// export default router;
