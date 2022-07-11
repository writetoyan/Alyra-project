import React, {useState} from 'react';
import useEth from "../../contexts/EthContext/useEth";

function GetVoter() {
    const { state: { contract, accounts } } = useEth();
    const [ inputValue, setInputValue ] = useState("");
    const [voters, setVoters] = useState({});

    const handleInputChange = event => {
        setInputValue(event.target.value);
  };
    
    const handleSubmit = async (event) => { 
        event.preventDefault();
        try {
        const votersData = await contract.methods.getVoter(inputValue).call({from: accounts[0]});
        setVoters(votersData)
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text" 
                    placeholder="Enter an address"
                    name="getAddress"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button> get voter</button>
            </form>

            <div> 
                <p>Is registered: {JSON.stringify(voters.isRegistered)}</p>  
                <p>Has voted: {JSON.stringify(voters.hasVoted)}</p>
                <p>Voted proposal ID:{JSON.stringify(voters.votedProposalId)}</p>
            </div>
        </div>
    )
}

export default GetVoter;
