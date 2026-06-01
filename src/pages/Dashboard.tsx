import React, { useState, useEffect, useMemo } from "react";
import { StatCard } from "../components/molecules/StatCard";
import { Users, AlertTriangle, TrendingUp, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "motion/react";
import { Button } from "../components/atoms/Button";
import { db } from "../firebase/config";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";

interface PatientCount {
	total: number;
	stunting: number;
	risiko: number;
	perhatian: number;
	normal: number;
}

interface RecentAlert {
	id: string;
	nama: string;
	issue: string;
	type: "error" | "warning";
	time: string;
}

export function Dashboard() {
	const [totalPatients, setTotalPatients] = useState(0);
	const [chartStats, setChartStats] = useState<PatientCount>({ total: 0, stunting: 0, risiko: 0, perhatian: 0, normal: 0 });
	const [upcomingSchedulesCount, setUpcomingSchedulesCount] = useState(0);
	const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>([]);
	const [loading, setLoading] = useState(true);

	// 1. Listen real-time total peserta terdaftar (role === "pasien")
	useEffect(() => {
		const qPatients = query(collection(db, "users"), where("role", "==", "pasien"));
		const unsubscribe = onSnapshot(
			qPatients,
			(snapshot) => {
				setTotalPatients(snapshot.size);
			},
			(err) => console.error("Error global tracking:", err),
		);

		return () => unsubscribe();
	}, []);

	// 2. Listen real-time data status klinis di healthRecord untuk Diagram Batang
	useEffect(() => {
		const qHealth = query(collection(db, "healthRecord"));
		const unsubscribe = onSnapshot(
			qHealth,
			(snapshot) => {
				const latestRecordsByUid: Record<string, string> = {};

				// Ambil status_pertumbuhan terbaru untuk setiap peserta unik
				const sortedDocs = snapshot.docs.map((d) => ({
					patient_uid: d.data().patient_uid,
					status_pertumbuhan: d.data().status_pertumbuhan || "Normal",
					waktu: d.data().waktuPemeriksaan || "",
				}));

				// Sort descending berdasarkan waktu untuk mengisolasi kondisi klinis terkini
				sortedDocs.sort((a, b) => b.waktu.localeCompare(a.waktu));

				sortedDocs.forEach((rec) => {
					if (!latestRecordsByUid[rec.patient_uid]) {
						latestRecordsByUid[rec.patient_uid] = rec.status_pertumbuhan;
					}
				});

				// Akumulasikan angka statistik murni untuk diagram komponen
				const stats = { total: 0, stunting: 0, risiko: 0, perhatian: 0, normal: 0 };
				Object.values(latestRecordsByUid).forEach((status) => {
					stats.total++;
					if (status === "Stunting") stats.stunting++;
					else if (status === "Risiko") stats.risiko++;
					else if (status === "Perhatian") stats.perhatian++;
					else stats.normal++;
				});

				setChartStats(stats);
			},
			(err) => console.error("Error chart listener:", err),
		);

		return () => unsubscribe();
	}, []);

	// 3. Listen real-time sisa agenda posyandu mendatang di bulan berjalan
	useEffect(() => {
		const hariIniStr = new Date().toISOString().split("T")[0];
		const qSchedules = query(collection(db, "schedules"), where("tanggal", ">=", hariIniStr), where("status", "==", "aktif"));
		const unsubscribe = onSnapshot(
			qSchedules,
			(snapshot) => {
				setUpcomingSchedulesCount(snapshot.size);
			},
			(err) => console.error("Error schedules summary:", err),
		);

		return () => unsubscribe();
	}, []);

	// 4. Listen real-time 3 berkas pemeriksaan terbaru untuk dijadikan Feed info
	useEffect(() => {
		setLoading(true);
		const qRecent = query(collection(db, "healthRecord"), orderBy("waktuPemeriksaan", "desc"), limit(3));

		const unsubscribe = onSnapshot(
			qRecent,
			(snapshot) => {
				const loadedAlerts: RecentAlert[] = snapshot.docs.map((doc) => {
					const data = doc.data();
					const status = data.status_pertumbuhan || "Normal";

					// Format penentuan label keterangan ringkas urgensi diagnosis
					let issueText = "Kondisi tubuh berkembang normal";
					let alertType: "error" | "warning" = "warning";

					if (status === "Stunting") {
						issueText = "Terindikasi indikator stunting";
						alertType = "error";
					} else if (status === "Risiko") {
						issueText = "Membutuhkan perhatian intensif (Keluhan Berat)";
						alertType = "error";
					} else if (status === "Perhatian") {
						issueText = "Pantau keluhan gejala ringan";
						alertType = "warning";
					}

					// Parser format waktu pendek lokal jam
					const waktuObj = data.waktuPemeriksaan ? new Date(data.waktuPemeriksaan) : new Date();
					const jamMenit = `${String(waktuObj.getHours()).padStart(2, "0")}:${String(waktuObj.getMinutes()).padStart(2, "0")} WIB`;

					return {
						id: doc.id,
						nama: data.nama || "Peserta Anonim",
						issue: issueText,
						type: alertType,
						time: jamMenit,
					};
				});

				setRecentAlerts(loadedAlerts);
				setLoading(false);
			},
			(err) => {
				console.error("Error alerts real-time feed:", err);
				setLoading(false);
			},
		);

		return () => unsubscribe();
	}, []);

	// Memetakan objek akumulasi status murni ke skema struktur Recharts
	const liveChartData = useMemo(
		() => [
			{ name: "Normal", value: chartStats.normal, color: "#b50457" },
			{ name: "Beresiko", value: chartStats.perhatian + chartStats.risiko, color: "#d82d70" },
			{ name: "Stunting", value: chartStats.stunting, color: "#ba1a1a" },
		],
		[chartStats],
	);

	return (
		<div className="space-y-10 max-w-5xl mx-auto pb-12">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div>
					<h1 className="text-4xl font-black text-gray-800 tracking-tight mb-1">Ringkasan Data</h1>
					<p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pusat Kendali Administrasi Klinik</p>
				</div>
				<div className="flex items-center gap-4">
					<div className="bg-white px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
						<CalendarIcon className="w-5 h-5 text-pink-600 stroke-[2.5px]" />
						<span className="text-xs font-black text-gray-700">{new Date().toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric" })}</span>
					</div>
				</div>
			</div>

			{/* Hero Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard title="Total Peserta" value={totalPatients.toString()} label="Peserta terdaftar" icon={<Users className="w-5 h-5" />} trend={{ value: "Live", isUp: true }} />
				<StatCard
					title="Pantauan Khusus"
					value={(chartStats.perhatian + chartStats.risiko).toString()}
					label="Membutuhkan perhatian"
					icon={<AlertTriangle className="w-5 h-5" />}
					trend={{ value: "Evaluasi", isUp: false }}
					variant={chartStats.risiko > 0 ? "error" : "default"}
				/>
				<StatCard title="Kasus Stunting" value={chartStats.stunting.toString()} label="Terdata di sistem" icon={<TrendingUp className="w-5 h-5" />} variant={chartStats.stunting > 0 ? "error" : "default"} />
				<StatCard title="Agenda Aktif" value={upcomingSchedulesCount.toString()} label="Hari ini & mendatang" icon={<CalendarIcon className="w-5 h-5" />} />
			</div>

			{/* Main Grid Section */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Chart Card */}
				<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-8 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col min-h-[450px]">
					<div className="flex justify-between items-center mb-10">
						<div>
							<h3 className="text-lg font-black text-gray-800 tracking-tight">Statistik Kondisi Peserta</h3>
							<p className="text-xs text-gray-400 font-bold mt-0.5">Berdasarkan hasil entri pemeriksaan terbaru</p>
						</div>
					</div>

					<div className="flex-1 w-full h-[300px] flex items-center justify-center">
						{chartStats.total === 0 ? (
							<p className="text-sm text-gray-400 font-medium italic">Belum ada grafik terdata. Lakukan screening pertama.</p>
						) : (
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={liveChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
									<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
									<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#374151", fontWeight: 700 }} dy={10} />
									<YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#374151", fontWeight: 500 }} />
									<Tooltip
										cursor={{ fill: "rgba(219, 39, 119, 0.03)" }}
										contentStyle={{
											borderRadius: "16px",
											border: "1px solid #F3F4F6",
											boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
											fontSize: "12px",
											fontWeight: "700",
										}}
									/>
									<Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={50}>
										{liveChartData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						)}
					</div>
				</motion.div>

				{/* Sidebar Alerts Column */}
				<div className="lg:col-span-4 space-y-8">
					<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-sm font-black text-gray-800 uppercase tracking-widest opacity-70">Aktivitas Screening</h3>
							<span className="text-[10px] font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-lg">Terbaru</span>
						</div>

						{loading ? (
							<p className="text-xs text-pink-600 font-medium animate-pulse text-center py-6">Menyinkronkan log aktivitas...</p>
						) : (
							<div className="flex flex-col gap-4">
								{recentAlerts.length > 0 ? (
									recentAlerts.map((alert) => (
										<div key={alert.id} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-pink-50/10 transition-all border border-transparent hover:border-gray-100 group cursor-pointer">
											<div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm text-white", alert.type === "error" ? "bg-red-500" : "bg-pink-600")}>
												<AlertTriangle className="w-5 h-5" strokeWidth={2} />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex justify-between items-center mb-0.5">
													<p className="text-xs font-black text-gray-800 truncate">{alert.nama}</p>
													<span className="text-[9px] text-gray-400 font-bold whitespace-nowrap ml-2">{alert.time}</span>
												</div>
												<p className={cn("text-xs font-medium truncate", alert.type === "error" ? "text-red-600 font-bold" : "text-gray-500")}>{alert.issue}</p>
											</div>
											<ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
										</div>
									))
								) : (
									<p className="text-xs text-gray-400 font-medium italic text-center py-6">Belum ada aktivitas screening klinis masuk.</p>
								)}
							</div>
						)}
					</motion.div>

					{/* Quick Action Bar */}
					<Button variant="secondary" className="bg-pink-600 hover:bg-pink-700 cursor-pointer text-white p-6 rounded-2xl shadow-md transition-colors w-full font-black uppercase tracking-[2px] text-xs">
						Mulai Kunjungan Posyandu
					</Button>
				</div>
			</div>
		</div>
	);
}
