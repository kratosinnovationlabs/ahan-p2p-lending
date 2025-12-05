import React from 'react'
import { ArrowLeft, Github, ExternalLink, FileCode } from 'lucide-react'
import WalletButton from './WalletButton'

interface SmartContractsProps {
  onBack: () => void
}

function SmartContracts({ onBack }: SmartContractsProps) {
  return (
    <div className="min-h-screen bg-neo-white">
      {/* Header */}
      <header className="bg-neo-black border-b-4 border-neo-black p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={onBack}
            className="bg-neo-white text-neo-black px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            BACK
          </button>
          <h1 className="text-3xl font-bold text-neo-white">SMART CONTRACTS</h1>
          <WalletButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="bg-neo-cyan border-brutal p-8 shadow-brutal-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileCode className="w-10 h-10 text-neo-black" />
            <h2 className="text-4xl font-bold text-neo-black">CONTRACT ARCHITECTURE</h2>
          </div>
          <p className="text-xl text-neo-black font-mono leading-relaxed">
            AHAN's smart contract system is built with security, transparency, and efficiency in mind. 
            All contracts are open-source and deployed on BNB Chain.
          </p>
        </div>

        {/* Core Contracts */}
        <div className="space-y-6 mb-8">
          <div className="bg-neo-pink border-brutal p-6 shadow-brutal">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-neo-black mb-2">AHAN POOL</h3>
                <p className="text-sm text-neo-black font-mono">Core lending pool contract</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-neo-black text-neo-white px-4 py-2 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  CODE
                </button>
                <button className="bg-neo-white text-neo-black px-4 py-2 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  SCAN
                </button>
              </div>
            </div>
            <p className="text-neo-black font-mono mb-4">
              Manages deposits, withdrawals, and yield distribution. Issues lqBUSD tokens to depositors.
            </p>
            <div className="bg-neo-white border-brutal p-4">
              <p className="text-sm font-bold text-neo-black mb-2">KEY FUNCTIONS:</p>
              <ul className="list-disc list-inside text-neo-black font-mono text-sm space-y-1">
                <li>deposit(uint256 amount)</li>
                <li>redeem(uint256 shares)</li>
                <li>getExchangeRate()</li>
                <li>totalAssets()</li>
              </ul>
            </div>
          </div>

          <div className="bg-neo-yellow border-brutal p-6 shadow-brutal">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-neo-black mb-2">LOAN MANAGER</h3>
                <p className="text-sm text-neo-black font-mono">Handles loan lifecycle</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-neo-black text-neo-white px-4 py-2 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  CODE
                </button>
                <button className="bg-neo-white text-neo-black px-4 py-2 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  SCAN
                </button>
              </div>
            </div>
            <p className="text-neo-black font-mono mb-4">
              Processes loan requests, disbursements, and repayments. Enforces Field Officer attestation.
            </p>
            <div className="bg-neo-white border-brutal p-4">
              <p className="text-sm font-bold text-neo-black mb-2">KEY FUNCTIONS:</p>
              <ul className="list-disc list-inside text-neo-black font-mono text-sm space-y-1">
                <li>requestLoan(uint256 amount, bytes32 purpose)</li>
                <li>attestLoan(uint256 loanId, bytes signature)</li>
                <li>disburseLoan(uint256 loanId)</li>
                <li>repayLoan(uint256 loanId, uint256 amount)</li>
              </ul>
            </div>
          </div>

          <div className="bg-neo-cyan border-brutal p-6 shadow-brutal">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-neo-black mb-2">lqBUSD TOKEN</h3>
                <p className="text-sm text-neo-black font-mono">ERC-20 receipt token</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-neo-black text-neo-white px-4 py-2 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  CODE
                </button>
                <button className="bg-neo-white text-neo-black px-4 py-2 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  SCAN
                </button>
              </div>
            </div>
            <p className="text-neo-black font-mono mb-4">
              Liquid receipt token representing pool shares. Fully ERC-20 compliant and tradeable.
            </p>
            <div className="bg-neo-white border-brutal p-4">
              <p className="text-sm font-bold text-neo-black mb-2">KEY FUNCTIONS:</p>
              <ul className="list-disc list-inside text-neo-black font-mono text-sm space-y-1">
                <li>transfer(address to, uint256 amount)</li>
                <li>approve(address spender, uint256 amount)</li>
                <li>balanceOf(address account)</li>
                <li>totalSupply()</li>
              </ul>
            </div>
          </div>

          <div className="bg-neo-green border-brutal p-6 shadow-brutal">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-neo-black mb-2">ORCHESTRATOR</h3>
                <p className="text-sm text-neo-black font-mono">System coordinator</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-neo-black text-neo-white px-4 py-2 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  CODE
                </button>
                <button className="bg-neo-white text-neo-black px-4 py-2 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  SCAN
                </button>
              </div>
            </div>
            <p className="text-neo-black font-mono mb-4">
              Coordinates interactions between pool and loan manager. Manages roles and permissions.
            </p>
            <div className="bg-neo-white border-brutal p-4">
              <p className="text-sm font-bold text-neo-black mb-2">KEY FUNCTIONS:</p>
              <ul className="list-disc list-inside text-neo-black font-mono text-sm space-y-1">
                <li>grantRole(bytes32 role, address account)</li>
                <li>revokeRole(bytes32 role, address account)</li>
                <li>pause()</li>
                <li>unpause()</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-neo-pink border-brutal p-8 shadow-brutal-lg mb-8">
          <h2 className="text-3xl font-bold text-neo-black mb-6">SECURITY FEATURES</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-neo-white border-brutal p-4">
              <h4 className="text-xl font-bold text-neo-black mb-3">ACCESS CONTROL</h4>
              <ul className="list-disc list-inside text-neo-black font-mono text-sm space-y-2">
                <li>Role-based permissions (Admin, Field Officer, Cooperative)</li>
                <li>Multi-signature requirements for critical operations</li>
                <li>Time-locked administrative functions</li>
              </ul>
            </div>
            <div className="bg-neo-white border-brutal p-4">
              <h4 className="text-xl font-bold text-neo-black mb-3">SAFETY MECHANISMS</h4>
              <ul className="list-disc list-inside text-neo-black font-mono text-sm space-y-2">
                <li>Emergency pause functionality</li>
                <li>Reentrancy guards on all state-changing functions</li>
                <li>Integer overflow/underflow protection</li>
              </ul>
            </div>
            <div className="bg-neo-white border-brutal p-4">
              <h4 className="text-xl font-bold text-neo-black mb-3">AUDITS</h4>
              <ul className="list-disc list-inside text-neo-black font-mono text-sm space-y-2">
                <li>Third-party security audit completed</li>
                <li>Formal verification of critical functions</li>
                <li>Bug bounty program active</li>
              </ul>
            </div>
            <div className="bg-neo-white border-brutal p-4">
              <h4 className="text-xl font-bold text-neo-black mb-3">TRANSPARENCY</h4>
              <ul className="list-disc list-inside text-neo-black font-mono text-sm space-y-2">
                <li>All contracts verified on BscScan</li>
                <li>Open-source code on GitHub</li>
                <li>Real-time on-chain monitoring</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Deployment Info */}
        <div className="bg-neo-black border-brutal p-8 shadow-brutal-lg">
          <h2 className="text-3xl font-bold text-neo-white mb-6">DEPLOYMENT INFORMATION</h2>
          <div className="space-y-4">
            <div className="bg-neo-white border-brutal p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-neo-black mb-1">NETWORK</p>
                  <p className="text-xl font-bold text-neo-black">BSC Testnet (Chain ID: 97)</p>
                </div>
                <div className="bg-neo-cyan border-brutal px-4 py-2">
                  <p className="font-bold text-neo-black">TESTNET</p>
                </div>
              </div>
            </div>
            <div className="bg-neo-white border-brutal p-4">
              <p className="text-sm font-bold text-neo-black mb-2">CONTRACT ADDRESSES</p>
              <div className="space-y-2 font-mono text-sm text-neo-black">
                <p>AHAN Pool: 0x...</p>
                <p>Loan Manager: 0x...</p>
                <p>lqBUSD Token: 0x...</p>
                <p>Orchestrator: 0x...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartContracts
