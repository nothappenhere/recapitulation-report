import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(str: string): string {
  return str
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
}

function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (index === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
}

export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("id-ID", { month: "2-digit" });
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  // const second = date.getSeconds().toString().padStart(2, "0");

  return `${hour}:${minute}, ${day}/${month}/${year}`;
}

function isISODateString(str: string): boolean {
  // Regex ISO 8601 sederhana
  const isoRegex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/;
  return isoRegex.test(str) && !isNaN(Date.parse(str));
}

export function detectAndFormat(str: string): string {
  if (isISODateString(str)) {
    const date = new Date(str);
    return formatDate(date); // pakai fungsi kamu sendiri
  }
  return str; // string biasa → tampilkan apa adanya
}

export function formatInput(str: string): string {
  // cek apakah string valid ISO date
  const date = new Date(str);
  if (!isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}T/.test(str)) {
    return formatDate(date);
  }

  // kalau bukan date, ubah ke camelCase
  return toCamelCase(str);
}
