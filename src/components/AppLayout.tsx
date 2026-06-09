import { LayoutDashboard, Users, ListOrdered, Calendar, LibraryBig, Plus, Menu, X } from "lucide-react";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { Button } from "./atoms/Button";
import { useAuth } from "../context/AuthContext";

interface LayoutProps {
	children: ReactNode;
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

const navItems = [
	{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ id: "patients", label: "Peserta", icon: Users },
	{ id: "queue", label: "Antrean", icon: ListOrdered },
	{ id: "calendar", label: "Kalender", icon: Calendar },
	{ id: "media", label: "Manajemen Media", icon: LibraryBig },
	{ id: "user-profile", label: "Profil Pengguna", icon: Users },
];

export function AppLayout({ children, activeTab, setActiveTab }: LayoutProps) {
	const { userData } = useAuth();
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => setIsOpen(!isOpen);
	const handleNavClick = (id: string) => {
		setActiveTab(id);
		setIsOpen(false); // Otomatis tutup menu setelah memilih item
	};

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<div className="flex h-screen overflow-hidden">
				{/* Desktop Sidebar */}
				<aside className="hidden lg:flex flex-col w-72 border-r border-outline-variant/20 bg-white p-6 shadow-sm">
					<div className="flex items-center gap-3 mb-10">
						<span className="text-2xl font-bold tracking-tighter flex gap-2 items-center text-primary">
							<img src="/icon.png" alt="" className="size-10" /> Dashboard Kader
						</span>
					</div>

					<div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl mb-8 border border-outline-variant/10">
						<div className="overflow-hidden">
							<h2 className="text-title-sm font-black text-on-surface truncate">{userData?.nama}</h2>
						</div>
					</div>

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
						<span className="font-white uppercase tracking-widest">Periksa Pasien</span>
					</Button>
				</aside>

				{/* Right Side: Header + Main Content */}
				<div className="flex-1 flex flex-col overflow-hidden">
					{/* Mobile Header Dashboard */}
					<header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-outline-variant/20 shadow-sm z-40">
						<div className="flex items-center gap-2">
							<img src="/icon.png" alt="" className="size-8" />
							<span className="text-lg font-bold tracking-tighter text-primary">Kader Mobile</span>
						</div>

						<button onClick={toggleMenu} className="p-2 text-on-surface hover:bg-surface-container rounded-xl transition-colors" aria-label="Toggle Menu">
							{isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
						</button>
					</header>

					{/* Main Content Area */}
					<main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 hide-scrollbar relative">
						<div className="max-w-6xl mx-auto pb-24 lg:pb-12">{children}</div>

						{/* Floating Action Button (FAB) Periksa Pasien - Hanya muncul di mobile saat tab dashboard */}
						{activeTab === "dashboard" && (
							<div className="lg:hidden fixed bottom-6 right-6 z-40">
								<Button className="shadow-2xl text-white rounded-full p-4 flex items-center gap-2" onClick={() => setActiveTab("new-exam")}>
									<Plus className="w-6 h-6" strokeWidth={3} />
									<span className="font-bold uppercase tracking-wider text-xs pr-2">Periksa Pasien</span>
								</Button>
							</div>
						)}
					</main>
				</div>
			</div>

			{/* Mobile Navigation Drawer Overlay */}
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Backdrop Click to Close */}
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={toggleMenu} className="lg:hidden fixed inset-0 bg-black z-40" />

						{/* Drawer Menu */}
						<motion.div
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="lg:hidden fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-50 p-6 flex flex-col shadow-2xl border-r border-outline-variant/20"
						>
							<div className="flex items-center justify-between mb-8">
								<div className="flex items-center gap-2">
									<img src="/icon.png" alt="" className="size-8" />
									<span className="text-xl font-bold tracking-tighter text-primary">Menu Utama</span>
								</div>
								<button onClick={toggleMenu} className="p-2 hover:bg-surface-container rounded-xl">
									<X className="w-6 h-6" />
								</button>
							</div>

							<div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl mb-6 border border-outline-variant/10">
								<div className="overflow-hidden">
									<h2 className="text-sm font-black text-on-surface truncate">{userData?.nama}</h2>
								</div>
							</div>

							<nav className="flex flex-col gap-2 flex-1">
								{navItems.map((item) => (
									<button
										key={item.id}
										onClick={() => handleNavClick(item.id)}
										className={cn(
											"flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 w-full text-left",
											activeTab === item.id ? "bg-primary text-on-primary shadow-lg shadow-primary/20 font-black" : "text-on-surface hover:bg-surface-container font-medium",
										)}
									>
										<item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-on-primary" : "text-primary")} strokeWidth={2.5} />
										<span className="text-sm">{item.label}</span>
									</button>
								))}
							</nav>

							{/* Tombol Periksa Pasien di bagian bawah drawer sebagai alternatif */}
							<Button className="w-full shadow-lg text-white mt-auto" onClick={() => handleNavClick("new-exam")}>
								<Plus className="w-6 h-6" strokeWidth={3} />
								<span className="font-white uppercase tracking-widest text-sm">Periksa Pasien</span>
							</Button>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
