# Single Choice Polls [Hardhat Project] - Documentation

## Initial run instructions

Run the following commands before first run:

###### *npm install*

This will install all the npm dependencies like ethers.
## Run app instructions
This will use the already deployed smart contract (by default on the Rinkeby testnet). If we want to use another smart contract instance on any other chain, follow the deploy instructions first and continue these instructions.

enter the react-part directory

###### *cd .\react-part\\*
###### *npm start*

The localhost:3000 url will open up in the default browser.
We can now interact with the app. Please follow 'Interacting with the app' section for details.


## Deploy instructions (Not mandatory for using app, as app already contains deployed smart contract)
Deploy script can be found under scripts => deploy.js.
We can add any custom network in the hardhat.config.js file (under module.exports => networks)

1. go to secret.json and add the node url (for the corresponding network) and privateKey in the corresponding fields.

2. Run the deploy command
###### *npx hardhat run --network rinkeby scripts/deploy.js* OR
###### *npx hardhat run --network [enter custom network here] scripts/deploy.js*

Now go to react-part directory => src => Main.js and set the singleChoicePollAddress value to the address of the smart contract during the deployment.


## Interacting with the app

We need to connect our wallet (by clicking on 'Connect Wallet' button) first in order to proceed with interacting with the blockchain.

There are 4 functions : 

a.  Create Poll :Allows any user to create a poll. Provide the 3 mandatory input fields : 
- question - the question string o the poll. 
- Options - The multiple choices provided. 
- ExpiryTime (in seconds) - Time at which the poll expires. To get the current timestamp use the {d.} function.

b. Vote on poll : Allow anyone to vote on any active polls, Mandatory Inputs : 
- Poll id - the id of the poll during poll creation. 
- Choice - The integer representing the choice value.

c.  Get Poll result : Fetches the poll details like question, choice and the votes on the corresponding choices.

d.  Fetch Current timestamp : Fetched the current block timestamp in seconds (Can be used to decide on expiry time in Create Poll).
