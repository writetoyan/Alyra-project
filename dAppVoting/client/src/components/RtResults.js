import React, {useState} from 'react';
import useEth from "../contexts/EthContext/useEth";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

export default function RtResults() {

    const { state: { contract, accounts } } = useEth();
    const [winnerId, setWinnerId] = useState();
    const [workflowStatus, setWorkflowStatus] = useState();
    const [ proposal, setProposal ] = useState({});

    const winner = async () => {
        const workflowStatus = await contract.methods.workflowStatus().call();
        setWorkflowStatus(workflowStatus);
        const winnerId = await contract.methods.winningProposalID().call()
        setWinnerId(winnerId);
        const proposalData = await contract.methods.getOneProposal(winnerId).call({from: accounts[0]});
        setProposal(proposalData);   
    }


    return (
    
        <div>
            <Card className="mt-5 shadow p-3 mb-5 bg-body rounded">
                <Card.Header>
                    <h3 className="text-center">Result</h3>
                </Card.Header>
                    <Button className="mt-5 mb-5 gap-2 col-8 mx-auto" size="lg" onClick={winner}>
                        Reveal the winner
                    </Button>
                    {workflowStatus === "5" && 
                    <Card className="text-center col-8 mt-3 mb-5 mx-auto"> 
                        <h5>The winner is proposal number</h5> 
                        <h3>{winnerId} </h3>
                        <h5>{proposal.description}</h5>
                    </Card>} 
                    {workflowStatus < "5" &&
                    <Alert className="text-center col-8 mx-auto mb-5">
                        The voting session is not over yet. Please come back later to check the results.
                    </Alert>
                    }
            </Card>
        </div>
    )
}