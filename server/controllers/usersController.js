const asyncHandler = require('express-async-handler')
require('dotenv').config()
const Users = require('../models/usersModel')
const Token = require('../models/tokenModel')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')




//! CLIENT ROUTES
// @desc    autherise login 
// @route   GET /api/users/login
// @access  Public

//function to generate the access token. Authorisation below.
const generateToken = (id, accountType, verified, isLoggedIn, data, secretKey) => {
    const token = jwt.sign({id, accountType, verified, isLoggedIn, data }, secretKey, {
        expiresIn: '60000',
    })
    return token
}

const loginAuth = asyncHandler(async (req, res) => {
    const user = await Users.findOne({email: req.body.email})
    if(user === null){
        return res.status(400).send({message: 'user does not exist'})
    }
    else if(user){
    const match = await bcrypt.compare(req.body.password, user.password)
    console.log(match)
    try{
        if(match) {
            //jwt below this line
            const accessToken = generateToken(user._id, user.accountType, user.verified, user.isLoggedIn, user.data, process.env.ACCESS_JWT_SECRET)

            res.cookie("access-token", accessToken, {
                maxAge: 60000,
                httpOnly: true,
            })
            .json({
                _id: user._id,
                accountType: user.accountType,
                verified: user.verified,
                data: user.data
            })
            //jwt above this line
         }
        else {
            return res.send({message: 'Incorrect password'})
        }
    } catch {
        res.status(500).send({message: 'Internal Server Error'})
    }
}
})



// @desc    log a user out
// @route   DELETE /api/users/:userId
// @access  Private
const logOut = asyncHandler(async (req, res) => {
    //here we want to end the token
    //TODO: THIS DOES NOT WORK NEED TO FIND A SOLUTION TO THIS!!!!!!
    res.clearCookie('access-token')
})









//! SERVER ROUTES
// @desc    creating a user in UsersDB and a token for that user in TokenDB
// @route   POST /api/users/register
// @access  Private
const setUser = asyncHandler(async (req, res) => {
    try{
        if(!req.body) {
            res.status(400)
            throw new Error('Please add an Email, First Name, Last Name and Password field')
        }

        //checking if user already exists
        let user = await Users.findOne({ email: req.body.email })
        if(user){
            return res.status(409).send({message: "User with given email already exists!"})
        }
        console.log('we are here')
        user = await Users.create({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
        })




        const token = await Token.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
        }) 

        const url = `${process.env.BASE_URL}/api/users/${user._id}/verify/${token.token}`
        await sendEmail(user.email, "Verify Email", url)

        res.status(201).send({message: "A verification email has been sent to your email address, please verify"})

    } catch(error){
        res.status(500).send({ message: "Internal Server Error"})
    }
})



// @desc    verify account
// @route   GET /api/users/:id/verify/:token
// @access  Private
const verifyAccount = asyncHandler( async (req, res) => {
    try {
        const user = await Users.findOne({_id: req.params.userId});
        
        if(!user) {
            return res.status(400).send({ message: 'Invalid link'})
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        });
        console.log(token)
        if(!token){
            return res.status(400).send({ message: 'Invalid link'})
        }

        await Users.updateOne({ _id: user._id},{$set: {verified: true}});
        
        await token.remove()

        res.redirect('http://localhost:3000/logIn')
        
    } catch(err){
        res.status(500).send({ message: "Internal Server Error"})
    }
})









//!DB ROUTES
// @desc    Get UsersDB
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
    const user = await Users.find()
    res.status(200).json(user)
})



// @desc    Update PizzasDB
// @route   PUT /api/pizzas/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const user = await Users.findById(req.params.id)

    if(!user) {
        res.status(400)
        throw new Error('User not found')
    }

    const updatedUser = await Users.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedUser)
})



// @desc    Delete PizzasDB
// @route   DELETE /api/pizzas/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    const user = await Users.findById(req.params.id)

    if(!user){
        res.status(400)
        throw new Error('User not found')
    }

    await user.remove()
    res.status(200).json({ id: req.params.id })
})








module.exports = {
    getUsers,
    setUser,
    loginAuth,
    updateUser,
    deleteUser,
    verifyAccount,
    logOut
}