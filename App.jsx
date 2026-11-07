import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './src/pages/Login'
import ProtectedRoute from './src/components/ProtectedRoute'

// --- ADMIN ---
import AdminDashboard from './src/pages/admin/Dashboard'
import DataOperator from './src/pages/admin/DataOperator'
import FormTambah from './src/pages/admin/FormTambah'
import FormEdit from './src/pages/admin/FormEdit'
import LihatDataOperator from './src/pages/admin/LihatDataOperator'
import RiwayatAkses from './src/pages/admin/RiwayatAkses'

// --- OPERATOR ---
import OperatorDashboard from './src/pages/operator/Dashboard'
import LogMonitoring from './src/pages/operator/logMonitoring'

// --- VIEWER ---
import ViewerDashboard from './src/pages/viewer/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        {/* Publik */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Terlindungi (auth required) */}
        <Route element={<ProtectedRoute />}>
          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/data-operator" element={<DataOperator />} />
          <Route path="/admin/form-tambah" element={<FormTambah />} />
          <Route path="/admin/form-edit/:id" element={<FormEdit />} />
          <Route path="/admin/lihat-data-operator" element={<LihatDataOperator />} />
          <Route path="/admin/riwayat-akses" element={<RiwayatAkses />} />

          {/* Operator (furnace real-time simulation) */}
          <Route path="/operator/dashboard" element={<OperatorDashboard />} />
          <Route path="/operator/log-monitoring" element={<LogMonitoring />} />

          {/* Viewer */}
          <Route path="/viewer/dashboard" element={<ViewerDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
