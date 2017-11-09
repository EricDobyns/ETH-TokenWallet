'use strict';

const express = require('express');
const router = express.Router();
const wallet = require('../../components/wallet/walletController.js');

// Display eth balance and all erc20 tokens (using etherscan.io)
router.get('/:walletAddress', function (req, res) {
    res.send(req.params.walletAddress);
})

// Display eth balance
router.get('/:walletAddress/balance', function (req, res) {
    if (req.params.walletAddress) {
        wallet.getEthBalance(req.params.walletAddress, function(balance) {
            res.send({
                eth: balance
            });
        })
    } else {
        res.send({
            'error': 'Missing required parameter: Wallet Address'
        });
    }
})

// Display token information by symbol or address
router.get('/:walletAddress/token', function (req, res) {
    if (!req.params.walletAddress) {
        var address = req.params.walletAddress;
        
        if (req.query.symbol) {
            switch (req.query.symbol) {
                case 'SK': case 'sk':         
                    wallet.getSKBalance(address, function(tokenBalance) {
    
                        // Get Value Per Token
                        // TokenValue = balance * valuePerToken
    
                        res.send({
                            'valuePerToken': null,
                            'tokenBalance': tokenBalance,
                            'tokenValue': null
                        });
                    })
                    break;
                default:
                    res.send('Display a specific token balance if query var specified');
                break;
            }
        } else if (req.query.contractAddress) {
            res.send('TODO: get token balance by contract address');
        }
    } else {
        res.send({
            'error': 'Missing required parameter: Wallet Address'
        });
    }
})

module.exports = router;