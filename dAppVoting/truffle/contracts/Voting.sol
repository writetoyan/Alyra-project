// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**@title Voting 
  *@author Alyra team (modified by Yannick for the exercice requirement)
  *@notice You can use this contract to allow a group of authorized people to propose and vote on decisions based on majority
  *@dev This contract can be used as a base contract to create different vote 
  */
contract Voting is Ownable {

    uint public winningProposalID;
    
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
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;

///@dev This event can be used to make a list of all the registered address
///@param _voterAddress is the address a voter to be registered
    event VoterRegistered(address _voterAddress); 

///@dev This event can be used to monitor the status of the voting process
///@param _previousStatus is the previous state
///@param _newStatus is the actual state
    event WorkflowStatusChange(WorkflowStatus _previousStatus, WorkflowStatus _newStatus);

///@dev This event can be used to make a list of different proposal 
///@param _proposalId is the id of the proposal
///@param _proposal is the description of the proposal
    event ProposalRegistered(uint _proposalId, string _proposal);

///@dev This event can be used to monitor the vote of a voter 
///@param _voter is the address of a regitered voter
///@param _proposalId is the id of the proposal he voted for
    event Voted (address _voter, uint _proposalId);

///@dev The owner/admin of the contract have to be registered as a voter in order to use some function with this modifier
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }
    
    // on peut faire un modifier pour les états

    // ::::::::::::: GETTERS ::::::::::::: //

/**@notice You can use this function to know if an address is registered, has voted and for which proposition he voted for
  *@dev Don't forget the owner of the contract should be registered as a voter
  *@param _addr address of a voter
  *@return Voter which is a struc that gives info for the address passed as parameters such as if this address is registered, has voted and for which proposition he voted for
  */
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }
    
 /**@notice You can use this function to know the description of the proposal and how many person voted for that proposition
   *@dev The owner of the contract have to be registered in order to call that function
   *@param _id is the id of the proposal to check for details
   *@return Proposal which is a struc that gives info on the description of the corresponding proposal and his vote count
   */
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

 
    // ::::::::::::: REGISTRATION ::::::::::::: // 

/**@dev This function is used by the admin to register the voters
  *@param _addr is the address to be registered
  */ 
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');
    
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }
 

    // ::::::::::::: PROPOSAL ::::::::::::: // 

/**@dev This function has been changed to prevent a DoS Gas Limit during tallying votes
  *@notice Use this function to make proposals to be voted for. You can make more than one proposal but the maximum proposal is limited to 1000
  *@param _desc is the description of the proposal
  */
    function addProposal(string memory _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer'); // facultatif
        // voir que desc est different des autres
        require(proposalsArray.length < 1000);

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1, _desc);
    }

    // ::::::::::::: VOTE ::::::::::::: //

/**@dev It is possible to implement the calcul of the winning proposal after each vote in this function in order to save gas
  *@notice Use this function to vote for your favorite proposal
  *@param _id is the id of the proposal to be voted for
  */
    function setVote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id < proposalsArray.length, 'Proposal not found'); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

///@dev This function is called to open the proposal period and emit the corresponding event
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }
///@dev This function is called to end the proposal period and emit the corresponding event
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }
///@dev This function is called to open the voting session and emit the corresponding event
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }
///@dev This function is called to close the voting session and emit the corresponding event
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

///@dev The loop in this function consumes a lot of gas and we can lower it by calculing the winning proposal directly within the setVote function and delete this one
    function tallyVotes() external onlyOwner {
       require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
       uint _winningProposalId;
      for (uint256 p = 0; p < proposalsArray.length; p++) {
           if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
               _winningProposalId = p;
          }
       }
       winningProposalID = _winningProposalId;
       
       workflowStatus = WorkflowStatus.VotesTallied;
       emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}