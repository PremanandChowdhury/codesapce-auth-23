require('dotenv').config()
require('./database/database').connect()
const express = require('express')

const app = express()

// Middleware
app.use(express.json())

app.get('/', (req, res) => {
  res.send("<h1>Server is working fine</h1>")
})

app.post('/register', async (req, res) => {
  try {
    // get all the data from the body
    // all the data should exist
    // check if the user already exists
    // encrypt the password
    // save the user in db
    // generate the token for user and send it
    res.send("<h1>Hello</h1>")

  } catch (error) {
    console.log(error);
  }
})

module.exports = app