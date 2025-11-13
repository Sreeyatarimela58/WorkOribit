import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    filename: { type: String },
    url: { type: String, required: true },
    ownerEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    type: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

fileSchema.index({ ownerEmployeeId: 1 });

const File = mongoose.model("File", fileSchema);
export default File;
