const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')


router.get('/getTotalPrice', basketController.getTotalPrice)
router.get('/getTotalQuantity', basketController.getTotalQuantity)
router.post('/updateTotalPrice', basketController.updateTotalPrice)
router.post('/updateTotalQuantity', basketController.updateTotalQuantity)


module.exports = router
