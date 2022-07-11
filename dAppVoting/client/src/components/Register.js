import React, {useState} from 'react';
import useEth from "../contexts/EthContext/useEth";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Register(props) {
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
        <div>
            {props.workflowStatus === "0" &&
            <Form onSubmit={handleSubmit}>
                <Form.Control 
                    size="lg"
                    type="text" 
                    placeholder="Add a new voter address"
                    name="addressToAdd"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <Button className="mt-3 d-grid gap-2 col-3" size="lg" onClick={handleSubmit}> Add a new voter </Button>
            </Form>
            }
        </div>
    );
}

export default Register;