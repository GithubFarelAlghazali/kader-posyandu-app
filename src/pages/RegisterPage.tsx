import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
	const [role, setRole] = useState<"pasien" | "kader">("pasien");
	const [name, setName] = useState("");
	const [contact, setContact] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const navigate = useNavigate();

	const handleRegister = (e: React.FormEvent) => {
		e.preventDefault();
		// Dummy register: langsung login
		localStorage.setItem("isLoggedIn", "true");
		navigate("/dashboard");
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
			<div className="w-full max-w-md bg-white bg-opacity-60 rounded-3xl shadow-lg p-8 flex flex-col items-center">
				<h2 className="text-2xl font-bold mb-2 text-center">Daftar Akun</h2>
				<p className="mb-6 text-center text-gray-600">Mari bergabung untuk kesehatan ibu dan anak yang lebih baik.</p>
				<div className="flex w-full mb-6">
					<button className={`flex-1 py-2 rounded-l-2xl font-semibold transition-colors ${role === "pasien" ? "bg-pink-600 text-white" : "bg-pink-100 text-pink-700"}`} onClick={() => setRole("pasien")}>
						Pasien
					</button>
					<button className={`flex-1 py-2 rounded-r-2xl font-semibold transition-colors ${role === "kader" ? "bg-pink-600 text-white" : "bg-pink-100 text-pink-700"}`} onClick={() => setRole("kader")}>
						Kader
					</button>
				</div>
				<form className="w-full" onSubmit={handleRegister}>
					<div className="w-full mb-4">
						<input
							type="text"
							placeholder="Masukkan nama lengkap Anda"
							className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="w-full mb-4">
						<input
							type="text"
							placeholder="Contoh: 08123456789 atau email@pos.id"
							className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
							value={contact}
							onChange={(e) => setContact(e.target.value)}
						/>
					</div>
					<div className="w-full mb-4">
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Min. 8 karakter"
								className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400" onClick={() => setShowPassword((s) => !s)} tabIndex={-1}>
								{showPassword ? "🙈" : "👁️"}
							</button>
						</div>
					</div>
					<div className="w-full mb-4">
						<div className="relative">
							<input
								type={showConfirmPassword ? "text" : "password"}
								placeholder="Ulangi kata sandi"
								className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
							<button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400" onClick={() => setShowConfirmPassword((s) => !s)} tabIndex={-1}>
								{showConfirmPassword ? "🙈" : "👁️"}
							</button>
						</div>
					</div>
					<button type="submit" className="w-full mt-2 py-3 rounded-2xl bg-pink-600 text-white font-bold text-lg shadow-md hover:bg-pink-700 transition-colors">
						Register
					</button>
				</form>
				<div className="mt-4 text-center">
					<span className="text-sm text-gray-600">Sudah punya akun? </span>
					<Link to="/login" className="text-pink-600 font-semibold hover:underline">
						Login
					</Link>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
