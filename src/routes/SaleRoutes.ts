import {Router} from "express";
import { SaleController } from "../controllers/SaleController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get('/', SaleController.getAll)
router.get('/:id', SaleController.getById)
router.get('/customer/:customerId', SaleController.getByCustomer)
router.get('/status/:status', SaleController.getByStatus)

router.post('/:customerId/:carId', authenticateToken, SaleController.create)
router.put('/:id', authenticateToken, SaleController.update)
router.delete('/:id', authenticateToken, SaleController.delete)

export default router