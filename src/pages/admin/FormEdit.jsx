import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import AdminHeader from '../../components/adminHeader'
import { demoStorage } from '../../services/storage'

export default function FormEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = demoStorage.getCurrentUser()

  const [formData, setFormData] = useState({
    nama_lengkap: '',
    username: '',
    nim: '',
    email: '',
    password: '',
    role: 'operator',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const users = demoStorage.getUsers()
    const u = users.find((x) => x.id === id)
    if (!u) {
      setMessage('❌ Data user tidak ditemukan.')
      setLoading(false)
      return
    }
    setFormData({
      nama_lengkap: u.nama_lengkap,
      username: u.username,
      nim: u.NIM,
      email: u.email,
      password: '',
      role: u.role,
    })
    setLoading(false)
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    setTimeout(() => {
      const updated = demoStorage.updateUser(id, {
        nama_lengkap: formData.nama_lengkap,
        username: formData.username,
        NIM: formData.nim,
        email: formData.email,
        role: formData.role,
        ...(formData.password ? { password: formData.password } : {}),
      })

      if (updated) {
        setMessage('✅ Data berhasil diperbarui!')
        setTimeout(() => navigate('/admin/dashboard'), 800)
      } else {
        setMessage('❌ Gagal memperbarui data user!')
      }
      setSubmitting(false)
    }, 500)
  }

  const handleCancel = () => navigate('/admin/dashboard')

  if (loading) return <p className="p-6">Memuat data...</p>

  return (
    <div className="flex min-h-screen bg-blue-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 pt-[60px]">
        <AdminHeader />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-[#3674B5]">Form Edit Operator</h2>
          {message && (
            <div
              className={`mb-4 p-3 rounded ${
                message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 grid grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className="block mb-2 font-medium">Nama Lengkap:</label>
              <input
                type="text"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                className="w-full p-2 border rounded shadow-sm"
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
                className="w-full p-2 border rounded shadow-sm"
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
                className="w-full p-2 border rounded shadow-sm"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Password Baru:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded shadow-sm"
                placeholder="Kosongkan jika tidak ingin mengganti"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded shadow-sm"
                required
              >
                <option value="operator">Operator</option>
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`flex items-center justify-center px-4 py-2 text-white rounded-lg shadow-md transition transform ${
                  submitting ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-[#3674B5] to-[#133E87] hover:opacity-90 hover:scale-105'
                }`}
              >
                {submitting ? 'Proses...' : 'Update'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center px-4 py-2 text-white rounded-lg shadow-md bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition transform hover:scale-105"
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
