// This model in currently inactive and will be added in future.

import mongoose from "mongoose";
import { DEPARTMENTS } from "../utils/departments.js";
const departmentSchema = new mongoose.Schema(
  {
    name: {
          type: String,
          enum: DEPARTMENTS,      // ⬅ HERE - Enforce enum
        },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

departmentSchema.index({ name: 1 });

const Department = mongoose.model("Department", departmentSchema);
export default Department;
