# CSCE-5575 Homework 2 - Ownable Smart Contract

A blockchain application demonstrating smart contract ownership, payable functions, and React-based web3 integration.

## Project Overview

This project implements an Ownable smart contract with:
- OpenZeppelin's Ownable inheritance for access control
- Payable functions for array slicing operations
- Owner-only administrative functions
- React front-end for contract interaction

## Features

### Smart Contract
- **Array Storage**: Stores 10 words (Lorem ipsum text)
- **Payable Functions**:
  - `firstNumElements()` - Returns first N elements (costs 0.001 ETH)
  - `lastNumElements()` - Returns elements from N to end (costs 0.002 ETH)
- **Owner Functions**:
  - `setNum()` - Update the array slice index
  - `withdrawFunds()` - Withdraw all contract funds to owner
- **View Functions**:
  - `getWords()` - View full array
  - `getContractBalance()` - Check contract balance

### Front-end
- Display owner address and contract information
- Show user address and ETH balance
- Interactive buttons for all contract functions
- Real-time balance and data updates
- Beautiful, modern UI with gradient design

## Prerequisites

- Node.js (v14+)
- pnpm
- Foundry (forge, cast, anvil)

## Quick Start

### 1. Setup
```bash
chmod +x SETUP.sh
./SETUP.sh
```

### 2. Start Local Blockchain
```bash
source ~/.zshenv
anvil
```
Keep this running in a separate terminal.

### 3. Deploy Contract
In a new terminal:
```bash
cd chain-end
source ~/.zshenv
forge script script/Deploy.sol:Deploy --rpc-url http://127.0.0.1:8545 --broadcast
```

Note the deployed contract address from the output.

### 4. Start Front-end
```bash
cd front-end
pnpm start
```

### 5. Use the Application
1. Open browser to `http://localhost:3000`
2. Click "Connect to Local Blockchain"
3. Interact with the contract!

## Project Structure

```
CSCE-5575-HW-2-Template/
├── chain-end/               # Smart contract project
│   ├── src/
│   │   └── Counter.sol     # Main Ownable contract
│   ├── script/
│   │   └── Deploy.sol      # Deployment script
│   └── lib/                # OpenZeppelin contracts
├── front-end/              # React application
│   ├── src/
│   │   ├── App.tsx        # Main UI component
│   │   └── App.css        # Styling
│   └── public/
├── README.md              # This file
└── SETUP.sh              # Setup script
```

## Contract Details

**Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3` (on local Anvil)

**Test Account** (Auto-connected in UI):
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- Initial Balance: 10,000 ETH

## Usage Examples

### Using the Web UI
1. Connect to blockchain
2. View current num value and array
3. Click "Get First N Elements" (pays 0.001 ETH)
4. Click "Get Last Elements" (pays 0.002 ETH)
5. As owner: Update num value (0-10)
6. As owner: Withdraw accumulated funds

### Using Command Line (Alternative)

```bash
cd chain-end
source ~/.zshenv

# View contract data
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "num()" --rpc-url http://127.0.0.1:8545
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "owner()" --rpc-url http://127.0.0.1:8545

# Call payable function
cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "firstNumElements()" \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
    --value 0.001ether \
    --rpc-url http://127.0.0.1:8545

# Owner: Set num value
cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "setNum(uint256)" 7 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
    --rpc-url http://127.0.0.1:8545
```

## Technology Stack

- **Smart Contracts**: Solidity 0.8.13
- **Framework**: Foundry
- **Frontend**: React 18, TypeScript
- **Blockchain Library**: ethers.js v6
- **Testing Network**: Anvil (Foundry)

## Assignment Requirements

✅ All requirements completed:
- [x] Ownable contract with OpenZeppelin inheritance
- [x] Array of 10 words with slicing functionality
- [x] Two payable functions (0.001 and 0.002 ETH)
- [x] Owner-only setNum function
- [x] Owner-only withdrawFunds function
- [x] React UI displaying all required information
- [x] Buttons for all function calls
- [x] Input field for setting number

## Troubleshooting

**React app won't connect**:
- Ensure Anvil is running on port 8545
- Check contract is deployed
- Verify contract address in `front-end/src/App.tsx`

**Transaction fails**:
- Ensure you have enough ETH
- Send exact payment amounts (0.001 or 0.002 ETH)
- Check num value is valid (0-10)

**Anvil not found**:
- Run `source ~/.zshenv`
- Install Foundry: `curl -L https://foundry.paradigm.xyz | bash && foundryup`

## Author

CSCE 4575/5575 - Blockchain Course
Instructor: Beddhu Murali

## License

See LICENSE file.
