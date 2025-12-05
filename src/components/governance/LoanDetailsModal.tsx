import React from 'react'
import { X, AlertTriangle, Send, Ban, CheckCircle } from 'lucide-react'

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

interface LoanDetailsModalProps {
  loan: Loan
  onClose: () => void
}

function LoanDetailsModal({ loan, onClose }: LoanDetailsModalProps) {
  const getFlagColor = (flag: string) => {
    switch (flag) {
      case 'yellow': return 'bg-neo-yellow'
      case 'red': return 'bg-red-500'
      default: return 'bg-neo-green'
    }
  }

  const handleSendNotice = () => {
    alert(`Sending payment reminder to ${loan.coopName}`)
  }

  const handleEscalate = () => {
    alert(`Escalating ${loan.id} to governance multisig`)
  }

  const handlePauseDisbursements = () => {
    alert(`Pausing new disbursements to ${loan.coopName}`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-neo-white border-brutal shadow-brutal-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-neo-black border-b-4 border-neo-black p-6 flex justify-between items-center sticky top-0">
          <h2 className="text-2xl font-bold text-neo-white">LOAN DETAILS: {loan.id}</h2>
          <button onClick={onClose} className="text-neo-white hover:text-neo-pink">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Banner */}
          {loan.flag !== 'none' && (
            <div className={`${getFlagColor(loan.flag)} border-brutal p-6`}>
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-neo-black flex-shrink-0" />
                <div>
                  <p className="text-2xl font-bold text-neo-black mb-2">
                    {loan.flag === 'yellow' ? 'PAYMENT OVERDUE (YELLOW FLAG)' : 'CRITICAL: 30+ DAYS OVERDUE (RED FLAG)'}
                  </p>
                  <p className="text-neo-black font-mono">
                    This loan is {loan.daysPastDue} days past due. Immediate action required.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loan Information */}
          <div className="bg-neo-cyan border-brutal p-6">
            <h3 className="text-xl font-bold text-neo-black mb-4">LOAN INFORMATION</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-bold text-neo-black mb-1">LOAN ID</p>
                <p className="text-xl font-bold text-neo-black">{loan.id}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-neo-black mb-1">PRINCIPAL AMOUNT</p>
                <p className="text-xl font-bold text-neo-black">${loan.principal}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-neo-black mb-1">ISSUED DATE</p>
                <p className="text-xl font-bold text-neo-black">{loan.issuedDate}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-neo-black mb-1">DUE DATE</p>
                <p className="text-xl font-bold text-neo-black">{loan.dueDate}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-neo-black mb-1">DAYS PAST DUE</p>
                <p className="text-xl font-bold text-neo-black">{loan.daysPastDue > 0 ? `+${loan.daysPastDue}` : loan.daysPastDue}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-neo-black mb-1">STATUS</p>
                <span className={`${loan.status === 'active' ? 'bg-neo-green' : 'bg-neo-pink'} border-brutal px-3 py-1 font-bold text-neo-black uppercase inline-block`}>
                  {loan.status}
                </span>
              </div>
            </div>
          </div>

          {/* Co-op & FO Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-neo-pink border-brutal p-6">
              <h3 className="text-xl font-bold text-neo-black mb-4">CO-OPERATIVE</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-neo-black mb-1">NAME</p>
                  <p className="text-lg font-bold text-neo-black">{loan.coopName}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-neo-black mb-1">WALLET ADDRESS</p>
                  <p className="text-sm font-mono text-neo-black">{loan.coopWallet}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-neo-black mb-1">CAP UTILIZATION</p>
                  <p className="text-lg font-bold text-neo-black">{loan.capUtilization}%</p>
                </div>
              </div>
            </div>

            <div className="bg-neo-yellow border-brutal p-6">
              <h3 className="text-xl font-bold text-neo-black mb-4">FIELD OFFICER</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-neo-black mb-1">NAME</p>
                  <p className="text-lg font-bold text-neo-black">{loan.foName}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-neo-black mb-1">ADDRESS</p>
                  <p className="text-sm font-mono text-neo-black">{loan.foAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-neo-black mb-1">FARMER ID HASH</p>
                  <p className="text-sm font-mono text-neo-black">{loan.farmerIdHash}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          {loan.flag !== 'none' && (
            <div className="bg-neo-green border-brutal p-6">
              <h3 className="text-xl font-bold text-neo-black mb-4">RECOMMENDED ACTIONS</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleSendNotice}
                  className="w-full bg-neo-black text-neo-white px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  SEND PAYMENT REMINDER
                </button>
                <button 
                  onClick={handleEscalate}
                  className="w-full bg-neo-yellow text-neo-black px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5" />
                  ESCALATE TO GOVERNANCE
                </button>
                {loan.flag === 'red' && (
                  <button 
                    onClick={handlePauseDisbursements}
                    className="w-full bg-red-500 text-neo-white px-6 py-3 border-brutal font-bold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center justify-center gap-2"
                  >
                    <Ban className="w-5 h-5" />
                    PAUSE CO-OP DISBURSEMENTS
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action History */}
          <div className="bg-neo-white border-brutal p-6">
            <h3 className="text-xl font-bold text-neo-black mb-4">ACTION HISTORY</h3>
            <div className="space-y-2">
              {[
                { action: 'Loan disbursed', timestamp: loan.issuedDate, user: 'System' },
                { action: 'Payment reminder sent', timestamp: '2024-02-01', user: 'Governance' },
                { action: 'Yellow flag triggered', timestamp: '2024-02-03', user: 'System' },
              ].map((entry, idx) => (
                <div key={idx} className="bg-gray-50 border-brutal p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-neo-black">{entry.action}</p>
                    <p className="text-sm text-neo-black font-mono">By: {entry.user}</p>
                  </div>
                  <p className="text-sm text-neo-black font-mono">{entry.timestamp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-neo-black text-neo-white px-6 py-4 border-brutal font-bold text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoanDetailsModal
