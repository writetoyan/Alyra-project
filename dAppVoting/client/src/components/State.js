import React from 'react';
import useEth from "../contexts/EthContext/useEth";

function State() {
    const { state: { contract, accounts } } = useEth();

    const startProposal = async () => {
        await contract.methods.startProposalsRegistering().send({from: accounts[0]})
    }

    const endProposal = async () => {
        await contract.methods.endProposalsRegistering().send({from: accounts[0]})
    }

    const startVoting = async () => {
        await contract.methods.startVotingSession().send({from: accounts[0]})
    }

    const endVoting = async () => {
        await contract.methods.endVotingSession().send({from: accounts[0]})
    }

    const tallyVote = async () => {
        await contract.methods.tallyVotes().send({from: accounts[0]})
    }

    return (

        <div>
            
            <button onClick={startProposal}>
                Start proposal
            </button>
            <button onClick={endProposal}>
                End proposal
            </button>
            <button onClick={startVoting}>
                Start voting
            </button>
            <button onClick={endVoting}>
                End voting
            </button>
            <button onClick={tallyVote}>
                Tally vote
            </button>
        </div>

    )

}

export default State;