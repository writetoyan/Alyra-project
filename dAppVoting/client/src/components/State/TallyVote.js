import React from 'react';
import useEth from "../../contexts/EthContext/useEth";
import Alert from "react-bootstrap/Alert"


export default function TallyVote(props) {
    
    const { state: { accounts } } = useEth();

    return (
        <div>
            {/*Display for the user if the admin haven't tallied vote*/}
            {props.workflowStatus === "4" && props.currentOwner !== accounts[0] &&
                <Alert className="mt-5 mb-3">The admin is tallying vote. Please come back later to check the results of the vote</Alert>
            }
            {/*Display for the user when the result is known*/}
            {props.workflowStatus === "5" &&
                <Alert className="mt-5 mb-3">The results of the vote are on the <Alert.Link href="/results">Results</Alert.Link> section.</Alert>
            }
        </div>
    )
}