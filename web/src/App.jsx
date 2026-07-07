import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import PromotionalBanner from './pages/PromotionalBanner'
import PromotionalVideo from './pages/PromotionalVideo'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import Workers from './pages/Workers'
import Transport from './pages/Transport'
import VehicleWork from './pages/VehicleWork'
import Emergency from './pages/Emergency'
import Bookings from './pages/Bookings'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import Sell from './pages/Sell'
import ListingDetail from './pages/ListingDetail'
import RoleManagement from './pages/RoleManagement'
import VillageManagement from './pages/VillageManagement'
import UserManagement from './pages/UserManagement'
import ScreenshotsShowcase from './pages/ScreenshotsShowcase'

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-white border-t border-gray-100 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>🌾 OoruMitra — Connecting Rural India</p>
          <p className="mt-1">© {new Date().getFullYear()} OoruMitra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/screenshots/:id" element={<ScreenshotsShowcase />} />
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/banner" element={<PromotionalBanner />} />
                  <Route path="/promo" element={<PromotionalVideo />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/workers" element={<Workers />} />
                  <Route path="/transport" element={<Transport />} />
                  <Route path="/vehicle-work" element={<VehicleWork />} />
                  <Route path="/emergency" element={<Emergency />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/roles" element={<RoleManagement />} />
                  <Route path="/admin/villages" element={<VillageManagement />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/sell" element={<Sell />} />
                  <Route path="/:type/:id" element={<ListingDetail />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
