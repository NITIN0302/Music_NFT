import React from 'react';
import './App.scss'
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import {Spinner,Button,Nav,Navbar,Container} from 'react-bootstrap';

function Navcomp() {
    return (
        <browserRouter>
            <div>
                <Navbar bg="secondary" expand="lg">
                    <Container>
                        <Navbar.Brand href="#home">MusicNFT</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/">Home</Nav.Link>
                                <Nav.Link href="my-tokens">My Tokens</Nav.Link>
                                <Nav.Link href="my-resales">My Resales</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        </browserRouter>
    );
}

export default Navcomp;