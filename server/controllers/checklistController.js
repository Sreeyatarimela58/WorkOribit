import Checklist from "../models/Checklist.js";
import { v4 as uuidv4 } from "uuid";

// GET /api/checklists
export const getChecklists = async (req, res) => {
  try {
    const checklists = await Checklist.find();
    res.json(checklists);
  } catch (err) {
    console.error("Get Checklists Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/checklists/:id
export const getChecklistById = async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id);
    if (!checklist)
      return res.status(404).json({ message: "Checklist not found" });
    res.json(checklist);
  } catch (err) {
    console.error("Get Checklist Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/checklists
export const createChecklist = async (req, res) => {
  try {
    const { title, description, items } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const newChecklist = await Checklist.create({
      title,
      description,
      items: (items || []).map((it) => ({
        key: it.key || uuidv4(),
        title: it.title,
        requiresApproval: !!it.requiresApproval,
      })),
      createdBy: req.user ? req.user._id : undefined,
    });

    res.status(201).json(newChecklist);
  } catch (err) {
    console.error("Create Checklist Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/checklists/:id
export const updateChecklist = async (req, res) => {
  try {
    const { title, description, items } = req.body;
    const checklist = await Checklist.findById(req.params.id);
    if (!checklist)
      return res.status(404).json({ message: "Checklist not found" });

    checklist.title = title ?? checklist.title;
    checklist.description = description ?? checklist.description;

    if (Array.isArray(items)) {
      // Overwrite items array (caller can manage keys)
      checklist.items = items.map((it) => ({
        key: it.key || uuidv4(),
        title: it.title,
        requiresApproval: !!it.requiresApproval,
      }));
    }

    await checklist.save();
    res.json(checklist);
  } catch (err) {
    console.error("Update Checklist Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/checklists/:id
export const deleteChecklist = async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id);
    if (!checklist)
      return res.status(404).json({ message: "Checklist not found" });
    await checklist.deleteOne();
    res.json({ message: "Checklist deleted" });
  } catch (err) {
    console.error("Delete Checklist Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/checklists/:id/items
export const addChecklistItem = async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id);
    if (!checklist)
      return res.status(404).json({ message: "Checklist not found" });
    const { title, requiresApproval } = req.body;
    if (!title) return res.status(400).json({ message: "Item title required" });
    const newItem = {
      key: uuidv4(),
      title,
      requiresApproval: !!requiresApproval,
    };
    checklist.items.push(newItem);
    await checklist.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Add Checklist Item Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/checklists/:id/items/:key
export const updateChecklistItem = async (req, res) => {
  try {
    const { title, requiresApproval } = req.body;
    const checklist = await Checklist.findById(req.params.id);
    if (!checklist)
      return res.status(404).json({ message: "Checklist not found" });
    const item = checklist.items.find((i) => i.key === req.params.key);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (title !== undefined) item.title = title;
    if (requiresApproval !== undefined)
      item.requiresApproval = !!requiresApproval;
    await checklist.save();
    res.json(item);
  } catch (err) {
    console.error("Update Checklist Item Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/checklists/:id/items/:key
export const deleteChecklistItem = async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id);
    if (!checklist)
      return res.status(404).json({ message: "Checklist not found" });
    const initial = checklist.items.length;
    checklist.items = checklist.items.filter((i) => i.key !== req.params.key);
    if (checklist.items.length === initial)
      return res.status(404).json({ message: "Item not found" });
    await checklist.save();
    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("Delete Checklist Item Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
