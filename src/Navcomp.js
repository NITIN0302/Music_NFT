import React from 'react';
import './App.scss';
import {ethers} from "ethers";
import {useState} from "react";
import MusicNFTMarketplaceAddress from './contractsData/MusicNFTMarketplace.json';
import MusicNFTMarketplaceAbi from './contractsData/MusicNFTmarketplace-address.json';
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import {Spinner,Button,Nav,Navbar,Container} from 'react-bootstrap';
import Home from './Home.js'
// import MyTokens from './MyTokens.js'
// import MyResales from './MyResales.js'


function Navcomp() {

    const [loading, setLoading] = useState(true)
    const [account,setAccount] = useState(null)
    const [contract,setContract] = useState({})
    const web3Handler = async () => {
        const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
        setAccount(accounts[0]);
        const provider = ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        loadContract(signer)
    }
    const loadContract = async(signer) =>{
        const contract = new ethers.Contract(MusicNFTMarketplaceAddress.address,MusicNFTMarketplaceAbi.abi, signer)
        setContract(contract)
        setLoading(false)
    }
    return (
        <browserRouter>
            <div className="App">
                <Navbar bg="secondary" expand="lg" variant="dark">
                    <Container>
                        <Navbar.Brand>MusicNFT</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/">Home</Nav.Link>
                                <Nav.Link href="my-tokens">My Tokens</Nav.Link>
                                <Nav.Link href="my-resales">My Resales</Nav.Link>
                            </Nav>
                            <Nav>
                                {account ? (
                                    <Nav.Link
                                    href = {`https://etherscan.io/address${account}`}
                                    target = "_blank"
                                    rel="noopener noreferrer"
                                    classname="button nav-button btn-sn mx-4">
                                        <Button variant="outline-light">
                                            {account.slice(0,5) + '...' + account.slice(38,42)}
                                        </Button>
                                    </Nav.Link>
                                    
                                ):(
                                    <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                                )}

                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <div>
                {loading ? (
                    <div style={{display:'flex',justifyContent:'center', alignItems:'center',minHeight:'80vh'}}>
                    <Spinner animation="border" style={{display:'flex'}}/>
                    <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
                    </div>
                ):(
                    <Routes>
                        <Route path="/Home" />
                        <Route path="/my-token"/>
                        <Route path="/my-resales"/>
                    </Routes>
                )}
                </div>
            </div>
        </browserRouter>
    );
}

export default Navcomp;