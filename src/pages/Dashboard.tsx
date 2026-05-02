import React from "react";
import { StatCard } from "../components/molecules/StatCard";
import { Users, AlertTriangle, TrendingUp, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "motion/react";
import { Button } from "../components/atoms/Button";

const mockData = [
	{ name: "Normal", value: 850, color: "#b50457" },
	{ name: "At Risk", value: 256, color: "#d82d70" },
	{ name: "Stunted", value: 142, color: "#ba1a1a" },
];

const alerts = [
	{ id: 1, name: "Budi Santoso", issue: "Weight dropped by 1.2kg", type: "error", time: "10m ago" },
	{ id: 2, name: "Ayu Lestari", issue: "Missed 2 month checkup", type: "warning", time: "2h ago" },
	{ id: 3, name: "Leo M.", issue: "Vaccination overdue", type: "warning", time: "5h ago" },
];

export function Dashboard() {
	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div>
					<h1 className="text-display-lg text-on-surface mb-2 font-black">Posyandu Analytics</h1>
					<p className="text-on-surface text-body-md font-medium opacity-80">Real-time toddler growth and nutritional monitoring.</p>
				</div>
				<div className="flex items-center gap-4">
					<div className="bg-white px-5 py-2.5 rounded-2xl border border-outline shadow-sm flex items-center gap-3">
						<CalendarIcon className="w-5 h-5 text-primary stroke-[3px]" />
						<span className="text-label-sm font-black text-on-surface">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
					</div>
				</div>
			</div>

			{/* Hero Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard title="Total Screened" value="1,248" label="Children under 5 years" icon={<Users className="w-5 h-5" />} trend={{ value: "12%", isUp: true }} />
				<StatCard title="High Risk" value="142" label="Requires immediate follow-up" icon={<AlertTriangle className="w-5 h-5" />} trend={{ value: "2%", isUp: false }} variant="error" />
				<StatCard title="Avg. Weight Gain" value="+450g" label="Compared to last month" icon={<TrendingUp className="w-5 h-5" />} trend={{ value: "5%", isUp: true }} />
				<StatCard title="Upcoming Camps" value="8" label="Scheduled for this month" icon={<CalendarIcon className="w-5 h-5" />} />
			</div>

			{/* Main Grid Section */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Chart Card */}
				<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-8 bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-clinical flex flex-col min-h-[450px]">
					<div className="flex justify-between items-center mb-10">
						<div>
							<h3 className="text-title-sm font-black text-on-surface">Growth Status Distribution</h3>
							<p className="text-label-sm text-on-surface font-bold opacity-60 uppercase tracking-widest">Height-for-Age (HAZ) Z-scores</p>
						</div>
						<select className="bg-surface-container-low border border-outline-variant/30 rounded-xl text-label-sm font-black px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20">
							<option>Last 30 Days</option>
							<option>Last Quarter</option>
						</select>
					</div>

					<div className="flex-1 w-full h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={mockData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E3E4" />
								<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#191c1d", fontWeight: 700 }} dy={10} />
								<YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#191c1d", fontWeight: 500 }} />
								<Tooltip
									cursor={{ fill: "rgba(181, 4, 87, 0.05)" }}
									contentStyle={{
										borderRadius: "16px",
										border: "1px solid rgba(0,0,0,0.05)",
										boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
										fontSize: "12px",
										fontWeight: "700",
									}}
								/>
								<Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
									{mockData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</motion.div>

				{/* Sidebar Alerts Column */}
				<div className="lg:col-span-4 space-y-8">
					<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-clinical">
						<div className="flex justify-between items-center mb-8">
							<h3 className="text-title-sm font-black text-on-surface">Recent Alerts</h3>
							<button className="text-label-sm text-primary font-black hover:underline decoration-2 underline-offset-4">View All</button>
						</div>

						<div className="flex flex-col gap-5">
							{alerts.map((alert) => (
								<div key={alert.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface transition-all border border-transparent hover:border-outline-variant/30 group cursor-pointer">
									<div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm", alert.type === "error" ? "bg-error text-on-error" : "bg-primary text-on-primary")}>
										<AlertTriangle className="w-6 h-6" strokeWidth={2.5} />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex justify-between items-center mb-0.5">
											<p className="text-label-sm font-black text-on-surface truncate">{alert.name}</p>
											<span className="text-[10px] text-on-surface font-black uppercase tracking-widest opacity-40 whitespace-nowrap ml-2">{alert.time}</span>
										</div>
										<p className={cn("text-label-sm font-bold truncate", alert.type === "error" ? "text-error" : "text-on-surface")}>{alert.issue}</p>
									</div>
									<ChevronRight className="w-5 h-5 text-on-surface opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
								</div>
							))}
						</div>
					</motion.div>

					{/* Quick Action Bar */}
					<div className="bg-primary text-on-primary p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
						<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-10 -mt-10 blur-2xl group-hover:scale-110 transition-transform duration-500" />
						<h4 className="text-title-sm font-black mb-2 relative z-10">Need to log data?</h4>
						<p className="text-label-sm mb-8 font-medium opacity-90 relative z-10 leading-relaxed">Start a new session for the current clinic cohort to track progress.</p>
						<Button variant="secondary" className="w-full relative z-10 font-black shadow-lg text-primary">
							Begin Screening Session
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
