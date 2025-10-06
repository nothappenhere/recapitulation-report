import cron from "node-cron";
import fs from "fs-extra";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Cron jalan setiap hari jam 00:00
cron.schedule("0 0 * * *", async () => {
  const files = await fs.readdir(UPLOADS_DIR);
  const now = Date.now();

  for (const file of files) {
    const filePath = path.join(UPLOADS_DIR, file);
    const stats = await fs.stat(filePath);
    const ageInDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);

    if (ageInDays > 3) {
      await fs.remove(filePath);
      console.log(`Deleted old file: ${file}`);
    }
  }
});
