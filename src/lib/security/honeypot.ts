/**
 * Bot honeypot. Add a hidden "website" field to public forms.
 * If filled, reject silently with 200 OK.
 */

export const HONEYPOT_FIELD = "website";

export function isHoneypotFilled(data: Record<string, unknown>): boolean {
  const v = data[HONEYPOT_FIELD];
  return typeof v === "string" && v.trim().length > 0;
}
