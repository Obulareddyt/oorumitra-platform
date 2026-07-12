import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { changeAppLanguage, getSavedLanguage } from '../api/i18n'

export default function Login() {
  const { t } = useTranslation()
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  // 'credentials' | 'otp-mobile' | 'otp-verify'
  const [mode, setMode] = useState('credentials')

  // Credential login state
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // OTP login state
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isLoggedIn) {
    navigate('/')
    return null
  }

  const clearError = () => setError('')

  const friendlyError = (msg = '') => {
    if (msg.includes('[Account]') || msg.toLowerCase().includes('not registered')) {
      return 'This user account is not registered. Please create an account to continue.'
    }
    if (msg.toLowerCase().includes('incorrect password') || msg.toLowerCase().includes('wrong password')) {
      return 'Incorrect password. Please try again.'
    }
    if (msg.toLowerCase().includes('invalid') && msg.toLowerCase().includes('otp')) {
      return 'Invalid or expired OTP. Please request a new one.'
    }
    if (msg.toLowerCase().includes('without a password')) {
      return 'This account was set up without a password. Please use OTP login below.'
    }
    return msg
  }

  // --- Credential login ---
  const handleCredentialLogin = async (e) => {
    e.preventDefault()
    if (!username.trim()) { setError('Please enter your username or mobile number'); return }
    if (!password) { setError('Please enter your password'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    clearError()
    try {
      const data = await authApi.loginWithCredentials(username.trim(), password)
      login(data)
      navigate('/')
    } catch (err) {
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  // --- OTP login ---
  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!mobile.trim()) { setError('Please enter your mobile number'); return }
    if (mobile.length !== 10) { setError('Enter a valid 10-digit mobile number'); return }
    setLoading(true)
    clearError()
    try {
      await authApi.sendOtp(mobile)
      setMode('otp-verify')
    } catch (err) {
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleOtpLogin = async (e) => {
    e.preventDefault()
    if (!otp.trim()) { setError('Please enter the OTP'); return }
    if (otp.length !== 6) { setError('OTP must be 6 digits'); return }
    setLoading(true)
    clearError()
    try {
      const data = await authApi.login(mobile, otp)
      login(data)
      navigate('/')
    } catch (err) {
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/Ooru_mitra_logo_2.png" alt="OoruMitra" className="h-24 w-auto mx-auto mb-2 drop-shadow" />
          <p className="text-gray-500 mt-1">Rural Marketplace & Services</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* Language Selection Bar */}
          <div className="flex justify-end items-center gap-1.5 mb-6 pb-3 border-b border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase">🌐 Language:</span>
            <select
              value={getSavedLanguage()}
              onChange={(e) => changeAppLanguage(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs font-semibold rounded-lg px-2.5 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు</option>
              <option value="ta">தமிழ்</option>
              <option value="ml">മലയാളം</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          {/* ── Credential Login ── */}
          {mode === 'credentials' && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{t('login.title', 'Sign In')}</h2>
              <p className="text-sm text-gray-500 mb-6">Enter your username and password to continue</p>

              <form onSubmit={handleCredentialLogin} className="space-y-4" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Your username or mobile number"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); clearError() }}
                    autoFocus
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input pr-16"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); clearError() }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{error}</p>
                    {error.includes('not registered') && (
                      <Link to="/register" className="text-primary-600 font-semibold text-sm hover:underline mt-1 block">
                        Create an account →
                      </Link>
                    )}
                    {error.includes('without a password') && (
                      <button
                        type="button"
                        onClick={() => { setMode('otp-mobile'); clearError() }}
                        className="text-primary-600 font-semibold text-sm hover:underline mt-1 block"
                      >
                        Login with OTP instead →
                      </button>
                    )}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            </>
          )}

          {/* ── OTP — Enter mobile ── */}
          {mode === 'otp-mobile' && (
            <>
              <button
                onClick={() => { setMode('credentials'); clearError() }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Login with OTP</h2>
              <p className="text-sm text-gray-500 mb-6">Enter your registered mobile number</p>

              <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-sm">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      className="input rounded-l-none"
                      placeholder="9000000000"
                      value={mobile}
                      onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '')); clearError() }}
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{error}</p>
                    {error.includes('not registered') && (
                      <Link to="/register" className="text-primary-600 font-semibold text-sm hover:underline mt-1 block">
                        Create an account →
                      </Link>
                    )}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                  {loading ? 'Sending OTP…' : 'Send OTP'}
                </button>
              </form>
            </>
          )}

          {/* ── OTP — Verify ── */}
          {mode === 'otp-verify' && (
            <>
              <button
                onClick={() => { setMode('otp-mobile'); setOtp(''); clearError() }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Enter OTP</h2>
              <p className="text-sm text-gray-500 mb-6">
                OTP sent to <span className="font-semibold text-gray-700">+91 {mobile}</span>
              </p>

              <form onSubmit={handleOtpLogin} className="space-y-4" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="input text-center text-xl tracking-widest font-mono"
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); clearError() }}
                    autoFocus
                  />
                </div>

                {error && <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}

                <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                  {loading ? 'Verifying…' : 'Sign In'}
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
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
