export type Role = "admin" | "clinical" | "pharmacist";

export type Gender = "Female" | "Male" | "Other";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type RoomType = "General Ward" | "Semi-Private" | "Private" | "ICU";

export type PrescriptionStatus = "Active" | "Dispensed" | "Cancelled";

export type PaymentStatus = "Pending" | "Partially Paid" | "Settled";

export type Department = "Doctors" | "Nurses" | "Pharmacists" | "Admins";

export type BillingCategory =
  | "Room"
  | "Consultation"
  | "Lab"
  | "Pharmacy"
  | "Procedure";

export interface VitalReading {
  id: string;
  recordedAt: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperatureC: number;
  spo2: number;
  recordedBy: string;
}

export interface ConsultationNote {
  id: string;
  date: string;
  clinician: string;
  department: string;
  diagnosis: string;
  notes: string;
}

export interface Allergy {
  id: string;
  substance: string;
  reaction: string;
  severity: "Mild" | "Moderate" | "Severe";
}

export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  contact: string;
  email: string;
  admittedAt: string;
  roomType: RoomType;
  bed: string;
  dailyRoomRate: number;
  attendingPhysician: string;
  status: "Admitted" | "Outpatient" | "Discharged";
  diagnoses: string[];
  allergies: Allergy[];
  vitals: VitalReading[];
  consultations: ConsultationNote[];
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  strength: string;
  form: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  stock: number;
  unitPrice: number;
  location: string;
}

export interface PrescriptionItem {
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  quantity: number;
  unitPrice: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  prescribedBy: string;
  prescribedAt: string;
  status: PrescriptionStatus;
  items: PrescriptionItem[];
  notes: string;
  dispensedAt?: string;
  dispensedBy?: string;
}

export interface BillingLineItem {
  id: string;
  category: BillingCategory;
  description: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  linkedPrescriptionId?: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  lineItems: BillingLineItem[];
  discountPercent: number;
  taxPercent: number;
  insuranceProvider: string;
  insuranceCoveragePercent: number;
  deductible: number;
  copay: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
}

export interface StaffMember {
  id: string;
  employeeId: string;
  name: string;
  department: Department;
  title: string;
  email: string;
  hiredAt: string;
  baseSalary: number;
  overtimeRate: number;
  nightShiftBonus: number;
  healthPremium: number;
  unpaidLeavePenaltyPerDay: number;
}

export interface Payslip {
  id: string;
  staffId: string;
  period: string;
  overtimeHours: number;
  nightShifts: number;
  unpaidLeaveDays: number;
  taxPercent: number;
  paidOn: string;
}

export interface HospitalState {
  version: number;
  role: Role;
  patients: Patient[];
  medicines: Medicine[];
  prescriptions: Prescription[];
  invoices: Invoice[];
  staff: StaffMember[];
  payslips: Payslip[];
}
