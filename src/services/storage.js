/**
 * DemoStorage — lapisan penyimpanan dummy yang di-back oleh localStorage.
 *
 * Tidak perlu backend. Semua data (user, operator, log akses, status tungku)
 * disimpan di browser (localStorage) sehingga input tetap tersimpan meski
 * halaman di-refresh, tapi akan hilang saat tombol "Reset Data" ditekan
 * (localStorage dibersihkan & di-seed ulang).
 */

const STORAGE_KEY = 'demo_lab_energi_v1'
const SEED_FLAG = 'demo_lab_energi_seeded_v1'

// ---------- Data dummy awal (seed) ----------
const SEED_USERS = [
  {
    id: '1',
    nama_lengkap: 'Administrator Sistem',
    username: 'admin',
    password: 'admin123',
    NIM: 'ADMIN0001',
    email: 'admin@fst.unja.ac.id',
    role: 'admin',
    createdAt: new Date('2026-01-01').toISOString(),
  },
  {
    id: '2',
    nama_lengkap: 'Budi Santoso',
    username: 'operator',
    password: 'operator123',
    NIM: '22010001',
    email: 'budi@fst.unja.ac.id',
    role: 'operator',
    createdAt: new Date('2026-01-05').toISOString(),
  },
  {
    id: '3',
    nama_lengkap: 'Siti Rahayu',
    username: 'viewer',
    password: 'viewer123',
    NIM: '22010002',
    email: 'siti@fst.unja.ac.id',
    role: 'viewer',
    createdAt: new Date('2026-01-10').toISOString(),
  },
]

const SEED_FURNACES = ['furnace1', 'furnace2', 'furnace3', 'furnace4']

const SEED_ACCESS_LOGS = [
  {
    id: 'log-1',
    session_id: 'S-20260105-001',
    nama_operator: 'Budi Santoso',
    operator_id: '2',
    furnace_id: 'furnace1',
    waktu_mulai: new Date('2026-01-05T08:00:00').toISOString(),
    waktu_selesai: new Date('2026-01-05T11:30:00').toISOString(),
    suhu_setpoint: 150,
  },
  {
    id: 'log-2',
    session_id: 'S-20260106-002',
    nama_operator: 'Budi Santoso',
    operator_id: '2',
    furnace_id: 'furnace2',
    waktu_mulai: new Date('2026-01-06T09:15:00').toISOString(),
    waktu_selesai: new Date('2026-01-06T14:00:00').toISOString(),
    suhu_setpoint: 180,
  },
  {
    id: 'log-3',
    session_id: 'S-20260107-003',
    nama_operator: 'Budi Santoso',
    operator_id: '2',
    furnace_id: 'furnace3',
    waktu_mulai: new Date('2026-01-07T10:00:00').toISOString(),
    waktu_selesai: null,
    suhu_setpoint: 200,
  },
]

const initialFurnaceStatus = SEED_FURNACES.reduce((acc, id) => {
  acc[id] = {
    furnace_id: id,
    is_active: false,
    active_user_id: null,
    active_user_fullname: null,
    mode: 'manual',
    power: 'off',
    last_updated: new Date().toISOString(),
  }
  return acc
}, {})

// Furnace 1 sudah aktif & dikunci operator lain (dummy) — tidak bisa diakses operator lain
initialFurnaceStatus['furnace1'] = {
  furnace_id: 'furnace1',
  is_active: true,
  active_user_id: 'operator-lain',
  active_user_fullname: 'Operator Lain',
  mode: 'auto',
  power: 'on',
  last_updated: new Date().toISOString(),
}

const initialLiveData = SEED_FURNACES.reduce((acc, id) => {
  acc[id] = { suhu: '0.0', tekanan: '0.00', setpoint: '0.0' }
  return acc
}, {})

const seedData = () => ({
  users: SEED_USERS,
  furnaces: SEED_FURNACES,
  furnaceStatus: initialFurnaceStatus,
  liveData: initialLiveData,
  accessLogs: SEED_ACCESS_LOGS,
})

// ---------- Helper localStorage ----------
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch (e) {
    return fallback
  }
}

const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export class DemoStorage {
  constructor() {
    this._ensureSeeded()
  }

  // Pastikan ada data dummy saat pertama kali dimuat
  _ensureSeeded() {
    if (!localStorage.getItem(SEED_FLAG)) {
      const data = seedData()
      save(`${STORAGE_KEY}:users`, data.users)
      save(`${STORAGE_KEY}:furnaces`, data.furnaces)
      save(`${STORAGE_KEY}:furnaceStatus`, data.furnaceStatus)
      save(`${STORAGE_KEY}:liveData`, data.liveData)
      save(`${STORAGE_KEY}:accessLogs`, data.accessLogs)
      localStorage.setItem(SEED_FLAG, '1')
    }
    // ⬜ WAJIB: selalu paksa furnace1 terkunci operator lain (dummy)
    this._forceFurnace1Locked()
  }

  _forceFurnace1Locked() {
    const statuses = this.getFurnaceStatus()
    statuses['furnace1'] = {
      furnace_id: 'furnace1',
      is_active: true,
      active_user_id: 'operator-lain',
      active_user_fullname: 'Operator Lain',
      mode: 'auto',
      power: 'on',
      last_updated: new Date().toISOString(),
    }
    save(`${STORAGE_KEY}:furnaceStatus`, statuses)
  }

  /** Bersihkan semua data demo dari localStorage lalu seed ulang dummy. */
  reset() {
    localStorage.removeItem(`${STORAGE_KEY}:users`)
    localStorage.removeItem(`${STORAGE_KEY}:furnaces`)
    localStorage.removeItem(`${STORAGE_KEY}:furnaceStatus`)
    localStorage.removeItem(`${STORAGE_KEY}:liveData`)
    localStorage.removeItem(`${STORAGE_KEY}:accessLogs`)
    localStorage.removeItem(SEED_FLAG)
    // Hapus juga sisa auth agar kembali ke layar login
    localStorage.removeItem('demo_token')
    localStorage.removeItem('demo_role')
    localStorage.removeItem('demo_username')
    this._ensureSeeded()
  }

  /* ---------- Auth ---------- */
  login(username, password) {
    const users = this.getUsers()
    const user = users.find(
      (u) => u.username === username && u.password === password,
    )
    if (!user) return null
    const { password: _pw, ...userWithoutPw } = user
    return userWithoutPw
  }

  getCurrentUser() {
    try {
      const raw = localStorage.getItem('demo_user')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  }

  setCurrentUser(user) {
    localStorage.setItem('demo_user', JSON.stringify(user))
    localStorage.setItem('demo_token', 'demo-token-' + user.id)
    localStorage.setItem('demo_role', user.role)
    localStorage.setItem('demo_username', user.username)
  }

  clearAuth() {
    localStorage.removeItem('demo_user')
    localStorage.removeItem('demo_token')
    localStorage.removeItem('demo_role')
    localStorage.removeItem('demo_username')
  }

  isAuthenticated() {
    return !!localStorage.getItem('demo_token')
  }

  /* ---------- Users / Operator ---------- */
  getUsers() {
    return load(`${STORAGE_KEY}:users`, [])
  }

  addUser(user) {
    const users = this.getUsers()
    const newUser = {
      ...user,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    }
    save(`${STORAGE_KEY}:users`, [...users, newUser])
    return newUser
  }

  updateUser(id, data) {
    const users = this.getUsers()
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) return null
    users[idx] = { ...users[idx], ...data }
    save(`${STORAGE_KEY}:users`, users)
    return users[idx]
  }

  deleteUser(id) {
    const users = this.getUsers()
    const filtered = users.filter((u) => u.id !== id)
    save(`${STORAGE_KEY}:users`, filtered)
    return filtered
  }

  /* ---------- Furnaces ---------- */
  getFurnaces() {
    return load(`${STORAGE_KEY}:furnaces`, SEED_FURNACES)
  }

  getFurnaceStatus() {
    return load(`${STORAGE_KEY}:furnaceStatus`, initialFurnaceStatus)
  }

  updateFurnaceStatus(furnaceId, status) {
    const statuses = this.getFurnaceStatus()
    statuses[furnaceId] = {
      ...statuses[furnaceId],
      ...status,
      furnace_id: furnaceId,
      last_updated: new Date().toISOString(),
    }
    save(`${STORAGE_KEY}:furnaceStatus`, statuses)
    return statuses[furnaceId]
  }

  getLiveData() {
    return load(`${STORAGE_KEY}:liveData`, initialLiveData)
  }

  updateLiveData(furnaceId, data) {
    const live = this.getLiveData()
    live[furnaceId] = { ...live[furnaceId], ...data }
    save(`${STORAGE_KEY}:liveData`, live)
    return live[furnaceId]
  }

  /* ---------- Access logs ---------- */
  getAccessLogs() {
    return load(`${STORAGE_KEY}:accessLogs`, [])
  }

  addAccessLog(log) {
    const logs = this.getAccessLogs()
    const newLog = { ...log, id: String(Date.now()), session_id: log.session_id || 'S-' + Date.now() }
    save(`${STORAGE_KEY}:accessLogs`, [newLog, ...logs])
    return newLog
  }

  endAccessSession(sessionId) {
    const logs = this.getAccessLogs()
    const idx = logs.findIndex((l) => l.session_id === sessionId)
    if (idx === -1) return null
    logs[idx].waktu_selesai = new Date().toISOString()
    save(`${STORAGE_KEY}:accessLogs`, logs)
    return logs[idx]
  }
}

export const demoStorage = new DemoStorage()
