# metahubjs

Javascript API for integration metahub wallet.  

[View Example](https://github.com/metahubwallet/metahubjs-example)

## Installation

`npm install metahubjs`

or

`yarn add metahubjs`

## Basic Usage

```javascript
const metahubjs = require('metahubjs');
const { Api, JsonRpc } = require('eosjs');

const appName = 'Your App Name';
const chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
const rpcUrl = 'https://eos.greymass.com';
const network = { chainId };

// connect
const connected = await metahubjs.connect(appName, { network });
if (!connected) {
    throw new Error('no metahub');
}


const rpc = new JsonRpc(rpcUrl, { fetch });
const api = metahubjs.eos(network, Api, { rpc });
// get logined accounts
let accounts = [];
if (metahubjs.identity) {
    accounts = metahubjs.identity.accounts;
}

// login
const identity = await metahubjs.login();
// if success, will response
{
    "accounts": [
        "authority": "active"
        "blockchain": "eos"
        "chainId": "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
        "isHardware": false
        "name": "metahubpower"
        "publicKey": "EOS8gFtMZP2WVqs2Z3812dNBWWLmNt2cuHzjfBPZAWk2KoG6fEq1x"
    ]
}

// logout all accounts
await metahubjs.logout();

// logout single account
await metahubjs.logout({account: 'metahubpower'});

// sign text
await metahubjs.getArbitrarySignature(account.publicKey, 'test text');

// transact
const result = await api.transact({
        actions: [{
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
                actor: 'useraaaaaaaa',
                permission: 'active',
            }],
            data: {
                from: 'useraaaaaaaa',
                to: 'useraaaaaaab',
                quantity: '0.0001 EOS',
                memo: '',
            },
        }] 
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    }
);

// For more api usage, please refer to https://github.com/EOSIO/eosjs

```
