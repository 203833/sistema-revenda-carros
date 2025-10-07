import { Router } from "express"
import customerRouter from "./CustomerRoutes"
import carRouter from "./CarRoutes"
import saleRouter from "./SaleRoutes"
import authRouter from "./AuthRoutes"

const router = Router()

router.use('/auth', authRouter)
router.use('/customers', customerRouter)
router.use('/cars', carRouter)
router.use('/sales', saleRouter)

export default router