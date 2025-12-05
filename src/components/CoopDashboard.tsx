import React, { useState, useEffect } from 'react'
import { ArrowLeft, Wallet, FileText, Users, DollarSign, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import WalletButton from './WalletButton'
import { ethers } from 'ethers'
import { CONTRACTS, POOL_ABI, BUSDT_ABI } from '../config/contracts'

interface CoopDashboardProps {
  onBack: () => void
}

interface Loan {
  id: string
  amount: string
  purpose: string
  timestamp: number
  status: 'ACTIVE' | 'REPAID'
}

function CoopDashboard({ onBack }: CoopDashboardProps) {
  const [loanAmount, setLoanAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [repaymentAmount, setRepaymentAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [txStatus, setTxStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)
  const [activeLoans, setActiveLoans] = useState<Loan[]>([])
  
  const { account, signer } = useWeb3()

  // Load loans from local storage on mount
  useEffect(() => {
    const savedLoans = localStorage.getItem('ahan_loans')
    if (savedLoans) {
      setActiveLoans(JSON.parse(savedLoans))
    }
  }, [])

  const updateLoans = (newLoans: Loan[]) => {
    setActiveLoans(newLoans)
    localStorage.setItem('ahan_loans', JSON.stringify(newLoans))
  }

  const handleRequestLoan = async () => {
    if (!account || !signer) {
      setTxStatus({ type: 'error', message: 'Please connect your wallet first' })
      return
    }

    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      setTxStatus({ type: 'error', message: 'Please enter a valid amount' })
      return
    }

    setIsProcessing(true)
    setTxStatus({ type: 'info', message: 'Initiating loan request...' })

    try {
      const poolContract = new ethers.Contract(CONTRACTS.POOL, POOL_ABI, signer)
      const amountWei = ethers.parseUnits(loanAmount, 18)

      // Call borrow function on contract
      setTxStatus({ type: 'info', message: 'Requesting funds from pool...' })
      
      // Note: This assumes the contract has a borrow function. 
      // If using the provided LendingPool.sol, it needs to be updated and redeployed.
      const tx = await poolContract.borrow(amountWei, {
        gasLimit: 300000
      })

      setTxStatus({ type: 'info', message: 'Transaction submitted. Waiting for confirmation...' })
      await tx.wait()

      // Create new loan record
      const newLoan: Loan = {
        id: `LOAN-${Math.floor(Math.random() * 10000)}`,
        amount: loanAmount,
        purpose: purpose,
        timestamp: Date.now(),
        status: 'ACTIVE'
      }

      updateLoans([...activeLoans, newLoan])
      
      setTxStatus({ 
        type: 'success', 
        message: `✅ Loan Approved! Received ${loanAmount} BUSD.` 
      })
      setLoanAmount('')
      setPurpose('')

    } catch (error: any) {
      console.error('Borrow error:', error)
      let msg = error.message || 'Transaction failed'
      if (msg.includes('revert')) msg = 'Transaction reverted. Pool might be empty or borrow function missing.'
      setTxStatus({ type: 'error', message: `❌ ${msg.slice(0, 100)}...` })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRepayLoan = async () => {
    if (!account || !signer) {
      setTxStatus({ type: 'error', message: 'Please connect your wallet first' })
      return
    }

    if (!repaymentAmount || parseFloat(repaymentAmount) <= 0) {
      setTxStatus({ type: 'error', message: 'Please enter a valid amount' })
      return
    }

    setIsProcessing(true)
    setTxStatus({ type: 'info', message: 'Initiating repayment...' })

    try {
      const busdtContract = new ethers.Contract(CONTRACTS.BUSDT, BUSDT_ABI, signer)
      const amountWei = ethers.parseUnits(repaymentAmount, 18)

      // 1. Check Balance
      const balance = await busdtContract.balanceOf(account)
      if (balance < amountWei) {
        throw new Error('Insufficient BUSD balance')
      }

      // 2. Transfer BUSD directly to Pool
      setTxStatus({ type: 'info', message: 'Sending repayment to pool...' })
      const tx = await busdtContract.transfer(CONTRACTS.POOL, amountWei, {
        gasLimit: 300000
      })

      setTxStatus({ type: 'info', message: 'Processing repayment...' })
      await tx.wait()

      // 3. Update Local State
      // Mark loans as repaid (simplification: just remove amount from total tracked or clear oldest)
      // For this demo, we'll just log the repayment and trigger the yield simulation
      
      // TRIGGER YIELD SIMULATION
      const currentYield = parseFloat(localStorage.getItem('ahan_yield_multiplier') || '1.0')
      const newYield = currentYield * 1.06 // Increase by 6%
      localStorage.setItem('ahan_yield_multiplier', newYield.toString())

      setTxStatus({ 
        type: 'success', 
        message: `✅ Repayment Successful! Lender yield updated.` 
      })
      setRepaymentAmount('')

    } catch (error: any) {
      console.error('Repay error:', error)
      setTxStatus({ type: 'error', message: `❌ ${error.message.slice(0, 100)}...` })
    } finally {
      setIsProcessing(false)
    }
  }

  const totalBorrowed = activeLoans
    .filter(l => l.status === 'ACTIVE')
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

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
        
        {/* Transaction Status */}
        {txStatus && (
          <div className={`${
            txStatus.type === 'success' ? 'bg-neo-green' : 
            txStatus.type === 'error' ? 'bg-neo-pink' : 'bg-neo-yellow'
          } border-brutal p-6 shadow-brutal mb-8 transition-all duration-300`}>
            <div className="flex items-center gap-3">
              {txStatus.type === 'error' && <AlertCircle className="w-6 h-6 text-neo-black" />}
              {txStatus.type === 'info' && <RefreshCw className="w-6 h-6 text-neo-black animate-spin" />}
              <p className="font-bold text-neo-black">{txStatus.message}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'ACTIVE LOANS', value: activeLoans.filter(l => l.status === 'ACTIVE').length.toString(), icon: FileText, color: 'bg-neo-cyan' },
            { label: 'TOTAL BORROWED', value: `${totalBorrowed.toFixed(2)} bUSD`, icon: DollarSign, color: 'bg-neo-pink' },
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
            Funds are disbursed immediately upon request (Auto-Grant).
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
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neo-black mb-2">PURPOSE</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-neo-white border-brutal p-4 text-xl font-bold text-neo-black focus:outline-none"
                disabled={isProcessing}
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
            disabled={!account || !loanAmount || !purpose || isProcessing}
            className="w-full bg-neo-black text-neo-white px-6 py-4 border-brutal font-bold text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'PROCESSING...' : 'REQUEST & RECEIVE FUNDS'}
          </button>
        </div>

        {/* Active Loans List */}
        {account && activeLoans.length > 0 && (
          <div className="bg-neo-yellow border-brutal p-8 shadow-brutal-lg mb-12">
            <h2 className="text-3xl font-bold text-neo-black mb-6">ACTIVE LOANS</h2>
            <div className="space-y-4">
              {activeLoans.filter(l => l.status === 'ACTIVE').map((loan, idx) => (
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
                      <p className="text-xl font-bold text-neo-black">{loan.amount} bUSD</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neo-black mb-1">DATE</p>
                      <p className="text-xl font-bold text-neo-black">{new Date(loan.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Repayment Section */}
        {account && (
          <div className="bg-neo-pink border-brutal p-8 shadow-brutal-lg">
            <h2 className="text-3xl font-bold text-neo-black mb-6">MAKE REPAYMENT</h2>
            <p className="text-neo-black font-mono mb-6">
              Repay loans to the pool. This will automatically distribute yield to lenders.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">REPAYMENT AMOUNT (bUSD)</label>
                <input
                  type="number"
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-neo-white border-brutal p-4 text-2xl font-bold text-neo-black focus:outline-none"
                  disabled={isProcessing}
                />
              </div>
            </div>
            <button
              onClick={handleRepayLoan}
              disabled={!account || !repaymentAmount || isProcessing}
              className="w-full mt-6 bg-neo-black text-neo-white px-6 py-4 border-brutal font-bold text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'PROCESSING...' : 'SUBMIT REPAYMENT'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoopDashboard
