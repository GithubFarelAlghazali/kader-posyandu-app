import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const RegisterPage: React.FC = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [telp, setTelp] = useState("");
	const [nik, setNik] = useState("");
	const [alamat, setAlamat] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// State tambahan untuk UX & Handling Error
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Kata sandi dan konfirmasi kata sandi tidak cocok.");
			return;
		}

		if (password.length < 8) {
			setError("Kata sandi minimal harus 8 karakter.");
			return;
		}

		setLoading(true);

		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;

			await setDoc(doc(db, "users", user.uid), {
				uid: user.uid,
				nama: name,
				email: email,
				nik: nik,
				telepon: telp,
				alamat: alamat,
				role: "kader",
				dibuat_pada: new Date().toISOString(),
			});

			await signOut(auth);
			navigate("/login");
		} catch (err: any) {
			if (err.code === "auth/email-already-in-use") {
				setError("Email tersebut sudah terdaftar.");
			} else if (err.code === "auth/invalid-email") {
				setError("Format email tidak valid.");
			} else {
				setError(err.message || "Terjadi kesalahan saat mendaftar.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
			<div className="w-full max-w-md bg-white bg-opacity-60 rounded-3xl shadow-lg p-8 flex flex-col items-center">
				<h2 className="text-2xl font-bold mb-2 text-center">Daftar Akun</h2>
				{error && <div className="w-full p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-2xl border border-red-200">{error}</div>}
				<form className="w-full" onSubmit={handleRegister}>
					<div className="w-full mb-4">
						<label htmlFor="">
							Username
							<input
								required
								type="text"
								placeholder="Masukkan Nama Lengkap"
								className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</label>
					</div>
					<div className="w-full mb-4">
						<label htmlFor="">
							Email
							<input
								required
								type="email"
								placeholder="Masukkan Email Aktif"
								className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</label>
					</div>
					<div className="w-full mb-4">
						<label htmlFor="">
							No. Telepon
							<input
								required
								type="tel"
								pattern="^\+628[1-9][0-9]{7,10}$|^\+622[1-9][0-9]{6,8}$"
								placeholder="Format +62"
								className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
								value={telp}
								onChange={(e) => setTelp(e.target.value)}
							/>
						</label>
					</div>
					<div className="w-full mb-4">
						<label htmlFor="">
							NIK
							<input
								required
								pattern="\d{16}"
								type="text"
								maxLength="16"
								minLength="16"
								placeholder="Masukkan NIK"
								className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
								value={nik}
								onChange={(e) => setNik(e.target.value)}
							/>
						</label>
					</div>
					<div className="w-full mb-4">
						<label htmlFor="">
							Alamat
							<input
								required
								type="text"
								placeholder="Masukkan Alamat Domisili"
								className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
								value={alamat}
								onChange={(e) => setAlamat(e.target.value)}
							/>
						</label>
					</div>
					<div className="w-full mb-4">
						<div className="relative">
							<label htmlFor="">
								Password
								<input
									required
									type={showPassword ? "text" : "password"}
									placeholder="Min. 8 karakter"
									className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
									value={password}
									minLength="8"
									onChange={(e) => setPassword(e.target.value)}
								/>
								<button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400" onClick={() => setShowPassword((s) => !s)} tabIndex={-1}>
									{showPassword ? "Sembunyikan" : "Tampilkan"}
								</button>
							</label>
						</div>
					</div>
					<div className="w-full mb-4">
						<div className="relative">
							<input
								required
								minLength="8"
								type={showConfirmPassword ? "text" : "password"}
								placeholder="Ulangi kata sandi"
								className="w-full px-4 py-3 rounded-2xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
							<button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400" onClick={() => setShowConfirmPassword((s) => !s)} tabIndex={-1}>
								{showConfirmPassword ? "Sembunyikan" : "Tampilkan"}
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
