import {
  Link,
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { useState } from 'react'
import { ethers } from "ethers"
import MusicNFTMarketplaceAbi from './contractsData/MusicNFTMarketplace.json'
import MusicNFTMarketplaceAddress from './contractsData/MusicNFTmarketplace-address.json'
import { Spinner, Navbar, Nav, Button, Container } from 'react-bootstrap'
import Home from './Home.js'
import './App.scss';

function App() {
  const [loading,setLoading] = useState(true);
  const [account,setAccount] = useState(null);
  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navbar expand="lg" bg="secondary" variant="dark">
            <Container>
              <Navbar.Brand>MusicNFT</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
              <Navbar.Collapse id="responsize-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/my-tokens">My Tokens</Nav.Link>
                  <Nav.Link as={Link} to="/my-resales">My resales</Nav.Link>
                </Nav>
                <Nav>

                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </>
      </div>
    </BrowserRouter>
  );

}

export default App;