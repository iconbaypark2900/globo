import './App.css';
import React, {useState} from 'react';
const Web3 = require('web3')
window.ethereum.request({method: "eth_requestAccounts"});
const web3 = new Web3(window.ethereum);
const fetch = require('node-fetch');
const crypto = require('crypto-js');

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

  const [basicMap, SetMapBasic] = useState({
    Height: '', Weight: ''
  });

  const [tailorMap, setMapTailor] = useState({
    Waist: '', Legs: '', Arms: '', Poisture: ''
  });

  const handleMapBasicChange = (e, key) => {
    SetMapBasic({...basicMap, [key]: e.target.value});
  }

  const handleMapTailorChange = (e, key) => {
    setMapTailor({...tailorMap, [key]: e.target.value});
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

async function updateMaps() {
  try{
  const accounts = await web3.eth.getAccounts();
  let mapBasicString = JSON.stringify(basicMap);
  let mapTailorString = JSON.stringify(tailorMap);
  const encryptedMapBasic = crypto.AES.encrypt(mapBasicString, passwordClearTextBasic).toString();
  const encryptedMapTailor = crypto.AES.encrypt(mapTailorString, passwordClearTextTailor).toString();
  await deployedContract.methods.setMap(passwordClearText,encryptedMapBasic, encryptedMapTailor).send({from: accounts[0], gas: 5000000});}
  catch (error) {
    console.error("Error updating maps: ", error);
  }
}

async function loadMaps() {
  let newMapBasicEncrypted = await deployedContract.methods.basicMap().call();
  let newMapTailorEncrypted = await deployedContract.methods.tailorMap().call();

  let mapBasicBytes = crypto.AES.decrypt(newMapBasicEncrypted, passwordClearTextBasic);
  let mapTailorBytes = crypto.AES.decrypt(newMapTailorEncrypted, passwordClearTextTailor);
  SetMapBasic(JSON.parse(mapBasicBytes.toString(crypto.enc.Utf8)));
  setMapTailor(JSON.parse(mapTailorBytes.toString(crypto.enc.Utf8)));
}

  return (
    <div className="App">
      <h1>Globo Body Map</h1>
      <h3>Contract address: {deployedAddress}</h3>
      <div>
        <label>Contract password</label>
        <input type='text' onChange={handlePasswordClearTextChanged} />
        <button onClick={deployContract}>Deploy Contract</button>
      </div>
      <div>
        <label>Basic Password</label>
        <input type='text' onChange={handlePasswordClearTextBasicChanged} />
      </div>
      <div>
        <label>Tailor Password</label>
        <input type='text' onChange={handlePasswordClearTextTailorChanged} />
      </div>
      <h3>Basic Body Map</h3>
      {Object.keys(basicMap).map((key) =>(
        <div key={key}>
          <label>{key}:
          <input type='text' value={basicMap[key]} onChange={(e) => handleMapBasicChange(e, key)} />
          </label> 
          </div>
      ))}
      <h3>Basic Tailor Map</h3>
      {Object.keys(tailorMap).map((key) =>(
        <div key={key}>
          <label>{key}:
          <input type='text' value={tailorMap[key]} onChange={(e) => handleMapTailorChange(e, key)} />
          </label> 
          </div>
      ))}
      <br/>
      <button onClick={updateMaps}>Update Body Maps</button>
      <br/>
      <button onClick={loadMaps}>Load Body Maps</button>
    </div>
  );
}

export default App;
