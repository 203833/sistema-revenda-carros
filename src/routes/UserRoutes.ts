import {Router} from "express";
import { CustomerController } from "src/controllers/CustomerController";

const router = Router();

router.get('/', CustomerController.getAll)
router.post('/', CustomerController.create)
router.put('/:id', CustomerController.update)
router.delete('/:id', CustomerController.delete)
router.get('/:id', CustomerController.getById)

export default router