import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  promoteEmployee,
  demoteEmployee
} from "../controllers/employeeController.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Employees
 *     description: Employee management endpoints
 */

/**
 * @openapi
 * /api/employees:
 *   get:
 *     tags:
 *       - Employees
 *     summary: Get all employees
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all employees
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /api/employees/{id}:
 *   get:
 *     tags:
 *       - Employees
 *     summary: Get employee by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Employee not found
 */

/**
 * @openapi
 * /api/employees:
 *   post:
 *     tags:
 *       - Employees
 *     summary: Create a new employee (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               department:
 *                 type: string
 *               position:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @openapi
 * /api/employees/{id}:
 *   put:
 *     tags:
 *       - Employees
 *     summary: Update employee by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               department:
 *                 type: string
 *               position:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Employee not found
 */

/**
 * @openapi
 * /api/employees/{id}:
 *   delete:
 *     tags:
 *       - Employees
 *     summary: Delete employee by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Employee not found
 */

/**
 * @openapi
 * /api/employees/{id}/promote:
 *   patch:
 *     tags:
 *       - Employees
 *     summary: Promote an employee to manager (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee promoted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Employee not found
 */

/**
 * @openapi
 * /api/employees/{id}/demote:
 *   patch:
 *     tags:
 *       - Employees
 *     summary: Demote a manager to regular employee (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee demoted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Employee not found
 */
router.use(protect);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.post("/", authorizeRoles("admin"), createEmployee);
router.put("/:id", authorizeRoles("admin"), updateEmployee);
router.delete("/:id", authorizeRoles("admin"), deleteEmployee);
router.patch("/:id", authorizeRoles("admin"), promoteEmployee);
router.patch("/:id/demote", authorizeRoles("admin"), demoteEmployee);

export default router;
