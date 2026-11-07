import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
import { demoStorage } from './storage';

/**
 * useLogMonitoring (Demo) — versi dummy dari custom hook asli.
 * Tidak memanggil backend API. Semua data dibaca dari demoStorage (localStorage).
 * Struktur return sama persis dengan versi asli agar halaman UI tidak perlu diubah banyak.
 */
export const useLogMonitoring = () => {
    const [availableLogs, setAvailableLogs] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [fullName, setFullName] = useState("Memuat...");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedFurnace, setSelectedFurnace] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [availableSessions, setAvailableSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [isSessionLoading, setIsSessionLoading] = useState(false);

    // Ambil data user dari localStorage (ganti jwtDecode + axios)
    useEffect(() => {
        const user = demoStorage.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setFullName(user.nama_lengkap || user.username || "Operator");
        } else {
            setFullName("Pengguna Tidak Terotentikasi");
        }
    }, []);

    // Efek untuk mengambil dan mengelompokkan data log awal (dummy dari localStorage)
    useEffect(() => {
        setIsLoading(true);
        try {
            const logs = demoStorage.getAccessLogs();

            // Kelompokkan log berdasarkan tanggal (waktu_mulai) dan furnace_id
            const groups = logs.reduce((acc, log) => {
                if (!log.waktu_mulai || !log.furnace_id) return acc;
                const dateKey = log.waktu_mulai.split('T')[0];
                if (!acc[dateKey]) {
                    acc[dateKey] = new Set();
                }
                acc[dateKey].add(log.furnace_id);
                return acc;
            }, {});
            const finalGroups = {};
            for (const date in groups) {
                finalGroups[date] = Array.from(groups[date]).sort();
            }
            setAvailableLogs(finalGroups);

            if (logs.length > 0 && logs[0].nama_operator) {
                setFullName(logs[0].nama_operator);
            }
        } catch (err) {
            console.error("Gagal memuat log dummy:", err);
            setAvailableLogs({});
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Efek untuk mengambil data sesi berdasarkan tanggal dan tungku (dummy)
    useEffect(() => {
        const fetchSessions = async () => {
            if (!selectedDate || !selectedFurnace) {
                setAvailableSessions([]);
                setSelectedSession(null);
                return;
            }

            setIsSessionLoading(true);
            setAvailableSessions([]);
            setSelectedSession(null);
            try {
                const dateKey = format(selectedDate, 'yyyy-MM-dd');
                const allLogs = demoStorage.getAccessLogs();

                // Filter sesi yang cocok tanggal dan furnace
                const sessions = allLogs.filter((log) => {
                    const logDate = log.waktu_mulai ? log.waktu_mulai.split('T')[0] : null;
                    return logDate === dateKey && log.furnace_id === selectedFurnace;
                });

                setAvailableSessions(sessions);
            } catch (error) {
                console.error("Gagal mengambil daftar sesi dummy:", error);
                alert("Gagal memuat daftar sesi.");
            } finally {
                setIsSessionLoading(false);
            }
        };
        fetchSessions();
    }, [selectedDate, selectedFurnace]);

    // Efek untuk mereset chart jika pilihan berubah
    useEffect(() => {
        if (showChart) {
            setShowChart(false);
            setChartData([]);
        }
    }, [selectedDate, selectedFurnace, selectedSession]);

    // Memoized values
    const availableDates = useMemo(() => Object.keys(availableLogs).map(dateStr => new Date(dateStr)), [availableLogs]);
    const availableFurnaces = useMemo(() => {
        if (!selectedDate) return [];
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        return availableLogs[dateKey] || [];
    }, [selectedDate, availableLogs]);
    const totalUniqueFurnaces = useMemo(() => {
        const uniqueFurnaces = new Set();
        Object.values(availableLogs).forEach(furnaces => {
            furnaces.forEach(id => uniqueFurnaces.add(id));
        });
        return uniqueFurnaces.size;
    }, [availableLogs]);

    // Efek untuk mereset tungku jika tidak valid
    useEffect(() => {
        if (selectedDate && availableFurnaces.length > 0 && !availableFurnaces.includes(selectedFurnace)) {
            setSelectedFurnace(null);
        } else if (selectedDate && availableFurnaces.length === 0) {
            setSelectedFurnace(null);
        }
    }, [selectedDate, availableLogs, selectedFurnace, availableFurnaces]);

    // Handler unduh CSV (dummy)
    const handleDownload = async () => {
        if (!selectedSession) {
            alert('Harap pilih tanggal, tungku, dan sesi terlebih dahulu.');
            return;
        }

        setIsLoading(true);
        try {
            // Buat CSV dummy dari data sesi
            const csvContent = [
                ['timestamp', 'suhu', 'tekanan'],
                ...chartData.map((d) => [d.timestamp, d.suhu, d.tekanan].join(',')),
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const dateKey = format(selectedDate, 'yyyy-MM-dd');
            const fileName = `log_sesi_${selectedSession.session_id}_${selectedFurnace}_${dateKey}.csv`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            alert('File log sesi berhasil diunduh (dummy)!');
        } catch (error) {
            console.error('Gagal download file CSV:', error);
            alert('Gagal mengunduh data log.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handler lihat grafik — generate dummy chart data untuk sesi yang dipilih
    const handleViewChart = async () => {
        if (showChart) {
            setShowChart(false);
            return;
        }
        if (!selectedSession) {
            alert('Harap pilih tanggal, tungku, dan sesi terlebih dahulu.');
            return;
        }

        setIsChartLoading(true);
        setShowChart(true);
        setChartData([]);
        try {
            // Generate dummy chart data: titik data setiap 1 menit dari waktu_mulai hingga waktu_selesai
            const start = new Date(selectedSession.waktu_mulai);
            const end = selectedSession.waktu_selesai ? new Date(selectedSession.waktu_selesai) : new Date(Date.now());
            const setpoint = selectedSession.suhu_setpoint || 150;

            const data = [];
            let current = new Date(start);
            const intervalMs = 60 * 1000; // 1 menit

            while (current <= end) {
                // Suhu fluktuasi di sekitar setpoint
                const suhu = Number((setpoint + (Math.random() * 10 - 5)).toFixed(1));
                const tekanan = Number((2.5 + (Math.random() * 2 - 1)).toFixed(2));
                data.push({
                    timestamp: new Date(current).toISOString(),
                    suhu,
                    tekanan,
                });
                current = new Date(current.getTime() + intervalMs);
            }

            setChartData(data);
        } catch (error) {
            console.error('Gagal mengambil data untuk grafik dummy:', error);
            alert('Gagal memuat data grafik.');
            setShowChart(false);
        } finally {
            setIsChartLoading(false);
        }
    };

    return {
        currentUser, fullName, availableLogs, totalUniqueFurnaces,
        selectedDate, selectedFurnace, selectedSession,
        availableDates, availableFurnaces, availableSessions,
        showChart, chartData,
        isLoading, isChartLoading, isSessionLoading,
        setSelectedDate, setSelectedFurnace, setSelectedSession,
        handleDownload, handleViewChart
    };

};
