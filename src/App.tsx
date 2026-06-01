import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";

// Import Halaman Publik
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Import Halaman Dashboard Internal
import { AppLayout } from "./components/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { NewExamination } from "./pages/NewExamination";
import { Queue } from "./pages/Queue";
import { MediaCMS } from "./pages/MediaCMS";
import { Calendar } from "./pages/Calendar";
import UserProfilePage from "./pages/UserProfilePage";
import Patients from "./pages/Patients";

// Komponen Pembungkus Konten Kontrol Dashboard Internal
const DashboardContainer = () => {
	const [activeTab, setActiveTab] = useState("dashboard");

	return (
		<AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
			{activeTab === "dashboard" && <Dashboard />}
			{activeTab === "new-exam" && <NewExamination />}
			{activeTab === "queue" && <Queue />}
			{activeTab === "calendar" && <Calendar />}
			{activeTab === "media" && <MediaCMS />}
			{activeTab === "user-profile" && <UserProfilePage />}
			{activeTab === "patients" && <Patients />}
		</AppLayout>
	);
};

export default function App() {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-pink-50">
				<p className="text-pink-600 font-semibold animate-pulse text-lg">Memuat Layanan Posyandu...</p>
			</div>
		);
	}

	return (
		<Routes>
			{/* Rute Publik: Jika sudah login, otomatis lempar ke dashboard */}
			<Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
			<Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

			{/* Rute Terproteksi: Wajib login untuk masuk ke dashboard */}
			<Route path="/dashboard" element={user ? <DashboardContainer /> : <Navigate to="/login" replace />} />

			{/* Rute Default Alur URL awal (/) */}
			<Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
		</Routes>
	);
}
