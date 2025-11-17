import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  assignOnboarding,
  getEmployeeOnboarding,
  updateTaskStatus,
  approveTask,
  getOnboardingStatus,
} from "../controllers/onboardingController.js";

const router = express.Router();

router.use(protect);
/**
 * @openapi
 * tags:
 *   - name: Onboarding
 *     description: Assign and manage onboarding instances per employee
 */

/**
 * @openapi
 * /api/onboarding/{employeeId}/assign:
 *   post:
 *     tags:
 *       - Onboarding
 *     summary: Assign a checklist to an employee (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
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
 *               checklistId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Onboarding assigned
 */
router.post("/:employeeId/assign", authorizeRoles("admin"), assignOnboarding);

/**
 * @openapi
 * /api/onboarding/{employeeId}:
 *   get:
 *     tags:
 *       - Onboarding
 *     summary: Get onboarding instances for an employee
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of onboarding instances
 */
router.get("/:employeeId", getEmployeeOnboarding);

/**
 * @openapi
 * /api/onboarding/{employeeId}/item/{key}:
 *   put:
 *     tags:
 *       - Onboarding
 *     summary: Update an onboarding item status (employee or manager)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
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
 *               status:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item updated
 */
router.put(
  "/:employeeId/item/:key",
  authorizeRoles("employee", "manager"),
  updateTaskStatus
);

/**
 * @openapi
 * /api/onboarding/{employeeId}/item/{key}/approve:
 *   post:
 *     tags:
 *       - Onboarding
 *     summary: Approve an onboarding item (manager)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
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
 *         description: Item approved
 */
router.post(
  "/:employeeId/item/:key/approve",
  authorizeRoles("manager"),
  approveTask
);

/**
 * @openapi
 * /api/onboarding/{employeeId}/status:
 *   get:
 *     tags:
 *       - Onboarding
 *     summary: Get summarized onboarding status for an employee
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Summary object
 */
router.get("/:employeeId/status", getOnboardingStatus);

export default router;
