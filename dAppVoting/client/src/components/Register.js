import React, {useState} from 'react';
import useEth from "../contexts/EthContext/useEth";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

export default function Register(props) {

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
            {props.workflowStatus === "0" && props.currentOwner === accounts[0] &&
            <Form className="mt-5" onSubmit={handleSubmit}>
                <Form.Control 
                    className="col-6"
                    size="lg"
                    type="text" 
                    placeholder="Add a new voter address"
                    name="addressToAdd"
                    value={inputValue}
                    onChange={handleInputChange}
                />   
                <Button className="mt-5 gap-2 col-6" size="lg" onClick={handleSubmit}> Add a new voter </Button>
            </Form>
            }
            {props.workflowStatus === "0" && props.currentOwner !== accounts[0] &&
            <Alert className="mt-5 mb-3">You will soon be able to make proposal. Please wait for everyone to be registered by the admin.</Alert>
            }
        </div>
    );
}
