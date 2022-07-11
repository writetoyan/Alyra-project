import React, {useState} from 'react';
import useEth from "../../contexts/EthContext/useEth";

function WinningProposalId() {

    const { state: { contract } } = useEth();
    const [winnerId, setWinnerId] = useState();

    const winner = async () => {
        const winnerId = await contract.methods.winningProposalID().call()
        setWinnerId(winnerId);
       
    }

    return (
    
        <div>
            <button onClick={winner}>
                Winner
            </button>
            <p>The winner is proposal number {winnerId}</p> 
           
        </div>
    )
}

export default WinningProposalId;
