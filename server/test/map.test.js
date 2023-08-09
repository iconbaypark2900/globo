const { clear } = require('console');
const {compiledContract} = require('../compile');
const assert = require('assert');
const ganache = require('ganache-cli');
const { beforeEach } = require('mocha');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const clearTextPassword = "SuperSecretPassword";
let accounts;
let deployedMapContract;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    deployedMapContract = await new web3.eth.Contract(compiledContract.abi).deploy({data: compiledContract.evm.bytecode.object, arguments: [clearTextPassword]}).send({from: accounts[0], gas: '1000000'});
})

describe('Map', () => {
    it('deploys', () => {
        assert.ok(deployedMapContract.options.address);
        console.log(deployedMapContract.options.address);
    })
    it('changes maps', async()=>{
        await deployedMapContract.methods.setMap(clearTextPassword, "New basic map", "New tailor map").send({from:accounts[0], gas: 5000000})
        const updatedBasicMap = await deployedMapContract.methods.basicMap().call();
        const updatedTailorMap = await deployedMapContract.methods.tailorMap().call();
        assert.equal("New basic map", updatedBasicMap);
        assert.equal("New tailor map", updatedTailorMap);
    })
    it("can't change maps with wrong password", async()=>{
        await deployedMapContract.methods.setMap("wrong password", "New basic map", "New tailor map").send({from:accounts[0], gas: 5000000})
        const updatedBasicMap = await deployedMapContract.methods.basicMap().call();
        const updatedTailorMap = await deployedMapContract.methods.tailorMap().call();
        assert.notEqual("New basic map", updatedBasicMap);
        assert.notEqual("New tailor map", updatedTailorMap);
    })
})