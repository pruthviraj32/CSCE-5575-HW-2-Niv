import { useState } from 'react';
import './App.css';
import { JsonRpcProvider, Wallet, Contract, formatEther, parseEther } from "ethers";

// ABI for the Counter contract
const COUNTER_ABI = [
  "function owner() view returns (address)",
  "function num() view returns (uint256)",
  "function getWords() view returns (string[])",
  "function getContractBalance() view returns (uint256)",
  "function firstNumElements() payable returns (string[])",
  "function lastNumElements() payable returns (string[])",
  "function setNum(uint256 _num)",
  "function withdrawFunds()",
];

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RPC_URL = "http://127.0.0.1:8545";
// Test account from Anvil (Account #0)
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

function App() {
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [ownerAddress, setOwnerAddress] = useState<string>("");
  const [numValue, setNumValue] = useState<number>(0);
  const [arraySlice, setArraySlice] = useState<string[]>([]);
  const [contractBalance, setContractBalance] = useState<string>("");
  const [contract, setContract] = useState<Contract | null>(null);
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [newNum, setNewNum] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const handleConnect = async () => {
    try {
      // Connect to local Anvil node
      const jsonProvider = new JsonRpcProvider(RPC_URL);
      const wallet = new Wallet(PRIVATE_KEY, jsonProvider);
      const userAddress = wallet.address;
      const userBalance = await jsonProvider.getBalance(userAddress);

      setAddress(userAddress);
      setBalance(formatEther(userBalance));
      setProvider(jsonProvider);
      setConnected(true);

      // Initialize contract
      const counterContract = new Contract(CONTRACT_ADDRESS, COUNTER_ABI, wallet);
      setContract(counterContract);

      // Load contract data
      await loadContractData(counterContract, userAddress, jsonProvider);
      setMessage("Connected successfully!");
    } catch (error) {
      console.error("Error connecting:", error);
      setMessage("Error connecting: " + (error as Error).message);
    }
  };

  const loadContractData = async (contractInstance: Contract, userAddress: string, prov: JsonRpcProvider) => {
    try {
      const owner = await contractInstance.owner();
      const num = await contractInstance.num();
      const words = await contractInstance.getWords();
      const balance = await contractInstance.getContractBalance();

      setOwnerAddress(owner);
      setNumValue(Number(num));
      setArraySlice(words);
      setContractBalance(formatEther(balance));
      setIsOwner(owner.toLowerCase() === userAddress.toLowerCase());
    } catch (error) {
      console.error("Error loading contract data:", error);
      setMessage("Error loading contract data: " + (error as Error).message);
    }
  };

  const refreshData = async () => {
    if (contract && address && provider) {
      const userBalance = await provider.getBalance(address);
      setBalance(formatEther(userBalance));
      await loadContractData(contract, address, provider);
    }
  };

  const handleFirstNumElements = async () => {
    if (!contract) return;
    
    setLoading(true);
    setMessage("");
    try {
      const tx = await contract.firstNumElements({ value: parseEther("0.001") });
      setMessage("Transaction sent! Waiting for confirmation...");
      const receipt = await tx.wait();
      setMessage("Successfully called firstNumElements!");
      addTransaction("firstNumElements()", receipt.hash, receipt.gasUsed.toString(), receipt.blockNumber, "0.001 ETH");
      await refreshData();
    } catch (error) {
      console.error("Error calling firstNumElements:", error);
      setMessage("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLastNumElements = async () => {
    if (!contract) return;
    
    setLoading(true);
    setMessage("");
    try {
      const tx = await contract.lastNumElements({ value: parseEther("0.002") });
      setMessage("Transaction sent! Waiting for confirmation...");
      const receipt = await tx.wait();
      setMessage("Successfully called lastNumElements!");
      addTransaction("lastNumElements()", receipt.hash, receipt.gasUsed.toString(), receipt.blockNumber, "0.002 ETH");
      await refreshData();
    } catch (error) {
      console.error("Error calling lastNumElements:", error);
      setMessage("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetNum = async () => {
    if (!contract || !isOwner) return;
    
    setLoading(true);
    setMessage("");
    try {
      const tx = await contract.setNum(newNum);
      setMessage("Transaction sent! Waiting for confirmation...");
      const receipt = await tx.wait();
      setMessage("Successfully updated num to " + newNum);
      addTransaction(`setNum(${newNum})`, receipt.hash, receipt.gasUsed.toString(), receipt.blockNumber, "0 ETH");
      setNewNum("");
      await refreshData();
    } catch (error) {
      console.error("Error setting num:", error);
      setMessage("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawFunds = async () => {
    if (!contract || !isOwner) return;
    
    setLoading(true);
    setMessage("");
    try {
      const tx = await contract.withdrawFunds();
      setMessage("Transaction sent! Waiting for confirmation...");
      const receipt = await tx.wait();
      setMessage("Successfully withdrew funds!");
      addTransaction("withdrawFunds()", receipt.hash, receipt.gasUsed.toString(), receipt.blockNumber, contractBalance + " ETH");
      await refreshData();
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      setMessage("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = (method: string, hash: string, gasUsed: string, blockNumber: number, value: string) => {
    const newTx = {
      method,
      hash: hash.substring(0, 10) + "..." + hash.substring(hash.length - 8),
      fullHash: hash,
      gasUsed,
      blockNumber,
      value,
      timestamp: new Date().toLocaleTimeString()
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const loadTransactionHistory = async () => {
    if (!provider) return;
    
    setLoading(true);
    try {
      const currentBlock = await provider.getBlockNumber();
      const allTransactions = [];
      
      // Fetch transactions from all blocks
      for (let i = 0; i <= currentBlock; i++) {
        const block = await provider.getBlock(i, true);
        if (block && block.transactions.length > 0) {
          for (const txHash of block.transactions) {
            const tx = await provider.getTransaction(txHash as string);
            const receipt = await provider.getTransactionReceipt(txHash as string);
            
            // Only include transactions to our contract
            if (tx && receipt && tx.to?.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()) {
              let method = "unknown";
              
              // Decode method from transaction data
              if (tx.data.startsWith("0x8da5cb5b")) method = "owner()";
              else if (tx.data.startsWith("0x4e70b1dc")) method = "num()";
              else if (tx.data.startsWith("0x924d1328")) method = "getWords()";
              else if (tx.data.startsWith("0x6f9fb98a")) method = "getContractBalance()";
              else if (tx.data.startsWith("0x3b72bb91")) method = "firstNumElements()";
              else if (tx.data.startsWith("0x49e339b3")) method = "lastNumElements()";
              else if (tx.data.startsWith("0xcd16ecbf")) method = "setNum()";
              else if (tx.data.startsWith("0x24600fc3")) method = "withdrawFunds()";
              
              const txData = {
                method,
                hash: tx.hash.substring(0, 10) + "..." + tx.hash.substring(tx.hash.length - 8),
                fullHash: tx.hash,
                gasUsed: receipt.gasUsed.toString(),
                blockNumber: receipt.blockNumber,
                value: formatEther(tx.value) + " ETH",
                timestamp: new Date(block.timestamp * 1000).toLocaleString(),
                from: tx.from,
                status: receipt.status === 1 ? "Success" : "Failed"
              };
              
              allTransactions.push(txData);
            }
          }
        }
      }
      
      setTransactions(allTransactions.reverse()); // Most recent first
      setMessage(`Loaded ${allTransactions.length} transactions from blockchain`);
    } catch (error) {
      console.error("Error loading transaction history:", error);
      setMessage("Error loading transaction history");
    } finally {
      setLoading(false);
    }
  };

  const getArraySlicePreview = () => {
    if (arraySlice.length === 0) return [];
    return arraySlice.slice(0, numValue);
  };

  return (
    <div className="App">
      <h1>Homework 2 - Ownable Contract</h1>
      <br />
      
      {!connected ? (
        <div>
          <button onClick={handleConnect} className="connect-button">
            Connect to Local Blockchain
          </button>
          <p style={{color: 'white', marginTop: '20px', textAlign: 'center'}}>
            Make sure Anvil is running on localhost:8545
          </p>
        </div>
      ) : (
        <div className="container">
          <div className="section">
            <h2>Wallet Information</h2>
            <div className="info-box">
              <p><strong>Your Address:</strong></p>
              <p className="address">{address}</p>
              <p><strong>Your Balance:</strong> {parseFloat(balance).toFixed(4)} ETH</p>
            </div>
          </div>

          <div className="section">
            <h2>Contract Information</h2>
            <div className="info-box">
              <p><strong>Contract Owner:</strong></p>
              <p className="address">{ownerAddress}</p>
              <p><strong>Contract Balance:</strong> {parseFloat(contractBalance).toFixed(4)} ETH</p>
              <p><strong>Current Num Value:</strong> {numValue}</p>
              {isOwner && <p className="owner-badge">✓ You are the owner</p>}
            </div>
          </div>

          <div className="section">
            <h2>Array Data</h2>
            <div className="info-box">
              <p><strong>Full Array:</strong></p>
              <p className="array-display">[{arraySlice.join(", ")}]</p>
              <p><strong>First {numValue} Elements Preview:</strong></p>
              <p className="array-display">[{getArraySlicePreview().join(", ")}]</p>
            </div>
          </div>

          <div className="section">
            <h2>Payable Functions</h2>
            <div className="button-group">
              <button 
                onClick={handleFirstNumElements} 
                disabled={loading}
                className="action-button"
              >
                Get First {numValue} Elements (0.001 ETH)
              </button>
              <button 
                onClick={handleLastNumElements} 
                disabled={loading}
                className="action-button"
              >
                Get Last Elements from {numValue} (0.002 ETH)
              </button>
            </div>
          </div>

          {isOwner && (
            <div className="section owner-section">
              <h2>Owner Functions</h2>
              <div className="owner-controls">
                <div className="input-group">
                  <label>Set New Num Value:</label>
                  <input 
                    type="number" 
                    value={newNum}
                    onChange={(e) => setNewNum(e.target.value)}
                    placeholder="Enter number (0-10)"
                    min="0"
                    max="10"
                  />
                  <button 
                    onClick={handleSetNum} 
                    disabled={loading || !newNum}
                    className="action-button"
                  >
                    Update Num
                  </button>
                </div>
                <button 
                  onClick={handleWithdrawFunds} 
                  disabled={loading || parseFloat(contractBalance) === 0}
                  className="action-button withdraw-button"
                >
                  Withdraw All Funds
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
              {message}
            </div>
          )}

          <div className="button-group">
            <button onClick={refreshData} className="refresh-button" disabled={loading}>
              Refresh Data
            </button>
            <button onClick={loadTransactionHistory} className="history-button" disabled={loading}>
              Load Full Transaction History
            </button>
          </div>

          {transactions.length > 0 && (
            <div className="section">
              <h2>Transaction History ({transactions.length} total)</h2>
              <div className="transactions-container">
                {transactions.map((tx, index) => (
                  <div key={index} className="transaction-item">
                    <div className="tx-row">
                      <span className="tx-label">Method:</span>
                      <span className="tx-value tx-method">{tx.method}</span>
                    </div>
                    <div className="tx-row">
                      <span className="tx-label">Hash:</span>
                      <span className="tx-value tx-hash" title={tx.fullHash}>{tx.hash}</span>
                    </div>
                    <div className="tx-row">
                      <span className="tx-label">Block:</span>
                      <span className="tx-value">#{tx.blockNumber}</span>
                    </div>
                    <div className="tx-row">
                      <span className="tx-label">Gas Used:</span>
                      <span className="tx-value">{tx.gasUsed}</span>
                    </div>
                    <div className="tx-row">
                      <span className="tx-label">Value:</span>
                      <span className="tx-value tx-value-amount">{tx.value}</span>
                    </div>
                    {tx.from && (
                      <div className="tx-row">
                        <span className="tx-label">From:</span>
                        <span className="tx-value address">{tx.from.substring(0, 10) + "..." + tx.from.substring(tx.from.length - 8)}</span>
                      </div>
                    )}
                    {tx.status && (
                      <div className="tx-row">
                        <span className="tx-label">Status:</span>
                        <span className={`tx-value ${tx.status === 'Success' ? 'tx-success' : 'tx-failed'}`}>{tx.status}</span>
                      </div>
                    )}
                    <div className="tx-row">
                      <span className="tx-label">Time:</span>
                      <span className="tx-value">{tx.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
