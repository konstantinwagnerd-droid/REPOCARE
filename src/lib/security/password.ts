import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export interface StrengthResult {
  ok: boolean;
  score: 0 | 1 | 2 | 3 | 4;
  issues: string[];
}

const COMMON = new Set([
  "password",
  "passwort",
  "123456",
  "qwerty",
  "admin",
  "letmein",
  "welcome",
  "careai",
  "pflege",
]);

export function checkPasswordStrength(pw: string): StrengthResult {
  const issues: string[] = [];
  if (pw.length < 10) issues.push("Mindestens 10 Zeichen.");
  if (!/[a-z]/.test(pw)) issues.push("Kleinbuchstaben erforderlich.");
  if (!/[A-Z]/.test(pw)) issues.push("Großbuchstaben erforderlich.");
  if (!/[0-9]/.test(pw)) issues.push("Mindestens eine Ziffer erforderlich.");
  if (!/[^a-zA-Z0-9]/.test(pw)) issues.push("Mindestens ein Sonderzeichen erforderlich.");
  if (COMMON.has(pw.toLowerCase())) issues.push("Passwort ist zu geläufig.");
  const score = Math.max(0, 4 - issues.length) as 0 | 1 | 2 | 3 | 4;
  return { ok: issues.length === 0, score, issues };
}
