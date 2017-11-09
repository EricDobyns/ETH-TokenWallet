'use strict'

// Set Constants
const Web3 = require('web3')
const contract = require('truffle-contract')
const config = require('../../config/config.json')

const skeletonToken_artifacts = require('../../../build/contracts/SkeletonToken.json')
const skeletonToken = contract(skeletonToken_artifacts)

const skeletonToken_Crowdsale_artifacts = require('../../../build/contracts/SkeletonToken_Crowdsale.json')
const skeletonTokenCrowdsale = contract(skeletonToken_Crowdsale_artifacts)

// Get Provider
var provider
if (config.environment == "staging") {
    provider = new Web3.providers.HttpProvider("http://localhost:8545")
} else if (config.environment == "production") {
    provider = new Web3.currentProvider
}


// Set Provider
var web3 = new Web3(provider);
skeletonToken.setProvider(provider);
skeletonTokenCrowdsale.setProvider(provider);



// Validate Address
exports.validateAddress = (address, completion) => {
    completion(web3.isAddress(address))
}

// Get Eth Balance
exports.getEthBalance = (address, completion) => {
    this.validateAddress(address, function(isValid) {
        if (isValid) {
            web3.eth.getBalance(address, function (error, result) {
                if (!error) {
                    var formattedBalance = web3.fromWei(result.toNumber(), 'ether');
                    completion(parseInt(formattedBalance))
                } else {
                    completion({
                        error: 'There was an error retrieving your balance'
                    })
                }
            })  
        } else {
            completion({
                error: 'Please include a valid address'
            }) 
        }
    })
}

// Get SK Token Value
exports.getSKValuePerToken = (completion) => {

}

// Get SK Token Balance
exports.getSKBalance = (address, completion) => {
    this.validateAddress(address, function(isValid) {
        if (isValid) {
            skeletonToken.deployed().then(function(token) {
                token.balanceOf(address).then(function(balance) {
                    completion(balance.toNumber())
                })
            })
        } else {
            completion({
                error: 'Please include a valid address'
            }) 
        }
    })
}




// TODO: REMOVE THIS
exports.getCoinInfo = () => {

    // Get Account 1 Address
    var account1Address = web3.eth.accounts[0];
    console.log('Account 1 Address: ' + account1Address);

    // Get Account 1 Eth Balance
    web3.eth.getBalance(account1Address, function (error, result) {
        if (!error) {
            var formattedBalance = web3.fromWei(result.toNumber(), 'ether');
            console.log('Account 1 ETH Balance: ' + formattedBalance);
        }
    })

    // Get Contract Instance
    skeletonTokenCrowdsale.deployed().then(function(crowdsale) {

        // Get SKC Crowdsale end time
        crowdsale.endTime().then(function(endTime) {
            var date = new Date(0);
            date.setUTCSeconds(endTime.toNumber());
            console.log('Contract End Date: ' + date);
        })

        // Get SKC Conversion Rate
        crowdsale.rate().then(function(rate) {
            console.log('SKC Conversion Rate: ' + rate.toNumber() + ' SKC = 1 Ether');
        })

        // Get Token Instance
        crowdsale.token().then(function(tokenAddress) {
            console.log('Contract Address: ' + tokenAddress);

            var coinInstance = skeletonToken.at(tokenAddress);

            // Get Total Supply
            coinInstance.totalSupply().then(function(instance) {
                console.log('Total Supply: ' + instance);
            })

            // Get Current User's SKC Balance
            coinInstance.balanceOf(account1Address).then(function(balance) {
                console.log('Account 1 SKC balance: ' + balance);
            })
        })
    })
}