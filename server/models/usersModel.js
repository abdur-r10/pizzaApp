const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const usersSchema = mongoose.Schema({
    email: {
        type: String,
        lowercase:true,
        required: true,
        unique:true,
    },
    firstName: { 
        type: String,
        lowercase:true,
        required: true,
    },
    lastName: { 
        type: String,
        lowercase:true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        default: 'user',
    },
    verified: {
        type: Boolean,
        default: false,
    },
    data: {
        previousOrders: [{type: String}]
    }
},
{
    timestamps: true
},
{
    new: true
}
)

//to hash the password (can't store the actual password)
usersSchema.pre('save', async function(next) {
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    }catch(error) {
        next(error)
    }
})


module.exports = mongoose.model('Users', usersSchema)