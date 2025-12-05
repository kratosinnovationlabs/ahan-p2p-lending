import React from 'react'
import { Wallet, AlertCircle, RefreshCw } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'

function WalletButton() {
  const { account, chainId, isConnecting, error, connectWallet, disconnectWallet } = useWeb3()

  const BSC_TESTNET_CHAIN_ID = 97

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isCorrectNetwork = chainId === BSC_TESTNET_CHAIN_ID

  if (account) {
    return (
      <div className="flex items-center gap-3">
        {!isCorrectNetwork && (
          <div className="bg-neo-pink border-brutal px-4 py-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-neo-black" />
            <span className="font-bold text-neo-black text-sm">WRONG NETWORK</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-neo-cyan text-neo-black px-4 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Switch Account"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={disconnectWallet}
            className={`${isCorrectNetwork ? 'bg-neo-green' : 'bg-neo-pink'} text-neo-black px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2`}
          >
            <Wallet className="w-5 h-5" />
            <span>{formatAddress(account)}</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="bg-neo-pink text-neo-black px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wallet className="w-5 h-5" />
        {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
      </button>
      {error && (
        <div className="bg-neo-pink border-brutal px-4 py-2 max-w-xs">
          <p className="text-sm font-bold text-neo-black">{error}</p>
        </div>
      )}
    </div>
  )
}

export default WalletButton
