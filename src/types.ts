import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  lastExam: string;
  status: 'Normal' | 'High Risk' | 'Follow-up';
  avatar?: string;
};

export type QueueItem = {
  id: string;
  queueNumber: string;
  patientName: string;
  category: 'Infant' | 'Adult' | 'Elderly';
  reason: string;
  status: 'Waiting' | 'Serving' | 'Finished';
};

export type MediaItem = {
  id: string;
  title: string;
  description: string;
  type: 'Video' | 'PDF' | 'Infographic';
  category: 'Nutrition' | 'Growth' | 'Immunization';
  status: 'Published' | 'Draft';
  thumbnail: string;
};
