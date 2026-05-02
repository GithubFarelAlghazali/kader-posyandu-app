import React from "react";
import { Plus, FileVideo, FileText, Image as ImageIcon, MoreVertical, Edit2, Trash2, Search } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/atoms/Button";
import { cn } from "../lib/utils";

const mediaData = [
	{
		id: "1",
		title: "Daily Nutrition Guide for Toddlers",
		description: "A comprehensive video guide for parents on balanced meals for children aged 1-3 years.",
		type: "Video",
		category: "Nutrition",
		status: "Published",
		thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400&auto=format&fit=crop",
	},
	{
		id: "2",
		title: "Standard Immunization Schedule 2024",
		description: "Printable chart showing required vaccines from birth to 5 years.",
		type: "PDF",
		category: "Immunization",
		status: "Published",
		thumbnail: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400&auto=format&fit=crop",
	},
	{
		id: "3",
		title: "Understanding Percentiles",
		description: "Visual explainer on how to read and interpret WHO child growth standards charts.",
		type: "Infographic",
		category: "Growth",
		status: "Draft",
		thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop",
	},
];

export function MediaCMS() {
	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
				<div>
					<h1 className="text-display-lg text-on-surface mb-2 font-black leading-tight">Education Media</h1>
					<p className="text-on-surface text-body-md font-bold opacity-60 uppercase tracking-widest leading-relaxed">Manage and distribute clinical health resources.</p>
				</div>
				<Button size="lg" className="w-full md:w-auto text-white shadow-2xl font-black px-8">
					<Plus className="w-6 h-6 stroke-[3px]" />
					<span>Upload New Resource</span>
				</Button>
			</div>

			{/* Secondary Nav / Filter Bar */}
			<div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-3 rounded-3xl border border-outline-variant/30 shadow-sm">
				<div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto hide-scrollbar p-1">
					{["All Library", "Nutrition", "Growth", "Immunization"].map((tab, i) => (
						<button
							key={tab}
							className={cn(
								"px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
								i === 0 ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "text-on-surface hover:bg-surface-container",
							)}
						>
							{tab}
						</button>
					))}
				</div>
				<div className="relative w-full md:w-80 px-2 lg:px-0">
					<Search className="w-5 h-5 absolute left-4 lg:left-3 top-1/2 -translate-y-1/2 text-on-surface opacity-40" />
					<input
						type="text"
						placeholder="Search clinical resources..."
						className="w-full pl-12 pr-6 py-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30 text-label-sm font-bold text-on-surface outline-none focus:border-primary transition-all placeholder:text-on-surface/30"
					/>
				</div>
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{mediaData.map((item) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						whileHover={{ y: -8 }}
						className="bg-white rounded-[40px] shadow-clinical border border-outline-variant/10 overflow-hidden flex flex-col group transition-all duration-300"
					>
						<div className="relative h-60 bg-surface-container overflow-hidden">
							<img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.95]" alt={item.title} />
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

							<div className="absolute top-6 left-6">
								<div className="bg-white/95 backdrop-blur-md text-on-surface font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-3 shadow-xl">
									{item.type === "Video" && <FileVideo className="w-4 h-4 text-primary" strokeWidth={3} />}
									{item.type === "PDF" && <FileText className="w-4 h-4 text-primary" strokeWidth={3} />}
									{item.type === "Infographic" && <ImageIcon className="w-4 h-4 text-primary" strokeWidth={3} />}
									{item.type}
								</div>
							</div>
							<div
								className={cn(
									"absolute top-6 right-6 text-[10px] uppercase tracking-[2px] px-3 py-2 rounded-xl shadow-xl border-2 font-black transition-all",
									item.status === "Published" ? "bg-white text-primary border-primary/20" : "bg-surface-container-high text-on-surface border-outline-variant/50",
								)}
							>
								{item.status}
							</div>
						</div>

						<div className="p-8 flex flex-col flex-grow">
							<h3 className="text-title-sm font-black text-on-surface leading-tight mb-3 line-clamp-2 min-h-[56px] group-hover:text-primary transition-colors">{item.title}</h3>
							<p className="text-label-sm text-on-surface font-bold opacity-50 line-clamp-2 mb-8 leading-relaxed max-w-[90%]">{item.description}</p>

							<div className="mt-auto flex items-center justify-between border-t border-outline-variant/10 pt-6">
								<span className="bg-primary text-on-primary px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">{item.category}</span>
								<div className="flex gap-2">
									<button className="p-2.5 text-on-surface hover:text-primary bg-surface-container-low hover:bg-primary/5 rounded-xl transition-all active:scale-90">
										<Edit2 className="w-4.5 h-4.5" strokeWidth={2.5} />
									</button>
									<button className="p-2.5 text-on-surface hover:text-error bg-surface-container-low hover:bg-error/5 rounded-xl transition-all active:scale-90">
										<Trash2 className="w-4.5 h-4.5" strokeWidth={2.5} />
									</button>
									<button className="p-2.5 text-on-surface hover:bg-surface-container bg-surface-container-low rounded-xl transition-all shadow-sm">
										<MoreVertical className="w-4.5 h-4.5" strokeWidth={2.5} />
									</button>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
