import React, { useMemo, useState, useEffect } from "react";
import { Baby, Calendar as CalendarIcon, ChevronRight, Filter, Plus, Search, ShieldAlert, TrendingUp, Users, MapPin, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/atoms/Button";
import { cn } from "../lib/utils";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";

type PatientStatus = "Normal" | "Perhatian" | "Risiko";

// 1. Interface disesuaikan persis dengan isi dokumen di gambar console-mu
interface PatientData {
	uid: string;
	nama: string;
	email: string;
	nik: string;
	telepon: string;
	alamat: string;
	role: "pasien" | "kader"; // role murni string 'pasien'
	tipe: "anak" | "hamil" | "dewasa" | "lansia"; // pembeda spesifik ada di properti tipe
	tanggalLahir: string;
	dibuat_pada: string;

	// Atribut opsional pendukung visual
	status_pertumbuhan?: PatientStatus;
	berat_badan?: string;
	tinggi_badan?: string;
	terakhir_kunjungan?: string;
}

const statusStyles: Record<PatientStatus, string> = {
	Normal: "bg-green-50 text-green-700 border-green-100",
	Perhatian: "bg-amber-50 text-amber-700 border-amber-100",
	Risiko: "bg-red-50 text-red-700 border-red-100",
};

export default function Patients() {
	const [searchQuery, setSearchQuery] = useState("");
	const [dbPatients, setDbPatients] = useState<PatientData[]>([]);
	const [loading, setLoading] = useState(true);

	// 2. Query disesuaikan: Ambil semua dokumen yang memiliki role "pasien"
	useEffect(() => {
		setLoading(true);
		const q = query(
			collection(db, "users"),
			where("role", "==", "pasien"), // Hanya tarik user dengan role pasien
		);

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const loadedPatients = snapshot.docs.map((doc) => ({
					...doc.data(),
				})) as PatientData[];

				// Urutkan alfabetis berdasarkan nama
				loadedPatients.sort((a, b) => a.nama.localeCompare(b.nama));

				setDbPatients(loadedPatients);
				setLoading(false);
			},
			(error) => {
				console.error("Gagal memuat data pasien:", error);
				setLoading(false);
			},
		);

		return () => unsubscribe();
	}, []);

	// 3. Filter Pencarian & Kategori Tipe Pasien
	const filteredPatients = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();

		if (!normalizedQuery) {
			return dbPatients;
		}

		return dbPatients.filter((patient) => [patient.nama, patient.nik, patient.alamat, patient.tipe].some((value) => value?.toLowerCase().includes(normalizedQuery)));
	}, [searchQuery, dbPatients]);

	// 4. Hitung Metrik Ringkasan dari properti 'tipe'
	const metrics = useMemo(() => {
		const total = dbPatients.length;
		const anakCount = dbPatients.filter((p) => p.tipe === "anak").length;
		const perhatianCount = dbPatients.filter((p) => p.status_pertumbuhan === "Perhatian" || p.status_pertumbuhan === "Risiko").length;

		return [
			{ title: "Total Peserta", value: total.toString(), label: "Peserta terdaftar", icon: Users },
			{ title: "Kategori Anak", value: anakCount.toString(), label: "Balita & Anak-anak", icon: Baby },
			{ title: "Perlu Perhatian", value: perhatianCount.toString(), label: "Pantauan khusus", icon: ShieldAlert },
			{ title: "Rata-rata Kunjungan", value: "94%", label: "Tingkat kehadiran", icon: TrendingUp },
		];
	}, [dbPatients]);

	// Helper label tipe pasien
	const getTipeLabel = (tipe: string) => {
		switch (tipe) {
			case "anak":
				return "Anak / Balita";
			case "hamil":
				return "Ibu Hamil";
			case "dewasa":
				return "Dewasa";
			case "lansia":
				return "Lansia";
			default:
				return "Umum";
		}
	};

	return (
		<div className="space-y-10 max-w-5xl mx-auto pb-12">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
				<div>
					<h1 className="text-display-lg text-on-surface mb-2 font-black">Direktori Peserta</h1>
					<p className="text-on-surface text-body-md font-bold opacity-60 uppercase tracking-widest leading-relaxed">Kelola data peserta, status pertumbuhan, dan riwayat kunjungan Posyandu.</p>
				</div>
				<Button size="lg" className="w-full md:w-auto text-white shadow-2xl font-black px-8">
					<Plus className="w-6 h-6 stroke-[3px]" />
					<span>Tambah Peserta</span>
				</Button>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{metrics.map((item) => (
					<motion.div key={item.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-clinical flex items-center gap-5">
						<div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shadow-sm">
							<item.icon className="w-7 h-7" strokeWidth={2.5} />
						</div>
						<div className="min-w-0">
							<p className="text-[10px] font-black uppercase tracking-[2px] text-on-surface opacity-40 truncate">{item.title}</p>
							<h3 className="text-xl font-black text-gray-800 leading-tight">{item.value}</h3>
							<p className="text-xs font-bold text-gray-400 truncate">{item.label}</p>
						</div>
					</motion.div>
				))}
			</div>

			{/* Patient Directory Layout */}
			<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] border border-outline-variant/30 shadow-clinical overflow-hidden relative">
				<div className="absolute top-0 right-0 w-56 h-56 bg-pink-500/5 rounded-bl-full blur-3xl" />

				<div className="px-8 py-8 border-b border-outline-variant/30 flex flex-col lg:flex-row justify-between items-center gap-6 bg-surface-bright/50 relative z-10">
					<div>
						<h2 className="text-sm font-black text-gray-800 uppercase tracking-widest opacity-70">Daftar Peserta Aktif</h2>
						<p className="text-xs font-bold text-gray-400 mt-1">{loading ? "Memproses database..." : `Menampilkan ${filteredPatients.length} data peserta`}</p>
					</div>

					<div className="flex items-center gap-4 w-full lg:w-auto">
						<div className="relative flex-1 lg:w-96">
							<Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Cari nama, NIK, wilayah, atau kategori..."
								className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-pink-400 transition-all placeholder:text-gray-400"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
							/>
						</div>
						<button className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-gray-600 hover:text-pink-600 transition-all active:scale-95 shadow-sm" type="button" aria-label="Filter peserta">
							<Filter className="w-5 h-5" strokeWidth={2.5} />
						</button>
					</div>
				</div>

				<div className="divide-y divide-gray-100 relative z-10">
					{loading ? (
						<div className="py-20 text-center text-pink-600 font-semibold animate-pulse">Menghubungkan ke basis data Posyandu...</div>
					) : (
						<AnimatePresence mode="popLayout">
							{filteredPatients.length > 0 ? (
								filteredPatients.map((patient) => (
									<div key={patient.uid} className="p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 hover:bg-pink-50/20 transition-all group">
										{/* Profil Utama */}
										<div className="flex items-center gap-6 min-w-0">
											<div className="w-16 h-16 rounded-2xl bg-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-600/20 text-sm font-black uppercase tracking-widest shrink-0">
												{patient.nama ? patient.nama.charAt(0) : "P"}
											</div>
											<div className="min-w-0">
												<div className="flex flex-wrap items-center gap-3 mb-1.5">
													<p className="text-md font-black text-gray-800 group-hover:text-pink-600 transition-colors truncate">{patient.nama}</p>
													<span className="text-[10px] font-black uppercase tracking-widest bg-gray-50 border border-gray-200/60 text-gray-500 px-3 py-1 rounded-lg">{getTipeLabel(patient.tipe)}</span>
												</div>
												<div className="flex flex-col gap-1 text-xs text-gray-400 font-bold">
													<p>
														NIK: <span className="text-gray-600">{patient.nik}</span>
													</p>
													<div className="flex items-center gap-3 mt-0.5 text-gray-500 font-medium">
														<span className="flex items-center gap-1">
															<Phone className="w-3.5 h-3.5 text-pink-500" /> {patient.telepon || "-"}
														</span>
														<span className="flex items-center gap-1">
															<MapPin className="w-3.5 h-3.5 text-pink-500" /> {patient.alamat}
														</span>
													</div>
												</div>
											</div>
										</div>

										{/* Parameter Medis */}
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-auto xl:min-w-[560px]">
											<div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
												<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Berat Badan</p>
												<p className="text-xs font-black text-gray-700">{patient.berat_badan || "-- kg"}</p>
											</div>
											<div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
												<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Tinggi Badan</p>
												<p className="text-xs font-black text-gray-700">{patient.tinggi_badan || "-- cm"}</p>
											</div>
											<div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
												<div className="flex items-center gap-1.5 text-gray-400 mb-1">
													<CalendarIcon className="w-3.5 h-3.5" strokeWidth={3} />
													<p className="text-[9px] font-black uppercase tracking-widest">Tgl Lahir</p>
												</div>
												<p className="text-xs font-black text-gray-700">{patient.tanggalLahir || "-"}</p>
											</div>
											<div className="flex items-center justify-between gap-3">
												<span className={cn("w-full text-center rounded-2xl px-4 py-3 border text-[10px] font-black uppercase tracking-widest", statusStyles[patient.status_pertumbuhan || "Normal"])}>
													{patient.status_pertumbuhan || "Normal"}
												</span>
												<button className="p-3 bg-gray-50 hover:bg-pink-600 hover:text-white rounded-2xl transition-all active:scale-95 shadow-sm" type="button" aria-label={`Lihat detail ${patient.nama}`}>
													<ChevronRight className="w-5 h-5" strokeWidth={3} />
												</button>
											</div>
										</div>
									</div>
								))
							) : (
								<div className="py-16 border-2 border-dashed border-gray-100 rounded-[40px] text-center bg-white/50 m-6">
									<Users className="w-10 h-10 text-gray-400 mx-auto mb-3 opacity-30" strokeWidth={1} />
									<p className="text-xs text-gray-500 font-black opacity-40 uppercase tracking-[2px]">Peserta tidak ditemukan</p>
								</div>
							)}
						</AnimatePresence>
					)}
				</div>
			</motion.div>
		</div>
	);
}
