/**
 * FurnaceSim — simulasi data sensor tungku secara real-time (gantikan MQTT/WebSocket
 * di versi demo). Nilai suhu & tekanan berfluktuasi acak-acak dan disimpan ke
 * localStorage agar tetap "hidup" saat berpindah halaman.
 */

import { demoStorage } from './storage'

const FURNACE_IDS = ['furnace1', 'furnace2', 'furnace3', 'furnace4']

// Rentang nilai realistis per tungku
const RANGE = {
  furnace1: { suhu: [60, 220], tekanan: [1.0, 6.0] },
  furnace2: { suhu: [50, 200], tekanan: [0.8, 5.5] },
  furnace3: { suhu: [70, 250], tekanan: [1.2, 7.0] },
  furnace4: { suhu: [40, 180], tekanan: [0.5, 4.5] },
}

const randomRange = (min, max) => Math.random() * (max - min) + min

export const startFurnaceSim = (onUpdate) => {
  // Inisialisasi nilai awal jika belum ada
  const live = demoStorage.getLiveData()
  FURNACE_IDS.forEach((id) => {
    if (!live[id]) {
      live[id] = {
        suhu: randomRange(...RANGE[id].suhu).toFixed(1),
        tekanan: randomRange(...RANGE[id].tekanan).toFixed(2),
        setpoint: '0.0',
      }
    }
  })
  demoStorage.updateLiveData('__init__', {}) // paksa tulis ulang ke localStorage

  const interval = setInterval(() => {
    const statuses = demoStorage.getFurnaceStatus()
    const next = { ...live }

    FURNACE_IDS.forEach((id) => {
      const st = statuses[id] || {}
      const isActive = st.is_active

      // Suhu naik ketika aktif & mode auto, sedikit menurun ketika idle
      let suhu = parseFloat(live[id].suhu || '0')
      let tekanan = parseFloat(live[id].tekanan || '0')

      if (isActive) {
        suhu += randomRange(-0.5, 1.2)
        tekanan += randomRange(-0.02, 0.05)
      } else {
        suhu += randomRange(-1.0, 0.2)
        tekanan += randomRange(-0.05, 0.02)
      }

      const r = RANGE[id]
      suhu = Math.min(Math.max(suhu, r.suhu[0] - 10), r.suhu[1] + 10)
      tekanan = Math.min(Math.max(tekanan, r.tekanan[0] - 0.5), r.tekanan[1] + 0.5)

      next[id] = {
        suhu: suhu.toFixed(1),
        tekanan: tekanan.toFixed(2),
        setpoint: live[id].setpoint || '0.0',
      }
    })

    demoStorage.updateLiveData('__batch__', {})
    Object.entries(next).forEach(([id, val]) => {
      demoStorage.updateLiveData(id, val)
    })

    onUpdate?.(next)
  }, 2000)

  return () => clearInterval(interval)
}

export { FURNACE_IDS }
