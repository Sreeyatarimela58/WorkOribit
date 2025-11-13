import express from "express";
import { loginUser, registerUser, getMe, seedAdmin } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/seed-admin", seedAdmin);

export default router;
