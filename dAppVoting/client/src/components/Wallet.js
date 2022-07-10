import React from 'react';
import useEth from "../contexts/EthContext/useEth";

function Wallet() {

    const { state: { accounts } } = useEth();

    return (
    
        <div>
            <p>Wallet address: {accounts}</p>
           
        </div>
    )
}

export default Wallet;
