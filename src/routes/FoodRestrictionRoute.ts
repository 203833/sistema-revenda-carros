import {Router} from "express";
import { SaleController } from "src/controllers/SaleController";

const router = Router();

router.get('/', SaleController.getAll)
router.post('/:customerId/:carId', SaleController.create)
router.put('/:id', SaleController.update)
router.delete('/:id', SaleController.delete)
router.get('/:id', SaleController.getById)
router.get('/customer/:customerId', SaleController.getByCustomer)
router.get('/status/:status', SaleController.getByStatus)

export default router