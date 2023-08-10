import './App.css';
import React, {useState} from 'react';
const Web3 = require('web3')
window.ethereum.request({method: "eth_requestAccounts"});
const web3 = new Web3(window.ethereum);
const fetch = require('node-fetch');

function App() {
  const[passwordClearText, setPasswordClearText] = useState('');
  const[passwordClearTextBasic, setPasswordClearTextBasic] = useState('');
  const [passwordClearTextTailor, setPasswordClearTextTailor] = useState('');
  const [deployedContract, setDeployedContract] = useState('');
  const[deployedAddress, setDeployedAddress] = useState('');


  const handlePasswordClearTextChanged = (event) => {
    setPasswordClearText(event.target.value);
  }

  const handlePasswordClearTextBasicChanged = (event) => {
    setPasswordClearTextBasic(event.target.value);
  }

  const handlePasswordClearTextTailorChanged = (event) => {
    setPasswordClearTextTailor(event.target.value);
  }

  const [MapBasic, SetMapBasic] = useState({
    Height: '', Weight: ''
  });

  const [MapTailor, setMapTailor] = useState({
    Waist: '', Legs: '', Arms: '', Poisture: ''
  });

  const handleMapBasicChange = (e, key) => {
    SetMapBasic({... MapBasic, [key]: e.target.value});
  }

  const handleMapTailorChange = (e, key) => {
    SetMapBasic({... MapTailor, [key]: e.target.value});
  }

  async function deployContract() {
    fetch('http://localhost:8000')
    .then((response) => response.json())
    .then(async (compiledContract) => {
        const accounts = await web3.eth.getAccounts();
        let contract = await new web3.eth.Contract(compiledContract.abi)
        .deploy({data: compiledContract.evm.bytecode.object, arguments: [passwordClearText]})
        .send({from: accounts[0], gas: '1000000'});
        setDeployedContract(contract);
        setDeployedAddress(contract.options.address);
    });
}

  return (
    <div className="App">
      <h1>Globo Body Map</h1>
      <h3>Contract address: {deployedAddress}</h3>
      <div>
        <label>Contract password</label>
        <input type='text' onChange={handlePasswordClearTextChanged} />
        <button onClick={deployContract}>Deplot Contract</button>
      </div>
    </div>
  );
}

export default App;
