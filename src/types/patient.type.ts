export interface PatientProfile {
  id: string;
  patient_number?: string;
  user_id?: string | null;
  first_name: string;
  last_name: string;
  date_of_birth?: string | null;
  gender?: string | null;
  phone_number?: string | null;
  email?: string | null;
  address?: string | null;
  blood_group?: string | null;
  allergies?: string | null;
  medical_history?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  status?: 'Active' | 'In Consultation' | 'Pending Vitals' | 'Discharged';
  last_visit?: string;
  assigned_doctor?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PatientUpdatePayload {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string | null;
  gender?: string | null;
  phone_number?: string | null;
  email?: string | null;
  address?: string | null;
  blood_group?: string | null;
  allergies?: string | null;
  medical_history?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  status?: 'Active' | 'In Consultation' | 'Pending Vitals' | 'Discharged';
  assigned_doctor?: string;
}

export interface PatientCreatePayload {
  user_id?: string | null;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  blood_group?: string;
  allergies?: string;
  medical_history?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  status?: 'Active' | 'In Consultation' | 'Pending Vitals' | 'Discharged';
  assigned_doctor?: string;
}

export interface Appointment {
  id: string;
  doctor_id: string;
  doctor_name: string;
  doctor_specialty: string;
  doctor_avatar?: string;
  department: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  reason: string;
  room?: string;
  notes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  avatar: string;
  rating: number;
  reviews_count: number;
  available_days: string[];
  slots: string[];
  fee: string;
}
