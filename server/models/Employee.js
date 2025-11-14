import mongoose from "mongoose";
import { DEPARTMENTS } from "../utils/departments.js";
const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    displayName: { type: String, index: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    department: {
      type: String,
      enum: DEPARTMENTS,      // ⬅ HERE - Enforce enum
      required: false,
    },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    jobTitle: { type: String },
    location: { type: String },
    skills: [{ type: String }],
    bio: { type: String },
    documents: [
      {
        fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
        label: String,
        uploadedAt: Date,
      },
    ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },

  { timestamps: true }
);

// Text search for directory
employeeSchema.index({
  displayName: "text",
  jobTitle: "text",
  skills: "text",
  bio: "text",
});

// Common filter indexes
employeeSchema.index({ department: 1, location: 1 });
employeeSchema.index({ managerId: 1 });

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
