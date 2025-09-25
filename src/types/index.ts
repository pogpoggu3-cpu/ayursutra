export interface User {
  id: string;
  email: string;
  name: string;
  role: 'doctor' | 'patient' | 'therapist';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Treatment {
  id: string;
  patientId: string;
  doctorId: string;
  therapistId: string;
  treatmentType: string;
  date: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  progress: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  originalText: string;
  aiInterpretation: string;
  treatments: string[];
  date: string;
}