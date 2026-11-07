import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { demoStorage } from '../../services/storage'
import { startFurnaceSim, FURNACE_IDS } from '../../services/furnaceSim'
import ScadaStyles from '../../components/operator/dashboard/scadaStyle'
import FurnaceCard from '../../components/operator/dashboard/furnaceCard'

export default function OperatorDashboard() {
  const user = demoStorage.getCurrentUser()

  const [liveData, setLiveData] = useState(demoStorage.getLiveData())
  const [furnaceStatuses, setFurnaceStatuses] = useState(demoStorage.getFurnaceStatus())
  const [setpoints, setSetpoints] = useState({})
  const [isSimActive, setIsSimActive] = useState(false)

  useEffect(() => {
    const initial = FURNACE_IDS.reduce((acc, id) => {
      acc[id] = { suhu: '' }
      return acc
    }, {})
    setSetpoints(initial)
  }, [])

  useEffect(() => {
    setIsSimActive(true)
    const stop = startFurnaceSim((next) => {
      setLiveData(next)
    })
    return () => {
      setIsSimActive(false)
      stop()
    }
  }, [])

  useEffect(() => {
    setFurnaceStatuses(demoStorage.getFurnaceStatus())
  }, [])

  const handleStartSession = (furnace) => {
    if (window.confirm(`Mulai sesi pada ${furnace}?`)) {
      demoStorage.updateFurnaceStatus(furnace, {
        is_active: true,
        active_user_id: user.id,
        active_user_fullname: user.nama_lengkap,
        mode: 'auto',
        power: 'on',
      })
      setFurnaceStatuses(demoStorage.getFurnaceStatus())
      demoStorage.addAccessLog({
        session_id: `S-${new Date().toISOString().slice(0, 13).replace(/[:-]/g, '')}-${furnace}`,
        nama_operator: user.nama_lengkap,
        operator_id: user.id,
        furnace_id: furnace,
        waktu_mulai: new Date().toISOString(),
        waktu_selesai: null,
        suhu_setpoint: null,
      })
      alert(`✅ Sesi ${furnace} dimulai (Mode AUTO aktif).`)
    }
  }

  const handleEndSession = (furnace) => {
    if (window.confirm(`Akhir sesi pada ${furnace}?`)) {
      demoStorage.updateFurnaceStatus(furnace, {
        is_active: false,
        active_user_id: null,
        active_user_fullname: null,
        mode: 'manual',
        power: 'off',
      })
      setFurnaceStatuses(demoStorage.getFurnaceStatus())
      alert(`⚠️ Sesi ${furnace} diakhiri (Power OFF).`)
    }
  }

  const handleChange = (furnace, field, value) => {
    setSetpoints((prev) => ({
      ...prev,
      [furnace]: { ...(prev[furnace] || {}), [field]: value },
    }))
  }

  const handleSetpointSubmit = (furnace) => {
    const { suhu } = setpoints[furnace] || { suhu: '' }
    if (suhu === '' || isNaN(suhu)) return alert('Masukkan suhu yang valid!')

    demoStorage.updateLiveData(furnace, { setpoint: Number(suhu).toFixed(1) })
    setLiveData((prev) => ({
      ...prev,
      [furnace]: { ...prev[furnace], setpoint: Number(suhu).toFixed(1) },
    }))
    alert(`🚀 Setpoint ${furnace} diubah menjadi ${suhu}°C (disimpan dummy).`)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <ScadaStyles />
      <Header role={user?.role} />
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-2xl font-bold text-slate-800">
            Sistem Kontrol & Monitoring Alat Laboratorium FST UNJA
          </h1>
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
            <div className={`h-3 w-3 rounded-full ${isSimActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-xs font-bold text-slate-600">
              {isSimActive ? 'WSS SERVER ACTIVE' : 'WSS SERVER DISCONNECTED'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {FURNACE_IDS.map((furnace, index) => (
            <FurnaceCard
              key={furnace}
              furnace={furnace}
              index={index}
              status={furnaceStatuses[furnace]}
              user={user}
              currentData={liveData[furnace] || { suhu: "0.0", tekanan: "0.00", setpoint: "0.0" }}
              setpoints={setpoints}
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
              onSetpointChange={handleChange}
              onSetpointSubmit={handleSetpointSubmit}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
