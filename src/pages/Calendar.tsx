import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Bell, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore";

const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// Interface untuk data schedule dari Firestore
interface ScheduleEvent {
	id?: string;
	tanggal: string;
	nama_kegiatan: string;
	waktu_mulai: string;
	waktu_selesai: string;
	lokasi: string;
	kuota_maksimal: number;
}

export function Calendar() {
	const { userData } = useAuth();

	// Real-time Date States
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);

	// Modal States
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [namaKegiatan, setNamaKegiatan] = useState("");
	const [waktuMulai, setWaktuMulai] = useState("08:00");
	const [waktuSelesai, setWaktuSelesai] = useState("11:00");
	const [lokasi, setLokasi] = useState("Balai Desa Purwokerto");
	const [kuota, setKuota] = useState(50);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	// Ambil metadata tanggal untuk kalkulasi grid kalender
	const firstDayOfMonth = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	// Format tanggal helper YYYY-MM-DD
	const formatKeyDate = (day: number) => {
		const formattedMonth = String(month + 1).padStart(2, "0");
		const formattedDay = String(day).padStart(2, "0");
		return `${year}-${formattedMonth}-${formattedDay}`;
	};

	// Real-time Listener ke Firestore schedules untuk bulan yang sedang aktif dilihat
	// Jalankan listener real-time untuk memantau koleksi schedules
	useEffect(() => {
		// Panggil seluruh schedule yang berstatus aktif tanpa membatasi string tanggal di query
		const q = query(collection(db, "schedules"), where("status", "==", "aktif"));

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const loadedSchedules: ScheduleEvent[] = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as ScheduleEvent[];

				console.log("Data murni dari Firestore yang berhasil ditarik:", loadedSchedules);
				setSchedules(loadedSchedules);
			},
			(error) => {
				console.error("Firestore Listener Error:", error);
			},
		);

		return () => unsubscribe();
	}, [currentDate]); // Akan memicu ulang jika bulan/tahun berpindah
	// Navigasi Bulan
	const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
	const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

	// Menghitung event hari terpilih
	const selectedKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
	const activeEvents = schedules.filter((evt) => evt.tanggal === selectedKey);

	// Submit Event baru ke Firestore
	const handleCreateEvent = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!namaKegiatan) return;

		setIsSubmitting(true);
		try {
			await addDoc(collection(db, "schedules"), {
				tanggal: selectedKey,
				nama_kegiatan: namaKegiatan,
				waktu_mulai: waktuMulai,
				waktu_selesai: waktuSelesai,
				lokasi: lokasi,
				kuota_maksimal: Number(kuota),
				total_pendaftar: 0,
				dibuat_oleh: userData?.uid || "system",
				status: "aktif",
				dibuat_pada: new Date().toISOString(),
			});

			setNamaKegiatan("");
			setIsModalOpen(false);
			alert("Jadwal pemeriksaan berhasil diterbitkan!");
		} catch (error) {
			console.error("Gagal menyimpan jadwal:", error);
			alert("Gagal menambahkan jadwal.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Generate Array Grid Hari (Termasuk blank space/muted days dari bulan sebelumnya)
	const calendarCells = [];
	for (let i = 0; i < firstDayOfMonth; i++) {
		calendarCells.push({ day: null, type: "muted" });
	}
	for (let day = 1; day <= daysInMonth; day++) {
		const dateStr = formatKeyDate(day);
		const hasEvent = schedules.some((evt) => evt.tanggal === dateStr);

		const today = new Date();
		const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

		calendarCells.push({ day, type: "normal", hasEvent, isToday });
	}

	return (
		<div className="space-y-10 max-w-3xl mx-auto pb-12">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-4xl font-black text-gray-800 tracking-tight">Antrean & Jadwal</h1>
				<p className="text-gray-500 text-sm font-bold opacity-70 uppercase tracking-widest leading-relaxed">Pantau antrean dan jadwal Posyandu Anda secara real-time.</p>
			</div>

			{/* Calendar Header Control */}
			<div className="space-y-8">
				<div className="flex flex-col sm:flex-row justify-between items-center gap-6">
					<h2 className="text-xl font-black text-gray-800">Jadwal Bulan Ini</h2>
					<div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
						<button onClick={prevMonth} className="p-1.5 hover:bg-pink-50 text-gray-700 rounded-xl transition-all active:scale-90">
							<ChevronLeft className="w-5 h-5 stroke-[3px]" />
						</button>
						<span className="text-xs font-black min-w-[140px] text-center uppercase tracking-widest text-gray-800">
							{months[month]} {year}
						</span>
						<button onClick={nextMonth} className="p-1.5 hover:bg-pink-50 text-gray-700 rounded-xl transition-all active:scale-90">
							<ChevronRight className="w-5 h-5 stroke-[3px]" />
						</button>
					</div>
				</div>

				{/* Grid Kalender */}
				<div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-md">
					<div className="grid grid-cols-7 gap-6 mb-6">
						{daysOfWeek.map((day) => (
							<div key={day} className="text-center text-[11px] text-gray-800 font-black uppercase tracking-[2px] opacity-40">
								{day}
							</div>
						))}
					</div>

					<div className="grid grid-cols-7 gap-y-4 gap-x-4">
						{calendarCells.map((item, i) => {
							const isSelected = item.day && selectedDate.getDate() === item.day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;

							return (
								<button
									key={i}
									disabled={!item.day}
									onClick={() => item.day && setSelectedDate(new Date(year, month, item.day))}
									className={cn(
										"relative w-full aspect-square flex flex-col items-center justify-center rounded-[20px] transition-all duration-300 group font-bold text-sm",
										item.type === "muted" ? "opacity-0 cursor-default" : "text-gray-800",
										isSelected ? "bg-pink-600 text-white shadow-lg scale-105 z-10 hover:bg-pink-700" : "hover:bg-pink-50",
										item.isToday && !isSelected && "border-2 border-pink-400 bg-pink-50/50",
									)}
								>
									<span>{item.day}</span>
									{item.hasEvent && <span className={cn("absolute bottom-2 w-1.5 h-1.5 rounded-full transition-colors", isSelected ? "bg-white" : "bg-pink-600")} />}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Bagian List Event Hari Terpilih */}
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<h3 className="text-xs font-black text-gray-700 uppercase tracking-[4px] opacity-60">
						EVENT: {selectedDate.getDate()} {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
					</h3>
					{/* Tombol aksi khusus Kader untuk menerbitkan jadwal */}
					{userData?.role === "kader" && (
						<button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 text-xs font-black text-pink-600 bg-pink-50 px-4 py-2 rounded-xl hover:bg-pink-100 transition-colors uppercase tracking-wider">
							<Plus className="w-4 h-4 stroke-[3px]" /> Buat Jadwal
						</button>
					)}
				</div>

				<AnimatePresence mode="wait">
					{activeEvents.length > 0 ? (
						activeEvents.map((evt) => (
							<motion.div
								key={evt.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-all cursor-pointer group"
							>
								<div className="w-16 h-16 rounded-[20px] bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
									<CalendarIcon className="w-8 h-8" />
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="text-lg font-black text-gray-800 mb-1 group-hover:text-pink-600 transition-colors">{evt.nama_kegiatan}</h4>
									<div className="flex flex-wrap items-center gap-y-1 gap-x-4">
										<div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
											<MapPin className="w-3.5 h-3.5 text-pink-500" strokeWidth={2} />
											{evt.lokasi}
										</div>
										<div className="flex items-center gap-1.5 text-xs text-gray-600 font-black uppercase tracking-wider">
											<Clock className="w-3.5 h-3.5 text-pink-500" strokeWidth={2} />
											{evt.waktu_mulai} - {evt.waktu_selesai}
										</div>
									</div>
								</div>
								<div className="bg-gray-50 rounded-xl p-2.5 text-gray-400 group-hover:bg-pink-600 group-hover:text-white transition-all">
									<ChevronRight className="w-5 h-5 stroke-[3px]" />
								</div>
							</motion.div>
						))
					) : (
						<motion.div key="no-event" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 border-2 border-dashed border-gray-200 rounded-[40px] text-center bg-white/50">
							<CalendarIcon className="w-10 h-10 text-gray-400 mx-auto mb-3 opacity-30" strokeWidth={1} />
							<p className="text-xs text-gray-500 font-black opacity-40 uppercase tracking-[2px]">Agenda Kosong</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Banner Stay Informed */}
			<div>
				<div className="bg-pink-600 text-white rounded-[32px] p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
					<div className="flex items-center gap-5 relative z-10">
						<div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shadow-inner backdrop-blur-md">
							<Bell className="w-8 h-8 text-white" strokeWidth={2} />
						</div>
						<div>
							<h5 className="text-md font-black mb-0.5">Stay Informed</h5>
							<p className="text-xs font-medium opacity-80 leading-relaxed max-w-sm">Dapatkan notifikasi cerdas 24 jam sebelum jadwal kunjungan Anda.</p>
						</div>
					</div>
					<button className="px-6 py-3.5 bg-white text-pink-600 text-[10px] font-black uppercase tracking-[2px] rounded-xl shadow-md hover:scale-105 transition-all active:scale-95 relative z-10 shrink-0">Aktifkan Sekarang</button>
				</div>
			</div>

			{/* RENDER MODAL BOX INPUT EVENT */}
			<AddEventModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleCreateEvent}
				selectedDateText={`${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`}
				namaKegiatan={namaKegiatan}
				setNamaKegiatan={setNamaKegiatan}
				waktuMulai={waktuMulai}
				setWaktuMulai={setWaktuMulai}
				waktuSelesai={waktuSelesai}
				setWaktuSelesai={setWaktuSelesai}
				lokasi={lokasi}
				setLokasi={setLokasi}
				kuota={kuota}
				setKuota={setKuota}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
}

interface AddEventModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (e: React.FormEvent) => void;
	selectedDateText: string;
	namaKegiatan: string;
	setNamaKegiatan: (val: string) => void;
	waktuMulai: string;
	setWaktuMulai: (val: string) => void;
	waktuSelesai: string;
	setWaktuSelesai: (val: string) => void;
	lokasi: string;
	setLokasi: (val: string) => void;
	kuota: number;
	setKuota: (val: number) => void;
	isSubmitting: boolean;
}

function AddEventModal({ isOpen, onClose, onSubmit, selectedDateText, namaKegiatan, setNamaKegiatan, waktuMulai, setWaktuMulai, waktuSelesai, setWaktuSelesai, lokasi, setLokasi, kuota, setKuota, isSubmitting }: AddEventModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
			<div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl border border-gray-100 flex flex-col gap-6">
				<div>
					<h3 className="text-xl font-black text-gray-800">Buat Jadwal Baru</h3>
					<p className="text-xs text-pink-600 font-bold uppercase tracking-wider mt-1">Tanggal: {selectedDateText}</p>
				</div>

				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Nama Kegiatan</label>
						<input
							type="text"
							required
							placeholder="Contoh: Posyandu Balita Seroja"
							value={namaKegiatan}
							onChange={(e) => setNamaKegiatan(e.target.value)}
							className="w-full px-4 py-3 text-sm rounded-xl border border-pink-100 bg-pink-50/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Jam Mulai</label>
							<input
								type="time"
								required
								value={waktuMulai}
								onChange={(e) => setWaktuMulai(e.target.value)}
								className="w-full px-4 py-3 text-sm rounded-xl border border-pink-100 bg-pink-50/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
							/>
						</div>
						<div>
							<label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Jam Selesai</label>
							<input
								type="time"
								required
								value={waktuSelesai}
								onChange={(e) => setWaktuSelesai(e.target.value)}
								className="w-full px-4 py-3 text-sm rounded-xl border border-pink-100 bg-pink-50/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
							/>
						</div>
					</div>

					<div>
						<label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Lokasi Domisili</label>
						<input
							type="text"
							required
							value={lokasi}
							onChange={(e) => setLokasi(e.target.value)}
							className="w-full px-4 py-3 text-sm rounded-xl border border-pink-100 bg-pink-50/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
						/>
					</div>

					<div>
						<label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Kuota Maksimal Pasien</label>
						<input
							type="number"
							required
							min="1"
							value={kuota}
							onChange={(e) => setKuota(Number(e.target.value))}
							className="w-full px-4 py-3 text-sm rounded-xl border border-pink-100 bg-pink-50/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
						/>
					</div>

					<div className="flex gap-3 pt-2">
						<button type="button" onClick={onClose} className="flex-1 py-3 text-sm rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors">
							Batal
						</button>
						<button type="submit" disabled={isSubmitting} className="flex-1 py-3 text-sm rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 transition-colors disabled:opacity-50">
							{isSubmitting ? "Menyimpan..." : "Terbitkan"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
