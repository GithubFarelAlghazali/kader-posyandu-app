import { AppLayout } from "./components/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { NewExamination } from "./pages/NewExamination";
import { Queue } from "./pages/Queue";
import { MediaCMS } from "./pages/MediaCMS";
import { Calendar } from "./pages/Calendar";
import { useState } from "react";
import UserProfilePage from "./pages/UserProfilePage";
import Patients from "./pages/Patients";

export default function App() {
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
}
