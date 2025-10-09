export function isWithinOperationalHours(): boolean {
  // ambil jam & menit sekarang
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // batas operasional (dalam menit dari jam 00:00)
  const totalMinutes = hours * 60 + minutes;
  const open = 8 * 60 + 30; // 08:30
  const close = 15 * 60; // 15:00

  return totalMinutes >= open && totalMinutes <= close;
}
