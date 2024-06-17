const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')
const productRouter = require('./productRouter')
const basketProductRouter = require('./basketProductRouter')
const basketRouter = require('./basketRouter')


router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/product', productRouter)
router.use('/basketProduct', basketProductRouter)
router.use('/basket', basketRouter)

module.exports = router