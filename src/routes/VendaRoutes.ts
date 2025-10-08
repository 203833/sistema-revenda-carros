import {Router} from "express";
import { VendaController } from "../controllers/VendaController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get('/', VendaController.getAll)
router.get('/:id', VendaController.getById)
router.get('/cliente/:customerId', VendaController.getByCustomer)
router.get('/status/:status', VendaController.getByStatus)

router.post('/:customerId/:carId', authenticateToken, VendaController.create)
router.put('/:id', authenticateToken, VendaController.update)
router.delete('/:id', authenticateToken, VendaController.delete)

export default router