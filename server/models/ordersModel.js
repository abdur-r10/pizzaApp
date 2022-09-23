const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    assignedToUser: {
        type: String,
    },
    items: {
        type: [{
            product: {
                type: String,
            },
            size: {
                type: String,
            },
            crust: { 
                type: String,
            },
            quantity: {
                type: Number,
                default: 1,
            }
        }]
    },
    orderStatus: {
        type: Number,
        default: 0 
    },
    },
{
    timestamps: true
}
)


module.exports = mongoose.model('Orders', orderSchema)

