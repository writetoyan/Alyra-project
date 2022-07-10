import { EthProvider } from "./contexts/EthContext";

import Register from "./components/Register";
import State from "./components/State";
import Proposal from "./components/Proposal";
import Vote from "./components/Vote";
import GetVoter from "./components/GetVoter";
import Wallet from "./components/Wallet";
import GetOneProposal from "./components/GetOneProposal";
import WinningProposalId from "./components/WinningProposalId";
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css";

//<GetVoter /> essayer de faire marcher 


function App() {
  return (
    <EthProvider>
      <div className="App" >
        <div className="container">
          <Wallet />
          <Register />
          <State />
          <Proposal />
          <Vote />
          <GetOneProposal />
          <GetVoter />
          <WinningProposalId />
         </div>
      </div>
    </EthProvider>
  );
}

export default App;
