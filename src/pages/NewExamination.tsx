import React, { useState } from "react";
import { User, Calendar as CalendarIcon, Ruler, Activity, Info, Save, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/atoms/Button";
import { cn } from "../lib/utils";

export function NewExamination() {
	const [formData, setFormData] = useState({
		patientName: "",
		age: "",
		weight: "",
		height: "",
		bloodSistolik: "",
		bloodDistolik: "",
		glucose: "",
		status: "",
	});

	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="mb-10">
				<h1 className="text-display-lg text-on-surface mb-3 font-bold">Pemeriksaan Baru</h1>
			</div>

			<form className="grid grid-cols-1 md:grid-cols-12 gap-10" onSubmit={(e) => e.preventDefault()}>
				{/* Patient Info Card */}
				<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-12 lg:col-span-8 bg-white rounded-[40px] shadow-clinical p-8 md:p-10 border border-outline-variant/30">
					<h3 className="text-title-sm font-bold text-on-surface flex items-center gap-4 mb-10 pb-6 border-b border-outline-variant/10">
						<User className="w-6 h-6 text-primary" strokeWidth={3} />
						Info Pasien
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
						<div className="space-y-3">
							<label className="text-[11px] text-on-surface font-bold uppercase tracking-[2px] block opacity-40 italic">Nama</label>
							<input
								type="text"
								placeholder="Contoh: Aditya"
								className="w-full px-6 py-5 bg-surface-container-low rounded-2xl border border-outline-variant/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body-md text-on-surface font-bold placeholder:text-on-surface/20 shadow-inner"
								value={formData.patientName}
								onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
							/>
						</div>
						<div className="space-y-3">
							<label className="text-[11px] text-on-surface font-bold uppercase tracking-[2px] block opacity-40 italic">Usia</label>
							<div className="relative">
								<input
									type="number"
									min={0}
									placeholder="Contoh: 25"
									className="w-full pl-6 pr-14 py-5 bg-surface-container-low rounded-2xl border border-outline-variant/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body-md text-on-surface font-bold appearance-none shadow-inner"
									value={formData.age}
									onChange={(e) => setFormData({ ...formData, age: e.target.value })}
								/>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Anthropometrics Card */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.1 }}
					className="md:col-span-12 lg:col-span-8 bg-white rounded-[40px] shadow-clinical p-8 md:p-10 border border-outline-variant/30 relative overflow-hidden group"
				>
					<div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-full -z-0 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
					<h3 className="text-title-sm font-bold text-on-surface flex items-center gap-4 mb-10 pb-6 border-b border-outline-variant/10 relative z-10">
						<Ruler className="w-6 h-6 text-primary" strokeWidth={3} />
						Data Kesehatan
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-10 relative z-10">
						<div className="space-y-4">
							<label className="text-[11px] text-on-surface font-bold uppercase tracking-[2px] flex justify-between items-center opacity-70">
								Berat Badan
								<span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold">kg</span>
							</label>
							<div className="relative group/input">
								<input
									type="number"
									placeholder="0.0"
									step="0.1"
									className="w-full px-6 py-8 bg-white rounded-[32px] border-2 border-outline-variant/10 focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all text-display-lg text-on-surface font-bold shadow-xl text-center"
									value={formData.weight}
									onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
								/>
							</div>
						</div>
						<div className="space-y-4">
							<label className="text-[11px] text-on-surface font-bold uppercase tracking-[2px] flex justify-between items-center opacity-70">
								Tinggi Badan
								<span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold">cm</span>
							</label>
							<div className="relative">
								<input
									type="number"
									placeholder="0.0"
									step="0.1"
									className="w-full px-6 py-8 bg-white rounded-[32px] border-2 border-outline-variant/10 focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all text-display-lg text-on-surface font-bold shadow-xl text-center"
									value={formData.height}
									onChange={(e) => setFormData({ ...formData, height: e.target.value })}
								/>
							</div>
						</div>
						<div className="space-y-4">
							<label className="text-[11px] text-on-surface font-bold uppercase tracking-[2px] flex justify-between items-center opacity-70">
								Gula Darah
								<span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold">mg/dL</span>
							</label>
							<div className="relative">
								<input
									type="number"
									placeholder="0.0"
									step="0.1"
									className="w-full px-6 py-8 bg-white rounded-[32px] border-2 border-outline-variant/10 focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all text-display-lg text-on-surface font-bold shadow-xl text-center"
									value={formData.glucose}
									onChange={(e) => setFormData({ ...formData, glucose: e.target.value })}
								/>
							</div>
						</div>
						<div className="space-y-4 w-full md:w-md">
							<p className="text-[11px] text-on-surface font-bold uppercase tracking-[2px] flex justify-between items-center opacity-70">
								Tekanan Darah
								<span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold">mmHg</span>
							</p>
							<div className="flex gap-3 p-5 rounded-xl bg-primary flex-wrap md:flex-nowrap">
								<div className="">
									<label htmlFor="sistolik" className="text-[11px] text-white font-bold uppercase tracking-[2px] flex justify-between items-center opacity-70 mb-4">
										Sistolik
									</label>
									<input
										id="sistolik"
										type="number"
										placeholder="0.0"
										step="0.1"
										className="w-full px-6 py-8 bg-white rounded-[32px] border-2 border-outline-variant/10 focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all text-display-lg text-on-surface font-bold shadow-xl text-center"
										value={formData.sistolik}
										onChange={(e) => setFormData({ ...formData, sistolik: e.target.value })}
									/>
								</div>
								<div className="">
									<label htmlFor="distolik" className="text-[11px] text-white font-bold uppercase tracking-[2px] flex justify-between items-center opacity-70 mb-4">
										Distolik
									</label>
									<input
										id="distolik"
										type="number"
										placeholder="0.0"
										step="0.1"
										className="w-full px-6 py-8 bg-white rounded-[32px] border-2 border-outline-variant/10 focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all text-display-lg text-on-surface font-bold shadow-xl text-center"
										value={formData.distolik}
										onChange={(e) => setFormData({ ...formData, distolik: e.target.value })}
									/>
								</div>
							</div>
						</div>
					</div>
					<button type="submit" className="font-bold uppercase p-5 mt-5 bg-primary text-center rounded-xl text-white">
						Simpan data pemeriksaan
					</button>
				</motion.div>
			</form>
		</div>
	);
}
