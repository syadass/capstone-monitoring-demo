import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { LogOut, LayoutDashboard, Activity } from 'lucide-react'
import LogoutModal from './LogoutModal'
import { demoStorage } from '../services/storage'

/**
 * Header untuk Operator & Viewer — sama persis dengan versi asli.
 * Role diterima melalui prop dari masing-masing halaman dashboard.
 */
const Header = ({ role }) => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const user = demoStorage.getCurrentUser()

  const handleLogoutConfirm = () => {
    demoStorage.clearAuth()
    setIsModalOpen(false)
    navigate('/login')
  }

  return (
    <>
      <header
        className="bg-gradient-to-r from-[#3674B5] to-[#1C4E8C] shadow-xl px-6 py-3 flex items-center justify-between backdrop-blur-md rounded-b-lg"
      >
        <div className="flex items-center space-x-3">
          <img
            src="/assets/logo.jpg"
            alt="Logo"
            className="w-12 h-12 object-contain"
          />
        </div>

        <nav className="flex space-x-6 text-white font-medium">
          {role === 'operator' ? (
            <>
              <NavLink
                to="/operator/dashboard"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform ${isActive ? 'bg-white/30 backdrop-blur-sm text-white shadow-md scale-105' : 'hover:bg-white/20 hover:scale-105'}`
                }
              >
                <LayoutDashboard size={20} />
                <span className="font-semibold">Dashboard</span>
              </NavLink>
              <NavLink
                to="/operator/log-monitoring"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform ${isActive ? 'bg-white/30 backdrop-blur-sm text-white shadow-md scale-105' : 'hover:bg-white/20 hover:scale-105'}`
                }
              >
                <Activity size={20} />
                <span className="font-semibold">Log Monitoring</span>
              </NavLink>
            </>
          ) : (
            <NavLink
              to="/viewer/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform ${isActive ? 'bg-white/30 backdrop-blur-sm text-white shadow-md scale-105' : 'hover:bg-white/20 hover:scale-105'}`
              }
            >
              <LayoutDashboard size={20} />
              <span className="font-semibold">Dashboard</span>
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-white/20 backdrop-blur px-2 py-1 rounded-full border border-white/30">
            {role}
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 text-white font-semibold shadow-md p-2 rounded-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 transform"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  )
}

export default Header
