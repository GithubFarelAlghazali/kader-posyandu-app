import { LayoutDashboard, Users, ListOrdered, Calendar, LibraryBig, Search, RefreshCcw, Bell, Plus } from "lucide-react";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { Button } from "./atoms/Button";

interface LayoutProps {
	children: ReactNode;
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

const navItems = [
	{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ id: "patients", label: "Patients", icon: Users },
	{ id: "queue", label: "Queue", icon: ListOrdered },
	{ id: "calendar", label: "Calendar", icon: Calendar },
	{ id: "media", label: "Media CMS", icon: LibraryBig },
	{ id: "user-profile", label: "Profil", icon: Users }, // Tambahkan menu user profile jika ingin di nav
];

export function AppLayout({ children, activeTab, setActiveTab }: LayoutProps) {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			<div className="flex h-screen overflow-hidden">
				{/* Desktop Sidebar */}
				<aside className="hidden lg:flex flex-col w-72 border-r border-outline-variant/20 bg-white p-6 shadow-sm">
					<div className="flex items-center gap-3 mb-10">
						<span className="text-2xl font-black tracking-tighter text-primary">VitalityTrack</span>
					</div>

					<button className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl mb-8 border border-outline-variant/10 w-full text-left transition hover:bg-primary/10 group" onClick={() => setActiveTab("user-profile")}>
						<img
							src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop"
							className="w-12 h-12 rounded-xl object-cover border-2 border-primary shadow-sm group-hover:scale-105 transition-transform"
							alt="Avatar"
						/>
						<div className="overflow-hidden">
							<h2 className="text-title-sm font-black text-on-surface truncate group-hover:text-primary transition-colors">Dr. Sarah Kader</h2>
							<p className="text-label-sm text-secondary font-bold truncate">Lead Specialist</p>
						</div>
					</button>

					<nav className="flex-1 flex flex-col gap-2">
						{navItems.map((item) => (
							<button
								key={item.id}
								onClick={() => setActiveTab(item.id)}
								className={cn(
									"flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
									activeTab === item.id ? "bg-primary text-on-primary shadow-lg shadow-primary/20 font-black" : "text-on-surface hover:bg-surface-container hover:translate-x-1 font-medium",
								)}
							>
								<item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-on-primary" : "text-primary")} strokeWidth={2.5} />
								<span className="text-label-sm">{item.label}</span>
							</button>
						))}
					</nav>

					<Button className="mt-auto w-full shadow-lg text-white" onClick={() => setActiveTab("new-exam")}>
						<Plus className="w-6 h-6" strokeWidth={3} />
						<span className="font-white  uppercase tracking-widest">New Examination</span>
					</Button>
				</aside>

				{/* Main Content Area */}
				<main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 hide-scrollbar">
					<div className="max-w-6xl mx-auto pb-24 lg:pb-12">{children}</div>
				</main>
			</div>

			{/* Mobile Navigation */}
			<nav className="lg:hidden fixed bottom-0 w-full z-50 bg-white/95 backdrop-blur-xl border-t border-outline-variant/30 pb-safe shadow-clinical-nav">
				<div className="flex justify-around items-center h-20">
					{navItems.map((item) => (
						<button
							key={item.id}
							onClick={() => setActiveTab(item.id)}
							className={cn("flex flex-col items-center justify-center transition-all min-w-[72px] h-full relative", activeTab === item.id ? "text-primary" : "text-on-surface")}
						>
							{activeTab === item.id && <motion.div layoutId="active-pill" className="absolute top-0 w-12 h-1.5 bg-primary rounded-b-full shadow-[0_4px_8px_rgba(181,4,87,0.3)]" />}
							<item.icon className={cn("w-6 h-6 mb-1", activeTab === item.id && "stroke-[3px]")} />
							<span className={cn("text-[10px] uppercase tracking-widest font-black", activeTab === item.id ? "opacity-100" : "opacity-70")}>{item.id === "dashboard" ? "Home" : item.label.split(" ")[0]}</span>
						</button>
					))}
				</div>
			</nav>
		</div>
	);
}
