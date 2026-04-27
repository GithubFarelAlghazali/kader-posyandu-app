import React, { useState } from 'react';
import { 
  User, 
  Calendar as CalendarIcon, 
  Ruler, 
  Activity, 
  Info, 
  Save,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/atoms/Button';
import { cn } from '../lib/utils';

export function NewExamination() {
  const [formData, setFormData] = useState({
    patientName: '',
    examDate: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    headCircum: '',
    status: ''
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-display-lg text-on-surface mb-3 font-black">New Examination</h1>
        <p className="text-on-surface text-body-md font-bold opacity-60 uppercase tracking-widest leading-relaxed">
          Record vital statistics and clinical nutritional assessment.
        </p>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-12 gap-10" onSubmit={(e) => e.preventDefault()}>
        {/* Patient Info Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-12 lg:col-span-8 bg-white rounded-[40px] shadow-clinical p-8 md:p-10 border border-outline-variant/30"
        >
          <h3 className="text-title-sm font-black text-on-surface flex items-center gap-4 mb-10 pb-6 border-b border-outline-variant/10">
            <User className="w-6 h-6 text-primary" strokeWidth={3} />
            Patient Demographics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[11px] text-on-surface font-black uppercase tracking-[2px] block opacity-40 italic">Patient Name</label>
              <input 
                type="text"
                placeholder="e.g. Maria Santos"
                className="w-full px-6 py-5 bg-surface-container-low rounded-2xl border border-outline-variant/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body-md text-on-surface font-black placeholder:text-on-surface/20 shadow-inner"
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] text-on-surface font-black uppercase tracking-[2px] block opacity-40 italic">Examination Date</label>
              <div className="relative">
                <input 
                  type="date"
                  className="w-full pl-6 pr-14 py-5 bg-surface-container-low rounded-2xl border border-outline-variant/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body-md text-on-surface font-black appearance-none shadow-inner"
                  value={formData.examDate}
                  onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                />
                <CalendarIcon className="w-6 h-6 absolute right-5 top-1/2 -translate-y-1/2 text-primary pointer-events-none" strokeWidth={3} />
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
          <h3 className="text-title-sm font-black text-on-surface flex items-center gap-4 mb-10 pb-6 border-b border-outline-variant/10 relative z-10">
            <Ruler className="w-6 h-6 text-primary" strokeWidth={3} />
            Anthropometrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 relative z-10">
            <div className="space-y-4">
              <label className="text-[11px] text-on-surface font-black uppercase tracking-[2px] flex justify-between items-center opacity-70">
                Weight (BB)
                <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-black">kg</span>
              </label>
              <div className="relative group/input">
                <input 
                  type="number"
                  placeholder="0.0"
                  step="0.1"
                  className="w-full px-6 py-8 bg-white rounded-[32px] border-2 border-outline-variant/10 focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all text-display-lg text-on-surface font-black shadow-xl text-center"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[11px] text-on-surface font-black uppercase tracking-[2px] flex justify-between items-center opacity-70">
                Height (TB)
                <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-black">cm</span>
              </label>
              <div className="relative">
                <input 
                  type="number"
                  placeholder="0.0"
                  step="0.1"
                  className="w-full px-6 py-8 bg-white rounded-[32px] border-2 border-outline-variant/10 focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all text-display-lg text-on-surface font-black shadow-xl text-center"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[11px] text-on-surface font-black uppercase tracking-[2px] flex justify-between items-center opacity-70">
                Head (HC)
                <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-black">cm</span>
              </label>
              <div className="relative">
                <input 
                  type="number"
                  placeholder="0.0"
                  step="0.1"
                  className="w-full px-6 py-8 bg-white rounded-[32px] border-2 border-outline-variant/10 focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all text-display-lg text-on-surface font-black shadow-xl text-center"
                  value={formData.headCircum}
                  onChange={(e) => setFormData({...formData, headCircum: e.target.value})}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Assessment Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-12 lg:col-span-4 bg-white rounded-[40px] shadow-clinical p-8 md:p-10 border border-outline-variant/30 flex flex-col lg:row-span-2"
        >
          <h3 className="text-title-sm font-black text-on-surface flex items-center gap-4 mb-10 pb-6 border-b border-outline-variant/10">
            <Activity className="w-6 h-6 text-primary" strokeWidth={3} />
            Assessment
          </h3>
          <div className="space-y-8 flex-1">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-on-surface uppercase tracking-[2px] block opacity-40">Clinical Nutritional Status</label>
              <select 
                className="w-full px-6 py-5 bg-surface-container-low rounded-2xl border border-outline-variant/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body-md text-on-surface font-black appearance-none cursor-pointer shadow-inner"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="" disabled>Select clinical status...</option>
                <option value="severely_wasted">Severely Wasted</option>
                <option value="wasted">Wasted</option>
                <option value="normal">Healthy / Normal</option>
                <option value="overweight">Overweight</option>
                <option value="obese">Obese</option>
              </select>
            </div>
            
            <div className="bg-primary text-on-primary rounded-3xl p-8 shadow-xl space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full -mr-8 -mt-8 blur-xl" />
              <div className="flex gap-4">
                <Info className="w-6 h-6 text-white shrink-0" strokeWidth={3} />
                <p className="text-label-sm font-bold leading-relaxed opacity-90">
                  Assessment protocol must adhere strictly to WHO Multi-Centred Growth Reference Study (MGRS) standards.
                </p>
              </div>
              <button 
                type="button"
                className="bg-white text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-md mt-4"
              >
                Launch Growth Charts <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-outline-variant/10">
            <Button size="lg" className="w-full shadow-2xl font-black py-6 rounded-3xl text-lg">
              <Save className="w-6 h-6" strokeWidth={3} />
              <span className="uppercase tracking-[3px]">Secure Clinical Record</span>
            </Button>
          </div>
        </motion.div>
      </form>
    </div>
  );
}
