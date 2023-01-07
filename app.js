require('dotenv').config()
require('./database/database').connect()

const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const { JWT_SECRET } = process.env

const User = require('./models/user')
const auth = require('./middleware/auth')

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())

// Routes
app.get('/', (req, res) => {
  res.send("<h1>Server is working fine</h1>")
})

app.post('/register', async (req, res) => {

  try {

    // get all the data from the body
    const { firstName, lastName, email, password } = req.body

    // all the data should exist
    if (!(firstName && lastName && email && password)) {
      res.status(400).send(`All fields are compulsory`)
    }

    // check if the user already exists
    const ExistingUser = await User.findOne({email})
    if ( ExistingUser ) {
      res.status(401).send(`User exists with email ${email}.`)
    }

    // encrypt the password
    const encryPassword = bcrypt.hash(password, 10, (err, hash) => {
      console.log(hash)
    })

    // save the user in db
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: encryPassword
    })

    // generate the token for user and send it
    const token = jwt.sign(
      { id: user._id, email }, 
      JWT_SECRET,
      { expiresIn: '2h' }
    )

    // send the response to front-end
    user.token = token
    user.password = undefined             // to not send the password

    res.status(201).json(user)

  } catch (error) {
    console.log(error);
  }
})

app.post('/login', async ( req, res ) => {

  try {
    // get all data from body
    const {email, password} = await req.body

    // Validation
    if(!(email && password)) {
      res.status(400).send(`Please send all the required fields`)
    }

    // check if user exists
    const user = await User.findOne({email})

    // user doesnot exists
    if(!user) {
      res.status(403).send(`Invalid login credentials`)
    }

    // match password
    if(user && bcrypt.compare(password, user.password)) {

      // Create token
      const token = jwt.sign(
        { id: user._id },
        JWT_SECRET,
        { expiresIn: '2h' }
      )
      user.token = token
      user.password = undefined

      // options for cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 ),
        httpOnly: true
      }

      // Send final response
      res.status(200)
         .cookie("token", token, options)
         .json({
            success: true,
            token,
            user
          })
    }

  } catch (error) {
    console.log(error);
  }
})

app.post('/dashboard', auth, (req, res) => {
  res.send('<h1>Welcome to the Dashboard!</h1>')
})

module.exports = app
