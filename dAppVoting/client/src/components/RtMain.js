import React, { useState } from 'react'
import useEth from "../contexts/EthContext/useEth";
import Register from "./State/Register"
import Proposal from "./State/Proposal"
import Vote from "./State/Vote"
import TallyVote from "./State/TallyVote"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card";

//Component managing the whole voting process
export default function RtMain() {

    const { state: { contract, accounts } } = useEth();
    const [workflowStatus, setWorkflowStatus] = useState("");
    const [currentOwner, setCurrentOwner ] = useState();

    //Enter the app with correct rendering
    const getCurrentStatus = async () => {
        try{
        const workflowStatus = await contract.methods.workflowStatus().call();
        const currentOwner = await contract.methods.owner().call();
        setWorkflowStatus(workflowStatus);
        setCurrentOwner(currentOwner);
        } catch(err) {
            console.error(err);
        }
    }

    //functions to change the workflow status
    const startProposal = async () => {
        await contract.methods.startProposalsRegistering().send({from: accounts[0]});
        getCurrentStatus();
    }

    const endProposal = async () => {
        await contract.methods.endProposalsRegistering().send({from: accounts[0]})
        getCurrentStatus();
    }

    const startVoting = async () => {
        await contract.methods.startVotingSession().send({from: accounts[0]})
        getCurrentStatus();
    }

    const endVoting = async () => {
        await contract.methods.endVotingSession().send({from: accounts[0]})
        getCurrentStatus();
    }

    const tallyVote = async () => {
        await contract.methods.tallyVotes().send({from: accounts[0]})
        getCurrentStatus();
    }

    
    return (
        <div>    
            {/*Info about the current status*/}
            <Card className="text-center mt-5 shadow p-3 mb-5 bg-body rounded">{workflowStatus === "0" ? 'Registration period' : 
                workflowStatus === "1" ? 'Proposal Period' :
                workflowStatus === "2" ? 'Proposal Period Closed' :
                workflowStatus === "3" ? 'Voting Period' :
                workflowStatus === "4" ? 'Voting Period Closed' :
                workflowStatus === "5" ? 'Thank you for your participation' : "Experience a new way to participate in decision"
                }
                        
                {workflowStatus === "" &&
                <div className="mt-5 mb-5 d-grid gap-2 col-4 mx-auto" onClick={getCurrentStatus}>
                    <Button variant="primary" size="lg">
                        Enter the vote
                    </Button>
                </div>
                }     

                {/*Rendering the component corresponding to the current status*/}
                <Register workflowStatus={workflowStatus} currentOwner={currentOwner}/>
                <Proposal workflowStatus={workflowStatus} currentOwner={currentOwner}/>
                <Vote workflowStatus={workflowStatus} currentOwner={currentOwner}/>
                <TallyVote workflowStatus={workflowStatus} currentOwner={currentOwner}/>

                {/*Rendering the right button to go to the next status - admin only*/}    
                <div>
                    {workflowStatus === "0" && currentOwner === accounts[0] ? 
                    <Button className="mt-4 mb-5 gap-2 col-6" size="lg" onClick={startProposal}>Start proposal</Button> :
                    workflowStatus === "1" && currentOwner === accounts[0] ?
                    <Button className="mt-4 mb-5 gap-2 col-6" size="lg" onClick={endProposal}>End proposal</Button> :
                    workflowStatus === "2" && currentOwner === accounts[0] ?
                    <Button className="mt-5 mb-5 gap-2 col-6" size="lg" onClick={startVoting}>Start voting</Button>:
                    workflowStatus === "3" && currentOwner === accounts[0] ?
                    <Button className="mt-4 mb-5 gap-2 col-6" size="lg" onClick={endVoting}>End voting</Button> :
                    workflowStatus === "4" && currentOwner === accounts[0] ?
                    <Button className="mt-5 mb-5 gap-2 col-6" size="lg" onClick={tallyVote}>Tally vote</Button> :
                    <p></p>
                    }
                </div>
            </Card>
                    
            
        </div>
    )
}

