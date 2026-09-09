-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'clinical', 'pharmacist');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Female', 'Male', 'Other');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('GeneralWard', 'SemiPrivate', 'Private', 'ICU');

-- CreateEnum
CREATE TYPE "PatientStatus" AS ENUM ('Admitted', 'Outpatient', 'Discharged');

-- CreateEnum
CREATE TYPE "AllergySeverity" AS ENUM ('Mild', 'Moderate', 'Severe');

-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('Active', 'Dispensed', 'Cancelled');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'PartiallyPaid', 'Settled');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('Doctors', 'Nurses', 'Pharmacists', 'Admins');

-- CreateEnum
CREATE TYPE "BillingCategory" AS ENUM ('Room', 'Consultation', 'Lab', 'Pharmacy', 'Procedure');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('New', 'Contacted', 'Scheduled', 'Closed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "mrn" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "admittedAt" TIMESTAMP(3) NOT NULL,
    "roomType" "RoomType" NOT NULL,
    "bed" TEXT NOT NULL,
    "dailyRoomRate" DECIMAL(12,2) NOT NULL,
    "attendingPhysician" TEXT NOT NULL,
    "status" "PatientStatus" NOT NULL,
    "diagnoses" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allergy" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "substance" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "severity" "AllergySeverity" NOT NULL,

    CONSTRAINT "Allergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vital" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "systolic" INTEGER NOT NULL,
    "diastolic" INTEGER NOT NULL,
    "heartRate" INTEGER NOT NULL,
    "temperatureC" DECIMAL(4,1) NOT NULL,
    "spo2" INTEGER NOT NULL,
    "recordedBy" TEXT NOT NULL,

    CONSTRAINT "Vital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "clinician" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genericName" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "form" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "expiryDate" DATE NOT NULL,
    "stock" INTEGER NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "location" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "prescribedBy" TEXT NOT NULL,
    "prescribedAt" TIMESTAMP(3) NOT NULL,
    "status" "PrescriptionStatus" NOT NULL,
    "notes" TEXT NOT NULL,
    "dispensedAt" TIMESTAMP(3),
    "dispensedBy" TEXT,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionItem" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "medicineName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "PrescriptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "discountPercent" DECIMAL(5,2) NOT NULL,
    "taxPercent" DECIMAL(5,2) NOT NULL,
    "insuranceProvider" TEXT NOT NULL,
    "insuranceCoveragePercent" DECIMAL(5,2) NOT NULL,
    "deductible" DECIMAL(12,2) NOT NULL,
    "copay" DECIMAL(12,2) NOT NULL,
    "amountPaid" DECIMAL(12,2) NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingLine" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "category" "BillingCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "linkedPrescriptionId" TEXT,

    CONSTRAINT "BillingLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffMember" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" "Department" NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hiredAt" DATE NOT NULL,
    "baseSalary" DECIMAL(12,2) NOT NULL,
    "overtimeRate" DECIMAL(12,2) NOT NULL,
    "nightShiftBonus" DECIMAL(12,2) NOT NULL,
    "healthPremium" DECIMAL(12,2) NOT NULL,
    "unpaidLeavePenaltyPerDay" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "StaffMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payslip" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "overtimeHours" INTEGER NOT NULL,
    "nightShifts" INTEGER NOT NULL,
    "unpaidLeaveDays" INTEGER NOT NULL,
    "taxPercent" DECIMAL(5,2) NOT NULL,
    "paidOn" DATE NOT NULL,

    CONSTRAINT "Payslip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'New',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_mrn_key" ON "Patient"("mrn");

-- CreateIndex
CREATE INDEX "Patient_lastName_firstName_idx" ON "Patient"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "Patient_status_idx" ON "Patient"("status");

-- CreateIndex
CREATE INDEX "Allergy_patientId_idx" ON "Allergy"("patientId");

-- CreateIndex
CREATE INDEX "Vital_patientId_recordedAt_idx" ON "Vital"("patientId", "recordedAt");

-- CreateIndex
CREATE INDEX "Consultation_patientId_date_idx" ON "Consultation"("patientId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_batchNumber_key" ON "Medicine"("batchNumber");

-- CreateIndex
CREATE INDEX "Medicine_name_idx" ON "Medicine"("name");

-- CreateIndex
CREATE INDEX "Medicine_stock_idx" ON "Medicine"("stock");

-- CreateIndex
CREATE INDEX "Medicine_expiryDate_idx" ON "Medicine"("expiryDate");

-- CreateIndex
CREATE INDEX "Prescription_patientId_idx" ON "Prescription"("patientId");

-- CreateIndex
CREATE INDEX "Prescription_status_idx" ON "Prescription"("status");

-- CreateIndex
CREATE INDEX "PrescriptionItem_prescriptionId_idx" ON "PrescriptionItem"("prescriptionId");

-- CreateIndex
CREATE INDEX "Invoice_patientId_idx" ON "Invoice"("patientId");

-- CreateIndex
CREATE INDEX "Invoice_paymentStatus_idx" ON "Invoice"("paymentStatus");

-- CreateIndex
CREATE INDEX "BillingLine_invoiceId_idx" ON "BillingLine"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffMember_employeeId_key" ON "StaffMember"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffMember_email_key" ON "StaffMember"("email");

-- CreateIndex
CREATE INDEX "StaffMember_department_idx" ON "StaffMember"("department");

-- CreateIndex
CREATE INDEX "Payslip_period_idx" ON "Payslip"("period");

-- CreateIndex
CREATE UNIQUE INDEX "Payslip_staffId_period_key" ON "Payslip"("staffId", "period");

-- CreateIndex
CREATE INDEX "AppointmentRequest_status_createdAt_idx" ON "AppointmentRequest"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "Allergy" ADD CONSTRAINT "Allergy_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vital" ADD CONSTRAINT "Vital_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionItem" ADD CONSTRAINT "PrescriptionItem_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionItem" ADD CONSTRAINT "PrescriptionItem_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingLine" ADD CONSTRAINT "BillingLine_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingLine" ADD CONSTRAINT "BillingLine_linkedPrescriptionId_fkey" FOREIGN KEY ("linkedPrescriptionId") REFERENCES "Prescription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payslip" ADD CONSTRAINT "Payslip_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "StaffMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
