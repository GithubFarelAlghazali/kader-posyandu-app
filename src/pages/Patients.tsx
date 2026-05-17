import React, { useMemo, useState } from "react";
import { Baby, Calendar as CalendarIcon, ChevronRight, Filter, Plus, Search, ShieldAlert, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/atoms/Button";
import { cn } from "../lib/utils";

type PatientStatus = "Normal" | "Perhatian" | "Risiko";

type Patient = {
	id: string;
	name: string;
	age: string;
	gender: "L" | "P";
	parentName: string;
	lastVisit: string;
	weight: string;
	height: string;
	status: PatientStatus;
};

const patients: Patient[] = [
	{ id: "P-001", name: "Keysha Latuhayu", age: "3 tahun 2 bulan", gender: "P", parentName: "Sari Latuhayu", lastVisit: "12 Mei 2026", weight: "12.4 kg", height: "91 cm", status: "Perhatian" },
	{ id: "P-002", name: "Budi Santoso", age: "4 tahun 1 bulan", gender: "L", parentName: "Dewi Santoso", lastVisit: "10 Mei 2026", weight: "15.1 kg", height: "101 cm", status: "Normal" },
	{ id: "P-003", name: "Ayu Lestari", age: "2 tahun 8 bulan", gender: "P", parentName: "Ratna Lestari", lastVisit: "08 Mei 2026", weight: "10.2 kg", height: "84 cm", status: "Risiko" },
	{ id: "P-004", name: "Leo Wijaya", age: "1 tahun 11 bulan", gender: "L", parentName: "Andi Wijaya", lastVisit: "06 Mei 2026", weight: "11.0 kg", height: "82 cm", status: "Normal" },
];

const statusStyles: Record<PatientStatus, string> = {
	Normal: "bg-primary/5 text-primary border-primary/10",
	Perhatian: "bg-primary-container text-on-primary-container border-primary/20",
	Risiko: "bg-error/10 text-error border-error/20",
};

export default function Patients() {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredPatients = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();

		if (!normalizedQuery) {
			return patients;
		}

		return patients.filter((patient) => [patient.name, patient.parentName, patient.id, patient.status].some((value) => value.toLowerCase().includes(normalizedQuery)));
	}, [searchQuery]);

	return (
		<div className="space-y-10">
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
				{[
					{ title: "Total Peserta", value: "248", label: "Anak terdaftar", icon: Users },
					{ title: "Balita Aktif", value: "186", label: "Kunjungan 30 hari", icon: Baby },
					{ title: "Perlu Perhatian", value: "13", label: "Pantauan pertumbuhan", icon: ShieldAlert },
					{ title: "Kenaikan Rata-rata", value: "+450g", label: "Bulan ini", icon: TrendingUp },
				].map((item) => (
					<motion.div key={item.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-clinical flex items-center gap-5">
						<div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shadow-sm">
							<item.icon className="w-7 h-7" strokeWidth={2.8} />
						</div>
						<div className="min-w-0">
							<p className="text-[10px] font-black uppercase tracking-[2px] text-on-surface opacity-40 truncate">{item.title}</p>
							<h3 className="text-title-lg font-black text-on-surface leading-tight">{item.value}</h3>
							<p className="text-label-sm font-bold text-on-surface opacity-50 truncate">{item.label}</p>
						</div>
					</motion.div>
				))}
			</div>

			{/* Patient Directory */}
			<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] border border-outline-variant/30 shadow-clinical overflow-hidden relative">
				<div className="absolute top-0 right-0 w-56 h-56 bg-primary/5 rounded-bl-full blur-3xl" />

				<div className="px-8 py-8 border-b border-outline-variant/30 flex flex-col lg:flex-row justify-between items-center gap-6 bg-surface-bright/50 relative z-10">
					<div>
						<h2 className="text-title-sm font-black text-on-surface uppercase tracking-widest opacity-70">Daftar Peserta</h2>
						<p className="text-label-sm font-bold text-on-surface opacity-40 mt-1">Menampilkan {filteredPatients.length} data peserta aktif</p>
					</div>

					<div className="flex items-center gap-4 w-full lg:w-auto">
						<div className="relative flex-1 lg:w-96">
							<Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface opacity-40" />
							<input
								type="text"
								placeholder="Cari nama, ID, wali, atau status..."
								className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 text-label-sm font-bold text-on-surface outline-none focus:border-primary transition-all placeholder:text-on-surface/30"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
							/>
						</div>
						<button className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 text-on-surface hover:text-primary transition-all active:scale-95 shadow-sm" type="button" aria-label="Filter peserta">
							<Filter className="w-5 h-5" strokeWidth={2.5} />
						</button>
					</div>
				</div>

				<div className="divide-y divide-outline-variant/10 relative z-10">
					{filteredPatients.map((patient) => (
						<div key={patient.id} className="p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 hover:bg-surface-container-low/30 transition-all group">
							<div className="flex items-center gap-6 min-w-0">
								<div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20 text-label-sm font-black uppercase tracking-widest shrink-0">{patient.gender}</div>
								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-3 mb-2">
										<p className="text-title-sm font-black text-on-surface group-hover:text-primary transition-colors truncate">{patient.name}</p>
										<span className="text-[10px] font-black uppercase tracking-widest bg-surface-container-low border border-outline-variant/30 text-on-surface/60 px-3 py-1 rounded-lg">{patient.id}</span>
									</div>
									<p className="text-label-sm font-bold text-on-surface opacity-50">{patient.age} • Wali: {patient.parentName}</p>
								</div>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-auto xl:min-w-[560px]">
								<div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20">
									<p className="text-[9px] font-black uppercase tracking-widest text-on-surface opacity-40 mb-1">BB</p>
									<p className="text-label-sm font-black text-on-surface">{patient.weight}</p>
								</div>
								<div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20">
									<p className="text-[9px] font-black uppercase tracking-widest text-on-surface opacity-40 mb-1">TB</p>
									<p className="text-label-sm font-black text-on-surface">{patient.height}</p>
								</div>
								<div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20">
									<div className="flex items-center gap-2 text-on-surface opacity-40 mb-1">
										<CalendarIcon className="w-3.5 h-3.5" strokeWidth={3} />
										<p className="text-[9px] font-black uppercase tracking-widest">Kunjungan</p>
									</div>
									<p className="text-label-sm font-black text-on-surface">{patient.lastVisit}</p>
								</div>
								<div className="flex items-center justify-between gap-3">
									<span className={cn("w-full text-center rounded-2xl px-4 py-3 border text-[10px] font-black uppercase tracking-widest", statusStyles[patient.status])}>{patient.status}</span>
									<button className="p-3 bg-surface-container-low hover:bg-primary hover:text-on-primary rounded-2xl transition-all active:scale-95 shadow-sm" type="button" aria-label={`Lihat detail ${patient.name}`}>
										<ChevronRight className="w-5 h-5" strokeWidth={3} />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</motion.div>
		</div>
	);
}
