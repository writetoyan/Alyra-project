import React, {useState, useEffect} from 'react';
import useEth from "../contexts/EthContext/useEth";
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';


export default function RtWhitelist() {

    const { state: { contract, accounts } } = useEth();
    const [ inputValue, setInputValue ] = useState("");
    const [voters, setVoters] = useState({});
    const [txn, setTxn] = useState([])

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

    useEffect(() => {
        contract.events.VoterRegistered({
            fromBlock: 0
        })
        .on('data', (event) => {console.log(event)
            setTxn((events) => [...events, event])
        })
       },[])

    return (
        <div>
            <Card className="mt-5 shadow p-3 mb-5 bg-body rounded">
                <h3 className="text-center">Whitelisted Voters</h3>
                <Form className="mt-5">
                    <Form.Control
                        className="col-6 mb-3"
                        size="lg"
                        type="text" 
                        placeholder="Enter an address"
                        name="getAddress"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <Row className="justify-content-md-center"> 
                        <Button id="i" className="mt-5 mb-5 gap-2 col-4" size="lg" onClick={handleSubmit}> get voter</Button>
                        <Col className="col-2"></Col>
                        <Card className="text-center col-4 mt-3 mb-3 ">
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>Is registered</th>
                                        <th>Has voted</th>
                                        <th>Voted proposal ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{JSON.stringify(voters.isRegistered)}</td>
                                        <td>{JSON.stringify(voters.hasVoted)}</td>
                                        <td>{voters.votedProposalId}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card>
                    </Row>
                </Form>  
                <Table className="mt-3" striped bordered hover variant="primary">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Whitelisted addresses</th>
                        </tr>
                    </thead>
                    <tbody>
                         {txn.slice(txn.length/2).map((address, index) => <tr key={index}><td key={index}>{index}</td><td key={address}>{address.returnValues._voterAddress}</td></tr>)}
                    </tbody>
                
                </Table>
            </Card>
        </div>
    )
}

