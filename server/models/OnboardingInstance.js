import mongoose from "mongoose";

const onboardingItemSchema = new mongoose.Schema({
  key: String,
  title: String,
  status: {
    type: String,
    enum: ["pending", "done", "approved"],
    default: "pending",
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: Date,
  comment: String,
});

const onboardingInstanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    checklistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Checklist",
      required: true,
    },
    itemsStatus: [onboardingItemSchema],
  },
  { timestamps: true }
);

onboardingInstanceSchema.index({ employeeId: 1, checklistId: 1 }, { unique: true });

const OnboardingInstance = mongoose.model("OnboardingInstance", onboardingInstanceSchema);
export default OnboardingInstance;
