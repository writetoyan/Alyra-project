import React, {useState} from 'react';
import useEth from "../../contexts/EthContext/useEth";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Proposal(props) {
    
    const { state: { contract, accounts } } = useEth();
    const [ inputValue, setInputValue ] = useState("")
   
    const handleInputChange = event => {
          setInputValue(event.target.value);
    };

    //function to add a proposal
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
            {/*Voters can make proposals*/}
            {props.workflowStatus === "1" &&
            <Form className="mt-5" onSubmit={handleSubmit}>
                <Form.Control 
                    className="col-6"
                    size="lg"
                    type="text" 
                    placeholder="Enter a proposal"
                    name="proposal"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                {props.currentOwner !== accounts[0] ?
                <Button className="mt-5 mb-5 gap-2 col-6" size="lg" onClick={handleSubmit}> Add a proposal </Button> :
                <Button className="mt-5 gap-2 col-6" size="lg" onClick={handleSubmit}> Add a proposal </Button> 
                }
            </Form>
            }
        </div>

    );
}
