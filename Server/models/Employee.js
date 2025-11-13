import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    displayName: { type: String, index: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    roleTitle: { type: String },
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
  },
  { timestamps: true }
);

// Text search for directory
employeeSchema.index({
  displayName: "text",
  roleTitle: "text",
  skills: "text",
  bio: "text",
});

// Common filter indexes
employeeSchema.index({ departmentId: 1, location: 1 });
employeeSchema.index({ managerId: 1 });

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
