import { AppLayout } from "./components/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { NewExamination } from "./pages/NewExamination";
import { Queue } from "./pages/Queue";
import { MediaCMS } from "./pages/MediaCMS";
import { Calendar } from "./pages/Calendar";
import { useState } from "react";
import UserProfilePage from "./pages/UserProfilePage";

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
			{activeTab === "patients" && (
				<div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant/30">
					<div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
						<span className="material-symbols-outlined text-[40px] text-primary">analytics</span>
					</div>
					<h2 className="text-headline-md text-on-surface mb-2 capitalize">{activeTab} Directory</h2>
					<p className="text-on-surface-variant text-body-md max-w-md">This analytical module is currently aggregating historical data. Full reporting will be available once the clinical cohort sync is complete.</p>
				</div>
			)}
		</AppLayout>
	);
}
