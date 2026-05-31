import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage: React.FC = () => {
	const [role, setRole] = useState<"pasien" | "kader">("kader");
	const [username, setUsername] = useState("");
	const [nik, setNik] = useState("");
	const [email, setEmail] = useState("");
	const [alamat, setAlamat] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		// Dummy login: set isLoggedIn true
		localStorage.setItem("isLoggedIn", "true");
		navigate("/dashboard");
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
			<div className="w-full max-w-md bg-white bg-opacity-60 rounded-3xl shadow-lg p-8 flex flex-col items-center">
				<h2 className="text-2xl font-bold mb-2 text-center">Login Kader</h2>

				<form className="w-full" onSubmit={handleLogin}>
					<div className="w-full mb-4">
						<label className="block text-sm mb-1">Email</label>
						<input
							type="email"
							placeholder="Masukkan email"
							className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="w-full mb-2">
						<label className="block text-sm mb-1">Password</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Masukkan password"
								className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400" onClick={() => setShowPassword((s) => !s)} tabIndex={-1}>
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
						type="button"
						className="w-full mt-4 py-3 rounded-2xl bg-pink-600 text-white font-bold text-lg shadow-md hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
						onClick={() => (window.location.href = "/")}
					>
						Login
					</button>
				</form>
				<div className="mt-6 text-center">
					<p className="text-sm text-gray-500 mb-2">Mengalami kendala masuk?</p>
					<button className="w-full p-2 rounded-2xl  text-pink-700 font-semibold hover:bg-pink-100 transition-colors">Hubungi Admin Puskesmas</button>
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
