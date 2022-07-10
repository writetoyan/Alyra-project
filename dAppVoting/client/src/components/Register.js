import React, {useState} from 'react';
import useEth from "../contexts/EthContext/useEth";

function Register() {
    const { state: { contract, accounts } } = useEth();
    const [ inputValue, setInputValue ] = useState("")
   
    const handleInputChange = event => {
          setInputValue(event.target.value);
    };

    const handleSubmit = async event => { 
        event.preventDefault();
        try{
        await contract.methods.addVoter(inputValue).send({from: accounts[0]});
        } catch(err) {
            console.error(err);
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Add a new voter address"
                name="addressToAdd"
                value={inputValue}
                onChange={handleInputChange}
            />
            <button> Add a new voter </button>
        </form>
    );
}

export default Register;