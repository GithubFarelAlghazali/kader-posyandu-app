import React, { useState, useEffect, useMemo } from "react";
import { Megaphone, Baby, User, UserRound, Search, Filter, CalendarX, CheckCircle, Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/atoms/Button";
import { cn } from "../lib/utils";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy } from "firebase/firestore";

interface ScheduleEvent {
	id: string;
	tanggal: string;
	nama_kegiatan: string;
	waktu_mulai: string;
	waktu_selesai: string;
	lokasi: string;
}

interface QueuePatient {
	id: string;
	schedule_id: string;
	nomor_antrean: number;
	pasien_uid: string;
	pasien_nama: string;
	pasien_kategori: "anak" | "hamil" | "dewasa" | "lansia";
	status_panggilan: "menunggu" | "diperiksa" | "selesai" | "terlewat";
	catatan_keluhan?: string;
}

export function Queue() {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeSchedule, setActiveSchedule] = useState<ScheduleEvent | null>(null);
	const [rawQueues, setRawQueues] = useState<QueuePatient[]>([]);
	const [loading, setLoading] = useState(true);

	// Mendapatkan tanggal hari ini dengan format YYYY-MM-DD sesuai zona lokal
	const hariIniStr = useMemo(() => {
		const target = new Date();
		const y = target.getFullYear();
		const m = String(target.getMonth() + 1).padStart(2, "0");
		const d = String(target.getDate()).padStart(2, "0");
		return `${y}-${m}-${d}`;
	}, []);

	// 1. Listen Jadwal Posyandu Aktif Hari Ini
	useEffect(() => {
		setLoading(true);
		const qSchedule = query(collection(db, "schedules"), where("tanggal", "==", hariIniStr), where("status", "==", "aktif"));

		const unsubscribeSchedule = onSnapshot(
			qSchedule,
			(snapshot) => {
				if (!snapshot.empty) {
					const docData = snapshot.docs[0];
					setActiveSchedule({ id: docData.id, ...docData.data() } as ScheduleEvent);
				} else {
					setActiveSchedule(null);
				}
				setLoading(false);
			},
			(err) => {
				console.error("Gagal memuat jadwal hari ini:", err);
				setLoading(false);
			},
		);

		return () => unsubscribeSchedule();
	}, [hariIniStr]);

	// 2. Listen Antrean Pasien Khusus untuk Jadwal Hari Ini
	useEffect(() => {
		if (!activeSchedule?.id) {
			setRawQueues([]);
			return;
		}

		const qQueues = query(collection(db, "queues"), where("schedule_id", "==", activeSchedule.id), orderBy("nomor_antrean", "asc"));

		const unsubscribeQueues = onSnapshot(
			qQueues,
			(snapshot) => {
				const loadedQueues = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as QueuePatient[];
				setRawQueues(loadedQueues);
			},
			(err) => {
				console.error("Gagal memuat list antrean:", err);
			},
		);

		return () => unsubscribeQueues();
	}, [activeSchedule]);

	// 3. Filter Pencarian Nama Pasien di Frontend
	const filteredQueues = useMemo(() => {
		const normalized = searchQuery.trim().toLowerCase();
		if (!normalized) return rawQueues;
		return rawQueues.filter((q) => q.pasien_nama.toLowerCase().includes(normalized));
	}, [searchQuery, rawQueues]);

	// 4. Kalkulasi Metrik Ringkasan Secara Real-time
	const summary = useMemo(() => {
		const waiting = rawQueues.filter((q) => q.status_panggilan === "menunggu");
		const serving = rawQueues.find((q) => q.status_panggilan === "diperiksa");
		const finished = rawQueues.filter((q) => q.status_panggilan === "selesai").length;

		const currentNumber = serving ? String(serving.nomor_antrean).padStart(3, "0") : "---";
		const totalAnak = rawQueues.filter((q) => q.pasien_kategori === "anak" && q.status_panggilan === "menunggu").length;
		const totalHamil = rawQueues.filter((q) => q.pasien_kategori === "hamil" && q.status_panggilan === "menunggu").length;
		const totalLansia = rawQueues.filter((q) => q.pasien_kategori === "lansia" && q.status_panggilan === "menunggu").length;

		return {
			currentNumber,
			remains: waiting.length,
			finished,
			categories: [
				{ label: "Anak/Balita", count: totalAnak, icon: Baby, color: "text-pink-500", bg: "bg-pink-50" },
				{ label: "Ibu Hamil", count: totalHamil, icon: User, color: "text-amber-500", bg: "bg-amber-50" },
				{ label: "Lansia", count: totalLansia, icon: UserRound, color: "text-purple-500", bg: "bg-purple-50" },
			],
		};
	}, [rawQueues]);

	// 5. Fungsi Aksi Mengubah Status Panggilan Pasien
	const updatePatientStatus = async (queueId: string, nextStatus: "diperiksa" | "selesai") => {
		try {
			const queueDocRef = doc(db, "queues", queueId);

			// Jika memanggil pasien baru (status diperiksa), ganti pasien yang sedang diperiksa sebelumnya menjadi 'selesai'
			if (nextStatus === "diperiksa") {
				const currentServing = rawQueues.find((q) => q.status_panggilan === "diperiksa");
				if (currentServing) {
					await updateDoc(doc(db, "queues", currentServing.id), { status_panggilan: "selesai" });
				}
			}

			await updateDoc(queueDocRef, { status_panggilan: nextStatus });
		} catch (error) {
			console.error("Gagal mengupdate status panggilan antrean:", error);
			alert("Gagal merubah antrean, periksa koneksi internet.");
		}
	};

	// 6. Tombol Panggil Otomatis (Next Auto Call)
	const handleNextAutoCall = async () => {
		const nextInLine = rawQueues.find((q) => q.status_panggilan === "menunggu");
		if (!nextInLine) {
			alert("Seluruh antrean hari ini telah selesai dilayani!");
			return;
		}
		await updatePatientStatus(nextInLine.id, "diperiksa");
	};

	const getKategoriLabel = (kat: string) => {
		switch (kat) {
			case "anak":
				return "Anak / Balita";
			case "hamil":
				return "Ibu Hamil";
			case "lansia":
				return "Lansia";
			default:
				return "Umum";
		}
	};

	if (loading) {
		return <div className="py-20 text-center text-pink-600 font-semibold animate-pulse">Menyelaraskan Sistem Antrean Posyandu...</div>;
	}

	// TAMPILAN JIKA TIDAK ADA JADWAL EVENT AKTIF HARI INI
	if (!activeSchedule) {
		return (
			<motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto py-20 px-8 text-center bg-white rounded-[40px] border border-gray-100 shadow-md">
				<CalendarX className="w-16 h-16 text-gray-300 mx-auto mb-6" strokeWidth={1} />
				<h1 className="text-2xl font-black text-gray-800 tracking-tight">Tidak Ada Kegiatan Hari Ini</h1>
				<p className="text-gray-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">Sistem manajemen antrean otomatis terkunci karena tidak ada jadwal agenda Posyandu aktif yang terdaftar untuk tanggal hari ini.</p>
			</motion.div>
		);
	}

	return (
		<div className="space-y-10 max-w-4xl mx-auto pb-12">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
				<div>
					<h1 className="text-display-lg text-on-surface mb-1 font-black tracking-tight">Manajemen Antrean</h1>
					<p className="text-pink-600 text-xs font-black uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-lg border border-pink-100 inline-block">
						AGENDA: {activeSchedule.nama_kegiatan} ({activeSchedule.waktu_mulai} - {activeSchedule.waktu_selesai})
					</p>
				</div>
				<Button size="lg" onClick={handleNextAutoCall} className="w-full md:w-auto shadow-xl font-black px-8 text-white bg-pink-600 hover:bg-pink-700">
					<Megaphone className="w-5 h-5 fill-white" strokeWidth={3} />
					<span>Panggil Antrean Berikutnya</span>
				</Button>
			</div>

			{/* Status Monitor Board */}
			<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-md relative overflow-hidden group">
				<div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/5 rounded-bl-full blur-3xl" />

				<div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 relative z-10">
					<div className="bg-pink-600 text-white px-5 py-2 rounded-full flex items-center gap-2.5 shadow-md shadow-pink-600/10">
						<span className="w-2 h-2 rounded-full bg-white animate-pulse" />
						<span className="text-[10px] font-black uppercase tracking-widest">Sesi Real-time Berjalan</span>
					</div>
					<p className="text-xs text-gray-400 font-bold">Lokasi: {activeSchedule.lokasi}</p>
				</div>

				<div className="grid grid-cols-2 gap-8 mb-8 py-8 border-y border-gray-50 relative z-10">
					<div className="text-center space-y-1">
						<p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">Nomor Sekarang</p>
						<p className="text-5xl font-black text-gray-800 tracking-tight">{summary.currentNumber}</p>
					</div>
					<div className="text-center space-y-1 border-l border-gray-100">
						<p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">Sisa Menunggu</p>
						<p className="text-5xl font-black text-pink-600 tracking-tight">{summary.remains}</p>
					</div>
				</div>

				{/* Category Counter Widgets */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
					{summary.categories.map((cat) => (
						<div key={cat.label} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
							<div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm", cat.bg)}>
								<cat.icon className={cn("w-6 h-6", cat.color)} strokeWidth={2.5} />
							</div>
							<div className="min-w-0">
								<h3 className="text-xs font-black text-gray-700 uppercase tracking-wide truncate">{cat.label}</h3>
								<p className="text-sm font-black text-gray-800">{cat.count} Antrean</p>
							</div>
						</div>
					))}
				</div>
			</motion.div>

			{/* Main Queue List */}
			<div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
				<div className="px-8 py-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/30">
					<h2 className="text-xs font-black text-gray-700 uppercase tracking-widest opacity-60">Baris Antrean Berjalan</h2>
					<div className="flex items-center gap-4 w-full md:w-auto">
						<div className="relative flex-1 md:w-72">
							<Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Cari nama pasien di antrean..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-100 text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-pink-400 transition-all placeholder:text-gray-400"
							/>
						</div>
						<button className="p-2.5 bg-white rounded-xl border border-gray-100 text-gray-500 hover:text-pink-600 transition-all active:scale-95 shadow-sm" type="button">
							<Filter className="w-4 h-4" strokeWidth={2.5} />
						</button>
					</div>
				</div>

				{/* Pasien List Element Rows */}
				<div className="divide-y divide-gray-50">
					<AnimatePresence mode="popLayout">
						{filteredQueues.length > 0 ? (
							filteredQueues.map((item) => {
								const isServing = item.status_panggilan === "diperiksa";
								const isDone = item.status_panggilan === "selesai";

								return (
									<motion.div
										layout
										key={item.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className={cn("p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all group", isServing && "bg-pink-50/20", isDone && "opacity-50 bg-gray-50/10")}
									>
										<div className="flex items-center gap-6 w-full md:w-auto min-w-0">
											{/* Nomor Antrean Badge */}
											<div
												className={cn(
													"w-16 h-14 rounded-xl text-md font-black flex items-center justify-center shadow-sm shrink-0 border transition-all",
													isServing ? "bg-pink-600 text-white border-pink-600 scale-105 shadow-md" : "bg-white text-gray-700 border-gray-100",
												)}
											>
												{String(item.nomor_antrean).padStart(2, "0")}
											</div>

											{/* Detail Ringkas Pasien */}
											<div className="min-w-0">
												<p className="text-md font-black text-gray-800 truncate group-hover:text-pink-600 transition-colors">{item.pasien_nama}</p>
												<div className="flex flex-wrap items-center gap-2 mt-1">
													<span className="text-[9px] font-black uppercase tracking-widest text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-100">{getKategoriLabel(item.pasien_kategori)}</span>
													{item.catatan_keluhan && <span className="text-xs text-gray-400 font-medium truncate max-w-xs">• Keluhan: "{item.catatan_keluhan}"</span>}
												</div>
											</div>
										</div>

										{/* Tombol Kontrol Aksi Kader */}
										<div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
											{isServing ? (
												<>
													<div className="flex items-center gap-2 text-pink-600 bg-pink-50 px-4 py-2 rounded-xl border border-pink-100/40 mr-1 text-xs font-bold">
														<div className="w-1.5 h-1.5 rounded-full bg-pink-600 animate-pulse" />
														<span>Sedang Diperiksa</span>
													</div>
													<button
														onClick={() => updatePatientStatus(item.id, "selesai")}
														className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-colors"
													>
														<CheckCircle className="w-4 h-4" /> Selesai
													</button>
												</>
											) : isDone ? (
												<div className="text-xs text-green-600 font-black uppercase tracking-wider bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">✓ Pemeriksaan Selesai</div>
											) : (
												<button
													onClick={() => updatePatientStatus(item.id, "diperiksa")}
													className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-pink-600 hover:text-white hover:border-pink-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95"
												>
													<Play className="w-3.5 h-3.5 fill-current" /> Panggil Ke Meja
												</button>
											)}
										</div>
									</motion.div>
								);
							})
						) : (
							<div className="py-16 text-center text-gray-400 text-xs font-bold italic">Tidak ada pasien dalam baris antrean filter ini</div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
