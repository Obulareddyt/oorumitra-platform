import { useParams } from 'react-router-dom'

const SCREEN_DATA = {
  1: { title: '01_Home_Splash.png', header: 'Splash Screen' },
  2: { title: '02_Login.png', header: 'User Authentication' },
  3: { title: '03_User_Registration.png', header: 'User Registration' },
  4: { title: '04_Home_Dashboard.png', header: 'Home Dashboard' },
  5: { title: '05_Profile_View.png', header: 'User Profile' },
  6: { title: '06_Post_Advertisement.png', header: 'Create Post' },
  7: { title: '07_Post_Success.png', header: 'Submission Success' },
  8: { title: '08_My_Products.png', header: 'My Listings' },
  9: { title: '09_Workers_List.png', header: 'Workers Listings' },
  10: { title: '10_Vehicles_List.png', header: 'Vehicle Rentals' },
  11: { title: '11_Transport_Services.png', header: 'Transport Logistics' },
  12: { title: '12_Emergency_Home.png', header: 'Emergency Dashboard' },
  13: { title: '13_Ambulance_Service.png', header: 'Ambulance Locator' },
  14: { title: '14_Hospital_Service.png', header: 'Rural Hospitals' },
  15: { title: '15_Police_Service.png', header: 'Police Helpline' },
  16: { title: '16_Admin_Verification.png', header: 'Admin Verification Portal' },
  17: { title: '17_Final_Marketing.png', header: 'Final App Promo' }
}

export default function ScreenshotsShowcase() {
  const { id } = useParams()
  const screenId = Number(id) || 1
  const meta = SCREEN_DATA[screenId] || SCREEN_DATA[1]

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 select-none font-sans">
      
      {/* Screenshot Frame Monitor Details */}
      <div className="mb-4 text-center">
        <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          Android Mockup Frame
        </span>
        <h2 className="text-lg font-bold text-white mt-1.5">{meta.header}</h2>
        <p className="text-xs text-slate-400 mt-0.5 font-mono">{meta.title}</p>
      </div>

      {/* Realistic Smartphone container (1080x1920 aspect ratio inside a 360x640 frame) */}
      <div className="relative w-[360px] h-[640px] bg-slate-950 rounded-[44px] border-[6px] border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between text-left select-none">
        
        {/* Status Bar */}
        <div className="absolute top-0 inset-x-0 h-8 bg-transparent z-50 flex justify-between items-center px-6 text-[10px] font-bold text-white/90">
          <span>09:41 AM</span>
          <div className="w-16 h-4 bg-black rounded-full border border-slate-800 absolute left-1/2 -translate-x-1/2" />
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span className="w-3 h-2 bg-emerald-500 rounded-sm" />
          </div>
        </div>

        {/* Home Screen Indicator (Bottom bar) */}
        <div className="absolute bottom-1 inset-x-0 h-4 z-50 flex justify-center items-center">
          <div className="w-28 h-1 bg-white/40 rounded-full" />
        </div>

        {/* Content Area */}
        <div className="flex-1 pt-8 pb-4 flex flex-col justify-between bg-slate-900 relative">
          
          {/* Screen 1: Splash Screen */}
          {screenId === 1 && (
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-800 via-emerald-950 to-indigo-950 flex flex-col justify-between p-8 text-center">
              <div />
              <div className="space-y-4">
                <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-lg border border-emerald-400 animate-bounce">
                  🌾
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight">ஊరుమిత్ర</h1>
                <p className="text-xs text-emerald-400 tracking-wider font-extrabold uppercase">OoruMitra</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-300 font-medium">"Connecting Villages Digitally"</p>
                <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto animate-spin" />
              </div>
            </div>
          )}

          {/* Screen 2: Login Screen */}
          {screenId === 2 && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-6">
              <div className="text-center pt-6 space-y-2">
                <span className="text-2xl">🌾</span>
                <h2 className="text-xl font-bold text-white">Welcome back to OoruMitra</h2>
                <p className="text-xs text-slate-400">Please authenticate to access rural services</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Username / Mobile</label>
                  <input type="text" className="input text-xs h-10 w-full" defaultValue="obulareddy" readOnly />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Password</label>
                  <input type="password" className="input text-xs h-10 w-full" defaultValue="password123" readOnly />
                </div>
                <p className="text-right text-[10px] text-indigo-400 font-bold cursor-pointer">Forgot Password?</p>
              </div>

              <div className="space-y-3 pb-4">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow">Login</button>
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-2.5 rounded-xl text-xs">Create Account</button>
              </div>
            </div>
          )}

          {/* Screen 3: User Registration */}
          {screenId === 3 && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-5 overflow-y-auto">
              <div className="text-left pt-2">
                <h2 className="text-lg font-bold text-white">Create New Account 👤</h2>
                <p className="text-[10px] text-slate-400">All fields marked with * are mandatory</p>
              </div>

              <div className="space-y-3 my-4 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">First Name *</label>
                    <input className="input text-[11px] py-1.5" defaultValue="Obulareddy" readOnly />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Last Name *</label>
                    <input className="input text-[11px] py-1.5" defaultValue="Thavva" readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Mobile Number *</label>
                    <input className="input text-[11px] py-1.5" defaultValue="916302938955" readOnly />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">WhatsApp No</label>
                    <input className="input text-[11px] py-1.5" defaultValue="916302938955" readOnly />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Village Name *</label>
                  <input className="input text-[11px] py-1.5" defaultValue="Kalasapadu" readOnly />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">District *</label>
                    <input className="input text-[11px] py-1.5" defaultValue="Kadapa" readOnly />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">State *</label>
                    <input className="input text-[11px] py-1.5" defaultValue="Andhra Pradesh" readOnly />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Username *</label>
                  <input className="input text-[11px] py-1.5" defaultValue="obulareddy" readOnly />
                </div>
              </div>

              <button className="w-full bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs shadow mb-2">Register</button>
            </div>
          )}

          {/* Screen 4: Home Dashboard */}
          {screenId === 4 && (
            <div className="absolute inset-0 bg-slate-950 flex flex-col justify-between overflow-hidden">
              {/* Header */}
              <div className="bg-slate-900 px-4 py-3 flex justify-between items-center border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-lg font-bold">🌾</div>
                  <div>
                    <h3 className="text-xs font-black text-white">ఊరుమిత్ర</h3>
                    <p className="text-[8px] text-slate-400">Kalasapadu Village</p>
                  </div>
                </div>
                <span className="text-sm">🔔</span>
              </div>

              {/* Banner Carousel */}
              <div className="mx-3 mt-3 bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl p-3 flex justify-between items-center relative overflow-hidden">
                <div className="space-y-1 relative z-10">
                  <span className="text-[7px] bg-white/20 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase">Special Scheme</span>
                  <p className="text-[10px] font-black text-white leading-tight">Panchayat Seed Subsidies</p>
                  <p className="text-[8px] text-white/80">Get 50% discount on seeds</p>
                </div>
                <span className="text-3xl relative z-10">🌱</span>
              </div>

              {/* Grid Categories */}
              <div className="flex-1 px-3 py-3 overflow-y-auto">
                <p className="text-[9px] uppercase font-black text-slate-400 tracking-wider mb-2">Village Services Categories</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ['Products', '🛒'], ['Services', '🔧'], ['Workers', '👤'],
                    ['Vehicles', '🚜'], ['Transport', '🚛'], ['Rentals', '🔑'],
                    ['Jobs', '💼'], ['Emergency', '🚨'], ['Events', '📅']
                  ].map(([label, icon]) => (
                    <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-col items-center justify-center text-center gap-1.5 shadow-sm hover:border-indigo-500">
                      <span className="text-xl">{icon}</span>
                      <span className="text-[9px] font-bold text-slate-200">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nav bar */}
              <div className="bg-slate-900 border-t border-slate-800 py-2 flex justify-around text-xs">
                <span className="text-emerald-500">🏠</span><span>🛒</span><span>🔧</span><span>👤</span>
              </div>
            </div>
          )}

          {/* Screen 5: Profile View */}
          {screenId === 5 && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-4">
              <div className="space-y-4">
                {/* User info */}
                <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl font-bold text-emerald-400">
                    OT
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Obulareddy Thavva</h3>
                    <p className="text-[9px] text-slate-400">obulareddyjd@gmail.com</p>
                    <span className="text-[8px] bg-indigo-500/10 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded mt-1 inline-block uppercase">Super Admin</span>
                  </div>
                </div>

                {/* Profile lists */}
                <div className="bg-slate-950/40 rounded-2xl border border-slate-800/80 divide-y divide-slate-800/60 overflow-hidden text-xs">
                  {[
                    ['My Product Listings', '📁'],
                    ['Favorite Listings', '⭐'],
                    ['Village Settings', '⚙️'],
                    ['User Guide', '📖'],
                    ['Contact Support', '📞']
                  ].map(([label, icon]) => (
                    <div key={label} className="p-3 flex justify-between items-center hover:bg-slate-800/40 cursor-pointer">
                      <span className="flex items-center gap-2 text-slate-200 font-medium"><span>{icon}</span> {label}</span>
                      <span className="text-slate-500">›</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold py-2 rounded-xl text-xs mb-2">Logout</button>
            </div>
          )}

          {/* Screen 6: Create Post */}
          {screenId === 6 && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-5 overflow-y-auto">
              <div className="text-left pt-2 border-b border-slate-800 pb-2">
                <h2 className="text-sm font-black text-white uppercase tracking-wider">Create New Post</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Submit post details for village verification</p>
              </div>

              <div className="space-y-3.5 my-4 text-xs">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Select Category</label>
                  <select className="input text-[11px] py-1.5 w-full bg-slate-950">
                    <option>Agriculture Equipments</option>
                    <option>Cattle & Livestock</option>
                    <option>Vehicle Rentals</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Listing Title</label>
                  <input className="input text-[11px] py-1.5 w-full" defaultValue="John Deere Tractor for Rent" readOnly />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Description</label>
                  <textarea className="input text-[11px] py-1.5 w-full resize-none" rows={3} defaultValue="Tractor available with rotavator. Rent by hour." readOnly />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Price (₹)</label>
                    <input className="input text-[11px] py-1.5 w-full" defaultValue="1200" readOnly />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Status</label>
                    <div className="h-8 flex items-center bg-slate-950 border border-slate-800 px-3 rounded-lg text-emerald-400 font-extrabold text-[10px]">Active (Available)</div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs shadow mb-2">Submit</button>
            </div>
          )}

          {/* Screen 7: Product Posted Successfully */}
          {screenId === 7 && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-6 text-center">
              <div />
              <div className="space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto shadow-md">
                  ✓
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-md font-bold text-white">Your post has been submitted successfully</h2>
                  <p className="text-xs text-slate-400 px-4 leading-normal">Our village administrator will verify and approve your listing shortly.</p>
                </div>
                <span className="inline-block bg-amber-500/15 text-amber-500 font-bold border border-amber-500/20 text-[10px] uppercase px-3 py-1 rounded-full">
                  Status: Pending Verification
                </span>
              </div>
              <button className="w-full bg-slate-800 text-slate-200 border border-slate-700 font-bold py-2.5 rounded-xl text-xs mb-2">Back to Home</button>
            </div>
          )}

          {/* Screen 8: My Posted Products */}
          {screenId === 8 && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-4 overflow-y-auto">
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-black tracking-wider text-slate-400 border-b border-slate-800 pb-2">My Posted Products</h3>
                {[
                  ['John Deere Tractor', '₹4,50,000', 'APPROVED', 'bg-green-500/10 text-green-400 border-green-500/20', '🚜'],
                  ['Water Motor Pump', '₹12,500', 'PENDING', 'bg-amber-500/10 text-amber-400 border-amber-500/20', '🚰'],
                  ['High Quality Rice Bags', '₹2,200', 'APPROVED', 'bg-green-500/10 text-green-400 border-green-500/20', '🌾'],
                  ['N-P-K Chemical Fertilizer', '₹1,800', 'REJECTED', 'bg-red-500/10 text-red-400 border-red-500/20', '🌱']
                ].map(([title, price, status, badge, icon]) => (
                  <div key={title} className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl bg-slate-900 w-10 h-10 rounded-lg flex items-center justify-center border border-slate-800">{icon}</span>
                      <div>
                        <h4 className="text-[11px] font-bold text-white leading-tight">{title}</h4>
                        <p className="text-[10px] font-extrabold text-emerald-400 mt-0.5">{price}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded-full ${badge}`}>{status}</span>
                      <button className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md font-bold">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
              <div />
            </div>
          )}

          {/* Screen 9: Workers Listings */}
          {screenId === 9 && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-4 overflow-y-auto">
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-black tracking-wider text-slate-400 border-b border-slate-800 pb-2">Workers Listings</h3>
                {[
                  ['R. Kumar', 'Electrician', '5 Years Exp', '9848022331', '⚡'],
                  ['S. Murthy', 'Plumber', '8 Years Exp', '9848022332', '🚰'],
                  ['L. Narayana', 'Carpenter', '12 Years Exp', '9848022333', '🪚'],
                  ['G. Prasad', 'Mason / Masonry', '10 Years Exp', '9848022334', '🧱']
                ].map(([name, role, exp, phone, icon]) => (
                  <div key={name} className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-xl font-bold text-indigo-400">
                        {icon}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-white">{name}</h4>
                        <p className="text-[9px] text-indigo-400 font-extrabold">{role}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">{exp}</p>
                      </div>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-[9px] tracking-wide uppercase">Call</button>
                  </div>
                ))}
              </div>
              <div />
            </div>
          )}

          {/* Screen 10: Vehicle Listings */}
          {screenId === 10 && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-4 overflow-y-auto">
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-black tracking-wider text-slate-400 border-b border-slate-800 pb-2">Vehicle Rentals</h3>
                {[
                  ['John Deere Tractor', '₹1,200 / hr', 'Kalasapadu', '🚜'],
                  ['Auto Rickshaw (Goods)', '₹15 / km', 'Porumamilla', '🛺'],
                  ['Mahindra Pickup Truck', '₹2,500 / day', 'Mydukur', '🚛'],
                  ['JCB Excavator', '₹1,500 / hr', 'Badvel', '🏗️']
                ].map(([name, price, loc, icon]) => (
                  <div key={name} className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl bg-slate-900 w-10 h-10 rounded-lg flex items-center justify-center border border-slate-800">{icon}</span>
                      <div>
                        <h4 className="text-[11px] font-bold text-white leading-tight">{name}</h4>
                        <p className="text-[10px] font-extrabold text-indigo-400 mt-0.5">{price}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">📍 {loc}</p>
                      </div>
                    </div>
                    <button className="bg-indigo-600 text-white font-bold py-1 px-2.5 rounded-lg text-[9px] uppercase">Book</button>
                  </div>
                ))}
              </div>
              <div />
            </div>
          )}

          {/* Screen 11: Transport Services */}
          {screenId === 11 && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-4 overflow-y-auto">
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-black tracking-wider text-slate-400 border-b border-slate-800 pb-2">Transport Services</h3>
                {[
                  ['Goods Transport Auto', 'Driver: Ramudu', '9848011221', '🛺'],
                  ['Tractor Crop Transport', 'Driver: Lakshmana', '9848011222', '🚜'],
                  ['Sand Transport Tipper', 'Driver: Bharatha', '9848011223', '🚛'],
                  ['Heavy Machine Transport', 'Driver: Shatrughna', '9848011224', '🚚']
                ].map(([name, driver, phone, icon]) => (
                  <div key={name} className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl bg-slate-900 w-10 h-10 rounded-lg flex items-center justify-center border border-slate-800">{icon}</span>
                      <div>
                        <h4 className="text-[11px] font-bold text-white leading-tight">{name}</h4>
                        <p className="text-[9px] text-slate-400 font-medium">{driver}</p>
                      </div>
                    </div>
                    <button className="bg-emerald-600 text-white font-bold py-1.5 px-3 rounded-lg text-[9px] uppercase">Call</button>
                  </div>
                ))}
              </div>
              <div />
            </div>
          )}

          {/* Screen 12: Emergency Services Dashboard */}
          {screenId === 12 && (
            <div className="absolute inset-0 bg-slate-950 flex flex-col justify-between overflow-hidden">
              {/* Header */}
              <div className="bg-rose-900 px-4 py-3.5 flex justify-between items-center border-b border-rose-950 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚨</span>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Emergency Services</h3>
                    <p className="text-[8px] text-rose-200">Instant Local Lifelines</p>
                  </div>
                </div>
                <span className="text-[10px] bg-rose-950 text-rose-300 font-extrabold px-2 py-0.5 rounded">RED MODE</span>
              </div>

              {/* Grid Categories */}
              <div className="flex-1 px-4 py-4 grid grid-cols-2 gap-3 overflow-y-auto">
                {[
                  ['Ambulance', '🚑'], ['Hospital', '🏥'], ['Police station', '👮'],
                  ['Fire Service', '🚒'], ['Blood Bank', '🩸'], ['Veterinary Dr', '🐕']
                ].map(([label, icon]) => (
                  <div key={label} className="bg-rose-950/30 border border-rose-900/60 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:bg-rose-950/50 hover:border-rose-500">
                    <span className="text-3xl">{icon}</span>
                    <span className="text-[10px] font-black text-rose-200 uppercase tracking-wide">{label}</span>
                  </div>
                ))}
              </div>

              {/* Nav bar */}
              <div className="bg-slate-900 border-t border-slate-800 py-2 flex justify-around text-xs">
                <span>🏠</span><span>🛒</span><span>🔧</span><span className="text-rose-500">🚨</span>
              </div>
            </div>
          )}

          {/* Screen 13: Ambulance Service */}
          {screenId === 13 && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="text-lg">🚑</span>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Nearest Ambulance Locator</h3>
                </div>

                <div className="bg-slate-950 rounded-2xl p-5 border border-rose-900/50 shadow-md text-center space-y-4">
                  <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center text-3xl mx-auto border border-rose-500/20 animate-pulse">
                    🚑
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Driver: K. Shiva</h4>
                    <p className="text-xs text-rose-400 font-extrabold mt-0.5">9848022338</p>
                    <p className="text-[10px] text-slate-400 mt-2">Distance to you: <span className="font-extrabold text-white">3.5 km (8 mins)</span></p>
                  </div>
                  <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded">Status: Available</span>
                </div>
              </div>

              <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md uppercase tracking-wider">Call Ambulance</button>
            </div>
          )}

          {/* Screen 14: Hospital Service */}
          {screenId === 14 && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="text-lg">🏥</span>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Nearby Rural Hospitals</h3>
                </div>

                {[
                  ['Sunrise Area Govt Hospital', 'Dr. Prasad M.B.B.S', '1.8 km', '9848033441'],
                  ['Lifeline Rural Health Clinic', 'Dr. Anjali M.D', '4.2 km', '9848033442']
                ].map(([name, doc, dist, phone]) => (
                  <div key={name} className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3 text-left">
                    <div>
                      <h4 className="text-[11px] font-bold text-white">{name}</h4>
                      <p className="text-[9px] text-indigo-400 font-semibold">{doc}</p>
                      <p className="text-[9px] text-slate-500 mt-1">📍 {dist} away</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-emerald-600 text-white font-bold py-1.5 rounded-lg text-[9px] uppercase">Call</button>
                      <button className="flex-1 bg-slate-800 text-slate-300 border border-slate-700 font-bold py-1.5 rounded-lg text-[9px] uppercase">Direction</button>
                    </div>
                  </div>
                ))}
              </div>
              <div />
            </div>
          )}

          {/* Screen 15: Police Service */}
          {screenId === 15 && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="text-lg">👮</span>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Local Police Station</h3>
                </div>

                <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-md space-y-4 text-left">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Station Name</h4>
                    <p className="text-xs font-bold text-white mt-0.5">Kalasapadu Police Station</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Station Officer</h4>
                    <p className="text-xs font-bold text-white mt-0.5">SI G. Venkatesh</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Mobile Number</h4>
                    <p className="text-xs font-bold text-indigo-400 mt-0.5">08562-234100</p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md uppercase tracking-wider">Emergency Contact (100)</button>
            </div>
          )}

          {/* Screen 16: Admin Verification */}
          {screenId === 16 && (
            <div className="absolute inset-0 bg-slate-900 flex flex-col justify-between p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Admin Verification Queue</h3>
                  <span className="text-[8px] bg-indigo-500/10 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded">ADMIN ONLY</span>
                </div>

                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3.5 text-left">
                  <div>
                    <span className="text-[7px] bg-amber-500/10 text-amber-400 font-extrabold px-1.5 py-0.5 rounded uppercase">New Listing</span>
                    <h4 className="text-xs font-bold text-white mt-1">John Deere Tractor for Rent</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">Posted by: Ramesh Kumar</p>
                  </div>
                  
                  <div>
                    <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">Admin Remarks</label>
                    <textarea className="input text-[10px] py-1.5 w-full resize-none bg-slate-900" rows={2} defaultValue="Valid documentation verified." readOnly />
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-emerald-600 text-white font-bold py-1.5 rounded-lg text-[9px] uppercase">Approve</button>
                    <button className="flex-1 bg-rose-600 text-white font-bold py-1.5 rounded-lg text-[9px] uppercase">Reject</button>
                  </div>
                </div>
              </div>
              <div />
            </div>
          )}

          {/* Screen 17: Final Marketing Screen */}
          {screenId === 17 && (
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-800 via-slate-950 to-indigo-950 flex flex-col justify-between p-6 text-center">
              <div />
              <div className="space-y-4">
                <div className="w-16 h-16 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-lg border border-emerald-400">
                  🌾
                </div>
                <h1 className="text-xl font-black text-white tracking-tight">ஊరుమిత్ర — OoruMitra</h1>
                
                <div className="space-y-1.5 text-left max-w-[240px] mx-auto text-[9px] text-slate-300 font-semibold">
                  {['Buy & Sell Products', 'Find Certified Workers', 'Vehicle Rentals & Leases', 'Transport & Cargo Logistics', '24/7 Local Emergency Services', 'Community News & Announcements'].map(feat => (
                    <div key={feat} className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pb-4">
                <p className="text-[10px] text-slate-300 font-bold">"One App for Every Village Need"</p>
                <div className="flex gap-1.5 justify-center">
                  <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded text-[8px] font-bold text-white">Google Play</div>
                  <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded text-[8px] font-bold text-white">App Store</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
