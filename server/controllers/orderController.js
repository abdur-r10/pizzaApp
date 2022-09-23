const asyncHandler = require('express-async-handler')

const Order = require('../models/ordersModel')
const Users = require('../models/usersModel')
const Pizzas = require('../models/pizzasModel')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY )


//!!!!!!!!!!CLIENT ROUTES
// @desc    Set a order in OrdersDB
// @route   POST /api/orders/:pizzaId/
// @access  Private
const setOrder = asyncHandler(async (req, res) => {
    if(!req.body) {
        res.status(400)
        throw new Error('Please ensure all fields are filled')
    } 
    //creating the order
    const order = await Order.create({
        assignedToUser: req.body.assignedToUser,
        items: [{
            product: req.body.product,
            size: req.body.size,
            crust: req.body.crust,
            quantity: req.body.quantity
        }],
    })

    //finding the order in db
    const pizza = await Pizzas.findById({_id: req.body.product})
    //returning basket to user hich contains the actual pizza object rather than just an id
    const basket  = {
        orderId: order._id,
        items: [{
            pizza: pizza,
            size: req.body.size,
            crust: req.body.crust,
            quantity: req.body.quantity
        }]
    }

    res.status(200).json(basket)
})


// @desc    Delete PizzasDB
// @route   DELETE /api/deleteItem
// @access  Private
const deleteItem = asyncHandler(async (req, res) => {
    const order= await Order.findById(req.body.orderId)
    console.log(req.body.orderId)
    console.log(req.body.pizzaId)
    console.log(req.body.size)
    console.log(req.body.crust)
    console.log(req.body.quantity)




    if(!order){
        res.status(400).json({ message: 'could not find order' })
        throw new Error('Order not found')
    }
    else {
        itemsArr = [...order.items]
        console.log(itemsArr)
        const newItemsArr = itemsArr.filter(item => (item.product === req.body.pizzaId && item.size === req.body.size && item.crust === req.body.crust && item.quantity === req.body.quantity))
        console.log(newItemsArr)

       await Order.findOneAndUpdate({_id: req.body.orderId}, { $pull: {items: newItemsArr[0]}}, {new: true})
        
        res.status(200).json({ message: 'order has been removed' })
    }
})


//@desc: Increase or decrease Quantity of item in basket
//@route: PUT /incOrDecQuantity/:orderId/:pizzaId
//@access: Private
const incOrDecQuantity = asyncHandler( async(req, res) => {
    const incOrDec = req.body.incOrDec
    console.log(req.params.pizzaId)
    console.log(req.params.orderId)
    console.log(req.body.incOrDec)

    //logic for increasing/decreasing quantity
    if(incOrDec === 'inc'){
        const oldOrder = await Order.findById(req.params.orderId)
        console.log(oldOrder)
        const itemsInOldOrder = oldOrder.items
        console.log(itemsInOldOrder)
        const findItem = itemsInOldOrder.filter(item => item.product === req.params.pizzaId)
        console.log(findItem)
        findItem[0].quantity += 1
        console.log(oldOrder)
        Order.updateOne(req.params.orderId, {$set: {items: oldOrder}})
        res.json(oldOrder)
        await oldOrder.save()
    } 
    else if(incOrDec === 'dec'){
        const oldOrder = await Order.findById(req.params.orderId)
        console.log(oldOrder)
        const itemsInOldOrder = oldOrder.items
        console.log(itemsInOldOrder)
        const findItem = itemsInOldOrder.filter(items => items.product === req.params.pizzaId)
        console.log(findItem)
        findItem[0].quantity -= 1
        console.log(oldOrder)
        Order.updateOne( {_id: req.params.orderId}, {$set: {items: oldOrder}})
        res.json(oldOrder)
        await oldOrder.save()
    }
    else {
        throw new Error('Could not update quantity')
    }
})


//@desc: add item to basket
//@route PUT /api/addItem/:orderId
//@access Private
const addItem = asyncHandler(async (req, res) => { 
    if(!req.params){
        res.status(400)
        throw new Error('No Paramaters provided')
    }
    //pushing the item they want to add into the items array
    await Order.updateOne({_id: req.params.orderId}, {$push: {"items": {
        product: req.body.product,
        size: req.body.size,
        crust: req.body.crust,
        quantity: req.body.quantity
    }}})

    const updatedOrder = await Order.findById(req.params.orderId)

    const pizzaIdArr = updatedOrder.items.map(item => {
        return item.product
    })

    //right now item.product is just the id of the pizza 
    //and we want to send back the actual pizza object back to the user to display the correct information
    let pizzaObjArr = []
    for(let i = 0; pizzaIdArr.length > i; i++){
        const pizza = await Pizzas.findById(pizzaIdArr[i])
        pizzaObjArr.push(pizza)
    }
    //here we are returning the item with the actual pizza object
    const items = updatedOrder.items.map( (item, index) => {
        return {
            pizza: pizzaObjArr[index],
            size: item.size,
            crust: item.crust,
            quantity: item.quantity 
        }
    })
    //basket we are returning to the user
    const basket = {
        orderId: updatedOrder._id,
        items: items
    }

    res.json(basket)
})


//protected placeFinalOrder
//@desc: place order (will lead to payment page)
//@route: POST /placeFinalOrder
//@access: Protected
const placeFinalOrder = asyncHandler( async(req, res) => {
    if(req.authenticated){
        try{
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                shipping_address_collection: {
                    allowed_countries: ['GB'],
                  },
                shipping_options: [
                   {
                    shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 0,
                        currency: 'gbp',
                    },
                    display_name: 'Free shipping',
                    delivery_estimate: {
                        minimum: {
                            unit: 'hour',
                            value: 1,
                        },
                        maximum: {
                            unit: 'hour',
                            value: 1,
                        },
                    }
                    }}
                ],
                mode: 'payment',
                line_items: req.body.basket.items.map(item => {
                    const size = item.size
                    const crust = item.crust
                    const sizeCost = size === 'Small' ? 0 : parseFloat(size.split('£')[1])
                    const crustCost = parseFloat(crust.split('£')[1])
                    const totalCostOfItem = sizeCost + crustCost
    
                    return{
                        price_data: {
                            currency: 'gbp',
                            product_data: {
                                name: item.pizza.name
                            },
                            unit_amount: (totalCostOfItem * 100) .toFixed(0)
                        },
                        quantity: item.quantity
                    }
                }),
                success_url: `http://localhost:3000/successfulPayment/${req.body.basket.orderId}/${req.body.userData._id}`,
                cancel_url: `http://localhost:3000/cancelledPayment/${req.body.basket.orderId}`,
            })
            
            res.json(session.url)
        } catch (error) {
            res.status(500).json({ error: error.message})
        }
    } else {
        res.json('not authenticated to do this')
    }
})


//@desc: to get the array of previous orders when user clicks on previous orders on the hamburger menu
//@route: POST /getPreviousOrders
//@access: Private
const getPreviousOrders = asyncHandler( async(req, res) => {
    //as its protected we need to know is the token authenticated 
    if(req.authenticated){
        try{
            const prevOrders = req.body.prevOrders
            let orderArr = []
            
            //getting the orders but as they might order it again we need to reset the order status (to 0 = not placed)
            //so we have an array of the order objects
            for(let i = 0; prevOrders.length > i; i++){
                const order = await Order.findByIdAndUpdate(prevOrders[i], {orderStatus: 0}, {new: true})
                orderArr.push(order)
            }
            
            //to get the pizza objects from the id 
            for(let j=0; orderArr.length > j; j++){
                for(let k=0; orderArr[j].items.length > k; k++){
                    const pizza = await Pizzas.findById(orderArr[j].items[k].product)
                    orderArr[j].items[k].product = JSON.stringify(pizza)
                }
            }

            //we onlt want the orders that have items
            //(because as a user can make changes to an order so if they delete all the items then it would save as a order with no items)
            const filteredOrderArr = orderArr.filter(item => item.items.length > 0)
            //only want to display the first 7 orders 
            const result = filteredOrderArr.splice(0,7)
            res.json(result)
        }
        catch(error){
            res.json('could not get previous orders')
        }
    } else {
        res.json('Not authorized, no token found may have expired')
    }
})


//@desc: in the previous orders page we have an option to add a previous order to our basket 
//if you have items in the basket then we want to add those items on to the previous order 
//if you don't have items in the basket then we want to create a new basket with those items as the user may add more items to this order now
//@route: PUT /previousOrders/addToBasket
//@access: Public
const previousOrdersAddToBasket = asyncHandler( async(req, res) => {
    let newArrayOfItems = req.body.newArrayOfItems
    const orderId = req.body.orderId

    //if there are items in the basket in the front end we added those items on to
    //our existing items in the basket so we are just setting the items array to that
    if(orderId !== undefined){
        const newOrder = await Order.findByIdAndUpdate(orderId , {'$set' : {items: newArrayOfItems} })
        res.json({ newArrayOfItems, orderId })
    }
    //!do the logic for the newArrayOfItems in the backend rather than frontend
    else {
        //if no items in basket then we want to take the items 
        //from that previous order and create a new order with that
        const newItems = newArrayOfItems.map(item => {
            return  {
                size: item.size,
                crust: item.crust,
                quantity: item.quantity,
                product: item.pizza._id
            }
        })

        const order = await Order.create({
            assignedToUser: req.body.assignedToUser,
            items: newItems,
        })

        //as the order contains the order id we want to return the actual pizza object
        let pizzaObjArr = []
        for(let i = 0; newItems.length > i; i++){
            const pizza = await Pizzas.findById(newItems[i].product)
            pizzaObjArr.push(pizza)
        }

        //the items array we want to include in our response (basket)
        const items = newItems.map( (item, index) => {
            return {
                pizza: pizzaObjArr[index],
                size: item.size,
                crust: item.crust,
                quantity: item.quantity 
            }
        })

        //the basket object we want to return
        const newBasket = {
            _id: order._id,
            items: items
        }

        res.json(newBasket)
    }
})


//@desc: for the kitchen to update the order status
//@route: PUT /updateOrderStatus/:orderId/:status/:userId
//@access: Public
const updateOrderStatus = asyncHandler(async(req, res) => {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, {orderStatus: req.params.status}, {new: true})
    const user = await Users.findById({_id: req.params.userId})
    const previousOrders = [...user.data.previousOrders]
    const orderedBefore = previousOrders.findIndex(item => JSON.stringify(item) === JSON.stringify(updatedOrder._id))


    if(updatedOrder.orderStatus === 4 && orderedBefore === -1){
        //put order at the top of user data.previousOrders
        previousOrders.unshift(updatedOrder._id)
        //setting userData.data.previousOrders array to the new previous orders
        await Users.updateOne( {_id: req.params.userId}, {$set : {"data.previousOrders": previousOrders}} )

        
        const updatedUser = await Users.findById({_id: req.params.userId})
        res.json({
            _id: updatedUser._id,
            accountType: updatedUser.accountType,
            verified: updatedUser.verified,
            data: updatedUser.data
        })
    }
    else{
        res.json(updatedOrder)
    }
})





//!!!!!!!!!!SERVER ROUTES
//@desc: once order is placed order can be tracked
//@route: GET /trackOrder/:orderId
//@access: Public
const trackOrder = asyncHandler( async(req, res) => {
    const order = await Order.findById(req.params.orderId)
    const oldStatus = order.orderStatus

    //updating order status
    if(oldStatus === 0){
        await Order.findByIdAndUpdate(req.params.orderId, {orderStatus: 1})
        const updatedOrderStatus = await Order.findById(req.params.orderId)
        res.status(200).json(updatedOrderStatus.orderStatus)
    }
    else {
        res.status(200).json(oldStatus)
    }
})


//@desc: once order is placed order can be tracked
//@route: PUT /createOrderCheckList/:orderId
//@access: Public
const createOrderCheckList = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.orderId)

    //creating the check list for the pizzas
    const items = [...order.items]
    let checkList
    let pizzaIdArr
    let pizzaObjArr = []
    
    //array of pizza Ids in basket
    pizzaIdArr = items.map(item => item.product)

    //creating array of pizza objects
    for(let i=0; pizzaIdArr.length > i; i++){
        const pizza = await Pizzas.findById(pizzaIdArr[i])
        pizzaObjArr.push(pizza)
    }

    
    //check list of items ordered (for user to check after delivery)
    checkList = items.map((item, index) => {
        return (
            {
                name: pizzaObjArr[index].name,
                size: item.size,
                crust: item.crust,
                quantity: item.quantity,
            }
        )
    })
    
    res.json(checkList)
})


//@desc: once user is logged in and wants to proceed to check out then we can assign that userId to the order
//@route: PUT /assignUserToOrder/:orderId/:userId
//@access: Public
const assignUserToOrder = asyncHandler(async (req, res) => {
    const result = await Order.findByIdAndUpdate({_id: req.params.orderId}, {assignedToUser: (req.params.userId)})
    console.log(result)
    const newbasket = await Order.findById(req.params.orderId)
    console.log(newbasket)
    res.status(200).json(newbasket)
})


//@desc: change orderStatus to -1 when cancelling the payment process
//@route: PUT cancelOrder/:orderId
//@access: Public
const cancelOrder = asyncHandler(async(req, res) => {
    const orderId = req.params.orderId
    const order = await Order.findByIdAndUpdate(orderId, {'$set': {orderStatus: -1}}, {new: true})

    res.json(order)
})





//!!!!!!!!!!DB ROUTES
// @desc    Get OrderssDB
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
    res.status(200).json(orders)
})



// @desc    Update PizzasDB
// @route   PUT /api/pizzas/:id
// @access  Private
const updateOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if(!order) {
        res.status(400)
        throw new Error('Order not found')
    }

    //updating order in db
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedOrder)
})























































module.exports = {
    getOrders,
    setOrder,
    updateOrder,
    deleteItem,
    incOrDecQuantity,
    placeFinalOrder,
    addItem,
    trackOrder,
    createOrderCheckList,
    assignUserToOrder,
    updateOrderStatus,
    getPreviousOrders,
    previousOrdersAddToBasket,
    cancelOrder
}