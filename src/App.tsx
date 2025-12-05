import React, { useState } from 'react'
import { Wallet, TrendingUp, Users, FileText, DollarSign, ArrowRight, Github, BookOpen, Shield } from 'lucide-react'
import { Web3Provider } from './contexts/Web3Context'
import WalletButton from './components/WalletButton'
import LenderDashboard from './components/LenderDashboard'
import CoopDashboard from './components/CoopDashboard'
import GovernanceDashboard from './components/GovernanceDashboard'
import Documentation from './components/Documentation'
import SmartContracts from './components/SmartContracts'

type View = 'home' | 'lender' | 'coop' | 'governance' | 'docs' | 'contracts'

function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  )
}

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('home')

  const renderView = () => {
    switch (currentView) {
      case 'lender':
        return <LenderDashboard onBack={() => setCurrentView('home')} />
      case 'coop':
        return <CoopDashboard onBack={() => setCurrentView('home')} />
      case 'governance':
        return <GovernanceDashboard onBack={() => setCurrentView('home')} />
      case 'docs':
        return <Documentation onBack={() => setCurrentView('home')} />
      case 'contracts':
        return <SmartContracts onBack={() => setCurrentView('home')} />
      default:
        return <HomePage setView={setCurrentView} />
    }
  }

  return (
    <div className="min-h-screen bg-neo-white">
      {renderView()}
    </div>
  )
}

function HomePage({ setView }: { setView: (view: View) => void }) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-neo-black border-b-4 border-neo-black p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-neo-pink p-3 border-brutal">
              <Wallet className="w-8 h-8 text-neo-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neo-white">AHAN</h1>
              <p className="text-neo-cyan text-sm font-mono">P2P LENDING PROTOCOL</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setView('governance')}
              className="bg-neo-pink text-neo-black px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2"
            >
              <Shield className="w-5 h-5" />
              GOVERNANCE
            </button>
            <button 
              onClick={() => setView('docs')}
              className="bg-neo-white text-neo-black px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              DOCS
            </button>
            <button 
              onClick={() => setView('contracts')}
              className="bg-neo-cyan text-neo-black px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              CONTRACTS
            </button>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-neo-pink border-b-4 border-neo-black py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-6xl font-bold text-neo-black mb-6 leading-tight">
                DECENTRALIZED LENDING FOR FARMERS
              </h2>
              <p className="text-2xl text-neo-black font-mono mb-8">
                Connect P2P lenders with farmer cooperatives on BNB Chain. Transparent. Efficient. Impactful.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setView('lender')}
                  className="bg-neo-black text-neo-white px-8 py-4 border-brutal font-bold text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal-lg flex items-center gap-2"
                >
                  START LENDING
                  <ArrowRight className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setView('coop')}
                  className="bg-neo-white text-neo-black px-8 py-4 border-brutal font-bold text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal-lg flex items-center gap-2"
                >
                  BORROW NOW
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="bg-neo-cyan border-brutal p-8 shadow-brutal-lg">
              <img 
                src="https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Farmer in field"
                className="w-full border-brutal"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-neo-yellow border-b-4 border-neo-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'TOTAL VALUE LOCKED', value: '$2.4M', icon: DollarSign },
              { label: 'ACTIVE LENDERS', value: '1,247', icon: Users },
              { label: 'LOANS DISBURSED', value: '856', icon: FileText },
              { label: 'AVG APY', value: '6.2%', icon: TrendingUp },
            ].map((stat, idx) => (
              <div key={idx} className="bg-neo-white border-brutal p-6 shadow-brutal">
                <stat.icon className="w-8 h-8 mb-3 text-neo-black" />
                <p className="text-sm font-bold text-neo-black mb-1">{stat.label}</p>
                <p className="text-4xl font-bold text-neo-black">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-neo-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-neo-black mb-12 text-center">HOW IT WORKS</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'LENDERS DEPOSIT',
                desc: 'P2P lenders deposit bUSD into the AHAN pool and receive lqBUSD tokens representing their share',
                color: 'bg-neo-pink',
              },
              {
                step: '02',
                title: 'COOPS BORROW',
                desc: 'Farmer cooperatives request loans with Field Officer attestation. Funds are disbursed on-chain',
                color: 'bg-neo-cyan',
              },
              {
                step: '03',
                title: 'EARN YIELD',
                desc: 'As loans are repaid with interest, lenders earn ~6% APY. Redeem lqBUSD anytime for bUSD',
                color: 'bg-neo-yellow',
              },
            ].map((item, idx) => (
              <div key={idx} className={`${item.color} border-brutal p-8 shadow-brutal-lg`}>
                <div className="text-6xl font-bold text-neo-black mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold text-neo-black mb-4">{item.title}</h3>
                <p className="text-lg text-neo-black font-mono">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-neo-black border-t-4 border-neo-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-neo-white mb-12 text-center">KEY FEATURES</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'LIQUID RECEIPT TOKENS', desc: 'lqBUSD tokens are tradeable and redeemable anytime' },
              { title: 'FIELD OFFICER ATTESTATION', desc: 'On-chain verification ensures loan legitimacy' },
              { title: 'TRANSPARENT ACCOUNTING', desc: 'All transactions recorded immutably on BNB Chain' },
              { title: 'AUTOMATED YIELD DISTRIBUTION', desc: 'Interest accrues automatically to lqBUSD holders' },
              { title: 'MULTISIG SECURITY', desc: 'Co-op wallets use multisig for enhanced security' },
              { title: 'GASLESS TRANSACTIONS', desc: 'Optional relayer for seamless user experience' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-neo-white border-brutal p-6 shadow-brutal">
                <h3 className="text-xl font-bold text-neo-black mb-3">{feature.title}</h3>
                <p className="text-neo-black font-mono">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neo-pink border-t-4 border-neo-black py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-2xl font-bold text-neo-black mb-4">AHAN PROTOCOL</p>
          <p className="text-neo-black font-mono mb-6">Empowering farmers through decentralized finance</p>
          <div className="flex justify-center gap-4">
            <button className="bg-neo-black text-neo-white px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal">
              GITHUB
            </button>
            <button className="bg-neo-white text-neo-black px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal">
              TWITTER
            </button>
            <button className="bg-neo-cyan text-neo-black px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal">
              DISCORD
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
