# AHAN P2P Lending Protocol

Decentralized P2P lending protocol for farmer cooperatives on BNB Chain.

## Overview

AHAN connects P2P lenders with farmer cooperatives through a transparent, efficient blockchain-based lending system. The protocol abstracts blockchain complexity from end farmers while maintaining full transparency for lenders.

## Key Features

- **Liquid Receipt Tokens**: lqBUSD tokens are tradeable and redeemable anytime
- **Field Officer Attestation**: On-chain verification ensures loan legitimacy
- **Transparent Accounting**: All transactions recorded immutably on BNB Chain
- **Automated Yield Distribution**: Interest accrues automatically to lenders (~6% APY)
- **Multisig Security**: Co-op wallets use multisig for enhanced security
- **Gasless Transactions**: Optional relayer for seamless user experience

## Architecture

### Core Modules

1. **Pool Contract** (`Pool.sol`)
   - Manages deposits and withdrawals
   - Mints/burns lqBUSD tokens
   - Handles loan disbursement and repayment
   - Tracks liquidity and interest

2. **LoanManager Contract** (`LoanManager.sol`)
   - Creates and manages loans
   - Verifies Field Officer attestations
   - Processes repayments
   - Maintains loan records

3. **lqBUSD Token**
   - ERC20 liquid receipt token
   - Represents share of pool deposits
   - Value increases with accrued interest

4. **Orchestrator Contract** (`Orchestrator.sol`)
   - Optional relayer for gasless transactions
   - Bundles Field Officer attestations
   - Submits transactions on behalf of co-ops

## Workflow

### 1. Lender Deposits
- P2P Lender deposits bUSD into AHAN Pool
- Pool mints lqBUSD tokens proportional to deposit
- Lender earns yield on deposited funds

### 2. Loan Request
- Farmer Co-operative requests loan with Field Officer attestation
- LoanManager verifies attestation signature
- Loan is registered on-chain

### 3. Disbursement
- Pool disburses funds to Co-op Wallet
- Co-op distributes to individual farmers off-chain
- Blockchain complexity abstracted from farmers

### 4. Repayment
- Farmers repay Co-op off-chain
- Co-op repays Pool on-chain with interest
- Interest distributed to lenders via lqBUSD value increase

### 5. Redemption
- Lenders can redeem lqBUSD for bUSD anytime
- Redemption value includes accrued interest

## Smart Contracts

### Pool.sol
Main liquidity pool contract handling:
- Deposits and withdrawals
- lqBUSD token minting/burning
- Loan disbursement
- Repayment processing
- Interest accounting

### LoanManager.sol
Loan management contract handling:
- Loan creation with attestation verification
- Loan status tracking
- Repayment processing
- Interest calculation

### Orchestrator.sol
Optional relayer contract for:
- Gasless transaction submission
- Attestation bundling
- Enhanced UX for co-ops

## Deployment

### Prerequisites
```bash
npm install --save-dev hardhat @openzeppelin/contracts
```

### Deploy Contracts
```bash
# Deploy Pool
npx hardhat run scripts/deploy-pool.js --network bsc

# Deploy LoanManager
npx hardhat run scripts/deploy-loanmanager.js --network bsc

# Deploy Orchestrator (optional)
npx hardhat run scripts/deploy-orchestrator.js --network bsc
```

### Configure
```javascript
// Set LoanManager in Pool
await pool.setLoanManager(loanManagerAddress)

// Add Field Officers
await loanManager.addFieldOfficer(officerAddress)

// Add Relayers (if using Orchestrator)
await orchestrator.addRelayer(relayerAddress)
```

## Technical Specifications

- **Blockchain**: BNB Chain (Binance Smart Chain)
- **Stablecoin**: bUSD (Binance USD)
- **Smart Contracts**: Solidity 0.8.x
- **Libraries**: OpenZeppelin
- **Target APY**: ~6% for lenders
- **Security**: Multisig wallets, attestation verification

## Security Features

- ReentrancyGuard on all state-changing functions
- Field Officer signature verification
- Multisig requirements for co-op wallets
- Comprehensive event logging
- Audited OpenZeppelin libraries

## Frontend Integration

The protocol includes a Neo-Brutalism themed web interface with:
- Lender dashboard for deposits/redemptions
- Co-op dashboard for loan requests/repayments
- Complete documentation
- Smart contract viewer

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## License

MIT

## Contact

For questions or support, please open an issue on GitHub.
