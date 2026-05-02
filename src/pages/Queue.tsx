import React from "react";
import { Megaphone, Baby, User, UserRound, MessageSquare, Search, Filter } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/atoms/Button";
import { cn } from "../lib/utils";

const queueData = [
	{ id: "1", number: "A-05", name: "Budi Santoso", category: "Adult", reason: "General Checkup", status: "Waiting" },
	{ id: "2", number: "I-02", name: "Siti Aminah", category: "Infant", reason: "Immunization", status: "Waiting" },
	{ id: "3", number: "E-01", name: "Rachmat Wahyudi", category: "Elderly", reason: "Blood Pressure", status: "Waiting" },
	{ id: "4", number: "A-06", name: "Dewi Lestari", category: "Adult", reason: "Consultation", status: "Serving" },
];

const categories = [
	{ label: "Infant", count: 3, icon: Baby, color: "text-blue-500", bg: "bg-blue-50" },
	{ label: "Adult", count: 7, icon: User, color: "text-primary", bg: "bg-primary/5" },
	{ label: "Elderly", count: 2, icon: UserRound, color: "text-purple-500", bg: "bg-purple-50" },
];

export function Queue() {
	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
				<div>
					<h1 className="text-display-lg text-on-surface mb-2 font-black">Queue Management</h1>
					<p className="text-on-surface text-body-md font-bold opacity-70 uppercase tracking-widest">Today, Oct 24 • Clinical Cohort A</p>
				</div>
				<Button size="lg" className=" w-full md:w-auto shadow-2xl font-black px-8">
					<Megaphone className="w-5 h-5 fill-white" strokeWidth={3} />
					<span className="text-white">Call Next Patient</span>
				</Button>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
				{categories.map((cat) => (
					<motion.div key={cat.label} whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl border-primary/25 border shadow-clinical flex items-center gap-5 transition-all">
						<div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm", cat.bg)}>
							<cat.icon className={cn("w-8 h-8", cat.color)} strokeWidth={2.5} />
						</div>
						<div>
							<h3 className="text-title-sm font-black text-on-surface">{cat.label}</h3>
							<p className="text-body-md text-on-surface font-black opacity-40">{cat.count} Waiting</p>
						</div>
					</motion.div>
				))}
			</div>

			{/* Main Queue List */}
			<div className="bg-white rounded-[32px] shadow-clinical border border-outline-variant/30 overflow-hidden">
				<div className="px-8 py-8 border-b border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-bright/50">
					<h2 className="text-title-sm font-black text-on-surface uppercase tracking-widest opacity-60">Live Queue List</h2>
					<div className="flex items-center gap-4 w-full md:w-auto">
						<div className="relative flex-1 md:w-80">
							<Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface opacity-40" />
							<input
								type="text"
								placeholder="Find in queue..."
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
