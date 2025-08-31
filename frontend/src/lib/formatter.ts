export function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

export function formatPhoneNumber(input: string): string {
  const cleaned = input.replace(/\D/g, "");

  // Remove leading + if exists
  const raw = cleaned.startsWith("62") ? cleaned : `62${cleaned}`;

  if (raw.length < 9) return `+${raw}`; // fallback

  const prefix = "+62 ";
  const firstGroup = raw.slice(2, 5); // ex: 812
  const secondGroup = raw.slice(5, 9); // ex: 3456
  const thirdGroup = raw.slice(9); // ex: 7890

  return `${prefix}${firstGroup}-${secondGroup}${thirdGroup ? `-${thirdGroup}` : ""}`;
}
