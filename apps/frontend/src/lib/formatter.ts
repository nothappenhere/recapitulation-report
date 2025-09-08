export function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

function normalizePhoneNumber(input: string): string {
  const cleaned = input.replace(/\D/g, "");

  if (cleaned.startsWith("0")) return "62" + cleaned.slice(1);
  if (cleaned.startsWith("8")) return "62" + cleaned;
  if (cleaned.startsWith("62")) return cleaned;

  return cleaned; // fallback
}


export function formatPhoneNumber(input: string): string {
  const raw = normalizePhoneNumber(input); // ← tambahkan ini

  const prefix = "+62";
  const firstGroup = raw.slice(2, 5); // e.g. 812
  const secondGroup = raw.slice(5, 9); // e.g. 3456
  const thirdGroup = raw.slice(9);     // e.g. 7890

  return `${prefix} ${firstGroup}${secondGroup ? `-${secondGroup}` : ""}${thirdGroup ? `-${thirdGroup}` : ""}`;
}



