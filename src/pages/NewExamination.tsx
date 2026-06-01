import React, { useState, useEffect, useRef } from "react";
import { User, Ruler, Activity, Save, ClipboardList, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
import { cn } from "../lib/utils";

// Interface data pasien dari koleksi users
interface PatientSuggestion {
	uid: string;
	nama: string;
	nik: string;
	tipe: string;
}

export function NewExamination() {
	// Database lokal untuk penampung auto-complete
	const [suggestions, setSuggestions] = useState<PatientSuggestion[]>([]);
	const [filteredSuggestions, setFilteredSuggestions] = useState<PatientSuggestion[]>([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// State Form Data sesuai instruksi baru
	const [selectedPatient, setSelectedPatient] = useState<PatientSuggestion | null>(null);
	const [searchName, setSearchName] = useState("");
	const [weight, setWeight] = useState("");
	const [height, setHeight] = useState("");
	const [glucose, setGlucose] = useState("");
	const [sistolik, setSistolik] = useState("");
	const [distolik, setDistolik] = useState("");
	const [catatan, setCatatan] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [alert, setAlert] = useState("");
	const [displayAlert, setDisplayAlert] = useState(false);

	// 1. Tarik data seluruh peserta terdaftar dari Firestore untuk modal auto-complete
	useEffect(() => {
		const q = query(collection(db, "users"), where("role", "==", "pasien"));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const patientsData = snapshot.docs.map((doc) => ({
				uid: doc.data().uid,
				nama: doc.data().nama,
				nik: doc.data().nik,
				tipe: doc.data().tipe,
			})) as PatientSuggestion[];
			setSuggestions(patientsData);
		});

		return () => unsubscribe();
	}, []);

	// 2. Filter nama peserta saat kader mengetik
	useEffect(() => {
		if (!searchName.trim()) {
			setFilteredSuggestions([]);
			return;
		}
		const filtered = suggestions.filter((p) => p.nama.toLowerCase().includes(searchName.toLowerCase()) || p.nik.includes(searchName));
		setFilteredSuggestions(filtered);
	}, [searchName, suggestions]);

	// 3. Deteksi klik di luar komponen untuk menutup dropdown auto-complete
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setShowDropdown(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// 4. Aksi Eksekusi Penyimpanan Rekam Medis ke Firestore
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedPatient) {
			setAlert("Silakan pilih peserta terdaftar terlebih dahulu dari sistem.");
			setDisplayAlert(true);
			return;
		}

		setIsSubmitting(true);
		try {
			const sekarang = new Date();

			// Kirim data ke koleksi healthRecord
			await addDoc(collection(db, "healthRecord"), {
				patient_uid: selectedPatient.uid,
				nama: selectedPatient.nama,
				nik: selectedPatient.nik,
				tipe_peserta: selectedPatient.tipe || "umum",
				beratBadan: weight ? Number(weight) : null,
				tinggiBadan: height ? Number(height) : null,
				gulaDarah: glucose ? Number(glucose) : null,
				// Struktur Data Map sesuai instruksimu
				tekananDarah: {
					sistolik: sistolik ? Number(sistolik) : null,
					distolik: distolik ? Number(distolik) : null,
				},
				catatanKeluhan: catatan.trim(),
				// Waktu pemeriksaan terstandarisasi
				waktuPemeriksaan: sekarang.toISOString(),
				tanggalSaja: sekarang.toISOString().split("T")[0],
			});

			setAlert(`Data rekam medis ${selectedPatient.nama} berhasil disimpan!`);
			setDisplayAlert(true);

			// Reset form kerja kader
			setSelectedPatient(null);
			setSearchName("");
			setWeight("");
			setHeight("");
			setGlucose("");
			setSistolik("");
			setDistolik("");
			setCatatan("");
		} catch (error) {
			console.error("Gagal menyimpan rekam medis:", error);
			alert("Terjadi kegagalan sistem saat menyimpan rekam medis.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-10 max-w-4xl mx-auto pb-12 relative">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-4xl font-black text-gray-800 tracking-tight">Pemeriksaan Baru</h1>
				<p className="text-gray-500 text-sm font-bold opacity-70 uppercase tracking-widest leading-relaxed">Input rekam medis klinis berkala peserta Posyandu.</p>
			</div>

			<form className="space-y-8" onSubmit={handleSubmit}>
				{/* Patient Info Card (Auto-complete Section) */}
				<motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] shadow-sm p-8 border border-gray-100 relative">
					<h3 className="text-md font-black text-gray-800 flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
						<User className="w-5 h-5 text-pink-600" strokeWidth={2.5} />
						Identifikasi Peserta
					</h3>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative" ref={dropdownRef}>
						{/* Input Search Nama dengan Dropdown */}
						<div className="space-y-2 relative">
							<label className="text-[11px] text-gray-500 font-black uppercase tracking-wider block">Nama Peserta</label>
							<div className="relative">
								<input
									type="text"
									required
									placeholder="Ketik nama atau NIK peserta..."
									autoComplete="off"
									className={cn(
										"w-full px-5 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 font-medium text-sm text-gray-800",
										selectedPatient && "border-green-300 bg-green-50/20 text-green-800 focus:ring-green-400",
									)}
									value={searchName}
									onFocus={() => setShowDropdown(true)}
									onChange={(e) => {
										setSearchName(e.target.value);
										if (selectedPatient) setSelectedPatient(null);
									}}
								/>
								{selectedPatient && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-green-600 bg-green-100 px-2 py-1 rounded-lg uppercase tracking-wide">Terkunci</span>}
							</div>

							{/* Render Dropdown List Suggestions */}
							<AnimatePresence>
								{showDropdown && filteredSuggestions.length > 0 && (
									<motion.div
										initial={{ opacity: 0, y: 5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 5 }}
										className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto z-50 divide-y divide-gray-50"
									>
										{filteredSuggestions.map((p) => (
											<button
												key={p.uid}
												type="button"
												className="w-full text-left px-5 py-3 hover:bg-pink-50/50 transition-colors flex flex-col gap-0.5"
												onClick={() => {
													setSelectedPatient(p);
													setSearchName(p.nama);
													setShowDropdown(false);
												}}
											>
												<span className="text-sm font-bold text-gray-800">{p.nama}</span>
												<span className="text-xs text-gray-400 font-medium">
													NIK: {p.nik} • Kategori: {p.tipe}
												</span>
											</button>
										))}
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{/* Kolom NIK (Auto Fill - Read Only) */}
						<div className="space-y-2">
							<label className="text-[11px] text-gray-500 font-black uppercase tracking-wider block">Nomor Induk Kependudukan (NIK)</label>
							<input
								type="text"
								readOnly
								placeholder="Akan terisi otomatis jika nama dipilih"
								className="w-full px-5 py-3.5 bg-gray-100 rounded-2xl border border-gray-100 text-sm font-bold text-gray-500 outline-none cursor-not-allowed"
								value={selectedPatient ? selectedPatient.nik : ""}
							/>
						</div>
					</div>
				</motion.div>

				{/* Anthropometrics & Vital Signs Card */}
				<motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] shadow-sm p-8 border border-gray-100">
					<h3 className="text-md font-black text-gray-800 flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
						<Activity className="w-5 h-5 text-pink-600" strokeWidth={2.5} />
						Data Parameter Klinis Kesehatan
					</h3>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
						{/* Berat Badan */}
						<div className="space-y-3">
							<label className="text-[11px] text-gray-700 font-black uppercase tracking-wider flex justify-between items-center">
								Berat Badan
								<span className="text-[10px] bg-pink-50 text-pink-700 px-2 py-0.5 rounded-md font-black">KG</span>
							</label>
							<input
								type="number"
								placeholder="0.0"
								step="0.1"
								required
								className="w-full px-6 py-6 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 text-2xl font-black text-gray-800 text-center"
								value={weight}
								onChange={(e) => setWeight(e.target.value)}
							/>
						</div>

						{/* Tinggi Badan */}
						<div className="space-y-3">
							<label className="text-[11px] text-gray-700 font-black uppercase tracking-wider flex justify-between items-center">
								Tinggi Badan
								<span className="text-[10px] bg-pink-50 text-pink-700 px-2 py-0.5 rounded-md font-black">CM</span>
							</label>
							<input
								type="number"
								placeholder="0.0"
								step="0.1"
								required
								className="w-full px-6 py-6 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 text-2xl font-black text-gray-800 text-center"
								value={height}
								onChange={(e) => setHeight(e.target.value)}
							/>
						</div>

						{/* Gula Darah */}
						<div className="space-y-3">
							<label className="text-[11px] text-gray-700 font-black uppercase tracking-wider flex justify-between items-center">
								Gula Darah
								<span className="text-[10px] bg-pink-50 text-pink-700 px-2 py-0.5 rounded-md font-black">MG/DL</span>
							</label>
							<input
								type="number"
								placeholder="0"
								className="w-full px-6 py-6 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 text-2xl font-black text-gray-800 text-center"
								value={glucose}
								onChange={(e) => setGlucose(e.target.value)}
							/>
						</div>

						{/* Tekanan Darah (Sistolik & Distolik Nested Box) */}
						<div className="sm:col-span-3 space-y-3 bg-pink-50/40 p-6 rounded-3xl border border-pink-100/40 mt-2">
							<p className="text-[11px] text-pink-800 font-black uppercase tracking-widest flex justify-between items-center">
								Tekanan Darah Kontrol
								<span className="text-[9px] bg-pink-600 text-white px-2 py-0.5 rounded-md font-bold">MMHG</span>
							</p>
							<div className="grid grid-cols-2 gap-4 pt-1">
								<div className="space-y-1.5">
									<label htmlFor="sistolik" className="text-[10px] text-gray-500 font-black uppercase tracking-wider">
										Sistolik
									</label>
									<input
										id="sistolik"
										type="number"
										placeholder="120"
										className="w-full p-4 bg-white rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg font-black text-center text-gray-800"
										value={sistolik}
										onChange={(e) => setSistolik(e.target.value)}
									/>
								</div>
								<div className="space-y-1.5">
									<label htmlFor="distolik" className="text-[10px] text-gray-500 font-black uppercase tracking-wider">
										Distolik
									</label>
									<input
										id="distolik"
										type="number"
										placeholder="80"
										className="w-full p-4 bg-white rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg font-black text-center text-gray-800"
										value={distolik}
										onChange={(e) => setDistolik(e.target.value)}
									/>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Input Catatan Tambahan */}
				<motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] shadow-sm p-8 border border-gray-100">
					<h3 className="text-md font-black text-gray-800 flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
						<ClipboardList className="w-5 h-5 text-pink-600" strokeWidth={2.5} />
						Catatan Medis Tambahan
					</h3>
					<div className="space-y-2">
						<label className="text-[11px] text-gray-500 font-black uppercase tracking-wider block">Keluhan atau Keterangan Tambahan Pasien</label>
						<textarea
							rows={3}
							placeholder="Masukkan detail keluhan tambahan jika ada (misal: batuk, pusing, atau suplemen vitamin tambahan)..."
							className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm font-medium text-gray-800 placeholder-gray-400"
							value={catatan}
							onChange={(e) => setCatatan(e.target.value)}
						/>
					</div>
				</motion.div>
				{/* Alert box */}
				{displayAlert && (
					<div className="bg-primary relative text-white w-full flex justify-center rounded-3xl">
						<p className="p-5 text-xl w-fit font-semibold">{alert}</p>
						<X className="size-5 absolute top-2 right-5" onClick={() => setDisplayAlert(false)} />
					</div>
				)}
				{/* Tombol Aksi Submit Form */}
				<div className="flex justify-end">
					<button
						type="submit"
						disabled={isSubmitting || !selectedPatient}
						className={cn(
							"px-8 py-4 bg-pink-600 text-white font-black text-xs uppercase tracking-[2px] rounded-2xl shadow-md hover:bg-pink-700 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
							isSubmitting && "animate-pulse",
						)}
					>
						<Save className="w-4 h-4 stroke-[2.5px]" />
						{isSubmitting ? "Menyimpan Dokumen..." : "Simpan Data Pemeriksaan"}
					</button>
				</div>
			</form>
		</div>
	);
}
