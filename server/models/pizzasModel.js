const mongoose = require('mongoose')

const pizzaSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    veg: {
        type: Boolean,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sizeandcrust: [
        {
            mediumPan: [{price: {type: Number}}],
            mediumstuffedcrustcheesemax: [{price: {type: Number}}],
            mediumstuffedcrustvegkebab: [{price: {type: Number}}]
        }
    ]
},
{
    timestamps: true
}
)


module.exports = mongoose.model('Pizzas', pizzaSchema)