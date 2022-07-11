import React, { useState } from 'react'
import useEth from "../contexts/EthContext/useEth";
import Register from "./Register"
import Proposal from "./Proposal"
import Vote from "./Vote"
import { Button } from "react-bootstrap"

export default function Main() {
    const { state: { contract, accounts } } = useEth();
    const [workflowStatus, setWorkflowStatus] = useState("");

    const getCurentStatus = async () => {
        try{
        const workflowStatus = await contract.methods.workflowStatus().call();
        setWorkflowStatus(workflowStatus);
        } catch(err) {
            console.error(err);
        }
    }

    const startProposal = async () => {
        await contract.methods.startProposalsRegistering().send({from: accounts[0]});
        getCurentStatus();
    }

    const endProposal = async () => {
        await contract.methods.endProposalsRegistering().send({from: accounts[0]})
        getCurentStatus();
    }

    const startVoting = async () => {
        await contract.methods.startVotingSession().send({from: accounts[0]})
        getCurentStatus();
    }

    const endVoting = async () => {
        await contract.methods.endVotingSession().send({from: accounts[0]})
        getCurentStatus();
    }

    const tallyVote = async () => {
        await contract.methods.tallyVotes().send({from: accounts[0]})
        getCurentStatus();
    }


    return (
        <div>
            {workflowStatus === "" &&
            <div className="d-grid gap-2 col-3 mx-auto" onClick={getCurentStatus}>
                <Button variant="primary" size="lg">
                    Enter the vote
                </Button>
            </div>
            }      
            <Register workflowStatus={workflowStatus}/>
            <Proposal workflowStatus={workflowStatus} />
            <Vote workflowStatus={workflowStatus} />
                 
            <div>
                {workflowStatus === "0" ? 
                <Button className="mt-3 d-grid gap-2 col-3" size="lg" onClick={startProposal}>Start proposal</Button> :
                workflowStatus === "1" ?
                <Button className="mt-3 d-grid gap-2 col-3" size="lg" onClick={endProposal}>End proposal</Button> :
                workflowStatus === "2" ?
                <Button className="mt-3 d-grid gap-2 col-3" size="lg" onClick={startVoting}>Start voting</Button>:
                workflowStatus === "3" ?
                <Button className="mt-3 d-grid gap-2 col-3" size="lg" onClick={endVoting}>End voting</Button> :
                workflowStatus === "4" ?
                <Button className="mt-3 d-grid gap-2 col-3" size="lg" onClick={tallyVote}>Tally vote</Button> :
                <p></p>
                }
                </div>
        </div>
    )
}

