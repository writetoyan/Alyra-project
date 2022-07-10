import React, {useState} from 'react';
import useEth from "../contexts/EthContext/useEth";

function Vote() {
    const { state: { contract, accounts } } = useEth();
    const [ inputValue, setInputValue ] = useState("");

    const handleInputChange = event => {
          setInputValue(event.target.value);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        try{
        await contract.methods.setVote(inputValue).send({from: accounts[0]});
        } catch(err) {
            console.error(err);
        }
    }

    return(

        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Vote for a proposal number"
                    name="voteProposal"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button> Vote</button>
            </form>
        </div>

    );
}

export default Vote;