const asyncHandler = require('express-async-handler')

const Pizza = require('../models/pizzasModel')

//!!!!ALL of these are DB routes as this was used just to make the db
// @desc    Get PizzasDB
// @route   GET /api/pizzas
// @access  Public
const getPizzas = asyncHandler(async (req, res) => {
    const pizzas = await Pizza.find()
    res.status(200).json(pizzas)
})


// @desc    Set a pizza in PizzasDB
// @route   POST /api/pizzas
// @access  Public
const setPizza = asyncHandler(async (req, res) => {
    if(!req.body) {
        res.status(400)
        throw new Error('Please add a text field')
    }

    const pizza = await Pizza.create({
        name: req.body.name,
        description: req.body.description,
        img: req.body.img,
        veg: req.body.veg,
        price: req.body.price,
        sizeandcrust: req.body.sizeandcrust
    }
    )
    res.status(200).json(pizza)
})


// @desc    Update PizzasDB
// @route   PUT /api/pizzas/:id
// @access  Public
const updatePizzas = asyncHandler(async (req, res) => {
    const pizza = await Pizza.findById(req.params.id)

    if(!pizza) {
        res.status(400)
        throw new Error('Pizza not found')
    }

    const updatedPizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedPizza)
})


// @desc    Delete PizzasDB
// @route   DELETE /api/pizzas/:id
// @access  Public
const deletePizza = asyncHandler(async (req, res) => {
    const pizza = await Pizza.findById(req.params.id)

    if(!pizza){
        res.status(400)
        throw new Error('Pizza not found')
    }

    await pizza.remove()
    res.status(200).json({ id: req.params.id })
})





module.exports = {
    getPizzas,
    setPizza,
    updatePizzas,
    deletePizza
}