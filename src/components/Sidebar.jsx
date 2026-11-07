import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Gauge,
  UserCog,
  UserPlus,
  List,
  ChevronDown,
  ChevronRight,
  History,
  LogOut,
} from 'lucide-react'
import LogoutModal from './LogoutModal'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [openMenu, setOpenMenu] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const isManajemenOperatorActive =
    location.pathname.startsWith('/admin/tambah-operator') ||
    location.pathname.startsWith('/admin/data-operator') ||
    location.pathname.startsWith('/admin/riwayat-akses')

  useEffect(() => {
    if (isManajemenOperatorActive) setOpenMenu(true)
  }, [location.pathname, isManajemenOperatorActive])

  const handleLogout = () => {
    const { demoStorage } = require('../services/storage')
    demoStorage.clearAuth()
    setIsModalOpen(false)
    navigate('/login')
  }

  const startColor = '#2c5a95'
  const endColor = '#3674B5'
  const hoverColor = 'hover:bg-[#2770d9]'
  const activeColor = 'bg-[#2770d9]'
  const subMenuBg = 'bg-[#1f4773]'

  return (
    <>
      <aside
        className={`w-64 text-white flex flex-col min-h-screen fixed top-[60px] left-0 z-10 shadow-xl`}
        style={{
          backgroundImage: `linear-gradient(to bottom, ${startColor}, ${endColor})`,
        }}
      >
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {/* Dashboard */}
            <li>
              <NavLink
                to="/admin/dashboard"
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors text-base ${hoverColor} ${
                  isActive('/admin/dashboard') ? activeColor : ''
                }`}
              >
                <Gauge size={20} className="text-xl" /> Dashboard
              </NavLink>
            </li>

            {/* Dropdown Manajemen Operator */}
            <li className="mt-2">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors text-base ${hoverColor} ${
                  isManajemenOperatorActive ? activeColor : ''
                }`}
              >
                <span className="flex items-center gap-3">
                  <UserCog size={20} /> Manajemen Operator
                </span>
                {openMenu ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>

              {openMenu && (
                <ul className={`ml-3 mt-1 space-y-1 ${subMenuBg} rounded-b-lg p-1`}>
                  <li>
                    <NavLink
                      to="/admin/form-tambah"
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-[#2770d9] ${
                        isActive('/admin/form-tambah') ? activeColor : ''
                      }`}
                    >
                      <UserPlus size={20} /> Tambah Operator
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/data-operator"
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-[#2770d9] ${
                        isActive('/admin/data-operator') ? activeColor : ''
                      }`}
                    >
                      <List size={20} /> Daftar Operator
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/riwayat-akses"
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-[#2770d9] ${
                        isActive('/admin/riwayat-akses') ? activeColor : ''
                      }`}
                    >
                      <History size={20} /> Riwayat Akses
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            {/* Tombol Logout */}
            <li className="pt-4 border-t border-white border-opacity-30 mt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-3 p-3 text-base bg-red-600 hover:bg-red-700 rounded-lg w-full text-left transition-colors shadow-lg"
              >
                <LogOut size={20} /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  )
}

export default Sidebar
