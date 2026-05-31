import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/config"; // Pastikan path import ini benar
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	// State handling yang sempat hilang di kode lama
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await signInWithEmailAndPassword(auth, email.trim(), password);
			alert("Login Berhasil!");
			navigate("/dashboard");
		} catch (err: any) {
			console.error("Firebase login error", err);
			switch (err.code) {
				case "auth/invalid-credential":
					setError("Email atau kata sandi salah.");
					break;
				case "auth/invalid-email":
					setError("Format email tidak valid.");
					break;
				case "auth/user-disabled":
					setError("Pengguna dinonaktifkan.");
					break;
				default:
					setError("Terjadi kesalahan saat mencoba masuk. Silakan coba lagi.");
					break;
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
			<div className="w-full max-w-md bg-white bg-opacity-60 rounded-3xl shadow-lg p-8 flex flex-col items-center">
				<h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Login Kader</h2>
				<p className="text-sm text-gray-500 mb-6 text-center">Layanan Rekam Medis Digital Posyandu</p>

				{error && <div className="w-full p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-2xl border border-red-200">{error}</div>}

				<form className="w-full" onSubmit={handleLogin}>
					<div className="w-full mb-4">
						<label className="block text-sm mb-1 font-medium text-gray-700">Email</label>
						<input
							type="email"
							required
							placeholder="Masukkan email"
							className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="w-full mb-2">
						<label className="block text-sm mb-1 font-medium text-gray-700">Password</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								required
								placeholder="Masukkan password"
								className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 focus:outline-none" onClick={() => setShowPassword((s) => !s)} tabIndex={-1}>
								{showPassword ? "🙈" : "👁️"}
							</button>
						</div>
						<div className="text-right mt-1">
							<a href="#" className="text-xs text-pink-500 hover:underline">
								Lupa Password?
							</a>
						</div>
					</div>
					<button
						type="submit"
						disabled={loading}
						className={`w-full mt-4 py-3 rounded-2xl bg-pink-600 text-white font-bold text-lg shadow-md hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
					>
						{loading ? "Memverifikasi..." : "Login"}
					</button>
				</form>
				<div className="mt-6 text-center w-full">
					<p className="text-sm text-gray-500 mb-2">Mengalami kendala masuk?</p>
					<button className="w-full p-2 rounded-2xl text-pink-700 font-semibold hover:bg-pink-100 transition-colors">Hubungi Admin Puskesmas</button>
				</div>
				<div className="mt-4 text-center">
					<span className="text-sm text-gray-600">Belum punya akun? </span>
					<Link to="/register" className="text-pink-600 font-semibold hover:underline">
						Register
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
