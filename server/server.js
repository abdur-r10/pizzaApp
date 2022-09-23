const express = require('express')
const cors = require('cors')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000
const cookieParser = require('cookie-parser')

connectDB()

const app = express()


//to get past cors restrictions
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))


//MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(errorHandler)
app.use(cookieParser());

//ROUTES
app.use('/api/pizzas', require('./routes/pizzaRoutes.js'))
app.use('/api/users', require('./routes/usersRoutes.js'))
app.use('/api/orders', require('./routes/orderRoutes.js'))


//CONNECT TO PORT
app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})
