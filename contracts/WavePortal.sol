//section 3:2 code

pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    /*
     * We will be using this below to help generate a random number
     */
    uint256 private seed;

    /* 
    here we are using events in solidity. Event is an inheritable member of a contract. An event is emitted, it stores the arguments passed in transaction logs.
    */
    event NewWave(address indexed from, uint256 timestamp, string message);

    /* 
    I created a struct here named Wave
    A struct is basically a custom datatype where we can customize what we want to hold
    */

    struct Wave {
        address waver; // the address of the user who waved 
        string message; // the message the user sent
        uint256 timestamp; // the timestamp when the user waved.
    }

    /*
     * I declare a variable waves that lets me store an array of structs.
     * This is what lets me hold all the waves anyone ever sends to me!
     */
    Wave[] waves;

    /*
     * This is an address => uint mapping, meaning I can associate an address with a number!
     * In this case, I'll be storing the address with the last time the user waved at us.
     */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable{
        console.log("We have been constructed!");

        /* 
        set the initial seed
        */
        seed = (block.timestamp + block.difficulty) % 100;
        
    } // payable keyword allow us to pay eth from smart contract

    /* 
    now wave function requires a string called _message. this is the message our user sends us from the frontend!
    */

    function wave(string memory _message) public{
        /*
         * We need to make sure the current timestamp is at least 15-minutes bigger than the last timestamp we stored
         */
        require(
            lastWavedAt[msg.sender] + 15 seconds  < block.timestamp,
            "Wait 15 s"
        );

        /*
         * Update the current timestamp we have for the user
         */
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves +=1;
        console.log("%s waved w/ message %s", msg.sender,_message);

        /* 
        This is where I actually store the wave data in the array.
        */
        waves.push(Wave(msg.sender,_message,block.timestamp));

        /* 
        Generate a new seed for the next user that sends a wave
        */
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        /* 
        Give a 50% chance that user wins the prize
        */
        if (seed <= 50){
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.00001 ether; // Solidity actually lets us use the keyword ether so we can easily represent monetary amounts. 

            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );// require which basically checks to see that some condition is true.lets us make sure that the balance of the contract is bigger than the prize amount, and if it is, we can move forward with giving the prize! If it isn't require will essentially kill the transaction and be like

            (bool success,) = (msg.sender).call{value:prizeAmount}(""); // this is the line where we send money
            
            require(success, "Failed to withdraw money from contract."); // require(success is where we know the transaction was a success :). If it wasn't, it'd mark the transaction as an error and say "Failed to withdraw money from contract.".
        }

        emit NewWave(msg.sender, block.timestamp, _message); 
    }

     /*
     * I added a function getAllWaves which will return the struct array, waves, to us.
     * This will make it easy to retrieve the waves from our website!
     */
    function getAllWaves() public view returns (Wave[] memory){
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
          // Optional: Add this line if you want to see the contract print the value!
        // We'll also print it over in run.js as well.
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

}

// explanation for using block.difficulty and block.timestamp 
// link : https://app.buildspace.so/projects/CO02cf0f1c-f996-4f50-9669-cf945ca3fb0b/lessons/LE9c2be71e-79e9-4392-b36f-f3ed89361b34















//section 3:1 code

// pragma solidity ^0.8.0;
// import "hardhat/console.sol";

// contract WavePortal {
//     uint256 totalWaves;
//     /* 
//     here we are using events in solidity. Event is an inheritable member of a contract. An event is emitted, it stores the arguments passed in transaction logs.
//     */
//     event NewWave(address indexed from, uint256 timestamp, string message);

//     /* 
//     I created a struct here named Wave
//     A struct is basically a custom datatype where we can customize what we want to hold
//     */

//     struct Wave {
//         address waver; // the address of the user who waved 
//         string message; // the message the user sent
//         uint256 timestamp; // the timestamp when the user waved.
//     }

//     /*
//      * I declare a variable waves that lets me store an array of structs.
//      * This is what lets me hold all the waves anyone ever sends to me!
//      */
//     Wave[] waves;

//     constructor(){
//         console.log("I am smart Contract. POG");
//     }

//     /* 
//     now wave function requires a string called _message. this is the message our user sends us from the frontend!
//     */

//     function wave(string memory _message) public{
//         totalWaves +=1;
//         console.log("%s waved w/ message %s", msg.sender,_message);

//         /* 
//         This is where I actually store the wave data in the array.
//         */
//         waves.push(Wave(msg.sender,_message,block.timestamp));

//         emit NewWave(msg.sender, block.timestamp, _message);
//     }

//      /*
//      * I added a function getAllWaves which will return the struct array, waves, to us.
//      * This will make it easy to retrieve the waves from our website!
//      */
//     function getAllWaves() public view returns (Wave[] memory){
//         return waves;
//     }

//     function getTotalWaves() public view returns (uint256) {
//           // Optional: Add this line if you want to see the contract print the value!
//         // We'll also print it over in run.js as well.
//         console.log("We have %d total waves!", totalWaves);
//         return totalWaves;
//     }

// }




// old Code:

// pragma solidity ^0.8.4; // this is solidity compiler version for our project

// import "hardhat/console.sol"; // this allow us to do console log in our smart contract

// contract WavePortal {
//     uint256 totalWaves;// this is state variable which will automatically initialized to 0. this variable stored permanently in contract storage.

//     constructor() {
//         console.log("Yo yo, I am a contract and I am smart");
//     }

//     function wave() public {
//         totalWaves +=1;
//         console.log("%s has waved!", msg.sender);// here msg.sender will give wallet address of person who called the function.This is awesome! It's like built-in authentication. We know exactly who called the function because in order to even call a smart contract function, you need to be connected with a valid wallet!
//     }

//     function getTotalWaves() public view returns (uint256) {
//         console.log("We have %d total waves!", totalWaves);
//         return totalWaves;
//     }
// }

// // smart contract deploy address : 0xAd50122951030e876824D8Be8479586166ceB967


// //So, smart contracts sort of look like a class in other languages, if you've ever seen those! Once we initialize this contract for the first time, that constructor will run and print out that line.