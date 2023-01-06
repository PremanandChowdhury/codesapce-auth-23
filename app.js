require('dotenv').config()
require('./database/database').connect()

const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('./models/user')

const app = express()

// Middleware
app.use(express.json())

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
    const encryPassword = await bcrypt.hash(password, 10, (err, hash) => {
      if(err){
        console.log(`err`);
      }
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
      {
        id: user._id,
        email
      }, 'shhhh',
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

module.exports = app