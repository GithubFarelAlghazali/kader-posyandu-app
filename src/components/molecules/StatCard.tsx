import React from "react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

interface StatCardProps {
	title: string;
	value: string | number;
	label: string;
	icon: React.ReactNode;
	trend?: {
		value: string;
		isUp: boolean;
	};
	variant?: "default" | "error";
}

export function StatCard({ title, value, label, icon, trend, variant = "default" }: StatCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -4 }}
			className={cn("relative bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-clinical flex flex-col justify-between overflow-hidden", variant === "error" && "border-error-container bg-error-container/5")}
		>
			{variant === "error" && <div className="absolute top-0 right-0 w-32 h-32 bg-error-container/20 rounded-bl-full -mr-10 -mt-10 pointer-events-none blur-xl" />}

			<div className="flex justify-between items-start mb-4 relative z-10">
				<div className={cn("w-10 h-10 rounded-full flex items-center justify-center", variant === "default" ? "bg-primary-container/10 text-primary" : "bg-error-container text-error")}>{icon}</div>
				{trend && (
					<span className={cn("px-2 py-1 rounded-full text-label-sm flex items-center gap-1", trend.isUp ? "bg-primary-container/20 text-primary" : "bg-error/10 text-error")}>
						<span className="material-symbols-outlined text-[14px]">{/* {trend.isUp ? 'arrow_upward' : 'arrow_downward'} */}</span>
						{trend.value}
					</span>
				)}
			</div>

			<div className="relative z-10">
				<h3 className="text-title-sm text-on-surface-variant font-medium mb-1">{title}</h3>
				<div className={cn("text-display-lg", variant === "error" ? "text-error" : "text-on-surface")}>{value}</div>
				<p className="text-label-sm text-on-surface-variant mt-2">{label}</p>
			</div>
		</motion.div>
	);
}
