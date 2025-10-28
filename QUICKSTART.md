# Quick Start Guide

## One-Time Setup
```bash
./SETUP.sh
```

## Every Time You Run

### Terminal 1: Start Blockchain
```bash
anvil
```

### Terminal 2: Deploy Contract (if not already deployed)
```bash
cd chain-end
forge script script/Deploy.sol:Deploy --rpc-url http://127.0.0.1:8545 --broadcast
```

### Terminal 3: Start UI
```bash
cd front-end
pnpm start
```

### Browser
```
http://localhost:3000
```
Click "Connect to Local Blockchain" and you're done!

## Files Created
- ✅ `chain-end/src/Counter.sol` - Smart contract
- ✅ `chain-end/script/Deploy.sol` - Deployment script  
- ✅ `front-end/src/App.tsx` - React UI
- ✅ `front-end/src/App.css` - Styling
- ✅ `README.md` - Full documentation
- ✅ `SETUP.sh` - Setup automation

## Contract Address
`0x5FbDB2315678afecb367f032d93F642f64180aa3`

## Test Account  
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- 10,000 ETH (test money)

