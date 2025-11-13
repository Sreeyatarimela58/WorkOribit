// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import { authorizeRoles } from "../middleware/roleMiddleware.js";
// import {
//   createChecklist,
//   getChecklists,
//   getChecklistById,
//   deleteChecklist,
// } from "../controllers/checklistController.js";

// const router = express.Router();

// router.use(protect);
// router.post("/", authorizeRoles("admin"), createChecklist);
// router.get("/", getChecklists);
// router.get("/:id", getChecklistById);
// router.delete("/:id", authorizeRoles("admin"), deleteChecklist);

// export default router;
