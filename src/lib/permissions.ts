import type { Role } from "./types";

export type ModuleKey = "dashboard" | "patients" | "pharmacy" | "billing" | "payroll";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  clinical: "Doctor / Nurse",
  pharmacist: "Pharmacist",
};

export const MODULE_ACCESS: Record<Role, ModuleKey[]> = {
  admin: ["dashboard", "patients", "pharmacy", "billing", "payroll"],
  clinical: ["dashboard", "patients", "billing"],
  pharmacist: ["dashboard", "patients", "pharmacy", "billing"],
};

export function canAccess(role: Role, module: ModuleKey) {
  return MODULE_ACCESS[role].includes(module);
}

export function canDispense(role: Role) {
  return role === "admin" || role === "pharmacist";
}

export function canPrescribe(role: Role) {
  return role === "admin" || role === "clinical";
}

export function canEditBilling(role: Role) {
  return role === "admin";
}

export function canManagePayroll(role: Role) {
  return role === "admin";
}
