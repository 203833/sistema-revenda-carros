import { Router } from "express"
import customerRouter from "./ClienteRoutes"
import carRouter from "./CarroRoutes"
import saleRouter from "./VendaRoutes"
import authRouter from "./AuthRoutes"

const router = Router()

router.use('/auth', authRouter)
router.use('/clientes', customerRouter)
router.use('/carros', carRouter)
router.use('/vendas', saleRouter)

export default router