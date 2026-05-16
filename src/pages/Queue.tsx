import React from "react";
import { Megaphone, Baby, User, UserRound, MessageSquare, Search, Filter } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/atoms/Button";
import { cn } from "../lib/utils";

const queueData = [
	{ id: "1", number: "A-05", name: "Budi Santoso", category: "Dewasa", reason: "Pemeriksaan rutin", status: "Serving" },
	{ id: "2", number: "I-02", name: "Siti Aminah", category: "Bayi", reason: "Imunisasi", status: "Menunggu" },
	{ id: "3", number: "E-01", name: "Rachmat Wahyudi", category: "Lansia", reason: "Tekanan Darah Rendah", status: "Menunggu" },
	{ id: "4", number: "A-06", name: "Dewi Lestari", category: "Dewasa", reason: "Consultation", status: "Menunggu" },
];

const categories = [
	{ label: "Bayi", count: 3, icon: Baby, color: "text-blue-500", bg: "bg-blue-50" },
	{ label: "Dewasa", count: 7, icon: User, color: "text-primary", bg: "bg-primary/5" },
	{ label: "Lansia", count: 2, icon: UserRound, color: "text-purple-500", bg: "bg-purple-50" },
];

export function Queue() {
	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
				<div>
					<h1 className="text-display-lg text-on-surface mb-2 font-black">Manajemen Antrean</h1>
					<p className="text-on-surface text-body-md font-bold opacity-70 uppercase tracking-widest">Hari ini, {new Date().toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric" })}</p>
				</div>
				<Button size="lg" className=" w-full md:w-auto shadow-2xl font-black px-8">
					<Megaphone className="w-5 h-5 fill-white" strokeWidth={3} />
					<span className="text-white">Panggil peserta berikutnya</span>
				</Button>
			</div>

			<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] p-10 border border-outline-variant/30 shadow-clinical relative overflow-hidden group">
				<div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full -z-0 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

				<div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10 relative z-10">
					<div className="bg-primary text-on-primary px-5 py-2 rounded-full flex items-center gap-3 shadow-lg shadow-primary/20">
						<span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
						<span className="text-[11px] font-black uppercase tracking-widest">Sedang Berjalan</span>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-10 mb-10 py-10 border-y border-outline-variant/10 relative z-10">
					<div className="text-center space-y-2">
						<p className="text-label-sm text-on-surface font-black opacity-40 uppercase tracking-widest">Antrean Saat Ini</p>
						<p className="text-display-lg text-on-surface font-black text-6xl">014</p>
					</div>
					<div className="text-center space-y-2 border-l border-outline-variant/10">
						<p className="text-label-sm text-on-surface font-black opacity-40 uppercase tracking-widest">Sisa Antrean</p>
						<p className="text-display-lg text-primary font-black text-6xl">8</p>
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
					{categories.map((cat) => (
						<motion.div key={cat.label} whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl border-primary/25 border shadow-clinical flex items-center gap-5 transition-all">
							<div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm", cat.bg)}>
								<cat.icon className={cn("w-8 h-8", cat.color)} strokeWidth={2.5} />
							</div>
							<div>
								<h3 className="text-title-sm font-black text-on-surface">{cat.label}</h3>
								<p className="text-body-md text-on-surface font-black opacity-40">{cat.count} Menunggu</p>
							</div>
						</motion.div>
					))}
				</div>
			</motion.div>

			{/* Summary Cards */}

			{/* Main Queue List */}
			<div className="bg-white rounded-[32px] shadow-clinical border border-outline-variant/30 overflow-hidden">
				<div className="px-8 py-8 border-b border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-bright/50">
					<h2 className="text-title-sm font-black text-on-surface uppercase tracking-widest opacity-60">Daftar Antrean</h2>
					<div className="flex items-center gap-4 w-full md:w-auto">
						<div className="relative flex-1 md:w-80">
							<Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface opacity-40" />
							<input
								type="text"
								placeholder="Cari di Antrean.."
								className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 text-label-sm font-bold text-on-surface outline-none focus:border-primary transition-all placeholder:text-on-surface/30"
							/>
						</div>
						<button className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 text-on-surface hover:text-primary transition-all active:scale-95 shadow-sm">
							<Filter className="w-5 h-5" strokeWidth={2.5} />
						</button>
					</div>
				</div>

				<div className="divide-y divide-outline-variant/10">
					{queueData.map((item) => (
						<div key={item.id} className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-surface-container-low/30 transition-all group">
							<div className="flex items-center gap-8 w-full md:w-auto">
								<div
									className={cn(
										"w-20 h-16 rounded-2xl text-title-sm font-black flex items-center justify-center shadow-lg transition-all",
										item.status === "Serving" ? "bg-primary text-on-primary scale-110" : "bg-white text-on-surface border border-outline-variant/30",
									)}
								>
									{item.number}
								</div>
								<div className="min-w-0">
									<p className="text-title-sm font-black text-on-surface truncate group-hover:text-primary transition-colors">{item.name}</p>
									<div className="flex items-center gap-3 mt-2">
										<span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">{item.category}</span>
										<span className="text-label-sm text-on-surface font-bold opacity-60">{item.reason}</span>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-4 w-full md:w-auto">
								{item.status === "Serving" ? (
									<div className="flex items-center gap-3 text-primary bg-primary/5 px-6 py-3 rounded-2xl border border-primary/20 mr-4">
										<div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(181,4,87,0.5)]" />
										<span className="text-label-sm font-black uppercase tracking-widest">Processing</span>
									</div>
								) : (
									<Button variant="outline" className="w-full md:w-auto font-black shadow-sm bg-white hover:bg-primary-container/10">
										<MessageSquare className="w-5 h-5" strokeWidth={2.5} />
										<span>Call to Station</span>
									</Button>
								)}
							</div>
						</div>
					))}
				</div>

				<div className="p-8 bg-surface-container-low/30 text-center">
					<button className="text-label-sm font-black text-primary hover:underline decoration-2 underline-offset-4 transition-all">View Complete Analytical History</button>
				</div>
			</div>
		</div>
	);
}
