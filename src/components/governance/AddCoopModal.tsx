import React, { useState } from 'react'
import { X, Upload } from 'lucide-react'

interface AddCoopModalProps {
  onClose: () => void
}

function AddCoopModal({ onClose }: AddCoopModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    multisigWallet: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    maxExposure: '',
    country: '',
    riskTier: 'medium',
    registrationDocs: null as File | null,
    accountDetails: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement on-chain registerCoop call
    alert('Co-operative registration submitted for governance approval')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-neo-white border-brutal shadow-brutal-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-neo-black border-b-4 border-neo-black p-6 flex justify-between items-center sticky top-0">
          <h2 className="text-2xl font-bold text-neo-white">ADD CO-OPERATIVE</h2>
          <button onClick={onClose} className="text-neo-white hover:text-neo-pink">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-neo-pink border-brutal p-6">
            <h3 className="text-xl font-bold text-neo-black mb-4">BASIC INFORMATION</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">CO-OP NAME *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                  placeholder="Green Valley Co-operative"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">MULTISIG WALLET ADDRESS *</label>
                <input
                  type="text"
                  required
                  value={formData.multisigWallet}
                  onChange={(e) => setFormData({...formData, multisigWallet: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none font-mono"
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">COUNTRY / JURISDICTION *</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                  placeholder="Kenya"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">RISK TIER *</label>
                <select
                  required
                  value={formData.riskTier}
                  onChange={(e) => setFormData({...formData, riskTier: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                >
                  <option value="low">LOW RISK</option>
                  <option value="medium">MEDIUM RISK</option>
                  <option value="high">HIGH RISK</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-neo-cyan border-brutal p-6">
            <h3 className="text-xl font-bold text-neo-black mb-4">CONTACT INFORMATION</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">CONTACT PERSON *</label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">EMAIL *</label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                  placeholder="contact@coop.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">PHONE *</label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="bg-neo-yellow border-brutal p-6">
            <h3 className="text-xl font-bold text-neo-black mb-4">FINANCIAL SETTINGS</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">MAX EXPOSURE LIMIT (USD) *</label>
                <input
                  type="number"
                  required
                  value={formData.maxExposure}
                  onChange={(e) => setFormData({...formData, maxExposure: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                  placeholder="100000"
                />
                <p className="text-sm text-neo-black font-mono mt-2">Maximum total outstanding loans</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">FIAT SETTLEMENT ACCOUNT</label>
                <textarea
                  value={formData.accountDetails}
                  onChange={(e) => setFormData({...formData, accountDetails: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                  rows={3}
                  placeholder="Bank name, account number, routing details..."
                />
              </div>
            </div>
          </div>

          {/* Legal Documents */}
          <div className="bg-neo-green border-brutal p-6">
            <h3 className="text-xl font-bold text-neo-black mb-4">LEGAL DOCUMENTS</h3>
            <div>
              <label className="block text-sm font-bold text-neo-black mb-2">REGISTRATION DOCUMENTS *</label>
              <div className="bg-neo-white border-brutal p-4">
                <input
                  type="file"
                  onChange={(e) => setFormData({...formData, registrationDocs: e.target.files?.[0] || null})}
                  className="w-full text-neo-black"
                />
                <p className="text-sm text-neo-black font-mono mt-2">
                  Upload certificate of incorporation, bylaws, or registration documents
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neo-white text-neo-black px-6 py-4 border-brutal font-bold text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 bg-neo-black text-neo-white px-6 py-4 border-brutal font-bold text-xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-brutal flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              SUBMIT FOR APPROVAL
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCoopModal
