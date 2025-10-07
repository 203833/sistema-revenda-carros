import {Router} from "express";
import { CustomerController } from "../controllers/CustomerController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Public endpoints (GET)
router.get('/', CustomerController.getAll)
router.get('/:id', CustomerController.getById)

// Protected endpoints (POST, PUT, DELETE)
router.post('/', authenticateToken, CustomerController.create)
router.put('/:id', authenticateToken, CustomerController.update)
router.delete('/:id', authenticateToken, CustomerController.delete)

export default router