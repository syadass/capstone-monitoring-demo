import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import AdminHeader from '../../components/adminHeader'
import { demoStorage } from '../../services/storage'

export default function TambahOperator() {
  const navigate = useNavigate()
  const user = demoStorage.getCurrentUser()

  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    username: '',
    password: '',
    nim: '',
    role: 'operator',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ Password dan Konfirmasi Password tidak sama!')
      return
    }

    setLoading(true)
    setMessage('')

    // Simulasi proses penyimpanan dummy
    setTimeout(() => {
      try {
        const existing = demoStorage.getUsers().find((u) => u.username === formData.username)
        if (existing) {
          setMessage('❌ Username sudah terdaftar.')
          setLoading(false)
          return
        }

        demoStorage.addUser({
          nama_lengkap: formData.namaLengkap,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          NIM: formData.nim,
          role: formData.role,
        })

        setMessage('✅ Operator berhasil ditambahkan!')
        setFormData({
          namaLengkap: '',
          email: '',
          username: '',
          password: '',
          nim: '',
          role: 'operator',
          confirmPassword: '',
        })

        setTimeout(() => navigate(-1), 800)
      } catch (error) {
        setMessage('❌ Pendaftaran gagal.')
      } finally {
        setLoading(false)
      }
    }, 500)
  }

  const handleCancel = () => {
    setFormData({
      namaLengkap: '',
      email: '',
      username: '',
      password: '',
      nim: '',
      role: 'operator',
      confirmPassword: '',
    })
    setMessage('')
    navigate(-1)
  }

  return (
    <div className="flex min-h-screen bg-blue-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 pt-[60px]">
        <AdminHeader />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-[#3674B5]">Form Tambah Operator</h2>

          {message && (
            <div
              className={`mb-4 p-3 rounded font-medium ${
                message.startsWith('✅')
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block mb-2 font-medium">Nama Lengkap:</label>
              <input
                type="text"
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus-ring-blue-300 outline-none focus:ring-[#3674B5]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-[#3674B5] outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-[#3674B5] outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-[#3674B5] outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">NIM:</label>
              <input
                type="text"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-[#3674B5] outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Konfirmasi Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-[#3674B5] outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-[#3674B5] outline-none"
                required
              >
                <option value="operator">Operator</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <div className="col-span-2 flex justify-end gap-4 mt-4 border-t pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center px-6 py-2.5 text-white font-bold rounded-lg shadow-md transition transform ${
                  loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#3674B5] to-[#133E87] hover:opacity-90 hover:scale-105'
                }`}
              >
                {loading ? 'Proses...' : 'Tambah'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center px-6 py-2.5 text-white font-bold rounded-lg shadow-md bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition transform hover:scale-105"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
