import React from "react";
import { Button } from "../components/atoms/Button";
import { motion } from "motion/react";
import { LogOut, User, Mail, Edit2 } from "lucide-react";

export default function UserProfilePage() {
	// Dummy user data
	const user = {
		name: "Ayu Lestari",
		email: "ayu.lestari@email.com",
		avatar: "https://ui-avatars.com/api/?name=Ayu+Lestari&background=0D8ABC&color=fff",
		role: "Kader Posyandu",
		location: "Posyandu Mawar 1, Jakarta",
	};

	return (
		<div className="space-y-10 max-w-3xl mx-auto">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-display-lg text-on-surface font-black">Profil Pengguna</h1>
				<p className="text-on-surface text-body-md font-bold opacity-60 uppercase tracking-widest leading-relaxed">Lihat dan kelola informasi akun Anda.</p>
			</div>

			{/* Profile Card */}
			<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] p-10 border border-outline-variant/30 shadow-clinical relative overflow-hidden group">
				<div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full -z-0 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
				<div className="flex flex-col sm:flex-row items-center gap-8 mb-8 relative z-10">
					<img src={user.avatar} alt="Avatar" className="w-28 h-28 rounded-full border-4 border-primary/20 shadow-lg object-cover bg-surface-container" />
					<div className="flex-1 min-w-0 space-y-2">
						<h2 className="text-title-lg font-black text-on-surface truncate flex items-center gap-2">
							<User className="w-6 h-6 text-primary" /> {user.name}
						</h2>
						<div className="flex items-center gap-2 text-label-md text-on-surface opacity-60">
							<Mail className="w-4 h-4 text-primary" /> {user.email}
						</div>
						<div className="flex items-center gap-2 text-label-md text-on-surface opacity-60">
							<span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-xs uppercase tracking-widest">{user.role}</span>
							<span className="mx-2">•</span>
							<span>{user.location}</span>
						</div>
					</div>
				</div>
				<div className="flex flex-col sm:flex-row gap-4 mt-6">
					<Button size="lg" className="flex-1 flex items-center justify-center gap-2 font-black rounded-2xl" variant="outline">
						<Edit2 className="w-5 h-5" /> Edit Profil
					</Button>
					<Button size="lg" className="flex-1 flex items-center justify-center gap-2 font-black rounded-2xl bg-error text-white hover:bg-error/90">
						<LogOut className="w-5 h-5" /> Logout
					</Button>
				</div>
			</motion.div>

			{/* Info Section */}
			<div className="bg-white rounded-[40px] p-10 border border-outline-variant/30 shadow-clinical space-y-6">
				<h3 className="text-label-sm font-black text-on-surface uppercase tracking-[4px] opacity-60 mb-4">Informasi Akun</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
					<div>
						<p className="text-label-md font-bold text-on-surface opacity-60 mb-1">Nama Lengkap</p>
						<p className="text-title-md font-black text-on-surface">{user.name}</p>
					</div>
					<div>
						<p className="text-label-md font-bold text-on-surface opacity-60 mb-1">Email</p>
						<p className="text-title-md font-black text-on-surface">{user.email}</p>
					</div>
					<div>
						<p className="text-label-md font-bold text-on-surface opacity-60 mb-1">Peran</p>
						<p className="text-title-md font-black text-on-surface">{user.role}</p>
					</div>
					<div>
						<p className="text-label-md font-bold text-on-surface opacity-60 mb-1">Lokasi</p>
						<p className="text-title-md font-black text-on-surface">{user.location}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
