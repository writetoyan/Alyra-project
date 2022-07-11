import React, {useState} from 'react';
import useEth from "../../contexts/EthContext/useEth";
 
function GetOneProposal() {
    const { state: { contract, accounts } } = useEth();
    const [ inputValue, setInputValue ] = useState("");
    const [ proposal, setProposal ] = useState({});
    
    const handleInputChange = event => {
        setInputValue(event.target.value);
  };
    
    const handleSubmit = async event => { 
        event.preventDefault();
        try {
        const proposalData = await contract.methods.getOneProposal(inputValue).call({from: accounts[0]});
        setProposal(proposalData);
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text" 
                    placeholder="Enter an number"
                    name="getProposal"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button> get proposal</button>
            </form>

            <div>
                <p>Proposal: {JSON.stringify(proposal.description)}</p>
                <p>Vote count: {JSON.stringify(proposal.voteCount)}</p>
          
            </div>
        </div>
    )
}

export default GetOneProposal;
