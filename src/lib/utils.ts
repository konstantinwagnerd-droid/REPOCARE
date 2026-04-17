import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, fmt = "dd.MM.yyyy") {
  return format(typeof date === "string" ? new Date(date) : date, fmt, { locale: de });
}

export function formatDateTime(date: Date | string) {
  return format(typeof date === "string" ? new Date(date) : date, "dd.MM.yyyy, HH:mm 'Uhr'", { locale: de });
}

export function timeAgo(date: Date | string) {
  return formatDistanceToNow(typeof date === "string" ? new Date(date) : date, { locale: de, addSuffix: true });
}

export function calcAge(birthdate: Date | string) {
  const b = typeof birthdate === "string" ? new Date(birthdate) : birthdate;
  const diff = Date.now() - b.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export function euro(amount: number) {
  return new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR" }).format(amount);
}
