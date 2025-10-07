import {Router} from "express";
import { CarController } from "../controllers/CarController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get('/', CarController.getAll)
router.get('/:id', CarController.getById)
router.get('/available', CarController.getAvailable)
router.get('/brand/:brand', CarController.searchByBrand)

router.post('/', authenticateToken, CarController.create)
router.put('/:id', authenticateToken, CarController.update)
router.delete('/:id', authenticateToken, CarController.delete)

export default router