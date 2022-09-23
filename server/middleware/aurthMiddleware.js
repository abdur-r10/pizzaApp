const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')

const protect = asyncHandler(async(req, res, next) => {
    //token is coming from our request as it includes the token from cookies in the request
    const token = req.cookies["access-token"]
    
    if(!token) {
        res.status(401).json('Not authorized, no token found may have expired')
        req.authenticated = false
    }
    else if(token) {
        try{
        
            //verify token
            const validToken = jwt.verify(token, process.env.ACCESS_JWT_SECRET)
            if(validToken){
                //set authenticated to true => we can use this in any following function after protect to check if user is authenticated 
                req.authenticated = true
                //get user from token (only accountType, verified, data)
                req.user = await User.findById(validToken.id).select('accountType verified data')
                return next()
            }
            else {
                req.authenticated = false
            }
        } catch (error) {
            console.log(error)
            res.status(400)
            throw new Error('Not authorized')
        }
    }
})

module.exports = {
    protect
}