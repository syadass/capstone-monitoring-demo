import { AlertTriangle } from 'lucide-react'

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/10 flex justify-center items-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-br from-[#2A3B52] to-[#1C283A] text-white rounded-xl shadow-2xl p-6 max-w-md w-full m-4 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-yellow-500/10 rounded-full mb-4">
            <AlertTriangle className="text-yellow-400 h-12 w-12" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Konfirmasi Logout</h2>
          <p className="text-slate-300 mb-8">Apakah Anda yakin ingin keluar?</p>
          <div className="flex justify-center gap-4 w-full">
            <button
              onClick={onClose}
              className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2.5 px-8 rounded-lg transition-colors duration-300 w-full md:w-auto"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-8 rounded-lg transition-colors duration-300 w-full md:w-auto"
            >
              Ya, Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal
