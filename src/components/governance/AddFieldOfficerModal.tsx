import React, { useState } from 'react'
import { X, Upload, CheckCircle } from 'lucide-react'

interface AddFieldOfficerModalProps {
  onClose: () => void
}

function AddFieldOfficerModal({ onClose }: AddFieldOfficerModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    publicKey: '',
    phone: '',
    email: '',
    coopAffiliation: '',
    dailyCap: '',
    monthlyCap: '',
    idDocs: null as File | null,
    proofOfEmployment: null as File | null,
    geoLocation: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement on-chain addApprovedFO call
    alert('Field Officer registration submitted for governance approval')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-neo-white border-brutal shadow-brutal-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-neo-black border-b-4 border-neo-black p-6 flex justify-between items-center sticky top-0">
          <h2 className="text-2xl font-bold text-neo-white">ADD FIELD OFFICER</h2>
          <button onClick={onClose} className="text-neo-white hover:text-neo-pink">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="bg-neo-cyan border-brutal p-6">
            <h3 className="text-xl font-bold text-neo-black mb-4">PERSONAL INFORMATION</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">FULL NAME *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">PUBLIC KEY / SIGNING ADDRESS *</label>
                <input
                  type="text"
                  required
                  value={formData.publicKey}
                  onChange={(e) => setFormData({...formData, publicKey: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none font-mono"
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">PHONE *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">EMAIL *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          {/* Co-op Affiliation */}
          <div className="bg-neo-yellow border-brutal p-6">
            <h3 className="text-xl font-bold text-neo-black mb-4">CO-OP AFFILIATION</h3>
            <div>
              <label className="block text-sm font-bold text-neo-black mb-2">SELECT CO-OPERATIVE *</label>
              <select
                required
                value={formData.coopAffiliation}
                onChange={(e) => setFormData({...formData, coopAffiliation: e.target.value})}
                className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
              >
                <option value="">SELECT CO-OP</option>
                <option value="green-valley">Green Valley Co-op</option>
                <option value="sunrise">Sunrise Farmers</option>
                <option value="highland">Highland Co-op</option>
                <option value="new">+ CREATE NEW CO-OP</option>
              </select>
            </div>
          </div>

          {/* Loan Caps */}
          <div className="bg-neo-pink border-brutal p-6">
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
                <label className="block text-sm font-bold text-neo-black mb-2">MONTHLY CAP (USD) *</label>
                <input
                  type="number"
                  required
                  value={formData.monthlyCap}
                  onChange={(e) => setFormData({...formData, monthlyCap: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                  placeholder="100000"
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-neo-green border-brutal p-6">
            <h3 className="text-xl font-bold text-neo-black mb-4">DOCUMENTS & VERIFICATION</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">ID DOCUMENTS *</label>
                <div className="bg-neo-white border-brutal p-4">
                  <input
                    type="file"
                    onChange={(e) => setFormData({...formData, idDocs: e.target.files?.[0] || null})}
                    className="w-full text-neo-black"
                  />
                  <p className="text-sm text-neo-black font-mono mt-2">Upload passport, national ID, or driver's license</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">PROOF OF EMPLOYMENT</label>
                <div className="bg-neo-white border-brutal p-4">
                  <input
                    type="file"
                    onChange={(e) => setFormData({...formData, proofOfEmployment: e.target.files?.[0] || null})}
                    className="w-full text-neo-black"
                  />
                  <p className="text-sm text-neo-black font-mono mt-2">Employment letter or contract</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neo-black mb-2">GEO-VERIFIED LOCATION</label>
                <input
                  type="text"
                  value={formData.geoLocation}
                  onChange={(e) => setFormData({...formData, geoLocation: e.target.value})}
                  className="w-full bg-neo-white border-brutal p-3 text-neo-black focus:outline-none"
                  placeholder="Latitude, Longitude (optional)"
                />
              </div>
            </div>
          </div>

          {/* KYC Notice */}
          <div className="bg-neo-cyan border-brutal p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-neo-black flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-neo-black mb-2">KYC VERIFICATION REQUIRED</p>
                <p className="text-sm text-neo-black font-mono">
                  Before on-chain registration, this Field Officer will undergo KYC verification through our third-party provider. 
                  Documents will be stored securely with hashes recorded on-chain.
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

export default AddFieldOfficerModal
