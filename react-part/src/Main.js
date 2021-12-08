import { ethers } from 'ethers';
import React, {useState, useEffect} from 'react'
// import Messenger from './artifacts/react-part/src/contracts/loot.sol/Messenger.json'
import SingleChoicePoll from './singleChoicePoll_abi.json'
import './App.css';


const Main = () => {

  let singleChoicePollAddress = "0x78c7B39E730aADa4d1040bBB682CB46D9cCf2EFC";

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");

  const [timestamp, setTimestamp ] = useState(null);
  const [question, setQuestion ] = useState(null);
  const [options, setOptions ] = useState(null);
  const [result, setResult ] = useState(null);


  const [provider, setProvider ] = useState(null);
  const [signer, setSigner ] = useState(null);
  const [contract, setContract ] = useState(null);


	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnectButtonText('Wallet Connected');
                var property = document.getElementById("btn");
                property.style.backgroundColor = "#0fec64"
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}



	}

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  }

  const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


  	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

  const updateEthers = () =>{
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(singleChoicePollAddress, SingleChoicePoll, tempSigner);
    setContract(tempContract);
  }

  const getPollResult = async(event) => {
    event.preventDefault();
    if(!contract) alert("Connect to Rinkeby on Metamask!");
    else{
    const res = await contract.getPollResult(event.target.pollId.value);
    const {0: question, 1: options, 2: result} = res;

    setQuestion(question);
    setOptions(options);
    setResult(result);
    }
  }

  const voteOnPoll = (event) => {
    event.preventDefault();
    if(!contract) alert("Connect to Rinkeby on Metamask!");
    else{
    contract.voteOnPoll(event.target.pollId.value, event.target.choice.value );}
  }

  const createPoll = (event) => {
    event.preventDefault();
    if(!contract) alert("Connect to Rinkeby on Metamask!");
    else{
    let optionstring = event.target.options.value;
    const arr = optionstring.split(",");
    contract.createPoll(event.target.question.value , event.target.expiryTime.value, arr);}
  }

  const fetchTime = async() =>{
      if(!contract) alert("Connect to Rinkeby on Metamask!");
else{
    let val = await contract.getCurrentTime();
    setTimestamp(val.toNumber());}
  }


  return(
    <div>
      <h1>
        Interact with SingleChoicePoll
      </h1>
      <button id ="btn" class= "button button1" onClick={connectWalletHandler}>{connectButtonText}</button>
      <h3>Address : {defaultAccount}</h3>
      <br />

      <form onSubmit={createPoll}>
      Question<input id = 'question' type = 'text' required/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
      Options ( separated by ,) <input id = 'options' type = 'text' required/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   
        ExpiryTime <input id = 'expiryTime' type = 'number' required/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  

        <button type ={"submit"}>Create Poll</button>
      </form>
      <br />
      <br />


      <button onClick={fetchTime}>Fetch Current Timestamp</button> 
      <h3>Timestamp : {timestamp} </h3>
      <br />


      <form onSubmit={voteOnPoll}>
      Poll Id : <input id ='pollId' type = 'number' required/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
      Choice (1,2,...) : <input id ='choice' type = 'number' required/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

        <button type ={"submit"}> Vote on poll </button>
      </form>
      <br />
      <br />



      <form onSubmit={getPollResult}>
      Poll Id : <input id="pollId" type = "number" required/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button type={"submit"}>Query Poll</button>
      </form>
      <br />

      <div class ="div box">
        <h3>Question : {question}</h3>
         

<table>
<tr>
<th><h3>Choice</h3></th>
&nbsp;
 {options && options.map((option) => <td>{option}&nbsp;</td>)}
</tr>
<tr>
<th><h3>Number of votes </h3></th>
&nbsp;
 {result && result.map((res) => <td>{res.toNumber()}&nbsp;</td>)}
</tr>
</table>

</div>

      {errorMessage}

    </div>

  )
}

export default Main;