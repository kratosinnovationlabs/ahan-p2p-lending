import React from 'react'
import { ArrowLeft, BookOpen, Code, Shield, Zap } from 'lucide-react'
import WalletButton from './WalletButton'

interface DocumentationProps {
  onBack: () => void
}

function Documentation({ onBack }: DocumentationProps) {
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
          <h1 className="text-3xl font-bold text-neo-white">DOCUMENTATION</h1>
          <WalletButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="bg-neo-pink border-brutal p-8 shadow-brutal-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-10 h-10 text-neo-black" />
            <h2 className="text-4xl font-bold text-neo-black">WELCOME TO AHAN</h2>
          </div>
          <p className="text-xl text-neo-black font-mono leading-relaxed">
            AHAN is a decentralized P2P lending protocol built on BNB Chain that connects individual lenders with farmer cooperatives. 
            Our mission is to provide transparent, efficient, and impactful financial services to agricultural communities.
          </p>
        </div>

        {/* Key Concepts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-neo-cyan border-brutal p-6 shadow-brutal">
            <h3 className="text-2xl font-bold text-neo-black mb-4">LIQUID RECEIPT TOKENS</h3>
            <p className="text-neo-black font-mono mb-4">
              When you deposit bUSD into the AHAN pool, you receive lqBUSD tokens representing your share. These tokens:
            </p>
            <ul className="list-disc list-inside text-neo-black font-mono space-y-2">
              <li>Accrue interest automatically</li>
              <li>Are tradeable on secondary markets</li>
              <li>Can be redeemed anytime for bUSD</li>
              <li>Represent proportional pool ownership</li>
            </ul>
          </div>

          <div className="bg-neo-yellow border-brutal p-6 shadow-brutal">
            <h3 className="text-2xl font-bold text-neo-black mb-4">FIELD OFFICER ATTESTATION</h3>
            <p className="text-neo-black font-mono mb-4">
              Every loan request requires verification from a trusted Field Officer who:
            </p>
            <ul className="list-disc list-inside text-neo-black font-mono space-y-2">
              <li>Verifies cooperative legitimacy</li>
              <li>Assesses loan viability</li>
              <li>Signs attestation on-chain</li>
              <li>Monitors loan performance</li>
            </ul>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-neo-white border-brutal p-8 shadow-brutal-lg mb-8">
          <h2 className="text-3xl font-bold text-neo-black mb-6">HOW IT WORKS</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-neo-pink border-brutal p-4 flex-shrink-0">
                <span className="text-3xl font-bold text-neo-black">01</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-neo-black mb-2">LENDERS DEPOSIT</h4>
                <p className="text-neo-black font-mono">
                  P2P lenders deposit bUSD into the AHAN pool smart contract. In return, they receive lqBUSD tokens 
                  representing their proportional share of the pool. Interest begins accruing immediately.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-neo-cyan border-brutal p-4 flex-shrink-0">
                <span className="text-3xl font-bold text-neo-black">02</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-neo-black mb-2">LOAN REQUEST</h4>
                <p className="text-neo-black font-mono">
                  Farmer cooperatives submit loan requests through the platform. Each request includes loan amount, 
                  purpose, and repayment terms. A Field Officer reviews and attests to the legitimacy.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-neo-yellow border-brutal p-4 flex-shrink-0">
                <span className="text-3xl font-bold text-neo-black">03</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-neo-black mb-2">DISBURSEMENT</h4>
                <p className="text-neo-black font-mono">
                  Once approved, funds are automatically disbursed from the pool to the cooperative's multisig wallet. 
                  All transactions are recorded on-chain for full transparency.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-neo-green border-brutal p-4 flex-shrink-0">
                <span className="text-3xl font-bold text-neo-black">04</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-neo-black mb-2">REPAYMENT & YIELD</h4>
                <p className="text-neo-black font-mono">
                  As cooperatives repay loans with interest, the pool value increases. This automatically increases 
                  the redemption value of lqBUSD tokens, distributing yield to all lenders proportionally.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-neo-pink border-brutal p-6 shadow-brutal">
            <Code className="w-8 h-8 mb-4 text-neo-black" />
            <h3 className="text-xl font-bold text-neo-black mb-3">SMART CONTRACTS</h3>
            <p className="text-neo-black font-mono text-sm">
              Built with Solidity, audited for security. Deployed on BNB Chain for low fees and fast transactions.
            </p>
          </div>

          <div className="bg-neo-cyan border-brutal p-6 shadow-brutal">
            <Shield className="w-8 h-8 mb-4 text-neo-black" />
            <h3 className="text-xl font-bold text-neo-black mb-3">SECURITY</h3>
            <p className="text-neo-black font-mono text-sm">
              Multisig wallets, time-locks, and role-based access control ensure funds are protected at all times.
            </p>
          </div>

          <div className="bg-neo-yellow border-brutal p-6 shadow-brutal">
            <Zap className="w-8 h-8 mb-4 text-neo-black" />
            <h3 className="text-xl font-bold text-neo-black mb-3">EFFICIENCY</h3>
            <p className="text-neo-black font-mono text-sm">
              Automated yield distribution, gasless transactions via relayer, and instant liquidity for lenders.
            </p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-neo-black border-brutal p-8 shadow-brutal-lg">
          <h2 className="text-3xl font-bold text-neo-white mb-6">GETTING STARTED</h2>
          
          <div className="space-y-4">
            <div className="bg-neo-white border-brutal p-4">
              <h4 className="text-xl font-bold text-neo-black mb-2">FOR LENDERS</h4>
              <ol className="list-decimal list-inside text-neo-black font-mono space-y-2">
                <li>Connect your MetaMask wallet</li>
                <li>Ensure you're on BSC Testnet</li>
                <li>Acquire test bUSD tokens</li>
                <li>Navigate to Lender Dashboard</li>
                <li>Deposit bUSD to start earning</li>
              </ol>
            </div>

            <div className="bg-neo-white border-brutal p-4">
              <h4 className="text-xl font-bold text-neo-black mb-2">FOR COOPERATIVES</h4>
              <ol className="list-decimal list-inside text-neo-black font-mono space-y-2">
                <li>Register your cooperative</li>
                <li>Connect multisig wallet</li>
                <li>Submit loan request with details</li>
                <li>Wait for Field Officer attestation</li>
                <li>Receive funds and manage repayments</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Documentation
