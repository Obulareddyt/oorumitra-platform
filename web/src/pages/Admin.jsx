import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi, categoryApi, adApi, productsApi, translationsApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { PageSpinner } from '../components/Spinner'
import Toast, { useToast } from '../components/Toast'

const STATUS_BADGE = {
  PENDING:  'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  SOLD:     'bg-gray-100 text-gray-700 font-semibold',
}

const TYPE_KEYS = ['products', 'workers', 'transport', 'vehicleWork']

// Modal component for Editing/Creating Category
function CategoryModal({ cat, onClose, onSave }) {
  const [keyName, setKeyName] = useState(cat.keyName || '')
  const [label, setLabel] = useState(cat.label || '')
  const [desc, setDesc] = useState(cat.desc || '')
  const [icon, setIcon] = useState(cat.icon || '')
  const [to, setTo] = useState(cat.to || '')
  const [modalKey, setModalKey] = useState(cat.modalKey || '')
  const [displayOrder, setDisplayOrder] = useState(cat.displayOrder || 0)
  const [status, setStatus] = useState(cat.status || 'ENABLED')
  const [color, setColor] = useState(cat.color || 'from-emerald-50 to-teal-100/40 border-emerald-200/50 hover:from-emerald-100 hover:to-teal-200 hover:shadow-emerald-500/10 hover:border-emerald-400')
  const [iconBg, setIconBg] = useState(cat.iconBg || 'bg-emerald-100 text-emerald-700')

  const submit = (e) => {
    e.preventDefault()
    onSave({
      keyName,
      label,
      description: desc,
      icon,
      toUrl: to,
      modalKey,
      displayOrder: parseInt(displayOrder, 10),
      status,
      colorClass: color,
      iconBg
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-left" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-black text-gray-900 mb-4">
          {cat.id ? 'Edit Category' : 'Add Category'}
        </h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Key Name</label>
            <input type="text" value={keyName} onChange={e => setKeyName(e.target.value)} className="input text-sm" required disabled={!!cat.id} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Label</label>
            <input type="text" value={label} onChange={e => setLabel(e.target.value)} className="input text-sm" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} className="input text-sm" rows={2} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Icon Emoji</label>
              <input type="text" value={icon} onChange={e => setIcon(e.target.value)} className="input text-sm" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Display Order</label>
              <input type="number" value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} className="input text-sm" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Navigate URL (To)</label>
              <input type="text" value={to} onChange={e => setTo(e.target.value)} className="input text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Modal Key</label>
              <input type="text" value={modalKey} onChange={e => setModalKey(e.target.value)} className="input text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Color Classes</label>
              <input type="text" value={color} onChange={e => setColor(e.target.value)} className="input text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Icon Bg Class</label>
              <input type="text" value={iconBg} onChange={e => setIconBg(e.target.value)} className="input text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="input text-sm">
              <option value="ENABLED">ENABLED</option>
              <option value="DISABLED">DISABLED</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs uppercase">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-primary-600 text-white font-bold rounded-xl text-xs uppercase">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TranslationManagementSubPanel({ toast }) {
  const [languages, setLanguages] = useState([])
  const [stats, setStats] = useState({})
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [selectedLang, setSelectedLang] = useState('en')
  
  // Add key modal
  const [showAddKey, setShowAddKey] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newVal, setNewVal] = useState('')
  
  // Add language modal
  const [showAddLang, setShowAddLang] = useState(false)
  const [newLangCode, setNewLangCode] = useState('')
  const [newLangName, setNewLangName] = useState('')
  const [newLangNative, setNewLangNative] = useState('')

  // Inline edit state
  const [editingEntry, setEditingEntry] = useState(null) // { key, langCode, value }

  const loadData = async () => {
    setLoading(true)
    try {
      const langs = await translationsApi.getAllLanguages()
      setLanguages(langs || [])
      
      const st = await translationsApi.getStats()
      setStats(st || {})
      
      const ent = await translationsApi.getEntries()
      setEntries(ent || [])
    } catch (e) {
      toast.add(e.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleLang = async (lang) => {
    try {
      await translationsApi.toggleLanguage(lang.languageCode, !lang.activeStatus)
      toast.add(`Language status updated`, 'success')
      loadData()
    } catch (e) {
      toast.add(e.message, 'error')
    }
  }

  const handleAddKey = async (e) => {
    e.preventDefault()
    if (!newKey.trim() || !newVal.trim()) return
    try {
      await translationsApi.addKey(newKey.trim(), newVal.trim())
      toast.add('Translation key added', 'success')
      setShowAddKey(false)
      setNewKey('')
      setNewVal('')
      loadData()
    } catch (e) {
      toast.add(e.message, 'error')
    }
  }

  const handleAddLang = async (e) => {
    e.preventDefault()
    if (!newLangCode.trim() || !newLangName.trim() || !newLangNative.trim()) return
    try {
      await translationsApi.addLanguage(newLangCode.trim().toLowerCase(), newLangName.trim(), newLangNative.trim())
      toast.add('Language registered successfully', 'success')
      setShowAddLang(false)
      setNewLangCode('')
      setNewLangName('')
      setNewLangNative('')
      loadData()
    } catch (e) {
      toast.add(e.message, 'error')
    }
  }

  const handleUpdateEntry = async (key, langCode, val) => {
    try {
      await translationsApi.updateEntry(key, langCode, val)
      toast.add('Translation updated', 'success')
      setEditingEntry(null)
      loadData()
    } catch (e) {
      toast.add(e.message, 'error')
    }
  }

  const handleJsonImport = (e, langCode) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result)
        await translationsApi.importMap(langCode, json)
        toast.add('Translations imported successfully', 'success')
        loadData()
      } catch (err) {
        toast.add('Invalid JSON file format: ' + err.message, 'error')
      }
    }
    reader.readAsText(file)
  }

  const handleJsonExport = async (langCode) => {
    try {
      const data = await translationsApi.exportMap(langCode)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `translation_${langCode}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      toast.add('Export failed: ' + e.message, 'error')
    }
  }

  // Filter keys and map to selected language
  const keys = Array.from(new Set(entries.map(e => e.translationKey)))
  const filteredKeys = keys.filter(k => 
    k.toLowerCase().includes(filterText.toLowerCase()) ||
    (entries.find(e => e.translationKey === k && e.languageCode === selectedLang)?.translationValue || '')
      .toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <div className="space-y-6">
      
      {/* Upper summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-gray-500 uppercase">Active Languages</h4>
            <button onClick={() => setShowAddLang(true)} className="text-xs bg-primary-50 text-primary-700 font-bold px-2.5 py-1 rounded-lg">
              + Add Language
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {languages.map(l => (
              <div key={l.languageCode} className="flex justify-between items-center text-xs border-b border-gray-50 pb-1.5">
                <span className="font-semibold text-gray-800">{l.nativeName} ({l.languageCode})</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-bold">{stats[l.languageCode] ?? 0}% Complete</span>
                  <button onClick={() => handleToggleLang(l)} className={`px-2 py-0.5 rounded font-black text-[9px] ${
                    l.activeStatus ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {l.activeStatus ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Translation actions & stats */}
        <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm sm:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-gray-500 uppercase">Translation Core Tools</h4>
            <button onClick={() => setShowAddKey(true)} className="btn-primary text-xs py-1.5 px-4">
              + Add Translation Key
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Export current translation key-value mappings to file formats, or upload standard localization files to mass apply values in the selected language.
          </p>
          <div className="flex items-center gap-4 flex-wrap text-xs pt-2">
            <div>
              <span className="font-bold text-gray-600 mr-2">Target Language:</span>
              <select value={selectedLang} onChange={e => setSelectedLang(e.target.value)} className="bg-gray-50 border rounded p-1 font-semibold">
                {languages.map(l => (
                  <option key={l.languageCode} value={l.languageCode}>{l.nativeName} ({l.languageCode})</option>
                ))}
              </select>
            </div>
            
            <button onClick={() => handleJsonExport(selectedLang)} className="btn-outline py-1 px-3">
              📥 Export JSON
            </button>
            
            <label className="btn-outline py-1 px-3 cursor-pointer">
              📤 Import JSON
              <input type="file" accept=".json" onChange={e => handleJsonImport(e, selectedLang)} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Translations List Table */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden text-left">
        <div className="px-5 py-4 border-b border-gray-150 flex justify-between items-center flex-wrap gap-3 bg-gray-50/50">
          <h3 className="text-sm font-black text-gray-900 uppercase">Translation Keys Index</h3>
          <input
            type="text"
            className="input max-w-xs text-xs py-1.5"
            placeholder="Search keys or values..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-gray-700 divide-y divide-gray-150">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="px-6 py-3">Translation Key</th>
                <th className="px-6 py-3">English Source</th>
                <th className="px-6 py-3">Selected Language Translation ({selectedLang.toUpperCase()})</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredKeys.map(key => {
                const enVal = entries.find(e => e.translationKey === key && e.languageCode === 'en')?.translationValue || '—';
                const targetEntry = entries.find(e => e.translationKey === key && e.languageCode === selectedLang);
                const isEditing = editingEntry?.key === key;

                return (
                  <tr key={key} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{key}</td>
                    <td className="px-6 py-4 text-gray-600">{enVal}</td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          className="input py-1 text-xs"
                          defaultValue={targetEntry?.translationValue || ''}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleUpdateEntry(key, selectedLang, e.target.value)
                          }}
                          onBlur={e => handleUpdateEntry(key, selectedLang, e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span className={targetEntry?.translationValue ? 'text-gray-800' : 'text-rose-500 italic font-medium'}>
                          {targetEntry?.translationValue || '[Missing Translation]'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setEditingEntry({ key, value: targetEntry?.translationValue || '' })}
                        className="text-primary-600 hover:text-primary-800 font-bold"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Key Modal */}
      {showAddKey && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddKey} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative space-y-4">
            <h3 className="text-md font-black text-gray-900 uppercase">Add Translation Key</h3>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Key Name</label>
              <input type="text" value={newKey} onChange={e => setNewKey(e.target.value)} className="input text-xs" placeholder="e.g. error.invalid_mobile" required />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Default English Value</label>
              <input type="text" value={newVal} onChange={e => setNewVal(e.target.value)} className="input text-xs" placeholder="e.g. Please enter a valid number" required />
            </div>
            <div className="flex gap-2.5 pt-2">
              <button type="button" onClick={() => setShowAddKey(false)} className="btn-outline flex-1 text-xs">Cancel</button>
              <button type="submit" className="btn-primary flex-1 text-xs">Add Key</button>
            </div>
          </form>
        </div>
      )}

      {/* Add Language Modal */}
      {showAddLang && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddLang} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative space-y-4">
            <h3 className="text-md font-black text-gray-900 uppercase">Register New Language</h3>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Language ISO Code</label>
              <input type="text" value={newLangCode} onChange={e => setNewLangCode(e.target.value)} className="input text-xs" placeholder="e.g. ml" required />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Language Name</label>
              <input type="text" value={newLangName} onChange={e => setNewLangName(e.target.value)} className="input text-xs" placeholder="e.g. Malayalam" required />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Native Name</label>
              <input type="text" value={newLangNative} onChange={e => setNewLangNative(e.target.value)} className="input text-xs" placeholder="e.g. മലയാളം" required />
            </div>
            <div className="flex gap-2.5 pt-2">
              <button type="button" onClick={() => setShowAddLang(false)} className="btn-outline flex-1 text-xs">Cancel</button>
              <button type="submit" className="btn-primary flex-1 text-xs">Register</button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}

function CategoryManagementSubPanel({ toast }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const loadCategories = async () => {
    setLoading(true)
    try {
      const res = await categoryApi.getAllAdmin()
      setCategories(res || [])
    } catch (e) {
      toast.add(e.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleToggle = async (cat) => {
    const newStatus = cat.status === 'ENABLED' ? 'DISABLED' : 'ENABLED'
    try {
      await categoryApi.update(cat.id, {
        keyName: cat.keyName,
        label: cat.label,
        description: cat.desc,
        icon: cat.icon,
        toUrl: cat.to,
        modalKey: cat.modalKey,
        status: newStatus,
        displayOrder: cat.displayOrder,
        colorClass: cat.color,
        iconBg: cat.iconBg
      })
      toast.add(`Category ${cat.label} ${newStatus === 'ENABLED' ? 'enabled' : 'disabled'} successfully`, 'success')
      loadCategories()
    } catch (e) {
      toast.add(e.message, 'error')
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingCat?.id) {
        await categoryApi.update(editingCat.id, formData)
        toast.add('Category updated successfully', 'success')
      } else {
        await categoryApi.create(formData)
        toast.add('Category created successfully', 'success')
      }
      setShowModal(false)
      loadCategories()
    } catch (e) {
      toast.add(e.message, 'error')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-left">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Category Management</h3>
        <button
          onClick={() => { setEditingCat({}); setShowModal(true) }}
          className="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary-700 transition-colors"
        >
          + Add Category
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading Categories…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Icon</th>
                <th className="px-6 py-3">Label</th>
                <th className="px-6 py-3">Key Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{cat.displayOrder}</td>
                  <td className="px-6 py-4 text-2xl">{cat.icon}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{cat.label}</td>
                  <td className="px-6 py-4">{cat.keyName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      cat.status === 'ENABLED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleToggle(cat)}
                      className={`px-3 py-1 rounded font-bold text-xs uppercase tracking-wider ${
                        cat.status === 'ENABLED' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {cat.status === 'ENABLED' ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => { setEditingCat(cat); setShowModal(true) }}
                      className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded font-bold text-xs uppercase tracking-wider"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <CategoryModal
          cat={editingCat}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function AdvertisementModal({ ad, onClose, onSave }) {
  const [title, setTitle] = useState(ad.title || '')
  const [description, setDescription] = useState(ad.description || '')
  const [redirectUrl, setRedirectUrl] = useState(ad.redirectUrl || '')
  const [startDate, setStartDate] = useState(ad.startDate || '')
  const [endDate, setEndDate] = useState(ad.endDate || '')
  const [priority, setPriority] = useState(ad.priority || 0)
  const [status, setStatus] = useState(ad.status || 'ACTIVE')
  const [adType, setAdType] = useState(ad.adType || 'BANNER')
  const [mediaType, setMediaType] = useState(ad.mediaType || 'IMAGE')

  const [startTime, setStartTime] = useState(ad.startTime || '')
  const [endTime, setEndTime] = useState(ad.endTime || '')
  const [dayOfWeek, setDayOfWeek] = useState(ad.dayOfWeek || '')

  const [mediaFile, setMediaFile] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    onSave({
      title,
      description,
      redirectUrl,
      startDate: startDate || null,
      endDate: endDate || null,
      priority: parseInt(priority, 10),
      status,
      adType,
      mediaType,
      startTime: startTime || null,
      endTime: endTime || null,
      dayOfWeek: dayOfWeek || null
    }, mediaFile)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left my-8" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-black text-gray-900 mb-4">
          {ad.id ? 'Edit Advertisement' : 'Add Advertisement'}
        </h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input text-sm" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="input text-sm" rows={2} required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Redirect Link</label>
            <input type="text" value={redirectUrl} onChange={e => setRedirectUrl(e.target.value)} className="input text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Ad Type</label>
              <select value={adType} onChange={e => setAdType(e.target.value)} className="input text-sm">
                <option value="BANNER">BANNER (Home Slider)</option>
                <option value="VIDEO">VIDEO (Video section)</option>
                <option value="POPUP">POPUP (Promo overlay)</option>
                <option value="FEATURED">FEATURED (Spotlight card)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Media Type</label>
              <select value={mediaType} onChange={e => setMediaType(e.target.value)} className="input text-sm">
                <option value="IMAGE">IMAGE</option>
                <option value="VIDEO">VIDEO</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Upload Media File (JPG, PNG, WEBP, MP4)</label>
            <input type="file" onChange={e => setMediaFile(e.target.files[0])} className="input text-sm" accept="image/*,video/*" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Start Time</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="input text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">End Time</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="input text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Priority</label>
              <input type="number" value={priority} onChange={e => setPriority(e.target.value)} className="input text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Day of Week</label>
              <input type="text" value={dayOfWeek} onChange={e => setDayOfWeek(e.target.value)} className="input text-sm" placeholder="e.g. MONDAY" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="input text-sm">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs uppercase">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-primary-600 text-white font-bold rounded-xl text-xs uppercase">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AdvertisementManagementSubPanel({ toast }) {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingAd, setEditingAd] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const loadAds = async () => {
    setLoading(true)
    try {
      const res = await adApi.getAllAdmin()
      setAds(res || [])
    } catch (e) {
      toast.add(e.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAds()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this advertisement?")) return
    try {
      await adApi.delete(id)
      toast.add('Advertisement deleted successfully', 'success')
      loadAds()
    } catch (e) {
      toast.add(e.message, 'error')
    }
  }

  const handleSave = async (formData, mediaFile) => {
    try {
      if (editingAd?.id) {
        await adApi.update(editingAd.id, formData, mediaFile)
        toast.add('Advertisement updated successfully', 'success')
      } else {
        await adApi.create(formData, mediaFile)
        toast.add('Advertisement created successfully', 'success')
      }
      setShowModal(false)
      loadAds()
    } catch (e) {
      toast.add(e.message, 'error')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-left">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Advertisement Management</h3>
        <button
          onClick={() => { setEditingAd({}); setShowModal(true) }}
          className="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary-700 transition-colors"
        >
          + Add Advertisement
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading Advertisements…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ads.map((ad) => (
            <div key={ad.id} className="border border-gray-100 rounded-3xl p-5 shadow-xs bg-gray-50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black uppercase rounded">
                    {ad.adType}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded ${
                    ad.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {ad.status}
                  </span>
                </div>
                <h4 className="font-extrabold text-gray-800 text-base mt-2">{ad.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{ad.description}</p>
                {ad.mediaUrl && (
                  <div className="rounded-xl overflow-hidden mt-3 max-h-32 bg-black flex items-center justify-center">
                    {ad.mediaType === 'VIDEO' ? (
                      <video src={ad.mediaUrl} className="w-full max-h-32 object-cover" muted />
                    ) : (
                      <img src={ad.mediaUrl} alt={ad.title} className="w-full max-h-32 object-cover" />
                    )}
                  </div>
                )}
                <div className="mt-3 text-xs space-y-1 text-gray-600 font-semibold">
                  <div>Priority: <span className="font-bold text-gray-800">{ad.priority}</span></div>
                  {ad.startDate && <div>Schedule: <span className="font-bold text-gray-800">{ad.startDate} to {ad.endDate || 'Ongoing'}</span></div>}
                  {ad.startTime && <div>Time: <span className="font-bold text-gray-800">{ad.startTime} - {ad.endTime}</span></div>}
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => { setEditingAd(ad); setShowModal(true) }}
                  className="flex-1 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl font-bold text-xs uppercase tracking-wider"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ad.id)}
                  className="flex-1 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-bold text-xs uppercase tracking-wider"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AdvertisementModal
          ad={editingAd}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function StatCard({ label, value, color = 'text-gray-800' }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value ?? 0}</p>
    </div>
  )
}

function RemarksModal({ item, action, listingName, onClose, onConfirm }) {
  const [remarks, setRemarks] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const submit = async () => {
    if (!remarks.trim()) { setErr('Remarks are required before you can proceed.'); return }
    setSaving(true); setErr('')
    try { await onConfirm(item.id, remarks); onClose() }
    catch (e) { setErr(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className={`flex items-center justify-between p-5 border-b rounded-t-2xl ${action === 'approve' ? 'bg-green-50' : 'bg-red-50'}`}>
          <h2 className="text-lg font-bold text-gray-800">
            {action === 'approve' ? '✅ Approve' : '❌ Reject'} Listing
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700">
            <span className="font-medium">{listingName}</span>
            {item.ownerName && <span className="text-gray-500"> · {item.ownerName}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input resize-none"
              rows={4}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder={action === 'approve'
                ? 'e.g. Verified — listing looks good, contact info confirmed.'
                : 'e.g. Incomplete information provided, please resubmit with photos.'}
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1">This will be sent to the user via SMS.</p>
          </div>
          {err && <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3">{err}</p>}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 btn-secondary py-2">Cancel</button>
            <button
              onClick={submit}
              disabled={saving}
              className={`flex-1 py-2 rounded-xl font-semibold text-white transition-colors ${
                action === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {saving ? 'Saving…' : action === 'approve' ? 'Approve' : 'Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ListingsTable({ items, loading, onApprove, onReject, getName, getVillage, getCategory, tab, onManageAvailability, onViewHistory }) {
  if (loading) return <div className="py-12 text-center text-gray-400">Loading…</div>
  if (!items?.length) return <div className="py-12 text-center text-gray-400">No listings found</div>

  const headers = ['Name / Type', 'Owner', 'Mobile', 'Village', 'Category', 'Voice Desc', 'Posted', 'Status']
  if (tab === 'Products') {
    headers.push('Availability')
  }
  headers.push('Remarks', 'Actions')

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            {headers.map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900 max-w-[160px] truncate">{getName(item)}</td>
              <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{item.ownerName}</td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.mobileNumber}</td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{getVillage(item) || '—'}</td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{getCategory(item) || '—'}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {item.voiceNoteUrl ? (
                  <audio src={item.voiceNoteUrl} controls className="h-6 w-32 scale-90 origin-left" />
                ) : (
                  <span className="text-gray-300">None</span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmt(item.createdAt)}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[item.approvalStatus] ?? ''}`}>
                  {item.approvalStatus}
                </span>
              </td>
              {tab === 'Products' && (
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1 ${
                    item.availabilityStatus === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.availabilityStatus === 'ACTIVE' ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
                    {item.availabilityStatus}
                  </span>
                </td>
              )}
              <td className="px-4 py-3 text-gray-500 max-w-[180px]">
                {item.adminRemarks
                  ? <span title={item.adminRemarks} className="line-clamp-2 text-xs">{item.adminRemarks}</span>
                  : <span className="text-gray-300">—</span>}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {item.approvalStatus === 'PENDING' && (
                    <div className="flex gap-2">
                      <button onClick={() => onApprove(item)} className="text-xs text-green-600 hover:underline font-medium whitespace-nowrap">Approve</button>
                      <button onClick={() => onReject(item)} className="text-xs text-red-600 hover:underline font-medium whitespace-nowrap">Reject</button>
                    </div>
                  )}
                  {tab === 'Products' && (
                    <div className="flex gap-2.5">
                      <button onClick={() => onManageAvailability(item)} className="text-xs text-indigo-600 hover:underline font-bold whitespace-nowrap">Status Override</button>
                      <button onClick={() => onViewHistory(item)} className="text-xs text-gray-500 hover:underline font-medium whitespace-nowrap">Audit Logs</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null
  return (
    <div className="px-4 py-3 border-t border-gray-100 flex gap-1 justify-end">
      <button disabled={page === 0} onClick={() => onPage(page - 1)}
        className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 text-sm">←</button>
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
        <button key={i} onClick={() => onPage(i)}
          className={`px-3 py-1 rounded-lg border text-sm ${i === page ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 hover:bg-gray-50'}`}>
          {i + 1}
        </button>
      ))}
      <button disabled={page >= totalPages - 1} onClick={() => onPage(page + 1)}
        className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 text-sm">→</button>
    </div>
  )
}

export default function Admin() {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [tab, setTab] = useState('Dashboard')
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [], totalPages: 1, totalElements: 0 })
  const [loading, setLoading] = useState(false)

  const [availabilityFilter, setAvailabilityFilter] = useState('ALL')
  const [availabilityModal, setAvailabilityModal] = useState(null)
  const [auditHistoryModal, setAuditHistoryModal] = useState(null)

  const [modal, setModal] = useState(null)
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) { navigate('/'); return }
    adminApi.getStats().then(setStats).catch(() => {}).finally(() => setStatsLoading(false))
  }, [isLoggedIn, user])

  const tabConfig = {
    'Products':     { fetch: adminApi.getProducts,     getName: i => i.productName,  getVillage: i => i.location, getCategory: i => i.category },
    'Workers':      { fetch: adminApi.getWorkers,      getName: i => i.groupName,    getVillage: i => i.village,  getCategory: i => i.workType },
    'Transport':    { fetch: adminApi.getTransport,    getName: i => i.vehicleType,  getVillage: i => i.village,  getCategory: i => i.vehicleType },
    'Vehicle Work': { fetch: adminApi.getVehicleWork,  getName: i => i.vehicleType,  getVillage: i => i.village,  getCategory: i => i.vehicleType },
  }

  const loadTab = useCallback(async () => {
    if (tab === 'Dashboard') return
    const cfg = tabConfig[tab]
    if (!cfg) return
    setLoading(true)
    try {
      let res
      if (tab === 'Products') {
        res = await adminApi.getProducts({
          status: statusFilter || undefined,
          availabilityStatus: availabilityFilter === 'ALL' ? undefined : availabilityFilter,
          page,
          size: 15
        })
      } else {
        res = await cfg.fetch({ status: statusFilter || undefined, page, size: 15 })
      }
      setData(res)
    } catch (e) { toast.add(e.message, 'error') }
    finally { setLoading(false) }
  }, [tab, statusFilter, availabilityFilter, page])

  useEffect(() => { loadTab() }, [loadTab])

  const switchTab = (t) => { setTab(t); setPage(0); setStatusFilter('') }

  const handleDecide = async (item, action) => {
    const cfg = tabConfig[tab]
    const apiCall = action === 'approve'
      ? (tab === 'Products' ? adminApi.approveProduct
         : tab === 'Workers' ? adminApi.approveWorker
         : tab === 'Transport' ? adminApi.approveTransport
         : adminApi.approveVehicleWork)
      : (tab === 'Products' ? adminApi.rejectProduct
         : tab === 'Workers' ? adminApi.rejectWorker
         : tab === 'Transport' ? adminApi.rejectTransport
         : adminApi.rejectVehicleWork)

    try {
      const updated = await apiCall(item.id, { remarks: modal.remarks })
      toast.add(`Listing ${action === 'approve' ? 'approved' : 'rejected'}`, action === 'approve' ? 'success' : 'error')
      setData(prev => ({ ...prev, content: prev.content.map(x => x.id === updated.id ? updated : x) }))
      adminApi.getStats().then(setStats).catch(() => {})
    } catch (e) { throw e }
  }

  const openModal = (item, action) => {
    setModal({ item, action, listingName: tabConfig[tab]?.getName(item) || '' })
  }

  const confirmModal = async (id, remarks) => {
    const cfg = tabConfig[tab]
    if (!cfg) return
    const apiCall = modal.action === 'approve'
      ? (tab === 'Products' ? adminApi.approveProduct
         : tab === 'Workers' ? adminApi.approveWorker
         : tab === 'Transport' ? adminApi.approveTransport
         : adminApi.approveVehicleWork)
      : (tab === 'Products' ? adminApi.rejectProduct
         : tab === 'Workers' ? adminApi.rejectWorker
         : tab === 'Transport' ? adminApi.rejectTransport
         : adminApi.rejectVehicleWork)

    const updated = await apiCall(id, { remarks })
    toast.add(`Listing ${modal.action === 'approve' ? 'approved' : 'rejected'}`, modal.action === 'approve' ? 'success' : 'error')
    setData(prev => ({ ...prev, content: prev.content.map(x => x.id === updated.id ? updated : x) }))
    adminApi.getStats().then(setStats).catch(() => {})
  }

  const tabsList = user?.role === 'SUPER_ADMIN' 
    ? ['Dashboard', 'Products', 'Workers', 'Transport', 'Vehicle Work', 'Category Management', 'Advertisement Management', 'Translation Management']
    : ['Dashboard', 'Products', 'Workers', 'Transport', 'Vehicle Work']

  if (!isLoggedIn || !isAdmin) return null

  const cfg = tabConfig[tab]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Toast toasts={toast.toasts} remove={toast.remove} />

      <div className="mb-6">
        <p className="text-sm text-gray-500">Administration</p>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel 🛡️</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {tabsList.map(t => (
          <button key={t} onClick={() => switchTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              tab === t ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'Dashboard' && (
        statsLoading ? <PageSpinner /> : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total Posts"    value={stats?.totalPosts}    />
              <StatCard label="Pending"        value={stats?.totalPending}  color="text-amber-600" />
              <StatCard label="Approved"       value={stats?.totalApproved} color="text-green-600" />
              <StatCard label="Rejected"       value={stats?.totalRejected} color="text-red-600"   />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Products',     total: stats?.totalProducts,    pending: stats?.pendingProducts,    approved: stats?.approvedProducts,    rejected: stats?.rejectedProducts    },
                { label: 'Workers',      total: stats?.totalWorkers,     pending: stats?.pendingWorkers,     approved: stats?.approvedWorkers,     rejected: stats?.rejectedWorkers     },
                { label: 'Transport',    total: stats?.totalTransport,   pending: stats?.pendingTransport,   approved: stats?.approvedTransport,   rejected: stats?.rejectedTransport   },
                { label: 'Vehicle Work', total: stats?.totalVehicleWork, pending: stats?.pendingVehicleWork, approved: stats?.approvedVehicleWork, rejected: stats?.rejectedVehicleWork },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="font-semibold text-gray-800 mb-3">{s.label}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-medium">{s.total ?? 0}</span></div>
                    <div className="flex justify-between"><span className="text-amber-600">Pending</span><span className="font-medium text-amber-600">{s.pending ?? 0}</span></div>
                    <div className="flex justify-between"><span className="text-green-600">Approved</span><span className="font-medium text-green-600">{s.approved ?? 0}</span></div>
                    <div className="flex justify-between"><span className="text-red-500">Rejected</span><span className="font-medium text-red-500">{s.rejected ?? 0}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* Category Management Panel */}
      {tab === 'Category Management' && (
        <CategoryManagementSubPanel toast={toast} />
      )}

      {/* Advertisement Management Panel */}
      {tab === 'Advertisement Management' && (
        <AdvertisementManagementSubPanel toast={toast} />
      )}

      {/* Translation Management Panel */}
      {tab === 'Translation Management' && (
        <TranslationManagementSubPanel toast={toast} />
      )}

      {/* Listing tabs */}
      {tab !== 'Dashboard' && tab !== 'Category Management' && tab !== 'Advertisement Management' && tab !== 'Translation Management' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <select
              className="input max-w-[160px] text-sm"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(0) }}
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="SOLD">Sold</option>
            </select>

            {tab === 'Products' && (
              <select
                className="input max-w-[180px] text-sm bg-indigo-50/50 border-indigo-100 text-indigo-900 font-medium"
                value={availabilityFilter}
                onChange={e => { setAvailabilityFilter(e.target.value); setPage(0) }}
              >
                <option value="ALL">All Products</option>
                <option value="ACTIVE">Active Products</option>
                <option value="INACTIVE">Inactive Products</option>
              </select>
            )}

            <span className="text-sm text-gray-400">{data.totalElements} listing{data.totalElements !== 1 ? 's' : ''}</span>
          </div>

          <ListingsTable
            items={data.content}
            loading={loading}
            onApprove={item => openModal(item, 'approve')}
            onReject={item => openModal(item, 'reject')}
            getName={cfg?.getName || (i => i.id)}
            getVillage={cfg?.getVillage || (() => '')}
            getCategory={cfg?.getCategory || (() => '')}
            tab={tab}
            onManageAvailability={item => setAvailabilityModal({ item, status: item.availabilityStatus, remarks: '' })}
            onViewHistory={async item => {
              try {
                const res = await productsApi.getStatusHistory(item.id)
                setAuditHistoryModal({ item, logs: res })
              } catch (e) {
                toast.add(e.message, 'error')
              }
            }}
          />

          <Pagination page={page} totalPages={data.totalPages} onPage={setPage} />
        </div>
      )}

      {modal && (
        <RemarksModal
          item={modal.item}
          action={modal.action}
          listingName={modal.listingName}
          onClose={() => setModal(null)}
          onConfirm={confirmModal}
        />
      )}

      {availabilityModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setAvailabilityModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scaleUp" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Manage Product Availability</h3>
              <button className="text-gray-400 hover:text-gray-600 font-bold" onClick={() => setAvailabilityModal(null)}>✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Availability Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="adminAvailabilityStatus"
                      value="ACTIVE"
                      checked={availabilityModal.status === 'ACTIVE'}
                      onChange={() => setAvailabilityModal(prev => ({ ...prev, status: 'ACTIVE' }))}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="adminAvailabilityStatus"
                      value="INACTIVE"
                      checked={availabilityModal.status === 'INACTIVE'}
                      onChange={() => setAvailabilityModal(prev => ({ ...prev, status: 'INACTIVE' }))}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Change Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="input text-sm resize-none"
                  rows={3}
                  placeholder="e.g. Stock replenished / Seller marked as sold out."
                  value={availabilityModal.remarks}
                  onChange={e => setAvailabilityModal(prev => ({ ...prev, remarks: e.target.value }))}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 btn-secondary text-sm" onClick={() => setAvailabilityModal(null)}>Cancel</button>
                <button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm py-2"
                  onClick={async () => {
                    if (!availabilityModal.remarks.trim()) {
                      toast.add('Remarks are required to change availability.', 'error')
                      return
                    }
                    try {
                      const updated = await productsApi.adminUpdateStatus(availabilityModal.item.id, availabilityModal.status, availabilityModal.remarks)
                      toast.add('Product availability updated successfully', 'success')
                      setData(prev => ({ ...prev, content: prev.content.map(x => x.id === updated.id ? updated : x) }))
                      setAvailabilityModal(null)
                    } catch (e) {
                      toast.add(e.message, 'error')
                    }
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {auditHistoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setAuditHistoryModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto animate-scaleUp" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Availability Audit Logs</h3>
                <p className="text-xs text-gray-500 mt-0.5">{auditHistoryModal.item.productName}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 font-bold" onClick={() => setAuditHistoryModal(null)}>✕</button>
            </div>
            
            <div className="space-y-4">
              {!auditHistoryModal.logs?.length ? (
                <div className="text-center py-6 text-sm text-gray-400">No status audit history found for this product.</div>
              ) : (
                <div className="relative border-l border-gray-200 ml-3 space-y-5">
                  {auditHistoryModal.logs.map(log => (
                    <div key={log.id} className="relative pl-6">
                      <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                        log.newStatus === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                      }`} />
                      <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                        <div className="flex justify-between items-center flex-wrap gap-2 text-xs">
                          <span className="font-bold text-gray-800">Changed by: {log.changedBy} ({log.role || 'User'})</span>
                          <span className="text-gray-400">{new Date(log.changedDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">{log.oldStatus}</span>
                          <span className="text-gray-400 text-xs">→</span>
                          <span className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded ${
                            log.newStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>{log.newStatus}</span>
                        </div>
                        {log.remarks && (
                          <p className="text-xs text-gray-600 bg-white border border-gray-100 p-2 rounded-lg mt-2.5 italic">
                            "{log.remarks}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 text-right">
                <button className="btn-secondary text-sm px-6 py-2" onClick={() => setAuditHistoryModal(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
