import OnboardingInstance from "../models/OnboardingInstance.js";
import Checklist from "../models/Checklist.js";
import Employee from "../models/Employee.js";

// POST /api/onboarding/:employeeId/assign
export const assignOnboarding = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { checklistId } = req.body;
    if (!checklistId)
      return res.status(400).json({ message: "checklistId required" });

    const employee = await Employee.findById(employeeId);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const checklist = await Checklist.findById(checklistId);
    if (!checklist)
      return res.status(404).json({ message: "Checklist not found" });

    // Prevent duplicate assignment
    const existing = await OnboardingInstance.findOne({
      employeeId,
      checklistId,
    });
    if (existing)
      return res
        .status(400)
        .json({ message: "Onboarding already assigned for this checklist" });

    const itemsStatus = checklist.items.map((it) => ({
      key: it.key,
      title: it.title,
      status: "pending",
    }));

    const instance = await OnboardingInstance.create({
      employeeId,
      checklistId,
      itemsStatus,
    });
    res.status(201).json(instance);
  } catch (err) {
    console.error("Assign Onboarding Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/onboarding/:employeeId
export const getEmployeeOnboarding = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const instances = await OnboardingInstance.find({ employeeId }).populate(
      "checklistId"
    );
    res.json(instances);
  } catch (err) {
    console.error("Get Employee Onboarding Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/onboarding/:employeeId/item/:key
export const updateTaskStatus = async (req, res) => {
  try {
    const { employeeId, key } = req.params;
    const { status, comment } = req.body;

    // Find the onboarding instance that contains this key
    const instance = await OnboardingInstance.findOne({
      employeeId,
      "itemsStatus.key": key,
    });
    if (!instance)
      return res
        .status(404)
        .json({ message: "Onboarding item not found for employee" });

    const item = instance.itemsStatus.find((i) => i.key === key);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (status) item.status = status;
    if (comment !== undefined) item.comment = comment;
    item.updatedBy = req.user ? req.user._id : null;
    item.updatedAt = new Date();

    await instance.save();
    res.json(item);
  } catch (err) {
    console.error("Update Task Status Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/onboarding/:employeeId/item/:key/approve
export const approveTask = async (req, res) => {
  try {
    const { employeeId, key } = req.params;
    const instance = await OnboardingInstance.findOne({
      employeeId,
      "itemsStatus.key": key,
    });
    if (!instance)
      return res
        .status(404)
        .json({ message: "Onboarding item not found for employee" });

    const item = instance.itemsStatus.find((i) => i.key === key);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.status = "approved";
    item.updatedBy = req.user ? req.user._id : null;
    item.updatedAt = new Date();

    await instance.save();
    res.json(item);
  } catch (err) {
    console.error("Approve Task Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/onboarding/:employeeId/status
export const getOnboardingStatus = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const instances = await OnboardingInstance.find({ employeeId }).populate(
      "checklistId"
    );
    // Return a summarized status
    const summary = instances.map((ins) => ({
      checklistId: ins.checklistId._id,
      checklistTitle: ins.checklistId.title,
      items: ins.itemsStatus.map((it) => ({
        key: it.key,
        title: it.title,
        status: it.status,
      })),
    }));
    res.json(summary);
  } catch (err) {
    console.error("Get Onboarding Status Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
