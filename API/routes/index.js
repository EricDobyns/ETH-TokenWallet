'use strict';

// Set Constants
const express = require('express');
const router = express.Router();

// Serve Index Page
router.get('/', function (req, res) {
    res.send('Plz go away. thx. bai.');
    // res.sendFile('index.html',{ root: require('path').join(__dirname, '../src') });
})

// Serve api status
router.get('/status', function (req, res) {
    res.send({
        'uptime': process.uptime()
    });
})

// Serve Wallet Page
router.get('/wallet', function(req, res) {
    res.send('TODO: Add Wallet Webpage')
})

// Verify all API requests include API Key and Device Id
router.use((req, res, next) => {
    if (req.header("apiKey") != require('../../config/config.json').apiKey) {
        res.status(401)
        res.json({Error: "Unauthorized Request"})
        return
    } else {
        if (req.header("DeviceId") == null) {
            res.status(401)
            res.json({Error: "Please include a device Id"})
            return
        } else {
            next()
        }
    }
})

// Add v1 Routes
router.use('/api/v1/wallet', require('./v1/wallet.js'))

// Add v2 Routes
router.use('/api/v2/wallet', require('./v2/wallet.js'))

module.exports = router;