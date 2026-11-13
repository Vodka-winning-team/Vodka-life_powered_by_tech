// Phone numbers in the data are stored as +230XXXXXXX (landline) or +2305XXXXXXX (mobile).
// On screen we show them with spaces so people can read them out; for dialling we keep digits only.

/** "+23052568074" → "+230 5256 8074", "+2302026060" → "+230 202 6060". Short numbers (e.g. "8971") stay as they are. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/[^\d]/g, '');
  if (!phone.trim().startsWith('+230') || !digits.startsWith('230')) return phone;
  const local = digits.slice(3);
  if (local.length === 8) return `+230 ${local.slice(0, 4)} ${local.slice(4)}`;
  if (local.length === 7) return `+230 ${local.slice(0, 3)} ${local.slice(3)}`;
  return phone;
}

/** True when a search looks like a phone number (digits, spaces, +, -, brackets, dots; at least 3 digits), e.g. "5256 8074" or "8971". */
export function isPhoneQuery(query: string): boolean {
  return /^[\d\s+().-]+$/.test(query.trim()) && query.replace(/\D/g, '').length >= 3;
}

/** Number for the dialler: "+" and digits only. */
export function dialNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}
