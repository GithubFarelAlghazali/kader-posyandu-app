import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Ticket, Calendar as CalendarIcon, MapPin, Clock, ArrowRight, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/atoms/Button";
import { cn } from "../lib/utils";

const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const calendarData = [
	{ day: 1, type: "muted" },
	{ day: 2 },
	{ day: 3 },
	{ day: 4 },
	{ day: 5 },
	{ day: 6 },
	{ day: 7 },
	{ day: 8 },
	{ day: 9, hasEvent: true },
	{ day: 10, isSelected: true },
	{ day: 11 },
	{ day: 12 },
	{ day: 13 },
	{ day: 14 },
	{ day: 15, hasEvent: true },
	{ day: 16 },
	{ day: 17 },
	{ day: 18, isToday: true },
	{ day: 19 },
	{ day: 20 },
	{ day: 21 },
];

export function Calendar() {
	const [selectedDate, setSelectedDate] = useState(10);

	return (
		<div className="space-y-10 max-w-3xl mx-auto">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-display-lg text-on-surface font-black">Antrean & Jadwal</h1>
				<p className="text-on-surface text-body-md font-bold opacity-60 uppercase tracking-widest leading-relaxed">Pantau antrean dan jadwal Posyandu Anda secara real-time.</p>
			</div>

			{/* Status Card */}
			<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] p-10 border border-outline-variant/30 shadow-clinical relative overflow-hidden group">
				<div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full -z-0 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

				<div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10 relative z-10">
					<div>
						<h2 className="text-title-sm font-black text-primary uppercase tracking-[4px] mb-2">POSYANDU MAWAR 1</h2>
						<p className="text-body-md text-on-surface font-black opacity-40">Sesi Imunisasi & Timbang Terpadu</p>
					</div>
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

				<Button size="lg" className="w-full relative z-10 py-6 text-lg shadow-xl hover:shadow-2xl font-black rounded-3xl text-white">
					<Ticket className="w-6 h-6 rotate-45" strokeWidth={3} />
					<span className="uppercase tracking-[3px]">Ambil Nomor Antrean</span>
				</Button>
			</motion.div>

			{/* Calendar Section */}
			<div className="space-y-8">
				<div className="flex flex-col sm:flex-row justify-between items-center gap-6">
					<h2 className="text-headline-md text-on-surface font-black">Jadwal Bulan Ini</h2>
					<div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-outline-variant/30 shadow-md">
						<button className="p-1.5 hover:bg-surface-container text-on-surface rounded-xl transition-all active:scale-90">
							<ChevronLeft className="w-5 h-5 stroke-[3px]" />
						</button>
						<span className="text-label-sm font-black min-w-[120px] text-center uppercase tracking-widest">Oktober 2023</span>
						<button className="p-1.5 hover:bg-surface-container text-on-surface rounded-xl transition-all active:scale-90">
							<ChevronRight className="w-5 h-5 stroke-[3px]" />
						</button>
					</div>
				</div>

				<div className="bg-white rounded-[40px] p-10 border border-outline-variant/30 shadow-clinical">
					<div className="grid grid-cols-7 gap-6 mb-8">
						{daysOfWeek.map((day) => (
							<div key={day} className="text-center text-[11px] text-on-surface font-black uppercase tracking-[2px] opacity-40">
								{day}
							</div>
						))}
					</div>

					<div className="grid grid-cols-7 gap-y-6 gap-x-4">
						{calendarData.map((item, i) => (
							<button
								key={i}
								onClick={() => setSelectedDate(item.day)}
								className={cn(
									"relative w-full aspect-square flex flex-col items-center justify-center rounded-[24px] transition-all duration-300 group",
									item.type === "muted" ? "text-on-surface-variant/20" : "text-on-surface",
									item.day === selectedDate ? "bg-primary text-on-primary shadow-2xl scale-110 z-10" : "hover:bg-surface-container-low font-bold",
									item.isToday && item.day !== selectedDate && "border-3 border-primary/20 bg-primary/5",
								)}
							>
								<span className="text-label-sm">{item.day}</span>
								{item.hasEvent && <span className={cn("absolute bottom-3 w-1.5 h-1.5 rounded-full transition-colors", item.day === selectedDate ? "bg-on-primary" : "bg-primary")} />}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Selected Day Events */}
			<div className="space-y-6">
				<h3 className="text-label-sm font-black text-on-surface uppercase tracking-[4px] opacity-60">EVENT: {selectedDate} OKTOBER 2023</h3>

				<AnimatePresence mode="wait">
					{selectedDate === 10 ? (
						<motion.div
							key="event-10"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="bg-white rounded-3xl p-8 border border-outline-variant/30 shadow-sm flex items-center gap-8 hover:shadow-clinical transition-all cursor-pointer group hover:border-primary/20"
						>
							<div className="w-20 h-20 rounded-[24px] bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
								<span className="material-symbols-outlined text-10" style={{ fontVariationSettings: "'FILL' 1" }}>
									vaccines
								</span>
							</div>
							<div className="flex-1 min-w-0">
								<h4 className="text-headline-md font-black text-on-surface mb-2 group-hover:text-primary transition-colors">Imunisasi Campak (MR)</h4>
								<div className="flex flex-wrap items-center gap-y-2 gap-x-6">
									<div className="flex items-center gap-2 text-label-sm text-on-surface font-bold opacity-60">
										<MapPin className="w-4 h-4 text-primary" strokeWidth={3} />
										Puskesmas Kecamatan
									</div>
									<div className="flex items-center gap-2 text-label-sm text-on-surface font-black uppercase tracking-widest">
										<Clock className="w-4 h-4 text-primary" strokeWidth={3} />
										08:00 - 11:00
									</div>
								</div>
							</div>
							<div className="bg-surface-container rounded-2xl p-3 group-hover:bg-primary group-hover:text-on-primary transition-all shadow-sm">
								<ChevronRight className="w-6 h-6 stroke-[3px]" />
							</div>
						</motion.div>
					) : (
						<motion.div key="no-event" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 border-4 border-dashed border-outline-variant/10 rounded-[40px] text-center bg-white/50 shadow-inner">
							<CalendarIcon className="w-12 h-12 text-on-surface mx-auto mb-4 opacity-10" strokeWidth={1} />
							<p className="text-label-sm text-on-surface font-black opacity-30 uppercase tracking-[2px]">Keheningan Administratif</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<div className="pb-12">
				<div className="bg-primary text-on-primary rounded-[40px] p-8 shadow-2xl flex flex-col sm:row-span-1 sm:flex-row items-center justify-between gap-8 relative overflow-hidden group">
					<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
					<div className="flex items-center gap-6 relative z-10">
						<div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center shadow-inner backdrop-blur-md">
							<Bell className="w-10 h-10 text-white" strokeWidth={3} />
						</div>
						<div>
							<h5 className="text-title-sm font-black mb-1">Stay Informed</h5>
							<p className="text-label-sm font-medium opacity-80 leading-relaxed">Dapatkan notifikasi cerdas 24 jam sebelum jadwal kunjungan Anda.</p>
						</div>
					</div>
					<button className="px-8 py-4 bg-white text-primary text-[11px] font-black uppercase tracking-[3px] rounded-2xl shadow-xl hover:scale-105 transition-all active:scale-95 relative z-10">Aktifkan Sekarang</button>
				</div>
			</div>
		</div>
	);
}
