import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

//Routes imports
import authRoutes from "./routes/authRoutes.js";
// import employeeRoutes from "./routes/employeeRoutes.js";
// import departmentRoutes from "./routes/departmentRoutes.js";
// import checklistRoutes from "./routes/checklistRoutes.js";
// import onboardingRoutes from "./routes/onboardingRoutes.js";
// import managerRoutes from "./routes/managerRoutes.js";
// import fileRoutes from "./routes/fileRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";

const app = express();
dotenv.config();
connectDB();

// app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "OK" }));

app.use("/api/auth", authRoutes);
// app.use("/api/employees", employeeRoutes);
// app.use("/api/departments", departmentRoutes);
// app.use("/api/checklists", checklistRoutes);
// app.use("/api/onboarding", onboardingRoutes);
// app.use("/api/manager", managerRoutes);
// app.use("/api/files", fileRoutes);
// app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});