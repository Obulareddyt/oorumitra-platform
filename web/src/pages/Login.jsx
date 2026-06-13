import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('mobile') // 'mobile' | 'otp'
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isLoggedIn) {
    navigate('/')
    return null
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (mobile.length !== 10) { setError('Enter a valid 10-digit mobile number'); return }
    setLoading(true)
    setError('')
    try {
      await authApi.sendOtp(mobile)
      setStep('otp')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!otp) { setError('Enter the OTP'); return }
    setLoading(true)
    setError('')
    try {
      const data = await authApi.login(mobile, otp)
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
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🌾</div>
          <h1 className="text-3xl font-bold text-primary-700">OoruMitra</h1>
          <p className="text-gray-500 mt-1">Rural Marketplace & Services</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {step === 'mobile' ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Sign In</h2>
              <p className="text-sm text-gray-500 mb-6">Enter your mobile number to receive an OTP</p>
              <form onSubmit={handleSendOtp} className="space-y-4">
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
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      autoFocus
                    />
                  </div>
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-4">
                Dev credentials: <span className="font-mono font-semibold text-gray-600">9000000000</span> / OTP: <span className="font-mono font-semibold text-gray-600">123456</span>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => { setStep('mobile'); setOtp(''); setError('') }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Enter OTP</h2>
              <p className="text-sm text-gray-500 mb-6">
                OTP sent to <span className="font-semibold text-gray-700">+91 {mobile}</span>
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
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
                  {loading ? 'Verifying...' : 'Sign In'}
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
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
