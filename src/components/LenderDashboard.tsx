import React, { useState, useEffect } from 'react'
import { ArrowLeft, Wallet, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import { ethers } from 'ethers'
import { CONTRACTS, BUSDT_ABI, LQBUSD_ABI, POOL_ABI } from '../config/contracts'
import WalletButton from './WalletButton'

interface LenderDashboardProps {
  onBack: () => void
}

function LenderDashboard({ onBack }: LenderDashboardProps) {
  const [depositAmount, setDepositAmount] = useState('')
  const [redeemAmount, setRedeemAmount] = useState('')
  const [isDepositing, setIsDepositing] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Balances
  const [busdtBalance, setBusdtBalance] = useState('0')
  const [lqBUSDBalance, setLqBUSDBalance] = useState('0')
  const [depositedAmount, setDepositedAmount] = useState('0')
  const [busdtDecimals, setBusdtDecimals] = useState(18)
  
  const [txStatus, setTxStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)
  
  const { account, provider, signer, chainId } = useWeb3()

  useEffect(() => {
    if (account && provider) {
      loadBalances()
    }
  }, [account, provider, chainId])

  const loadBalances = async () => {
    if (!account || !provider) return
    setIsLoading(true)

    try {
      // 1. Load BUSDT details
      const busdtContract = new ethers.Contract(CONTRACTS.BUSDT, BUSDT_ABI, provider)
      
      // Get decimals first to ensure correct formatting
      let decimals = 18
      try {
        decimals = Number(await busdtContract.decimals())
        setBusdtDecimals(decimals)
      } catch (e) {
        console.warn('Could not fetch decimals, defaulting to 18', e)
      }

      const busdtBal = await busdtContract.balanceOf(account)
      setBusdtBalance(ethers.formatUnits(busdtBal, decimals))

      // 2. Load lqBUSD balance and position
      if (CONTRACTS.POOL && CONTRACTS.LQBUSD) {
        const lqBUSDContract = new ethers.Contract(CONTRACTS.LQBUSD, LQBUSD_ABI, provider)
        const lqBal = await lqBUSDContract.balanceOf(account)
        setLqBUSDBalance(ethers.formatUnits(lqBal, 18)) // lqBUSD is standard 18

        const poolContract = new ethers.Contract(CONTRACTS.POOL, POOL_ABI, provider)
        const position = await poolContract.getLenderPosition(account)
        setDepositedAmount(ethers.formatUnits(position[0], 18))
      }
    } catch (error) {
      console.error('Error loading balances:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeposit = async () => {
    if (!account || !signer) {
      setTxStatus({ type: 'error', message: 'Please connect your wallet first' })
      return
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setTxStatus({ type: 'error', message: 'Please enter a valid amount' })
      return
    }

    setIsDepositing(true)
    setTxStatus(null)

    try {
      const amount = ethers.parseUnits(depositAmount, busdtDecimals)
      const busdtContract = new ethers.Contract(CONTRACTS.BUSDT, BUSDT_ABI, signer)
      const poolContract = new ethers.Contract(CONTRACTS.POOL, POOL_ABI, signer)

      // Check Allowance first
      setTxStatus({ type: 'info', message: 'Checking token allowance...' })
      const currentAllowance = await busdtContract.allowance(account, CONTRACTS.POOL)
      
      if (currentAllowance < amount) {
        setTxStatus({ type: 'info', message: 'Step 1/2: Please approve BUSDT usage in your wallet...' })
        
        // Explicit gas limit for approval
        const approveTx = await busdtContract.approve(CONTRACTS.POOL, amount, {
          gasLimit: 300000
        })
        
        setTxStatus({ type: 'info', message: 'Approving... Waiting for confirmation...' })
        await approveTx.wait()
        setTxStatus({ type: 'success', message: 'Approval successful! Proceeding to deposit...' })
      }

      // Deposit
      setTxStatus({ type: 'info', message: 'Step 2/2: Confirm deposit transaction...' })
      
      // Explicit gas limit for deposit
      const depositTx = await poolContract.deposit(amount, {
        gasLimit: 500000
      })
      
      setTxStatus({ type: 'info', message: 'Depositing... Waiting for confirmation...' })
      const receipt = await depositTx.wait()

      setTxStatus({ 
        type: 'success', 
        message: `✅ Successfully deposited ${depositAmount} BUSDT! Tx: ${receipt.hash.slice(0, 10)}...` 
      })
      
      setDepositAmount('')
      await loadBalances()
    } catch (error: unknown) {
      console.error('Deposit error:', error)
      
      let errorMessage = 'Transaction failed'
      if (error instanceof Error) {
        if (error.message.includes('user rejected')) {
          errorMessage = 'Transaction rejected by user'
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient BNB for gas fees'
        } else if (error.message.includes('Ownable')) {
          errorMessage = 'Contract Permission Error: Pool cannot mint tokens.'
        } else {
          errorMessage = error.message.slice(0, 100) + (error.message.length > 100 ? '...' : '')
        }
      }
      
      setTxStatus({ type: 'error', message: `❌ ${errorMessage}` })
    } finally {
      setIsDepositing(false)
    }
  }

  const handleRedeem = async () => {
    if (!account || !signer) {
      setTxStatus({ type: 'error', message: 'Please connect your wallet first' })
      return
    }

    if (!redeemAmount || parseFloat(redeemAmount) <= 0) {
      setTxStatus({ type: 'error', message: 'Please enter a valid amount' })
      return
    }

    setIsRedeeming(true)
    setTxStatus(null)

    try {
      const amount = ethers.parseUnits(redeemAmount, 18) // lqBUSD is 18 decimals

      setTxStatus({ type: 'info', message: 'Withdrawing from pool...' })
      const poolContract = new ethers.Contract(CONTRACTS.POOL, POOL_ABI, signer)
      
      const withdrawTx = await poolContract.withdraw(amount, {
        gasLimit: 500000
      })
      
      const receipt = await withdrawTx.wait()

      setTxStatus({ 
        type: 'success', 
        message: `✅ Successfully redeemed ${redeemAmount} lqBUSD! Tx: ${receipt.hash.slice(0, 10)}...` 
      })
      
      setRedeemAmount('')
      await loadBalances()
    } catch (error: unknown) {
      console.error('Redeem error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed'
      setTxStatus({ type: 'error', message: `❌ ${errorMessage}` })
    } finally {
      setIsRedeeming(false)
    }
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
          <h1 className="text-3xl font-bold text-neo-white">LENDER DASHBOARD</h1>
          <WalletButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {!account ? (
          /* Connection Prompt */
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-neo-pink border-brutal p-12 shadow-brutal-lg max-w-2xl text-center">
              <Wallet className="w-24 h-24 mx-auto mb-6 text-neo-black" />
              <h2 className="text-4xl font-bold text-neo-black mb-4">CONNECT YOUR WALLET</h2>
              <p className="text-xl text-neo-black font-mono mb-8">
                Connect your MetaMask wallet to start lending and earning yield on your BUSDT deposits.
              </p>
              <p className="text-sm text-neo-black font-mono mt-6">
                Make sure you're on BSC Testnet
              </p>
            </div>
          </div>
        ) : (
          /* Connected State - Dashboard Content */
          <>
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
                { label: 'BUSDT BALANCE', value: `${parseFloat(busdtBalance).toFixed(2)} BUSDT`, icon: DollarSign, color: 'bg-neo-pink' },
                { label: 'lqBUSD BALANCE', value: `${parseFloat(lqBUSDBalance).toFixed(2)} lqBUSD`, icon: Wallet, color: 'bg-neo-cyan' },
                { label: 'DEPOSITED', value: `${parseFloat(depositedAmount).toFixed(2)} BUSDT`, icon: TrendingUp, color: 'bg-neo-yellow' },
                { label: 'CURRENT APY', value: '6.2%', icon: ArrowUpRight, color: 'bg-neo-green' },
              ].map((stat, idx) => (
                <div key={idx} className={`${stat.color} border-brutal p-6 shadow-brutal relative overflow-hidden`}>
                  {isLoading && <div className="absolute top-2 right-2"><RefreshCw className="w-4 h-4 animate-spin text-neo-black opacity-50"/></div>}
                  <stat.icon className="w-8 h-8 mb-3 text-neo-black" />
                  <p className="text-sm font-bold text-neo-black mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-neo-black">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Deposit Card */}
              <div className="bg-neo-pink border-brutal p-8 shadow-brutal-lg">
                <div className="flex items-center gap-3 mb-6">
                  <ArrowUpRight className="w-8 h-8 text-neo-black" />
                  <h2 className="text-3xl font-bold text-neo-black">DEPOSIT BUSDT</h2>
                </div>
                <p className="text-neo-black font-mono mb-6">
                  Deposit BUSDT into the AHAN pool and receive lqBUSD tokens (1:1 ratio). Start earning yield immediately.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-neo-black mb-2">AMOUNT (BUSDT)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-neo-white border-brutal p-4 text-2xl font-bold text-neo-black focus:outline-none"
                      disabled={isDepositing}
                    />
                    <button 
                      onClick={() => setDepositAmount(busdtBalance)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-neo-black text-neo-white px-2 py-1 hover:bg-gray-800"
                    >
                      MAX
                    </button>
                  </div>
                  <p className="text-xs text-neo-black font-mono mt-2">
                    Available: {parseFloat(busdtBalance).toFixed(4)} BUSDT
                  </p>
                </div>
                <button
                  onClick={handleDeposit}
                  disabled={!depositAmount || isDepositing}
                  className="w-full bg-neo-black text-neo-white px-6 py-4 border-brutal font-bold text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDepositing ? 'PROCESSING...' : 'DEPOSIT NOW'}
                </button>
              </div>

              {/* Redeem Card */}
              <div className="bg-neo-cyan border-brutal p-8 shadow-brutal-lg">
                <div className="flex items-center gap-3 mb-6">
                  <ArrowDownRight className="w-8 h-8 text-neo-black" />
                  <h2 className="text-3xl font-bold text-neo-black">REDEEM lqBUSD</h2>
                </div>
                <p className="text-neo-black font-mono mb-6">
                  Redeem your lqBUSD tokens for the underlying BUSDT plus accrued interest. Available anytime.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-neo-black mb-2">AMOUNT (lqBUSD)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={redeemAmount}
                      onChange={(e) => setRedeemAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-neo-white border-brutal p-4 text-2xl font-bold text-neo-black focus:outline-none"
                      disabled={isRedeeming}
                    />
                    <button 
                      onClick={() => setRedeemAmount(lqBUSDBalance)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-neo-black text-neo-white px-2 py-1 hover:bg-gray-800"
                    >
                      MAX
                    </button>
                  </div>
                  <p className="text-xs text-neo-black font-mono mt-2">
                    Available: {parseFloat(lqBUSDBalance).toFixed(4)} lqBUSD
                  </p>
                </div>
                <button
                  onClick={handleRedeem}
                  disabled={!redeemAmount || isRedeeming}
                  className="w-full bg-neo-black text-neo-white px-6 py-4 border-brutal font-bold text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRedeeming ? 'PROCESSING...' : 'REDEEM NOW'}
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-neo-yellow border-brutal p-6 shadow-brutal">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-6 h-6 text-neo-black" />
                <h3 className="text-xl font-bold text-neo-black">CONTRACT INFO</h3>
              </div>
              <ul className="space-y-2 text-neo-black font-mono text-sm break-all">
                <li>• BUSDT: {CONTRACTS.BUSDT}</li>
                <li>• POOL: {CONTRACTS.POOL}</li>
                <li>• lqBUSD: {CONTRACTS.LQBUSD}</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LenderDashboard
