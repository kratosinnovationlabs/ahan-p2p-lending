import React, { useState } from 'react'
import { X, Save, AlertTriangle } from 'lucide-react'

interface EditFieldOfficerModalProps {
  fieldOfficer: {
    address: string
    name: string
    coopAffiliation: string
    dailyCap: string
    status: 'active' | 'revoked'
  }
  onClose: () => void
  onSave: (oldAddress: string, newData: any) => void
}

function EditFieldOfficerModal({ fieldOfficer, onClose, onSave }: EditFieldOfficerModalProps) {
  const [formData, setFormData] = useState({
    newWalletAddress: fieldOfficer.address,
    name: fieldOfficer.name,
    dailyCap: fieldOfficer.dailyCap,
    monthlyCap: ''
  })
  const [showConfirmation, setShowConfirmation] = useState(false)

  const isWalletAddressChanged = formData.newWalletAddress !== fieldOfficer.address

  const validateEthereumAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isWalletAddressChanged && !validateEthereumAddress(formData.newWalletAddress)) {
      alert('Invalid Ethereum address format. Must be 42 characters starting with 0x')
      return
    }

    if (isWalletAddressChanged && !showConfirmation) {
      setShowConfirmation(true)
      return
    }

    // TODO: Implement on-chain updateFOAddress call
    onSave(fieldOfficer.address, formData)
    alert('Field Officer updated successfully. Wallet address change will be recorded in audit log.')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-neo-white border-brutal shadow-brutal-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-neo-black border-b-4 border-neo-black p-6 flex justify-between items-center sticky top-0">
          <h2 className="text-2xl font-bold text-neo-white">EDIT FIELD OFFICER</h2>
          <button onClick={onClose} className="text-neo-white hover:text-neo-pink">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Information */}
          <div className="bg-neo-cyan border-brutal p-6">
            <h3 className="text-xl font-bold text-neo-black mb-4">CURRENT INFORMATION</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">CURRENT WALLET ADDRESS</label>
                <div className="bg-neo-white border-brutal p-3">
                  <p className="text-neo-black font-mono text-sm">{fieldOfficer.address}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">CO-OP AFFILIATION</label>
                <div className="bg-neo-white border-brutal p-3">
                  <p className="text-neo-black font-mono text-sm">{fieldOfficer.coopAffiliation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Address Update */}
          <div className="bg-neo-pink border-brutal p-6">
            <h3 className="text-xl font-bold text-neo-black mb-4">UPDATE WALLET ADDRESS</h3>
            <div>
              <label className="block text-sm font-bold text-neo-black mb-2">NEW WALLET ADDRESS *</label>
              <input
                type="text"
                required
                value={formData.newWalletAddress}
                onChange={(e) => setFormData({...formData, newWalletAddress: e.target.value})}
                className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none font-mono"
                placeholder="0x..."
              />
              {isWalletAddressChanged && (
                <div className="mt-3 bg-neo-yellow border-brutal p-3 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-neo-black flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-neo-black">WALLET ADDRESS CHANGE DETECTED</p>
                    <p className="text-xs text-neo-black font-mono mt-1">
                      This will update the borrowing wallet for this Field Officer. The old address will be preserved in the audit log.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-neo-yellow border-brutal p-6">
            <h3 className="text-xl font-bold text-neo-black mb-4">PERSONAL INFORMATION</h3>
            <div>
              <label className="block text-sm font-bold text-neo-black mb-2">FULL NAME *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Loan Caps */}
          <div className="bg-neo-green border-brutal p-6">
            <h3 className="text-xl font-bold text-neo-black mb-4">LOAN ORIGINATION CAPS</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">DAILY CAP (USD) *</label>
                <input
                  type="number"
                  required
                  value={formData.dailyCap}
                  onChange={(e) => setFormData({...formData, dailyCap: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">MONTHLY CAP (USD)</label>
                <input
                  type="number"
                  value={formData.monthlyCap}
                  onChange={(e) => setFormData({...formData, monthlyCap: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                  placeholder="100000"
                />
              </div>
            </div>
          </div>

          {/* Confirmation Warning */}
          {showConfirmation && isWalletAddressChanged && (
            <div className="bg-red-500 border-brutal p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-8 h-8 text-neo-white flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-neo-white text-xl mb-3">CONFIRM WALLET ADDRESS CHANGE</p>
                  <div className="space-y-2 text-neo-white font-mono text-sm mb-4">
                    <p><strong>OLD ADDRESS:</strong> {fieldOfficer.address}</p>
                    <p><strong>NEW ADDRESS:</strong> {formData.newWalletAddress}</p>
                  </div>
                  <p className="text-neo-white font-bold mb-2">IMPORTANT NOTES:</p>
                  <ul className="list-disc list-inside text-neo-white text-sm space-y-1">
                    <li>This Field Officer will use the new wallet for all future borrowing operations</li>
                    <li>The old wallet address will be preserved in the audit log</li>
                    <li>Ensure the new wallet is controlled by the Field Officer</li>
                    <li>This action will be recorded on-chain and cannot be easily reversed</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neo-white text-neo-black px-6 py-4 border-brutal font-bold text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal"
            >
              CANCEL
            </button>
            {showConfirmation && isWalletAddressChanged ? (
              <button
                type="submit"
                className="flex-1 bg-red-500 text-neo-white px-6 py-4 border-brutal font-bold text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                CONFIRM & SAVE CHANGES
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 bg-neo-black text-neo-white px-6 py-4 border-brutal font-bold text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {isWalletAddressChanged ? 'REVIEW CHANGES' : 'SAVE CHANGES'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditFieldOfficerModal
