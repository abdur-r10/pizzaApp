const express = require('express')
const router = express.Router()
const {getUsers, setUser, loginAuth, updateUser, deleteUser, verifyAccount, logOut} = require('../controllers/usersController')


//! CLIENT ROUTES
//log in an user
router.post('/login', loginAuth)
//log Out a user
router.put('/logOut/:userId', logOut)



//! SERVER ROUTES
//registering a user, creating a token for verification email and sending email
router.route('/register').post(setUser)
//sending verification email
router.route('/:userId/verify/:token').get(verifyAccount)



//!DB ROUTES
//get all users
router.route('/').get(getUsers)
//update or delete a user
router.route('/:id').put(updateUser).delete(deleteUser)



module.exports = router