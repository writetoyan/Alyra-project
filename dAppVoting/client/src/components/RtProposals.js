import React, {useState, useEffect} from 'react';
import useEth from "../contexts/EthContext/useEth";
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';

//Page that gives info about the proposals
export default function RtProposals() {

    const { state: { contract, accounts } } = useEth();
    const [ inputValue, setInputValue ] = useState("");
    const [ proposal, setProposal ] = useState({});
    const [txn, setTxn] = useState([]);

    const handleInputChange = event => {
        setInputValue(event.target.value);
  };
    
    //Function that gives more info about a proposal
    const handleSubmit = async event => { 
        event.preventDefault();
        try {
        const proposalData = await contract.methods.getOneProposal(inputValue).call({from: accounts[0]});
        setProposal(proposalData);
        } catch(err) {
            console.error(err)
        }
    }
  
    //Event to get the proposals made by the voters
    useEffect(() => {
        contract.getPastEvents('ProposalRegistered', {
            fromBlock: 0, 
            toBlock: 'latest'
        }, function(error, events){console.log(events)})
        .then(function(events){
            setTxn(events)
        })
    }, [])
    
    return (
        <div>
        <Card className="mt-5 shadow p-3 mb-5 bg-body rounded">
            <h3 className="text-center">Proposals</h3>
            {/*User can enter the number of the proposal he wants more info on*/}
            <Form className="mt-5">
                <Form.Control
                    className="col-6 mb-3"
                    size="lg"
                    type="text" 
                    placeholder="Enter an number"
                    name="getProposal"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <Row className="justify-content-md-center"> 
                    <Button className="mt-5 mb-5 gap-2 col-4" size="lg" onClick={handleSubmit}> get proposal</Button>
                    <Col className="col-1"></Col>
                    <Card className="text-center col-6 mt-3 mb-3 ">
                        {/*Display the info about the proposal asked*/}
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>Proposal</th>
                                    <th>Vote count</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{proposal.description}</td>
                                    <td>{proposal.voteCount}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card>
                </Row>
            </Form>  

            {/*List all the proposals*/}
            <Table className="mt-3" striped bordered hover variant="primary">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Proposals</th>
                    </tr>
                </thead>
                <tbody>
                   {txn.map((txn, index) => <tr key={index}><td key={index}>{txn.returnValues._proposalId}</td><td key={txn}>{txn.returnValues._proposal}</td></tr>)}
                </tbody>
            </Table>
        </Card>
    </div>
    )
}

