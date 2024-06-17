const Router = require('express')
const router = new Router()
const basketProductController = require('../controllers/basketProductController')


router.post('/', basketProductController.addProduct)
router.post('/removeProduct', basketProductController.removeProduct)
router.post('/removeAllProducts', basketProductController.removeAllProducts)
router.get('/', basketProductController.getAll)
router.get('/with_products', basketProductController.getWithProducts)

module.exports = router
