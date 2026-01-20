// Utility helpers to map between canonical (English) values and localized (French) values
// Used to keep API payloads consistent while displaying localized labels in the UI

const normalize = (s?: string) => (s || '').toLowerCase().trim();

// --- Project status ---
const projectStatusCanonicalToLocal: Record<string, string> = {
  active: 'actif',
  paused: 'en pause',
  closed: 'clos',
  draft: 'draft',
};
const projectStatusLocalToCanonical: Record<string, string> = Object.fromEntries(
  Object.entries(projectStatusCanonicalToLocal).map(([k, v]) => [v, k])
);
export function toCanonicalProjectStatus(v?: string): string | undefined {
  const key = normalize(v);
  return projectStatusLocalToCanonical[key] || (projectStatusCanonicalToLocal[key] ? key : undefined);
}
export function toLocalizedProjectStatus(v?: string): string | undefined {
  const key = normalize(v);
  return projectStatusCanonicalToLocal[key] || projectStatusLocalToCanonical[key] || undefined;
}

// --- Review status (activities, milestones, reports) ---
const reviewStatusCanonicalToLocal: Record<string, string> = {
  draft: 'brouillon',
  submitted: 'soumis',
  approved: 'validé',
  rejected: 'rejeté',
};
const reviewStatusLocalToCanonical: Record<string, string> = Object.fromEntries(
  Object.entries(reviewStatusCanonicalToLocal).map(([k, v]) => [v, k])
);
export function toCanonicalReviewStatus(v?: string): string | undefined {
  const key = normalize(v);
  return reviewStatusLocalToCanonical[key] || (reviewStatusCanonicalToLocal[key] ? key : undefined);
}
export function toLocalizedReviewStatus(v?: string): string | undefined {
  const key = normalize(v);
  return reviewStatusCanonicalToLocal[key] || reviewStatusLocalToCanonical[key] || undefined;
}

// --- Expense status ---
export function toCanonicalExpenseStatus(v?: string) {
  return toCanonicalReviewStatus(v);
}
export function toLocalizedExpenseStatus(v?: string) {
  return toLocalizedReviewStatus(v);
}

// --- Expense category ---
const expenseCategoryCanonicalToLocal: Record<string, string> = {
  production: 'production',
  distribution: 'distribution',
  training: 'formation',
  admin: 'admin',
  procurement: 'achat',
  logistics: 'transport', // mock uses "transport" for logistics
};
const expenseCategoryLocalToCanonical: Record<string, string> = Object.fromEntries(
  Object.entries(expenseCategoryCanonicalToLocal).map(([k, v]) => [v, k])
);
export function toCanonicalExpenseCategory(v?: string): string | undefined {
  const key = normalize(v);
  if (key === 'logistique') return 'logistics';
  return expenseCategoryLocalToCanonical[key] || (expenseCategoryCanonicalToLocal[key] ? key : undefined);
}
export function toLocalizedExpenseCategory(v?: string): string | undefined {
  const key = normalize(v);
  return expenseCategoryCanonicalToLocal[key] || expenseCategoryLocalToCanonical[key] || undefined;
}

// --- Payment method ---
const paymentMethodCanonicalToLocal: Record<string, string> = {
  cash: 'Cash',
  bank_transfer: 'Virement',
  mobile_money: 'Mobile',
  card: 'CB',
};
const paymentMethodLocalToCanonical: Record<string, string> = Object.fromEntries(
  Object.entries(paymentMethodCanonicalToLocal).map(([k, v]) => [normalize(v), k])
);
export function toCanonicalPaymentMethod(v?: string): string | undefined {
  const key = normalize(v);
  return paymentMethodLocalToCanonical[key] || (paymentMethodCanonicalToLocal[key] ? key : undefined);
}
export function toLocalizedPaymentMethod(v?: string): string | undefined {
  const key = normalize(v);
  return paymentMethodCanonicalToLocal[key] || paymentMethodLocalToCanonical[key] || undefined;
}

// --- Report type ---
const reportTypeCanonicalToLocal: Record<string, string> = {
  monthly: 'mensuel',
  milestone: 'milestone',
  final: 'final',
};
const reportTypeLocalToCanonical: Record<string, string> = Object.fromEntries(
  Object.entries(reportTypeCanonicalToLocal).map(([k, v]) => [v, k])
);
export function toCanonicalReportType(v?: string): string | undefined {
  const key = normalize(v);
  return reportTypeLocalToCanonical[key] || (reportTypeCanonicalToLocal[key] ? key : undefined);
}
export function toLocalizedReportType(v?: string): string | undefined {
  const key = normalize(v);
  return reportTypeCanonicalToLocal[key] || reportTypeLocalToCanonical[key] || undefined;
}
