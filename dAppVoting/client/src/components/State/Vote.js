import React, {useState} from 'react';
import useEth from "../../contexts/EthContext/useEth";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

export default function Vote(props) {
    
    const { state: { contract, accounts } } = useEth();
    const [ inputValue, setInputValue ] = useState("");

    const handleInputChange = event => {
          setInputValue(event.target.value);
    };

    //function to vote
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
            {/*Form used by user to vote*/}
            {props.workflowStatus === "3" &&
            <Form className="mt-5" onSubmit={handleSubmit}>
                <Form.Control 
                    className="6"
                    size="lg"
                    type="text" 
                    placeholder="Vote for a proposal number"
                    name="voteProposal"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                {props.currentOwner !== accounts[0] ?
                <Button className="mt-5 mb-5 gap-2 col-6" size="lg" onClick={handleSubmit}> Vote </Button> :
                <Button className="mt-5 gap-2 col-6" size="lg" onClick={handleSubmit}> Vote </Button>
                }
            </Form>
            }
            {/*Display message for the user if the admin haven't started the voting period*/}   
            {props.workflowStatus === "2" && props.currentOwner !== accounts[0] &&
            <Alert className="mt-5 mb-3">You will soon be able to vote!</Alert>
            }
        </div>

    );
}

