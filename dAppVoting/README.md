# DApp Voting

This DApp can be used to allow registered users to make proposals and vote on them.

A video demo of that DApp can be found at:

https://www.loom.com/share/f5b32d44b8834eabaccafc30c0974f1b

Deployment on public servers:

Heroku:

https://writetoyan.herokuapp.com/

Git Pages:

https://writetoyan.github.io/Alyra-project


The smart contract has been deployed on Ropsten Testnet at that address:

0x7456D2C7b4484e1d8b29cfbcc55686727d14E2fb



## Installation

```sh
# To make a copy of that DApp, use a git clone
$ git clone https://github.com/writetoyan/Alyra-project.git
```
Only keep the dAppVoting folder.\
If you want to test it on your Ganache
```sh
# Launch ganache
$ ganache

# On a new terminal, go to the truffle folder and do the migration
$ cd truffle
$ truffle migrate --reset
```

Then start the local server to launch the DApp on your favorite web browser
 
```sh
#
$ cd client
$ npm start
```

Don't forget to import some private keys from your ganache to Metamask in order to interact with the DApp.

You are now ready to experience the voting process in a decentralized way. 

