import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api/client'
import { useAuth } from '../context/AuthContext'

const Req = () => <span className="text-red-500 ml-0.5">*</span>

function validate(form) {
  if (!form.firstName.trim()) return 'First name is required'
  if (/\d/.test(form.firstName)) return 'First name must not contain numbers'
  if (!form.lastName.trim()) return 'Last name is required'
  if (/\d/.test(form.lastName)) return 'Last name must not contain numbers'
  if (form.mobileNumber.length !== 10) return 'Enter a valid 10-digit mobile number'
  if (!form.whatsappNumber.trim()) return 'WhatsApp number is required'
  if (form.whatsappNumber.length !== 10) return 'Enter a valid 10-digit WhatsApp number'
  if (!form.username.trim()) return 'Username is required'
  if (form.username.length < 8) return 'Username must be at least 8 characters'
  if (!/^[a-zA-Z0-9_]+$/.test(form.username)) return 'Username may only contain letters, numbers and underscores'
  if (!form.password) return 'Password is required'
  if (form.password.length < 8) return 'Password must be at least 8 characters'
  if (!form.village.trim()) return 'Village name is required'
  return null
}

export default function Register() {
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('details')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    whatsappNumber: '',
    email: '',
    gender: 'MALE',
    village: '',
    username: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [sameAsPhone, setSameAsPhone] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isLoggedIn) {
    navigate('/')
    return null
  }

  const update = (field) => (e) => {
    const raw = e.target.value
    const value = field === 'mobileNumber' || field === 'whatsappNumber'
      ? raw.replace(/\D/g, '').slice(0, 10)
      : raw
    setForm((f) => ({ ...f, [field]: value }))
    setError('')
  }

  const handleSameAsPhone = (checked) => {
    setSameAsPhone(checked)
    if (checked) setForm((f) => ({ ...f, whatsappNumber: f.mobileNumber }))
    else setForm((f) => ({ ...f, whatsappNumber: '' }))
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    const err = validate(form)
    if (err) { setError(err); return }
    setLoading(true)
    setError('')
    try {
      await authApi.sendOtp(form.mobileNumber)
      setStep('otp')
    } catch (err) {
      const msg = err.message || ''
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('conflict')) {
        setError('This mobile number is already registered. Please sign in instead.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) { setError('Enter the 6-digit OTP'); return }
    setLoading(true)
    setError('')
    try {
      const data = await authApi.register({
        ...form,
        gender: form.gender.toLowerCase(),
        otp,
      })
      login(data)
      navigate('/')
    } catch (err) {
      const msg = err.message || ''
      if (msg.toLowerCase().includes('already registered')) {
        setError('This mobile number is already registered. Please sign in.')
      } else if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('expired')) {
        setError('Invalid or expired OTP. Please go back and request a new one.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-green-100 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/Ooru_mitra_logo_2.png" alt="OoruMitra" className="h-20 w-auto mx-auto mb-2 drop-shadow" />
          <p className="text-gray-500 mt-1">Rural Marketplace & Services</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {step === 'details' ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Create Account</h2>
              <p className="text-sm text-gray-500 mb-5">Fill in your details to get started</p>

              <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name<Req /></label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Ravi"
                      value={form.firstName}
                      onChange={update('firstName')}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name<Req /></label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Kumar"
                      value={form.lastName}
                      onChange={update('lastName')}
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number<Req /></label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-sm">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      className="input rounded-l-none"
                      placeholder="9000000000"
                      value={form.mobileNumber}
                      onChange={(e) => {
                        update('mobileNumber')(e)
                        if (sameAsPhone) setForm((f) => ({ ...f, whatsappNumber: e.target.value.replace(/\D/g, '').slice(0, 10) }))
                      }}
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number<Req /></label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-sm">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      className="input rounded-l-none"
                      placeholder="9000000000"
                      value={form.whatsappNumber}
                      onChange={update('whatsappNumber')}
                      disabled={sameAsPhone}
                    />
                  </div>
                  <label className="flex items-center gap-2 mt-1.5 text-sm text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsPhone}
                      onChange={(e) => handleSameAsPhone(e.target.checked)}
                      className="rounded"
                    />
                    Same as mobile number
                  </label>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username<Req /></label>
                  <input
                    type="text"
                    className="input"
                    placeholder="min 8 characters (e.g. ravi_kumar)"
                    value={form.username}
                    onChange={update('username')}
                    autoComplete="username"
                  />
                  {form.username && form.username.length < 8 && (
                    <p className="text-xs text-amber-600 mt-0.5">{form.username.length}/8 characters minimum</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password<Req /></label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input pr-10"
                      placeholder="Min 8 characters"
                      value={form.password}
                      onChange={update('password')}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {form.password && form.password.length < 8 && (
                    <p className="text-xs text-amber-600 mt-0.5">{form.password.length}/8 characters minimum</p>
                  )}
                </div>

                {/* Gender + Village */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender<Req /></label>
                    <select className="input" value={form.gender} onChange={update('gender')}>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Village<Req /></label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Your village"
                      value={form.village}
                      onChange={update('village')}
                    />
                  </div>
                </div>

                {/* Email (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="email" className="input" placeholder="you@email.com" value={form.email} onChange={update('email')} />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{error}</p>
                    {error.includes('already registered') && (
                      <Link to="/login" className="text-primary-600 font-semibold text-sm hover:underline mt-1 block">
                        Sign in instead →
                      </Link>
                    )}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                  {loading ? 'Sending OTP...' : 'Send OTP & Verify'}
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
              <h2 className="text-xl font-bold text-gray-800 mb-1">Verify OTP</h2>
              <p className="text-sm text-gray-500 mb-6">
                OTP sent to <span className="font-semibold text-gray-700">+91 {form.mobileNumber}</span>
              </p>
              <form onSubmit={handleRegister} className="space-y-4" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OTP<Req /></label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="input text-center text-xl tracking-widest font-mono"
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError('') }}
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
              <button
                onClick={handleSendOtp}
                className="text-sm text-primary-600 hover:underline mt-3 block text-center w-full"
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
