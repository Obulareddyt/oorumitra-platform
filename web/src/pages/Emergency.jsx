import { useEffect, useState } from 'react'
import { emergencyApi } from '../api/client'
import { PageSpinner } from '../components/Spinner'

const typeIcon = { AMBULANCE: '🚑', DOCTOR: '🩺', VET: '🐄', ELECTRICIAN: '⚡', PLUMBER: '🔧' }

export default function Emergency() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    emergencyApi.getServices().then(setServices).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">🆘 Emergency Services</h1>
        <p className="text-gray-500 mt-1">Quick access to emergency helplines — tap to call</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-start gap-3">
        <span className="text-2xl shrink-0">⚠️</span>
        <div>
          <p className="font-semibold text-red-800">Life threatening emergency?</p>
          <p className="text-sm text-red-700">Call <span className="font-bold">112</span> for the National Emergency Helpline (Police, Fire, Ambulance)</p>
          <a href="tel:112" className="inline-block mt-2 bg-red-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
            📞 Call 112
          </a>
        </div>
      </div>

      {loading ? (
        <PageSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((svc) => (
            <a
              key={svc.id}
              href={`tel:${svc.number}`}
              className="card border p-5 flex items-center gap-4 hover:border-red-300 hover:bg-red-50 transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-3xl shrink-0 group-hover:bg-red-200 transition-colors">
                {typeIcon[svc.type] ?? '📞'}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">{svc.name}</p>
                <p className="text-sm text-gray-500">{svc.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-red-600">{svc.number}</p>
                <p className="text-xs text-gray-400 group-hover:text-red-500 transition-colors">Tap to call</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
