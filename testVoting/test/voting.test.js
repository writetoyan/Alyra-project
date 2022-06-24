const voting = artifacts.require('Voting');

const { expectEvent, expectRevert, BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');


contract('voting', function (accounts) {
    
    const owner = accounts[0];
    const aVoter1 = accounts[1]; 
    const aVoter2 = accounts[2];
    const aVoter3 = accounts[3];
    const notAVoter = accounts[4];

    describe('Modifier testing', () => {

        beforeEach(async function() {
            votingInstance = await voting.new({from: owner});
        });
            
        it('Only the owner should be able to add a voter', async () => {
            await expectRevert(votingInstance.addVoter(notAVoter, {from: aVoter1}), 'Ownable: caller is not the owner');
        })
        it('Only the owner should be able to start the proposals registration state', async () => {
            await expectRevert(votingInstance.startProposalsRegistering({from: aVoter1}), 'Ownable: caller is not the owner');
        });
        it('Only the owner should be able to end the proposals registration state', async () => {
            await expectRevert(votingInstance.endProposalsRegistering({from: aVoter1}), 'Ownable: caller is not the owner');
        });
        it('Only the owner should be able to start the voting session', async () => {
            await expectRevert(votingInstance.startVotingSession({from: aVoter1}), 'Ownable: caller is not the owner');
        });
        it('Only the owner should be able to end the voting session', async () => {
            await expectRevert(votingInstance.endVotingSession({from: aVoter1}), 'Ownable: caller is not the owner');
        });
        it('Only the owner should be able to tally votes', async () => {
            await expectRevert(votingInstance.tallyVotes({from: aVoter1}), 'Ownable: caller is not the owner');
        });
        it('Only a voter can view other voters vote', async () => {
            expectRevert(votingInstance.getVoter(aVoter1, {from: notAVoter}), "You're not a voter");
        });
        it('Only a voter can view proposals', async () => {
            expectRevert(votingInstance.getOneProposal(0, {from: notAVoter}), "You're not a voter");
        });
    });

    describe('Changing state testing and their respective event', () => {

        let statusChange = ''

        before(async function() {
            votingInstance = await voting.new({from: owner});
        });
        
        it('Should start proposal registering', async () => {
            statusChange = await votingInstance.startProposalsRegistering({from: owner});
            expect(await (votingInstance.workflowStatus.call())).to.be.bignumber.equal(new BN(1));
        });
        it('Should emit an event after starting proposal session', async () => {
            expectEvent(statusChange, 'WorkflowStatusChange', {previousStatus: new BN(0), newStatus: new BN(1)});
        });
        it('Should end proposal registering', async () => {
            statusChange = await votingInstance.endProposalsRegistering({from: owner});
            expect(await (votingInstance.workflowStatus.call())).to.be.bignumber.equal(new BN(2));
        });
        it('Should emit an event after ending proposal session', async () => {
            expectEvent(statusChange, 'WorkflowStatusChange', {previousStatus: new BN(1), newStatus: new BN(2)});
        });
        it('Should start voting session', async () => {
            statusChange = await votingInstance.startVotingSession({from: owner});
            expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(new BN(3));
        });
        it('Should emit an event after starting voting session', async () => {
            expectEvent(statusChange, 'WorkflowStatusChange', {previousStatus: new BN(2), newStatus: new BN(3)});
        });
        it('Should end voting session', async () => {
            statusChange = await votingInstance.endVotingSession({from: owner});
            expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(new BN(4));
        });
        it('Should emit an event after ending voting session', async () => {
            expectEvent(statusChange, 'WorkflowStatusChange', {previousStatus: new BN(3), newStatus: new BN(4)});
        });
        it('Should tally votes', async () => {
            statusChange = await votingInstance.tallyVotes({from: owner});
            expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(new BN(5));
        });
        it('Should emit an event after tallying votes', async () => {
            expectEvent(statusChange, 'WorkflowStatusChange', {previousStatus: new BN(4), newStatus: new BN(5)})
        });
    });
    
    describe('Wait for the right moment', () => {

        before(async function() {
            votingInstance = await voting.new({from: owner});
            await votingInstance.addVoter(aVoter1, {from: owner});
        });
        it('Should not be able to make proposal if proposal period not open', async () => {
            await expectRevert(votingInstance.addProposal('test proposal', {from: aVoter1}), 'Proposals are not allowed yet');
        });
        it('Should not be able to vote if voting session is not open', async () => {
            await expectRevert(votingInstance.setVote(0, {from: aVoter1}), 'Voting session havent started yet');
        });
        it('Should not be able to tally vote before voting session is over', async () => {
            await expectRevert(votingInstance.tallyVotes({from: owner}), "Current status is not voting session ended");
        });

    });

    describe('Registration period testing', () => {

        let register = "";

        before(async function() {
            votingInstance = await voting.new({from: owner});
            register = await votingInstance.addVoter(aVoter1, {from: owner});
       });

        it('Should register correctly a voter', async () => {
            const data = await votingInstance.getVoter(aVoter1, {from: aVoter1});
            expect(data.isRegistered).to.be.true;
        }); 
        it('Should emit an event after registering a new voter', () => {
            expectEvent(register, 'VoterRegistered', {voterAddress: aVoter1});
        });
        it('Should not be able to registered two times', async () => {
            await expectRevert(votingInstance.addVoter(aVoter1, {from: owner}), 'Already registered');
        }); 
    })

    describe('Proposal period testing', () => {

        let firstProposal = "";

        before(async function() {
            votingInstance = await voting.new({from: owner});
            await votingInstance.addVoter(aVoter1, {from: owner});
            await votingInstance.startProposalsRegistering({from: owner});
        
        });
        it('Should register proposal correctly', async () => {
            firstProposal = await votingInstance.addProposal('Paint in blue', {from: aVoter1});
            const dataProposal = await votingInstance.getOneProposal(0, {from: aVoter1});
            expect(dataProposal.description).to.equal('Paint in blue');
        });
        it('Should emit an event after making a proposal', async () => {
            expectEvent(firstProposal, 'ProposalRegistered', {proposalId: (new BN(0))});
        });
        it('Should a voter be able to make more than one proposal', async () => {
            await votingInstance.addProposal('Paint in red', {from: aVoter1});
            const secondProposal = await votingInstance.getOneProposal(1, {from: aVoter1});
            expect(secondProposal.description).to.equal('Paint in red');
        });
        it('Should not be an empty proposal', async () => {
            await expectRevert(votingInstance.addProposal('', {from: aVoter1}), 'Vous ne pouvez pas ne rien proposer')
        });
    });

    describe('Voting period testing', () => {
        
        let Voted ='';

        before(async function() {
            votingInstance = await voting.new({from: owner});
            await votingInstance.addVoter(aVoter1, {from: owner});
            await votingInstance.startProposalsRegistering({from: owner});
            await votingInstance.addProposal('Paint in blue', {from: aVoter1});
            await votingInstance.addProposal('Paint in red', {from: aVoter1});
            await votingInstance.addProposal('Paint in green', {from: aVoter1});
            await votingInstance.endProposalsRegistering({from: owner});
            await votingInstance.startVotingSession({from: owner});
        });

        it('Should not be able to vote for a proposal that does not exist', async () => {
            await expectRevert(votingInstance.setVote(10, {from: aVoter1}), 'Proposal not found');
        })
        it('Should register vote correctly', async () => {
            Voted = await votingInstance.setVote(2, {from: aVoter1});
            const dataVote = await votingInstance.getVoter(aVoter1, {from: aVoter1});
            expect(new BN(dataVote.votedProposalId)).to.be.bignumber.equal(new BN(2));
        });
        it('Should set up the hasVoted to true after a vote', async () => {
            const data = await votingInstance.getVoter(aVoter1, {from: aVoter1});
            expect(data.hasVoted).to.be.true;
        });
        it('Should update the number of vote for a proposal correctly', async () => {
            let numberOfVote = await votingInstance.getOneProposal(2, {from: aVoter1});
            expect(new BN(numberOfVote.voteCount)).to.be.bignumber.equal(new BN(1));
        })
        it('Should emit an event after voting', async () => {
            expectEvent(Voted, 'Voted', {voter: aVoter1, proposalId: new BN(2)});
        });
        it('Should not be able to vote two times', async () => {
            await expectRevert(votingInstance.setVote(0, {from: aVoter1}), 'You have already voted');
        });
    })

    describe('Winner testing', () => {

        before(async function() {
            votingInstance = await voting.new({from: owner});
            await votingInstance.addVoter(aVoter1, {from: owner});
            await votingInstance.addVoter(aVoter2, {from: owner});
            await votingInstance.addVoter(aVoter3, {from: owner});
            await votingInstance.startProposalsRegistering({from: owner});
            await votingInstance.addProposal('Paint in blue', {from: aVoter1});
            await votingInstance.addProposal('Paint in red', {from: aVoter1});
            await votingInstance.addProposal('Paint in green', {from: aVoter1});
            await votingInstance.endProposalsRegistering({from: owner});
            await votingInstance.startVotingSession({from: owner});
            await votingInstance.setVote(0, {from: aVoter1});
            await votingInstance.setVote(2, {from: aVoter2});
            await votingInstance.setVote(2, {from: aVoter3});
            await votingInstance.endVotingSession({from: owner});
        });
        
        it('Should return the right winning proposal Id', async () => {
            votesTallied = await votingInstance.tallyVotes({from: owner});
            expect(await votingInstance.winningProposalID.call()).to.be.bignumber.equal(new BN(2));
        });
    });

})


