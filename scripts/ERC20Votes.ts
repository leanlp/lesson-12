import {ethers} from "hardhat";
import { MyToken__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseEther("10");

async function main () {
const accounts = await ethers.getSigners();

// deploy the contract
const contractFactory = new MyToken__factory(accounts[0])  // new factory from typescript, remember pass argument vinculing accounts
const contract = await contractFactory.deploy(); //in this case not pass params for constructor, another case, pass in this step"()""
await contract.deployed();
console.log(`token contract deployed at ${contract.address}\n`)
//Mint some tokens
const mintTx = await contract.connect(accounts[0]).mint(accounts[1].address, MINT_VALUE); //accounts[0] not need write it is defauld
await mintTx.wait();
console.log(`Minted ${MINT_VALUE.toString()} decimals units to account ${accounts[1].address}\n`)

const balanceBN = await contract.balanceOf(accounts[1].address);
console.log(`account ${accounts[1].address} is balance ${balanceBN}\n`)
//check the voting power
const votes = await contract.getVotes(accounts[1].address);
console.log(`accounts ${accounts[1].address} has ${votes.toString()} before voting power \n`)
//Self Delegate
const delegateTx = await contract.connect(accounts[1]).delegate(accounts[1].address); //note ".address not write"
await delegateTx.wait();
//check the voting power
const votesAfter = await contract.getVotes(accounts[1].address) //function only read nos write
console.log(`account ${accounts[1].address} has ${votesAfter.toString()} after voting power\n`)
// Transfer tokens
const transferTx = await contract.connect(accounts[1]).transfer(accounts[2].address, MINT_VALUE.div(2))
await transferTx.wait();
const balanceBN2 = await contract.balanceOf(accounts[2].address);
const delegateTx2 = await contract.connect(accounts[2]).delegate(accounts[2].address); //note ".address not write"
await delegateTx2.wait();
const votesAfter2 = await contract.getVotes(accounts[2].address)
console.log(`account ${accounts[2].address} have ${balanceBN2} and have voting power ${votesAfter2}\n` )
//check past voting power
const lastBlock = await ethers.provider.getBlock("latest");
console.log(`this is the previus block ${lastBlock.number}\n`)
const pastVotes = await contract.getPastVotes(accounts[1].address, lastBlock.number -2)
console.log(`this is the votes in the previus block ${pastVotes}\n`)



}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});