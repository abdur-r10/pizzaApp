const express = require('express')
const router = express.Router()
const {getOrders, setOrder, updateOrder, deleteItem, incOrDecQuantity, placeFinalOrder, addItem, trackOrder, createOrderCheckList, assignUserToOrder, updateOrderStatus, getPreviousOrders, previousOrdersAddToBasket, cancelOrder} = require('../controllers/orderController')
const { protect} = require('../middleware/aurthMiddleware') 



//!!!!!!!!!!CLIENT ROUTES
//to create a basket (adding first order into basket)
router.route('/').post(setOrder)

//route to delete an order from basket
router.route('/deleteItem').delete(deleteItem)

//route to increase or decrease Quantity of an item in order
router.route('/incOrDecQuantity/:orderId/:pizzaId').put(incOrDecQuantity)

//route to add item to basket
router.route('/addItem/:orderId').put(addItem)

//place final order and pay via stripe
//PROTECTED ROUTE
router.route('/placeFinalOrder').post(protect, placeFinalOrder)

//get array of previous orders
//PROTECTED ROUTE
router.route('/getPreviousOrders').post(protect, getPreviousOrders)

//in PreviousOrders page add to basket
router.route('/previousOrders/addToBasket').put(previousOrdersAddToBasket)

//update the satus of the order //!!!!!RIGHT NOW THS IS IN THE CLIENT SIDE BUT IT SHOULD BE FOR THE KITCHEN
router.route('/updateOrderStatus/:orderId/:status/:userId').put(updateOrderStatus)



//!!!!!!!!!!SERVER ROUTES
//route to set initial order status
router.route('/trackOrder/:orderId').get(trackOrder)

//route to create order checkList
router.route('/createOrderCheckList/:orderId').put(createOrderCheckList)

//assign user to order
router.route('/assignUserToOrder/:orderId/:userId').put(assignUserToOrder)

//when cancelling order change orderStatus to -1
router.route('/cancelOrder/:orderId').put(cancelOrder) 



//!!!!!!!!!!DB ROUTES
//get all orders or creating an order
router.route('/').get(getOrders)
//update an individual order
router.route('/:id').put(updateOrder)



















module.exports = router