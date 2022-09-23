const express = require('express')
const router = express.Router()
const {getPizzas, setPizza, updatePizzas, deletePizza} = require('../controllers/pizzaController')



//!DB routes
router.route('/').get(getPizzas).post(setPizza)
router.route('/:id').put(updatePizzas).delete(deletePizza)



module.exports = router
