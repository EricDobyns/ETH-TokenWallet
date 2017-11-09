'use strict' 

// Set Constants
const express = require('express')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')

// Allow CORS
app.use(cors())

// Set up general security with Helmet
app.use(helmet())

// Set up Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// Configure Routes
app.use('/', require('./routes/index.js'))

// Serve Static Files
// app.use(express.static('./src'));

// Handle Errors
app.use((req, res) => {
    console.log('/404 loaded')
    res.status(404)
    res.send("404. Idiot.")
    //res.sendFile('404.html', { root: require('path').join(__dirname, 'public/views') });
})

// Start Server
app.listen(1337, function () {
    console.log('Example app listening on port 1337!\n')
})