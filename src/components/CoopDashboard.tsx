import React, { useState } from 'react'
import { ArrowLeft, Wallet, FileText, Users, DollarSign, CheckCircle } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import WalletButton from './WalletButton'

interface CoopDashboardProps {
  onBack: () => void
}

function CoopDashboard({ onBack }: CoopDashboardProps) {
  const [loanAmount, setLoanAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const { account } = useWeb3()

  const handleRequestLoan = () => {
    if (!account) {
      alert('Please connect your wallet first')
      return
    }
    alert(`Requesting loan of ${loanAmount} bUSD for: ${purpose}`)
    setLoanAmount('')
    setPurpose('')
  }

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
          <h1 className="text-3xl font-bold text-neo-white">CO-OP DASHBOARD</h1>
          <WalletButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'ACTIVE LOANS', value: account ? '3' : '0', icon: FileText, color: 'bg-neo-cyan' },
            { label: 'TOTAL BORROWED', value: account ? '15,000 bUSD' : '0 bUSD', icon: DollarSign, color: 'bg-neo-pink' },
            { label: 'FARMERS SERVED', value: account ? '47' : '0', icon: Users, color: 'bg-neo-yellow' },
            { label: 'REPAYMENT RATE', value: '98.5%', icon: CheckCircle, color: 'bg-neo-green' },
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.color} border-brutal p-6 shadow-brutal`}>
              <stat.icon className="w-8 h-8 mb-3 text-neo-black" />
              <p className="text-sm font-bold text-neo-black mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-neo-black">{stat.value}</p>
            </div>
          ))}
        </div>

        {!account && (
          <div className="bg-neo-yellow border-brutal p-8 shadow-brutal-lg mb-12">
            <p className="text-2xl font-bold text-neo-black text-center">
              Please connect your wallet to access the Co-op Dashboard
            </p>
          </div>
        )}

        {/* Request Loan Card */}
        <div className="bg-neo-cyan border-brutal p-8 shadow-brutal-lg mb-12">
          <h2 className="text-3xl font-bold text-neo-black mb-6">REQUEST NEW LOAN</h2>
          <p className="text-neo-black font-mono mb-6">
            Submit a loan request with Field Officer attestation. Funds will be disbursed to your co-op wallet upon approval.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-neo-black mb-2">LOAN AMOUNT (bUSD)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-neo-white border-brutal p-4 text-2xl font-bold text-neo-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neo-black mb-2">PURPOSE</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-neo-white border-brutal p-4 text-xl font-bold text-neo-black focus:outline-none"
              >
                <option value="">SELECT PURPOSE</option>
                <option value="seeds">SEEDS & FERTILIZER</option>
                <option value="equipment">EQUIPMENT</option>
                <option value="irrigation">IRRIGATION</option>
                <option value="livestock">LIVESTOCK</option>
                <option value="other">OTHER</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleRequestLoan}
            disabled={!account || !loanAmount || !purpose}
            className="w-full bg-neo-black text-neo-white px-6 py-4 border-brutal font-bold text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal disabled:opacity-50 disabled:cursor-not-allowed"
          >
            SUBMIT LOAN REQUEST
          </button>
        </div>

        {/* Active Loans */}
        {account && (
          <>
            <div className="bg-neo-yellow border-brutal p-8 shadow-brutal-lg mb-12">
              <h2 className="text-3xl font-bold text-neo-black mb-6">ACTIVE LOANS</h2>
              <div className="space-y-4">
                {[
                  { id: 'LOAN-001', amount: '5,000 bUSD', purpose: 'SEEDS & FERTILIZER', disbursed: '2024-01-10', due: '2024-07-10', status: 'ACTIVE' },
                  { id: 'LOAN-002', amount: '7,500 bUSD', purpose: 'EQUIPMENT', disbursed: '2024-01-15', due: '2024-07-15', status: 'ACTIVE' },
                  { id: 'LOAN-003', amount: '2,500 bUSD', purpose: 'IRRIGATION', disbursed: '2024-01-20', due: '2024-07-20', status: 'ACTIVE' },
                ].map((loan, idx) => (
                  <div key={idx} className="bg-neo-white border-brutal p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-2xl font-bold text-neo-black mb-2">{loan.id}</p>
                        <p className="text-neo-black font-mono">{loan.purpose}</p>
                      </div>
                      <div className="bg-neo-green border-brutal px-4 py-2">
                        <p className="font-bold text-neo-black">{loan.status}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-bold text-neo-black mb-1">AMOUNT</p>
                        <p className="text-xl font-bold text-neo-black">{loan.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neo-black mb-1">DISBURSED</p>
                        <p className="text-xl font-bold text-neo-black">{loan.disbursed}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neo-black mb-1">DUE DATE</p>
                        <p className="text-xl font-bold text-neo-black">{loan.due}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Repayment Section */}
            <div className="bg-neo-pink border-brutal p-8 shadow-brutal-lg">
              <h2 className="text-3xl font-bold text-neo-black mb-6">MAKE REPAYMENT</h2>
              <p className="text-neo-black font-mono mb-6">
                Repay your loans on-chain. Interest accrues to lenders automatically.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-neo-black mb-2">SELECT LOAN</label>
                  <select className="w-full bg-neo-white border-brutal p-4 text-xl font-bold text-neo-black focus:outline-none">
                    <option>LOAN-001 (5,000 bUSD)</option>
                    <option>LOAN-002 (7,500 bUSD)</option>
                    <option>LOAN-003 (2,500 bUSD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neo-black mb-2">REPAYMENT AMOUNT</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-neo-white border-brutal p-4 text-2xl font-bold text-neo-black focus:outline-none"
                  />
                </div>
              </div>
              <button
                disabled={!account}
                className="w-full mt-6 bg-neo-black text-neo-white px-6 py-4 border-brutal font-bold text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                SUBMIT REPAYMENT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CoopDashboard
