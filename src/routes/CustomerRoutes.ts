import {Router} from "express";
import { CustomerController } from "../controllers/CustomerController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get('/', CustomerController.getAll)
router.get('/:id', CustomerController.getById)

router.post('/', authenticateToken, CustomerController.create)
router.put('/:id', authenticateToken, CustomerController.update)
router.delete('/:id', authenticateToken, CustomerController.delete)

export default router