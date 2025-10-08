import {Router} from "express";
import { CarroController } from "../controllers/CarroController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get('/', CarroController.getAll)
router.get('/disponiveis', CarroController.getAvailable)
router.get('/marca/:brand', CarroController.searchByBrand)
router.get('/:id', CarroController.getById)

router.post('/', authenticateToken, CarroController.create)
router.put('/:id', authenticateToken, CarroController.update)
router.delete('/:id', authenticateToken, CarroController.delete)

export default router