import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const checklistItemSchema = new mongoose.Schema({
  key: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  requiresApproval: { type: Boolean, default: true },
});

const checklistSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    items: [checklistItemSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

checklistSchema.index({ title: "text" });

const Checklist = mongoose.model("Checklist", checklistSchema);
export default Checklist;
