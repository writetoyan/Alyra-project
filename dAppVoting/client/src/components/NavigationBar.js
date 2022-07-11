import React from 'react';
import Main from "./Main";
import RtWhitelist from "./RtWhitelist";
import RtProposals from "./RtProposals";
import RtResults from "./RtResults";
import useEth from "../contexts/EthContext/useEth";

import { Container, Navbar, Nav, Button} from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"


function NavigationBar() {
  const { state: { accounts } } = useEth();

  return(
    <Router>
      <Navbar bg="light" variant="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Vote in a decentralised way</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to={"/main"}>Main</Nav.Link>
              <Nav.Link as={Link} to={"/whitelist"}>Whitelisted voters</Nav.Link>
              <Nav.Link as={Link} to={"/proposals"}>Proposals</Nav.Link>
              <Nav.Link as={Link} to={"/results"}>Results</Nav.Link>    
            </Nav>      
          </Navbar.Collapse> 
          Wallet address: {accounts}
        </Container>
      </Navbar>
        <Routes>
          <Route path="/main" element={<Main />}/>           
          <Route path="/whitelist" element={<RtWhitelist />}/>
          <Route path="/proposals" element={<RtProposals />}/>
          <Route path="/results" element={<RtResults />}/>
        </Routes>
    </Router>

  );
};

export default NavigationBar;