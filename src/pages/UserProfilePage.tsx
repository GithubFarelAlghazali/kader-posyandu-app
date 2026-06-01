import React, { useState } from "react";
import { Button } from "../components/atoms/Button";
import { motion } from "motion/react";
import { LogOut, User, Mail, Edit2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/config";

export default function UserProfilePage() {
	const { userData } = useAuth();
	const [loading, setLoading] = useState(false);

	const handleLogout = async () => {
		const konfirmasi = window.confirm(`Halo ${userData?.nama || "Kader"}, Apakah Anda yakin ingin keluar dari aplikasi?`);

		if (!konfirmasi) return;

		setLoading(true);
		try {
			await auth.signOut();
			alert("Anda telah berhasil keluar.");
		} catch (error) {
			console.error("Gagal melakukan logout:", error);
			alert("Terjadi kesalahan saat mencoba logout. Silakan coba lagi.");
		} finally {
			setLoading(false);
		}
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
					<div className="flex-1 min-w-0 space-y-2">
						<h2 className="text-2xl font-black text-on-surface truncate flex items-center gap-2">
							<User className="size-20 text-primary" /> {userData.nama}
						</h2>
						<div className="flex items-center gap-2 text-label-md text-on-surface opacity-60">
							<Mail className="w-4 h-4 text-primary" /> {userData.email}
						</div>
						<div className="flex items-center gap-2 text-label-md text-on-surface opacity-60">
							<span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-xs uppercase tracking-widest">{userData.role}</span>
						</div>
					</div>
				</div>
				<div className="flex flex-col sm:flex-row gap-4 mt-6">
					<Button size="lg" className="flex-1 flex items-center justify-center gap-2 font-black rounded-2xl" variant="outline">
						<Edit2 className="w-5 h-5" /> Edit Profil
					</Button>
					<Button onClick={handleLogout} size="lg" className="flex-1 flex items-center justify-center gap-2 font-black rounded-2xl bg-error text-white hover:bg-error/90">
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
						<p className="text-title-md font-black text-on-surface">{userData?.nama}</p>
					</div>
					<div>
						<p className="text-label-md font-bold text-on-surface opacity-60 mb-1">Email</p>
						<p className="text-title-md font-black text-on-surface">{userData?.email}</p>
					</div>
					<div>
						<p className="text-label-md font-bold text-on-surface opacity-60 mb-1">Peran</p>
						<p className="text-title-md font-black text-on-surface">{userData?.role}</p>
					</div>
					<div>
						<p className="text-label-md font-bold text-on-surface opacity-60 mb-1">Alamat</p>
						<p className="text-title-md font-black text-on-surface">{userData?.alamat}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
