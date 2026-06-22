import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('details') // 'details' | 'otp'
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    gender: 'male',
    village: '',
  })
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isLoggedIn) {
    navigate('/')
    return null
  }

  const update = (field) => (e) => {
    const value = field === 'mobileNumber' ? e.target.value.replace(/\D/g, '') : e.target.value
    setForm((f) => ({ ...f, [field]: value }))
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!form.firstName || !form.lastName) { setError('Enter your first and last name'); return }
    if (form.mobileNumber.length !== 10) { setError('Enter a valid 10-digit mobile number'); return }
    setLoading(true)
    setError('')
    try {
      await authApi.sendOtp(form.mobileNumber)
      setStep('otp')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!otp) { setError('Enter the OTP'); return }
    setLoading(true)
    setError('')
    try {
      const data = await authApi.register({ ...form, otp })
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🌾</div>
          <h1 className="text-3xl font-bold text-primary-700">OoruMitra</h1>
          <p className="text-gray-500 mt-1">Rural Marketplace & Services</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {step === 'details' ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Create Account</h2>
              <p className="text-sm text-gray-500 mb-6">Fill in your details to get started</p>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" className="input" value={form.firstName} onChange={update('firstName')} autoFocus />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" className="input" value={form.lastName} onChange={update('lastName')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      className="input rounded-l-none"
                      placeholder="9000000000"
                      value={form.mobileNumber}
                      onChange={update('mobileNumber')}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                  <input type="email" className="input" value={form.email} onChange={update('email')} />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select className="input" value={form.gender} onChange={update('gender')}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Village (optional)</label>
                    <input type="text" className="input" value={form.village} onChange={update('village')} />
                  </div>
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            </>
          ) : (
            <>
              <button
                onClick={() => { setStep('details'); setOtp(''); setError('') }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Enter OTP</h2>
              <p className="text-sm text-gray-500 mb-6">
                OTP sent to <span className="font-semibold text-gray-700">+91 {form.mobileNumber}</span>
              </p>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    className="input text-center text-xl tracking-widest font-mono"
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
              <button
                onClick={handleSendOtp}
                className="text-sm text-primary-600 hover:underline mt-3 block text-center"
              >
                Resend OTP
              </button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
