import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import AdminHeader from '../../components/adminHeader'
import {
  ChevronLeft as FaChevronLeft,
  ChevronRight as FaChevronRight,
  Download as FaDownload,
  Trash2 as FaTrash,
} from 'lucide-react'
import { demoStorage } from '../../services/storage'

const RiwayatAkses = () => {
  const [accessLogs, setAccessLogs] = useState([])
  const [searchLogs, setSearchLogs] = useState('')
  const [entriesLogs, setEntriesLogs] = useState(5)
  const [currentPageLogs, setCurrentPageLogs] = useState(1)
  const user = demoStorage.getCurrentUser()

  useEffect(() => {
    setAccessLogs(demoStorage.getAccessLogs())
  }, [])

  const resetAllData = () => {
    if (!window.confirm('Yakin ingin mereset semua data demo? Semua input (operator, log akses, status tungku) akan hilang dan kembali ke data dummy awal.')) return
    demoStorage.reset()
    setAccessLogs(demoStorage.getAccessLogs())
    alert('Data demo telah direset ke kondisi awal (dummy).')
  }

  const filteredLogs = accessLogs.filter(
    (log) =>
      (log.nama_operator?.toLowerCase() || '').includes(searchLogs.toLowerCase()) ||
      (log.furnace_id?.toString().toLowerCase() || '').includes(searchLogs.toLowerCase()),
  )
  const totalPagesLogs = Math.ceil(filteredLogs.length / entriesLogs)
  const startIndexLogs = (currentPageLogs - 1) * entriesLogs
  const currentLogs = filteredLogs.slice(startIndexLogs, startIndexLogs + entriesLogs)

  const formatDate = (iso) => {
    if (!iso) return 'Masih Berjalan'
    return new Date(iso).toLocaleString('id-ID')
  }

  return (
    <div className="flex min-h-screen bg-blue-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 pt-[60px]">
        <AdminHeader />
        <main className="p-6 flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#3674B5]">Riwayat Akses Tungku</h1>
              <p className="text-sm text-gray-500">Log sesi penggunaan tungku oleh operator.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetAllData}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md bg-orange-600 hover:from-orange-700 hover:to-orange-600 hover:scale-105 transition transform bg-gradient-to-r from-orange-600 to-orange-500"
              >
                <FaTrash /> Reset Data Demo
              </button>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
              <div>
                <label className="text-sm text-gray-600">
                  Lihat{' '}
                  <select
                    value={entriesLogs}
                    onChange={(e) => {
                      setEntriesLogs(Number(e.target.value))
                      setCurrentPageLogs(1)
                    }}
                    className="border rounded px-2 py-1 mx-2 shadow-sm focus:ring focus:ring-[#3674B5] transition"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  entri
                </label>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Cari:</label>
                <input
                  type="text"
                  value={searchLogs}
                  onChange={(e) => {
                    setSearchLogs(e.target.value)
                    setCurrentPageLogs(1)
                  }}
                  className="border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-[#3674B5] shadow-sm transition"
                  placeholder="Cari operator/tungku..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#c0d6f9] to-[#9bbce4] text-left">
                    <th className="p-3">No.</th>
                    <th className="p-3">Nama Operator</th>
                    <th className="p-3">Tungku</th>
                    <th className="p-3">Waktu Mulai</th>
                    <th className="p-3">Waktu Selesai</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.map((row, i) => (
                    <tr
                      key={row.session_id || row.id}
                      className={`transition-all duration-300 hover:bg-blue-50 ${
                        i % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                      }`}
                    >
                      <td className="p-3 text-center">{startIndexLogs + i + 1}</td>
                      <td className="p-3">{row.nama_operator || '(User Dihapus)'}</td>
                      <td className="p-3 capitalize">{row.furnace_id}</td>
                      <td className="p-3">{formatDate(row.waktu_mulai)}</td>
                      <td className="p-3">
                        {row.waktu_selesai ? formatDate(row.waktu_selesai) : 'Masih Berjalan'}
                      </td>
                      <td className="p-3 flex gap-2 justify-center">
                        {!row.waktu_selesai && (
                          <button
                            onClick={() => {
                              demoStorage.endAccessSession(row.session_id)
                              setAccessLogs(demoStorage.getAccessLogs())
                              alert('Sesi diakhiri.')
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-white rounded-lg shadow-md bg-gradient-to-r from-[#3674B5] to-[#133E87] hover:opacity-90 transition"
                          >
                            Akhiri Sesi
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center p-6 text-gray-500 italic">
                        Belum ada data riwayat akses.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm text-gray-600">
              <p>
                Lihat {startIndexLogs + 1} dari {filteredLogs.length} entri
              </p>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <button
                  disabled={currentPageLogs === 1}
                  onClick={() => setCurrentPageLogs((p) => p - 1)}
                  className={`p-2 rounded-full transition ${
                    currentPageLogs === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 hover:scale-110'
                  }`}
                >
                  <FaChevronLeft size={16} />
                </button>
                <div className="px-3 py-1 text-white font-medium rounded-lg shadow" style={{ backgroundColor: '#3674B5' }}>
                  {currentPageLogs}
                </div>
                <button
                  disabled={currentPageLogs === totalPagesLogs || totalPagesLogs === 0}
                  onClick={() => setCurrentPageLogs((p) => p + 1)}
                  className={`p-2 rounded-full transition ${
                    currentPageLogs === totalPagesLogs || totalPagesLogs === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 hover:scale-110'
                  }`}
                >
                  <FaChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default RiwayatAkses
