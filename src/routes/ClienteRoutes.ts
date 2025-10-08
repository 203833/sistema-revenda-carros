import {Router} from "express";
import { ClienteController } from "../controllers/ClienteController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get('/', ClienteController.getAll)
router.get('/:id', ClienteController.getById)

router.post('/', authenticateToken, ClienteController.create)
router.put('/:id', authenticateToken, ClienteController.update)
router.delete('/:id', authenticateToken, ClienteController.delete)

export default router