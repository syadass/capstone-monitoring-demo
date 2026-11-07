import { Navigate, Outlet } from 'react-router-dom'
import { demoStorage } from '../services/storage'

/**
 * ProtectedRoute — memastikan user sudah login (demo token di localStorage).
 * Menggunakan <Outlet /> agar child route (halaman dashboard, dll.) tetap dirender.
 */
const ProtectedRoute = ({ roles }) => {
  if (!demoStorage.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  const user = demoStorage.getCurrentUser()
  if (roles && !roles.includes(user.role)) {
    // Akses ditolak untuk role yang tidak cocok
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-2">Akses Ditolak</h2>
          <p className="text-slate-600 mb-6">
            Anda ({user.username}) tidak memiliki izin untuk halaman ini.
          </p>
          <button
            onClick={() => {
              demoStorage.clearAuth()
              window.location.href = '/login'
            }}
            className="px-6 py-2 text-white rounded-lg bg-[#3674B5] hover:bg-[#2770d9] transition"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    )
  }

  return <Outlet />
}

export default ProtectedRoute
