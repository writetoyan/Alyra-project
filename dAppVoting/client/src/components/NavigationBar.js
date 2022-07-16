import React from 'react';
import RtMain from "./RtMain";
import RtWhitelist from "./RtWhitelist";
import RtProposals from "./RtProposals";
import RtResults from "./RtResults";
import useEth from "../contexts/EthContext/useEth";
import { Container, Navbar, Nav} from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"

export default function NavigationBar() {

  const { state: { accounts } } = useEth();

  return(
    <Router>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Vote in a decentralised way</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to={"/"}>Main</Nav.Link>
              <Nav.Link as={Link} to={"/whitelist"}>Whitelisted voters</Nav.Link>
              <Nav.Link as={Link} to={"/proposals"}>Proposals</Nav.Link>
              <Nav.Link as={Link} to={"/results"}>Results</Nav.Link>    
            </Nav>      
          </Navbar.Collapse> 
          <div className="text-light">
          Wallet address: {accounts}
          </div>
        </Container>
      </Navbar>
        <Routes>
          <Route path="/" element={<RtMain />}/>           
          <Route path="/whitelist" element={<RtWhitelist />}/>
          <Route path="/proposals" element={<RtProposals />}/>
          <Route path="/results" element={<RtResults />}/>
        </Routes>
    </Router>

  );
};

