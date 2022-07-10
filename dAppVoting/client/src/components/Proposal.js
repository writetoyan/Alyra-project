import React, {useState} from 'react';
import useEth from "../contexts/EthContext/useEth";

function Proposal() {
    const { state: { contract, accounts } } = useEth();
    const [ inputValue, setInputValue ] = useState("")
   
    const handleInputChange = event => {
          setInputValue(event.target.value);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        try{
        await contract.methods.addProposal(inputValue).send({from: accounts[0]});
        } catch(err) {
            console.error(err);
        }
    }

    return(

        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Enter a proposal"
                    name="proposal"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button> Add a proposal </button>
            </form>
        </div>

    );
}

export default Proposal;