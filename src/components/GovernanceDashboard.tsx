import React, { useState } from 'react'
import { ArrowLeft, Shield, Users, FileText, AlertTriangle, TrendingUp, DollarSign, Activity, Clock, CheckCircle, XCircle, Plus, Eye, Ban, Edit } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import WalletButton from './WalletButton'
import AddFieldOfficerModal from './governance/AddFieldOfficerModal'
import AddCoopModal from './governance/AddCoopModal'
import LoanDetailsModal from './governance/LoanDetailsModal'
import EditFieldOfficerModal from './governance/EditFieldOfficerModal'

interface GovernanceDashboardProps {
  onBack: () => void
}

interface Loan {
  id: string
  coopWallet: string
  coopName: string
  farmerIdHash: string
  principal: string
  issuedDate: string
  dueDate: string
  daysPastDue: number
  status: 'active' | 'repaid' | 'defaulted'
  foAddress: string
  foName: string
  capUtilization: number
  flag: 'none' | 'yellow' | 'red'
}

interface FieldOfficer {
  address: string
  name: string
  coopAffiliation: string
  status: 'active' | 'revoked'
  dailyCap: string
  kycStatus: 'pending' | 'verified' | 'rejected'
  flaggedIncidents: number
}

interface Coop {
  wallet: string
  name: string
  totalBorrowed: string
  outstanding: string
  activeLoans: number
  delinquencyRate: number
  lastRepayment: string
  status: 'active' | 'paused'
  cap: string
}

interface Alert {
  id: string
  severity: 'info' | 'warn' | 'critical'
  message: string
  loanId?: string
  coopWallet?: string
  timestamp: string
  resolved: boolean
}

function GovernanceDashboard({ onBack }: GovernanceDashboardProps) {
  const { account } = useWeb3()
  const [activeTab, setActiveTab] = useState<'overview' | 'loans' | 'coops' | 'fos' | 'alerts' | 'audit'>('overview')
  const [showAddFOModal, setShowAddFOModal] = useState(false)
  const [showAddCoopModal, setShowAddCoopModal] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [selectedFO, setSelectedFO] = useState<FieldOfficer | null>(null)
  const [loanFilter, setLoanFilter] = useState<'all' | 'active' | 'overdue' | 'repaid'>('all')
  const [fieldOfficers, setFieldOfficers] = useState<FieldOfficer[]>([
    {
      address: '0xfo01...1234',
      name: 'Rajesh Kumar',
      coopAffiliation: 'Maharashtra Krishi Sahakari Mandal',
      status: 'active',
      dailyCap: '10,000',
      kycStatus: 'verified',
      flaggedIncidents: 0
    },
    {
      address: '0xfo02...2345',
      name: 'Amara Okonkwo',
      coopAffiliation: 'Kenya Farmers Cooperative Society',
      status: 'active',
      dailyCap: '15,000',
      kycStatus: 'verified',
      flaggedIncidents: 1
    }
  ])

  // Mock data - replace with real data from contracts/database
  const kpis = {
    totalPoolSize: '2,450,000',
    outstandingLoans: '1,850,000',
    lenderCount: 1247,
    avgUtilization: 75.5,
    reserveFund: '125,000',
    delinquencyRate: 2.3,
    activeCoops: 2,
    activeFOs: 47
  }

  const mockLoans: Loan[] = [
    {
      id: 'LOAN-001',
      coopWallet: '0x1234...5678',
      coopName: 'Maharashtra Krishi Sahakari Mandal',
      farmerIdHash: '0xabcd...ef01',
      principal: '5,000',
      issuedDate: '2024-01-10',
      dueDate: '2024-07-10',
      daysPastDue: 0,
      status: 'active',
      foAddress: '0xfo01...1234',
      foName: 'Rajesh Kumar',
      capUtilization: 45,
      flag: 'none'
    },
    {
      id: 'LOAN-002',
      coopWallet: '0x2345...6789',
      coopName: 'Kenya Farmers Cooperative Society',
      farmerIdHash: '0xbcde...f012',
      principal: '7,500',
      issuedDate: '2024-01-05',
      dueDate: '2024-01-20',
      daysPastDue: 15,
      status: 'active',
      foAddress: '0xfo02...2345',
      foName: 'Amara Okonkwo',
      capUtilization: 62,
      flag: 'yellow'
    },
    {
      id: 'LOAN-003',
      coopWallet: '0x1234...5678',
      coopName: 'Maharashtra Krishi Sahakari Mandal',
      farmerIdHash: '0xcdef...0123',
      principal: '3,200',
      issuedDate: '2023-12-01',
      dueDate: '2024-01-01',
      daysPastDue: 35,
      status: 'active',
      foAddress: '0xfo01...1234',
      foName: 'Rajesh Kumar',
      capUtilization: 28,
      flag: 'red'
    },
    {
      id: 'LOAN-004',
      coopWallet: '0x2345...6789',
      coopName: 'Kenya Farmers Cooperative Society',
      farmerIdHash: '0xdef0...1234',
      principal: '4,800',
      issuedDate: '2024-01-15',
      dueDate: '2024-07-15',
      daysPastDue: 0,
      status: 'active',
      foAddress: '0xfo02...2345',
      foName: 'Amara Okonkwo',
      capUtilization: 38,
      flag: 'none'
    }
  ]

  const mockCoops: Coop[] = [
    {
      wallet: '0x1234...5678',
      name: 'Maharashtra Krishi Sahakari Mandal',
      totalBorrowed: '45,000',
      outstanding: '22,500',
      activeLoans: 5,
      delinquencyRate: 8.5,
      lastRepayment: '2024-02-01',
      status: 'active',
      cap: '100,000'
    },
    {
      wallet: '0x2345...6789',
      name: 'Kenya Farmers Cooperative Society',
      totalBorrowed: '67,500',
      outstanding: '35,000',
      activeLoans: 8,
      delinquencyRate: 12.5,
      lastRepayment: '2024-01-28',
      status: 'active',
      cap: '150,000'
    }
  ]

  const mockAlerts: Alert[] = [
    {
      id: 'ALERT-001',
      severity: 'critical',
      message: 'LOAN-003 is 35 days overdue (Red flag) - Maharashtra Krishi Sahakari Mandal',
      loanId: 'LOAN-003',
      coopWallet: '0x1234...5678',
      timestamp: '2024-02-05 09:30',
      resolved: false
    },
    {
      id: 'ALERT-002',
      severity: 'warn',
      message: 'LOAN-002 is 15 days overdue (Yellow flag) - Kenya Farmers Cooperative Society',
      loanId: 'LOAN-002',
      coopWallet: '0x2345...6789',
      timestamp: '2024-02-04 14:20',
      resolved: false
    },
    {
      id: 'ALERT-003',
      severity: 'info',
      message: 'Reserve fund below 10% threshold',
      timestamp: '2024-02-03 11:15',
      resolved: false
    }
  ]

  const handleSaveFO = (oldAddress: string, newData: any) => {
    setFieldOfficers(prev => prev.map(fo => 
      fo.address === oldAddress 
        ? { ...fo, address: newData.newWalletAddress, name: newData.name, dailyCap: newData.dailyCap }
        : fo
    ))
  }

  const getFlagColor = (flag: string) => {
    switch (flag) {
      case 'yellow': return 'bg-neo-yellow'
      case 'red': return 'bg-red-500'
      default: return 'bg-neo-green'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'warn': return 'bg-neo-yellow'
      default: return 'bg-neo-cyan'
    }
  }

  const filteredLoans = mockLoans.filter(loan => {
    if (loanFilter === 'all') return true
    if (loanFilter === 'active') return loan.status === 'active' && loan.flag === 'none'
    if (loanFilter === 'overdue') return loan.flag === 'yellow' || loan.flag === 'red'
    if (loanFilter === 'repaid') return loan.status === 'repaid'
    return true
  })

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
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-neo-pink" />
            <h1 className="text-3xl font-bold text-neo-white">GOVERNANCE CONSOLE</h1>
          </div>
          <WalletButton />
        </div>
      </header>

      {!account && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-neo-yellow border-brutal p-8 shadow-brutal-lg">
            <p className="text-2xl font-bold text-neo-black text-center">
              Please connect your governance wallet to access the console
            </p>
          </div>
        </div>
      )}

      {account && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* KPI Dashboard */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-neo-pink border-brutal p-6 shadow-brutal">
              <DollarSign className="w-8 h-8 mb-3 text-neo-black" />
              <p className="text-sm font-bold text-neo-black mb-1">TOTAL POOL SIZE</p>
              <p className="text-3xl font-bold text-neo-black">${kpis.totalPoolSize}</p>
            </div>
            <div className="bg-neo-cyan border-brutal p-6 shadow-brutal">
              <TrendingUp className="w-8 h-8 mb-3 text-neo-black" />
              <p className="text-sm font-bold text-neo-black mb-1">OUTSTANDING LOANS</p>
              <p className="text-3xl font-bold text-neo-black">${kpis.outstandingLoans}</p>
            </div>
            <div className="bg-neo-yellow border-brutal p-6 shadow-brutal">
              <Users className="w-8 h-8 mb-3 text-neo-black" />
              <p className="text-sm font-bold text-neo-black mb-1">P2P LENDERS</p>
              <p className="text-3xl font-bold text-neo-black">{kpis.lenderCount}</p>
            </div>
            <div className="bg-neo-green border-brutal p-6 shadow-brutal">
              <Activity className="w-8 h-8 mb-3 text-neo-black" />
              <p className="text-sm font-bold text-neo-black mb-1">UTILIZATION</p>
              <p className="text-3xl font-bold text-neo-black">{kpis.avgUtilization}%</p>
            </div>
          </div>

          {/* Secondary KPIs */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-neo-white border-brutal p-4 shadow-brutal">
              <p className="text-sm font-bold text-neo-black mb-1">RESERVE FUND</p>
              <p className="text-2xl font-bold text-neo-black">${kpis.reserveFund}</p>
            </div>
            <div className="bg-neo-white border-brutal p-4 shadow-brutal">
              <p className="text-sm font-bold text-neo-black mb-1">30-DAY DELINQUENCY</p>
              <p className="text-2xl font-bold text-neo-black">{kpis.delinquencyRate}%</p>
            </div>
            <div className="bg-neo-white border-brutal p-4 shadow-brutal">
              <p className="text-sm font-bold text-neo-black mb-1">ACTIVE CO-OPS</p>
              <p className="text-2xl font-bold text-neo-black">{kpis.activeCoops}</p>
            </div>
            <div className="bg-neo-white border-brutal p-4 shadow-brutal">
              <p className="text-sm font-bold text-neo-black mb-1">ACTIVE FOs</p>
              <p className="text-2xl font-bold text-neo-black">{kpis.activeFOs}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'OVERVIEW', icon: Activity },
              { id: 'loans', label: 'OPEN LOANS', icon: FileText },
              { id: 'coops', label: 'CO-OPS', icon: Users },
              { id: 'fos', label: 'FIELD OFFICERS', icon: Shield },
              { id: 'alerts', label: 'ALERTS', icon: AlertTriangle },
              { id: 'audit', label: 'AUDIT LOG', icon: Clock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${activeTab === tab.id ? 'bg-neo-black text-neo-white' : 'bg-neo-white text-neo-black'} px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2 whitespace-nowrap`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Alerts */}
              <div className="bg-neo-pink border-brutal p-6 shadow-brutal-lg">
                <h3 className="text-2xl font-bold text-neo-black mb-4">RECENT ALERTS</h3>
                <div className="space-y-3">
                  {mockAlerts.slice(0, 3).map(alert => (
                    <div key={alert.id} className="bg-neo-white border-brutal p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`${getSeverityColor(alert.severity)} border-brutal p-3`}>
                          <AlertTriangle className="w-5 h-5 text-neo-black" />
                        </div>
                        <div>
                          <p className="font-bold text-neo-black">{alert.message}</p>
                          <p className="text-sm text-neo-black font-mono">{alert.timestamp}</p>
                        </div>
                      </div>
                      <button className="bg-neo-black text-neo-white px-4 py-2 border-brutal font-bold text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal">
                        VIEW
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-neo-cyan border-brutal p-6 shadow-brutal-lg">
                  <h3 className="text-2xl font-bold text-neo-black mb-4">QUICK ACTIONS</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowAddFOModal(true)}
                      className="w-full bg-neo-black text-neo-white px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      ADD FIELD OFFICER
                    </button>
                    <button 
                      onClick={() => setShowAddCoopModal(true)}
                      className="w-full bg-neo-black text-neo-white px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      ADD CO-OPERATIVE
                    </button>
                    <button className="w-full bg-neo-white text-neo-black px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center justify-center gap-2">
                      <Ban className="w-5 h-5" />
                      EMERGENCY PAUSE
                    </button>
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-neo-yellow border-brutal p-6 shadow-brutal-lg">
                  <h3 className="text-2xl font-bold text-neo-black mb-4">SYSTEM HEALTH</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neo-black">Pool Liquidity</span>
                      <span className="text-neo-black font-mono">HEALTHY</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neo-black">Smart Contracts</span>
                      <span className="text-neo-black font-mono">OPERATIONAL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neo-black">Overdue Loans</span>
                      <span className="text-neo-black font-mono">2 FLAGGED</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-neo-black">Reserve Coverage</span>
                      <span className="text-neo-black font-mono">6.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loans' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex gap-3">
                {['all', 'active', 'overdue', 'repaid'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setLoanFilter(filter as any)}
                    className={`${loanFilter === filter ? 'bg-neo-black text-neo-white' : 'bg-neo-white text-neo-black'} px-6 py-2 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal uppercase`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Loans Table */}
              <div className="bg-neo-white border-brutal shadow-brutal-lg overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neo-black">
                    <tr>
                      <th className="text-left p-4 text-neo-white font-bold">LOAN ID</th>
                      <th className="text-left p-4 text-neo-white font-bold">CO-OP</th>
                      <th className="text-left p-4 text-neo-white font-bold">PRINCIPAL</th>
                      <th className="text-left p-4 text-neo-white font-bold">ISSUED</th>
                      <th className="text-left p-4 text-neo-white font-bold">DUE DATE</th>
                      <th className="text-left p-4 text-neo-white font-bold">DAYS PAST DUE</th>
                      <th className="text-left p-4 text-neo-white font-bold">STATUS</th>
                      <th className="text-left p-4 text-neo-white font-bold">FO</th>
                      <th className="text-left p-4 text-neo-white font-bold">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLoans.map((loan, idx) => (
                      <tr key={loan.id} className={idx % 2 === 0 ? 'bg-neo-white' : 'bg-gray-50'}>
                        <td className="p-4 font-bold text-neo-black">{loan.id}</td>
                        <td className="p-4 text-neo-black font-mono text-sm">{loan.coopName}</td>
                        <td className="p-4 font-bold text-neo-black">${loan.principal}</td>
                        <td className="p-4 text-neo-black font-mono text-sm">{loan.issuedDate}</td>
                        <td className="p-4 text-neo-black font-mono text-sm">{loan.dueDate}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className={`${getFlagColor(loan.flag)} border-brutal px-3 py-1`}>
                              <span className="font-bold text-neo-black text-sm">
                                {loan.daysPastDue > 0 ? `+${loan.daysPastDue}` : loan.daysPastDue}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`${loan.status === 'active' ? 'bg-neo-green' : 'bg-neo-cyan'} border-brutal px-3 py-1 font-bold text-neo-black text-sm uppercase`}>
                            {loan.status}
                          </span>
                        </td>
                        <td className="p-4 text-neo-black font-mono text-sm">{loan.foName}</td>
                        <td className="p-4">
                          <button 
                            onClick={() => setSelectedLoan(loan)}
                            className="bg-neo-black text-neo-white px-4 py-2 border-brutal font-bold text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            VIEW
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'coops' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-neo-black">CO-OPERATIVE REGISTRY</h3>
                <button 
                  onClick={() => setShowAddCoopModal(true)}
                  className="bg-neo-black text-neo-white px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  ADD CO-OP
                </button>
              </div>

              <div className="space-y-4">
                {mockCoops.map(coop => (
                  <div key={coop.wallet} className="bg-neo-white border-brutal p-6 shadow-brutal">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-2xl font-bold text-neo-black mb-2">{coop.name}</h4>
                        <p className="text-sm text-neo-black font-mono">{coop.wallet}</p>
                      </div>
                      <div className={`${coop.status === 'active' ? 'bg-neo-green' : 'bg-neo-pink'} border-brutal px-4 py-2`}>
                        <span className="font-bold text-neo-black uppercase">{coop.status}</span>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-bold text-neo-black mb-1">TOTAL BORROWED</p>
                        <p className="text-xl font-bold text-neo-black">${coop.totalBorrowed}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neo-black mb-1">OUTSTANDING</p>
                        <p className="text-xl font-bold text-neo-black">${coop.outstanding}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neo-black mb-1">ACTIVE LOANS</p>
                        <p className="text-xl font-bold text-neo-black">{coop.activeLoans}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neo-black mb-1">DELINQUENCY RATE</p>
                        <p className="text-xl font-bold text-neo-black">{coop.delinquencyRate}%</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-neo-cyan text-neo-black px-4 py-2 border-brutal font-bold text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        ADJUST CAP
                      </button>
                      <button className="bg-neo-yellow text-neo-black px-4 py-2 border-brutal font-bold text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2">
                        <Ban className="w-4 h-4" />
                        PAUSE LOANS
                      </button>
                      <button className="bg-neo-pink text-neo-black px-4 py-2 border-brutal font-bold text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        FREEZE WALLET
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fos' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-neo-black">FIELD OFFICER REGISTRY</h3>
                <button 
                  onClick={() => setShowAddFOModal(true)}
                  className="bg-neo-black text-neo-white px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  ADD FIELD OFFICER
                </button>
              </div>

              <div className="bg-neo-white border-brutal shadow-brutal-lg overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neo-black">
                    <tr>
                      <th className="text-left p-4 text-neo-white font-bold">ADDRESS</th>
                      <th className="text-left p-4 text-neo-white font-bold">NAME</th>
                      <th className="text-left p-4 text-neo-white font-bold">CO-OP</th>
                      <th className="text-left p-4 text-neo-white font-bold">DAILY CAP</th>
                      <th className="text-left p-4 text-neo-white font-bold">KYC STATUS</th>
                      <th className="text-left p-4 text-neo-white font-bold">INCIDENTS</th>
                      <th className="text-left p-4 text-neo-white font-bold">STATUS</th>
                      <th className="text-left p-4 text-neo-white font-bold">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fieldOfficers.map((fo, idx) => (
                      <tr key={fo.address} className={idx % 2 === 0 ? 'bg-neo-white' : 'bg-gray-50'}>
                        <td className="p-4 text-neo-black font-mono text-sm">{fo.address}</td>
                        <td className="p-4 font-bold text-neo-black">{fo.name}</td>
                        <td className="p-4 text-neo-black font-mono text-sm">{fo.coopAffiliation}</td>
                        <td className="p-4 font-bold text-neo-black">${fo.dailyCap}</td>
                        <td className="p-4">
                          <span className={`${fo.kycStatus === 'verified' ? 'bg-neo-green' : 'bg-neo-yellow'} border-brutal px-3 py-1 font-bold text-neo-black text-sm uppercase`}>
                            {fo.kycStatus}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-neo-black">{fo.flaggedIncidents}</td>
                        <td className="p-4">
                          <span className={`${fo.status === 'active' ? 'bg-neo-green' : 'bg-neo-pink'} border-brutal px-3 py-1 font-bold text-neo-black text-sm uppercase`}>
                            {fo.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setSelectedFO(fo)}
                              className="bg-neo-cyan text-neo-black px-3 py-2 border-brutal font-bold text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal"
                            >
                              EDIT
                            </button>
                            <button className="bg-neo-pink text-neo-black px-3 py-2 border-brutal font-bold text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal">
                              REVOKE
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-neo-black">SYSTEM ALERTS</h3>
              {mockAlerts.map(alert => (
                <div key={alert.id} className="bg-neo-white border-brutal p-6 shadow-brutal">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`${getSeverityColor(alert.severity)} border-brutal p-4`}>
                        <AlertTriangle className="w-6 h-6 text-neo-black" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`${getSeverityColor(alert.severity)} border-brutal px-3 py-1 font-bold text-neo-black text-sm uppercase`}>
                            {alert.severity}
                          </span>
                          <span className="text-sm text-neo-black font-mono">{alert.timestamp}</span>
                        </div>
                        <p className="text-xl font-bold text-neo-black mb-2">{alert.message}</p>
                        {alert.loanId && (
                          <p className="text-sm text-neo-black font-mono">Loan ID: {alert.loanId}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-neo-black text-neo-white px-4 py-2 border-brutal font-bold text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal">
                        INVESTIGATE
                      </button>
                      <button className="bg-neo-green text-neo-black px-4 py-2 border-brutal font-bold text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        RESOLVE
                      </button>
                    </div>
                  </div>
                  {alert.severity === 'critical' && (
                    <div className="bg-neo-pink border-brutal p-4">
                      <p className="font-bold text-neo-black mb-2">RECOMMENDED ACTIONS:</p>
                      <ul className="list-disc list-inside text-neo-black font-mono text-sm space-y-1">
                        <li>Pause new disbursements to Co-op</li>
                        <li>Contact Field Officer for investigation</li>
                        <li>Review insurance fund claim eligibility</li>
                        <li>Initiate recovery workflow</li>
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-neo-black">AUDIT LOG</h3>
              <div className="bg-neo-white border-brutal shadow-brutal-lg">
                <div className="space-y-2 p-6">
                  {[
                    { action: 'Added Field Officer', user: '0xgov1...1234', target: 'Rajesh Kumar (0xfo01...1234)', timestamp: '2024-02-05 10:30', txHash: '0xabc...def' },
                    { action: 'Adjusted Co-op Cap', user: '0xgov2...2345', target: 'Maharashtra Krishi Sahakari Mandal', timestamp: '2024-02-04 15:20', txHash: '0xdef...ghi' },
                    { action: 'Added Field Officer', user: '0xgov1...1234', target: 'Amara Okonkwo (0xfo02...2345)', timestamp: '2024-02-03 09:15', txHash: '0xghi...jkl' },
                    { action: 'Registered Co-op', user: '0xgov3...3456', target: 'Kenya Farmers Cooperative Society', timestamp: '2024-02-02 14:45', txHash: '0xjkl...mno' },
                  ].map((entry, idx) => (
                    <div key={idx} className="bg-gray-50 border-brutal p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-neo-black text-lg">{entry.action}</p>
                          <p className="text-sm text-neo-black font-mono">Target: {entry.target}</p>
                        </div>
                        <span className="text-sm text-neo-black font-mono">{entry.timestamp}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-neo-black font-mono">By: {entry.user}</p>
                        <a href={`https://testnet.bscscan.com/tx/${entry.txHash}`} target="_blank" rel="noopener noreferrer" className="text-sm text-neo-black font-mono underline">
                          {entry.txHash}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showAddFOModal && <AddFieldOfficerModal onClose={() => setShowAddFOModal(false)} />}
      {showAddCoopModal && <AddCoopModal onClose={() => setShowAddCoopModal(false)} />}
      {selectedLoan && <LoanDetailsModal loan={selectedLoan} onClose={() => setSelectedLoan(null)} />}
      {selectedFO && (
        <EditFieldOfficerModal 
          fieldOfficer={selectedFO} 
          onClose={() => setSelectedFO(null)}
          onSave={handleSaveFO}
        />
      )}
    </div>
  )
}

export default GovernanceDashboard
