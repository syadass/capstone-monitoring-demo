import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { demoStorage } from '../../services/storage'
import { startFurnaceSim, FURNACE_IDS } from '../../services/furnaceSim'
import ScadaStyles from '../../components/viewer/dashboard/ScadaStyles'
import ThermometerVisual from '../../components/viewer/dashboard/ThermometerVisual'
import FurnaceAssembly from '../../components/viewer/dashboard/FurnaceAssembly'

const ViewerDashboard = () => {
  const [liveData, setLiveData] = useState(demoStorage.getLiveData())
  const [furnaceStatuses, setFurnaceStatuses] = useState(demoStorage.getFurnaceStatus())
  const [isSimActive, setIsSimActive] = useState(false)

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

  return (
    <div className="min-h-screen bg-sky-50 font-sans">
      <ScadaStyles />
      <Header role="viewer" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Monitoring Tungku</h1>
            <p className="text-sm text-gray-500">Pantauan data suhu & tekanan secara waktu nyata (simulasi demo).</p>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded-full shadow-md border border-gray-200">
            <span
              className={`h-3 w-3 rounded-full ${isSimActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
            ></span>
            <span className="text-xs font-semibold text-gray-600">
              {isSimActive ? 'Simulasi Aktif' : 'Simulasi Mati'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-start gap-16">
          {FURNACE_IDS.map((furnace, index) => {
            const status = furnaceStatuses[furnace] || {}
            const data = liveData[furnace] || { suhu: '0.0', tekanan: '0.00' }
            const active = status.is_active

            return (
              <div key={furnace} className="relative p-4" style={{ minWidth: '350px', minHeight: '400px' }}>
                {active && (
                  <div className="absolute top-2 right-2 flex items-center justify-center z-30">
                    <span className="text-sm font-bold p-2 bg-yellow-600 text-white rounded-lg shadow-xl border border-yellow-400">
                      AKTIF: {status.active_user_fullname || 'User'}
                    </span>
                  </div>
                )}
                <div className="flex justify-center items-center gap-8">
                  <div className="relative z-10 pt-16">
                    <ThermometerVisual value={data.suhu} max={100} />
                  </div>
                  <div className="flex flex-col items-center">
                    <FurnaceAssembly
                      furnaceName={`Furnace ${index + 1}`}
                      pressureValue={data.tekanan}
                      pressureMax={10}
                      isActive={status?.is_active}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ViewerDashboard
