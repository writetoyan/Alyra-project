// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Voting is Ownable{

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint ProposalId);
    event Voted (address voter, uint proposalId);

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalRegistrationStarted,
        ProposalRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    mapping(address => Voter) public whitelist;
    Proposal[] public proposals;
    uint proposalId = 0;
    uint public winningProposalId; 

    function nextStatus() public onlyOwner {
        require(uint(workflowStatus) < 6, "Pls reset before making a new vote session");
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus (uint(workflowStatus) + 1);
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    function register(address _voterAddress) public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "This is not registration period!");
        //require(!whitelist[_voterAddress].isRegistered); disabled for reseting purpose
        whitelist[_voterAddress].isRegistered = true;
        whitelist[_voterAddress].hasVoted = false;     //reset for a new vote session
        emit VoterRegistered(_voterAddress);
    }

    // In case there is a mistake or someone left between two different voting session 
    // even if he cannot vote without being registered again for the new vote
    // In order to have an up do date list of the voters for the new session
    function remove(address _voterAddress) public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "This is not registration period!");
        whitelist[_voterAddress].isRegistered = false;
    }

    function makeProposal(string calldata _description) public {
        require(workflowStatus == WorkflowStatus.ProposalRegistrationStarted, "This is not proposition period!");
        require(whitelist[msg.sender].isRegistered, "You have to be registered in order to make proposal");
        Proposal memory proposal = Proposal(_description, 0);
        proposals.push(proposal);
        emit ProposalRegistered(proposalId);
        proposalId++;
    }

    function vote(uint _proposalId) public {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "This is not voting period!");
        require(whitelist[msg.sender].isRegistered, "You are not registered!");
        require(!whitelist[msg.sender].hasVoted, "You cannot vote two times!");
        require(_proposalId < proposals.length, "This proposal do not exist!");
        whitelist[msg.sender].hasVoted = true;
        whitelist[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount += 1;
        emit Voted(msg.sender, _proposalId);
    } 

    function countVote() public onlyOwner returns (uint _winningProposalId) {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, "This is not counting period!");
        uint mostVoted = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > mostVoted) {
                mostVoted = proposals[i].voteCount;
               _winningProposalId = i;
            }
        } 
        winningProposalId = _winningProposalId;
    }

    function checkWinnerDetails() public view returns (string memory _description, uint _voteCount) {
        require(workflowStatus == WorkflowStatus.VotesTallied, "Winning proposal will be published soon");
        _description = proposals[winningProposalId].description;
        _voteCount = proposals[winningProposalId].voteCount;
    }

    // Voters have to be registered again in order to be able to vote for the new session
    // If voters between two session left, the whitelist have to be updated by removing them
    function reset() public onlyOwner {
        require(workflowStatus == WorkflowStatus.VotesTallied, "Pls wait for the end of the previous vote session before making a new one");
        delete proposals;
        proposalId = 0;
        workflowStatus = WorkflowStatus(0);
    }
}