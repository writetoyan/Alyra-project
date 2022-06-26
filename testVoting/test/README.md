# VOTING SMART CONTRACT TESTS

## CHOICE EXPLANATION
           
The structure of the voting smart contract is linear and every step of the vote need the previous state to end before the next. Hence the logical choice for testing should be an step by step testing. 

However, I decided to choose a slightly different structure combining the step by step testing which is required in order to test the different function available during each state for the vote (registering  - proposal - voting - tallying votes) with a structure that regroup testing similar functionnality in every state.

Indeed, it is easy to forgot to test the same functionnality in each state of the voting contract by mixing them with the particular need of a particular function that is being tested. 

Moreover, that leads to less mistake due to the unique set up for testing a particular function.

## HOW TO LAUNCH THE TEST

1. Launch Ganache in one terminal

>`ganache`

2. In another terminal, lauch the test

>`truffle test`

## THE DIFFERENT PART OF THE TEST

1. Modifier testing
2. Changing state testing and their respective event
3. Wait for the right moment
4. Registration period testing
5. Proposal period testing
6. Voting period testing
7. Winner testing

## DETAILS 


1. **Modifier testing**

There are two modifiers that is being used in the voting contract. The first one is the onlyOwner modifier that is imported from the Ownable contract by OpenZeppelin and the second one the modifier that requires to be a registered voter. 

With these tests, we want to make sure that only the owner of the contract can manage the voting procedure by adding a voter or opening and closing the different state or tallying the votes. 

So we are trying to call the different function used for by calling them from an address that is not the owner (e.g. "aVoter1"). And if everything is working fine, we should have a revert.

We are doing the same for the two getters function but from an account that is not a voter (e.g. notAVoter).

PS: even if the functions require to be called in a specific state of the contract, these functions can be tested because the modifier is above the requirements in the function.

2. **Changing state testing and their respective event**

In this part of the test, we are trying to see if the normal flow of the vote is working as expected and that the corresponding event is correctly emited. 

For that, we need a variable that stock the current state of the contract (e.g. statusChange) that will give every test, the needed status in order to work. 

Since the WorkflowStatus is an enum, we need to use big numbers (BN) from the test-helpers from OpenZeppelin to compare them. 

3. **Wait for the right moment**

There are three main action that can be called during the voting procedure: 

* addProposal - in which a voter can propose a proposal
* setVote - in which a voter can vote for the desire proposal
* tallyVotes - in which the owner of the contract can tally the vote

We are testing them together because these actions can only be taken during the right state of the contract. 

To make sure these actions cannot be called when it's not the right moment, we are setting up the contract to the registering state and trying to call them with the right modifier requirement to check if we got a revert.

4. **Registration period testing**

We are now starting to test the different step of the voting contract. At this stage, we are checking if the addVoter() function, register correctly a voter. 

For that, we are calling a new instance of the voting contract and register a voter with the owner account. 

Then we call the getter function to be sure that the voter is registered by looking at the boolean isRegistered of that particular voter. If it is set to true. That means the function addVoter() works. 

Moreover, we need to be sure, that an event is emitting with the correct address and that once registered, it is not possible to register the same address again.

5. **Proposal period testing**

In this state, it is possible for the voters registered to make proposals to be voted. 

For that, we are setting a new instance with the required step done in order to be able to call the different function available at this stage. 

The different requirements are that a proposal is registered correctly (we need to call the getOneProposal() getter to check if it is done), that when a proposal is made, the corresponding event is emitted. 

We are also testing the fact that a voter can make more than one proposal but cannot make a proposal that is empty.

6. **Voting period testing**

In this state, we are testing the voting period. For that we are setting up a new instance until the voting session by providing different proposal to vote for. 

We need to see if the vote from a voter is taken into account by checking if the proposition the voter voted is registered correctly in his struct. That after making a vote, his state say that he already voted and it emit an event with the proposition he voted for. Of course we need to test that a voter cannot vote two times. 

7. **Winner testing**

In this last test, we are testing if the winningProposalID is returning the right proposal winner. 

For that, we are setting up a clean instance and register three different voters that can vote for three different proposal. We give more votes for the last proposal.

## THE RESULT

```
Contract: voting
    Modifier testing
      ✓ Only the owner should be able to add a voter (3193ms)
      ✓ Only the owner should be able to start the proposals registration state (83ms)
      ✓ Only the owner should be able to end the proposals registration state (53ms)
      ✓ Only the owner should be able to start the voting session (76ms)
      ✓ Only the owner should be able to end the voting session (56ms)
      ✓ Only the owner should be able to tally votes (65ms)
      ✓ Only a voter can view other voters vote (8ms)
      ✓ Only a voter can view proposals (2ms)
    Changing state testing and their respective event
      ✓ Should start proposal registering (165ms, 47653 gas)
      ✓ Should emit an event after starting proposal session (1ms)
      ✓ Should end proposal registering (238ms, 30575 gas)
      ✓ Should emit an event after ending proposal session (1ms)
      ✓ Should start voting session (425ms, 30530 gas)
      ✓ Should emit an event after starting voting session (0ms)
      ✓ Should end voting session (213ms, 30509 gas)
      ✓ Should emit an event after ending voting session (2ms)
      ✓ Should tally votes (235ms, 34921 gas)
      ✓ Should emit an event after tallying votes (1ms)
    Wait for the right moment
      ✓ Should not be able to make proposal if proposal period not open (189ms)
      ✓ Should not be able to vote if voting session is not open (295ms)
      ✓ Should not be able to tally vote before voting session is over (130ms)
    Registration period testing
      ✓ Should register correctly a voter (162ms)
      ✓ Should emit an event after registering a new voter (0ms)
      ✓ Should not be able to registered two times (84ms)
    Proposal period testing
      ✓ Should register proposal correctly (413ms, 76668 gas)
      ✓ Should emit an event after making a proposal (1ms)
      ✓ Should a voter be able to make more than one proposal (324ms, 59556 gas)
      ✓ Should not be an empty proposal (69ms)
    Voting period testing
      ✓ Should not be able to vote for a proposal that does not exist (541ms)
      ✓ Should register vote correctly (323ms, 78013 gas)
      ✓ Should set up the hasVoted to true after a vote (38ms)
      ✓ Should update the number of vote for a proposal correctly (48ms)
      ✓ Should emit an event after voting (1ms)
      ✓ Should not be able to vote two times (66ms)
    Winner testing
      ✓ Should return the right winning proposal Id (768ms, 63541 gas)

·--------------------------------------------|----------------------------|-------------|----------------------------·
|    Solc version: 0.8.13+commit.abaa5c0e    ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
·············································|····························|·············|·····························
|  Methods                                                                                                           │
···············|·····························|··············|·············|·············|··············|··············
|  Contract    ·  Method                     ·  Min         ·  Max        ·  Avg        ·  # calls     ·  eur (avg)  │
···············|·····························|··············|·············|·············|··············|··············
|  Migrations  ·  setCompleted               ·           -  ·          -  ·      45913  ·           1  ·          -  │
···············|·····························|··············|·············|·············|··············|··············
|  Voting      ·  addProposal                ·       59556  ·      76668  ·      69823  ·           5  ·          -  │
···············|·····························|··············|·············|·············|··············|··············
|  Voting      ·  addVoter                   ·           -  ·          -  ·      50196  ·           6  ·          -  │
···············|·····························|··············|·············|·············|··············|··············
|  Voting      ·  endProposalsRegistering    ·           -  ·          -  ·      30575  ·           3  ·          -  │
···············|·····························|··············|·············|·············|··············|··············
|  Voting      ·  endVotingSession           ·           -  ·          -  ·      30509  ·           4  ·          -  │
···············|·····························|··············|·············|·············|··············|··············
|  Voting      ·  setVote                    ·           -  ·          -  ·      78013  ·           5  ·          -  │
···············|·····························|··············|·············|·············|··············|··············
|  Voting      ·  startProposalsRegistering  ·           -  ·          -  ·      47653  ·           4  ·          -  │
···············|·····························|··············|·············|·············|··············|··············
|  Voting      ·  startVotingSession         ·           -  ·          -  ·      30530  ·           5  ·          -  │
···············|·····························|··············|·············|·············|··············|··············
|  Voting      ·  tallyVotes                 ·       34921  ·      63541  ·      44461  ·           3  ·          -  │
···············|·····························|··············|·············|·············|··············|··············
|  Deployments                               ·                                          ·  % of limit  ·             │
·············································|··············|·············|·············|··············|··············
|  Migrations                                ·           -  ·          -  ·     250154  ·       3.7 %  ·          -  │
·············································|··············|·············|·············|··············|··············
|  Voting                                    ·           -  ·          -  ·    2137238  ·      31.8 %  ·          -  │
·--------------------------------------------|--------------|-------------|-------------|--------------|-------------·

  35 passing (1m)