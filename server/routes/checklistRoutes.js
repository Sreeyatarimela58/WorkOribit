import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  createChecklist,
  getChecklists,
  getChecklistById,
  deleteChecklist,
  updateChecklist,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from "../controllers/checklistController.js";

const router = express.Router();

router.use(protect);
/**
 * @openapi
 * tags:
 *   - name: Checklists
 *     description: Manage onboarding checklists and their items
 */

/**
 * @openapi
 * /api/checklists:
 *   get:
 *     tags:
 *       - Checklists
 *     summary: Get all checklists
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of checklists
 */
/**
 * @openapi
 * /api/checklists:
 *   post:
 *     tags:
 *       - Checklists
 *     summary: Create a checklist (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     requiresApproval:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Checklist created
 */
router.post("/", authorizeRoles("admin"), createChecklist);
router.get("/", getChecklists);
router.get("/:id", getChecklistById);
/**
 * @openapi
 * /api/checklists/{id}:
 *   get:
 *     tags:
 *       - Checklists
 *     summary: Get a checklist by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Checklist object
 *       404:
 *         description: Not found
 */
/**
 * @openapi
 * /api/checklists/{id}:
 *   put:
 *     tags:
 *       - Checklists
 *     summary: Update a checklist (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               items:
 *                 type: array
 *     responses:
 *       200:
 *         description: Checklist updated
 */
router.put("/:id", authorizeRoles("admin"), updateChecklist);
router.delete("/:id", authorizeRoles("admin"), deleteChecklist);

// item routes
/**
 * @openapi
 * /api/checklists/{id}/items:
 *   post:
 *     tags:
 *       - Checklists
 *     summary: Add an item to a checklist (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               requiresApproval:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Item added
 */
router.post("/:id/items", authorizeRoles("admin"), addChecklistItem);
/**
 * @openapi
 * /api/checklists/{id}/items/{key}:
 *   put:
 *     tags:
 *       - Checklists
 *     summary: Update a checklist item (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               requiresApproval:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Item updated
 */
router.put("/:id/items/:key", authorizeRoles("admin"), updateChecklistItem);
/**
 * @openapi
 * /api/checklists/{id}/items/{key}:
 *   delete:
 *     tags:
 *       - Checklists
 *     summary: Delete a checklist item (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted
 */
router.delete("/:id/items/:key", authorizeRoles("admin"), deleteChecklistItem);

export default router;
