import {Router} from "express";
import { CarController } from "src/controllers/CarController";

const router = Router();

router.get('/', CarController.getAll)
router.post('/', CarController.create)
router.put('/:id', CarController.update)
router.delete('/:id', CarController.delete)
router.get('/:id', CarController.getById)
router.get('/available', CarController.getAvailable)
router.get('/brand/:brand', CarController.searchByBrand)

export default router