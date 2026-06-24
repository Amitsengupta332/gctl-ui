import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const jobs = [
  {
    inputDir: "public/images/categories",
    backupDir: "public/images/categories-original-backup",
    width: 520,
    height: 460,
    quality: 45,
  },
  {
    inputDir: "public/images/industries",
    backupDir: "public/images/industries-original-backup",
    width: 640,
    height: 450,
    quality: 45,
  },
  {
    inputDir: "public/images/services",
    backupDir: "public/images/services-original-backup",
    width: 640,
    height: 450,
    quality: 45,
  },
];

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

for (const job of jobs) {
  const inputDir = path.resolve(job.inputDir);
  const backupDir = path.resolve(job.backupDir);

  try {
    await fs.access(inputDir);
  } catch {
    console.log(`Folder not found, skipped: ${job.inputDir}`);
    continue;
  }

  try {
    await fs.access(backupDir);
    console.log(`Backup already exists: ${job.backupDir}`);
  } catch {
    await fs.cp(inputDir, backupDir, { recursive: true });
    console.log(`Backup created: ${job.backupDir}`);
  }

  const files = await fs.readdir(inputDir);

  for (const file of files) {
    if (!/\.avif$/i.test(file)) continue;

    const inputPath = path.join(inputDir, file);
    const tempPath = path.join(inputDir, `${path.parse(file).name}.tmp.avif`);

    const oldSize = (await fs.stat(inputPath)).size;

    await sharp(inputPath)
      .resize({
        width: job.width,
        height: job.height,
        fit: "cover",
        position: "center",
        withoutEnlargement: true,
      })
      .avif({
        quality: job.quality,
        effort: 6,
      })
      .toFile(tempPath);

    const newSize = (await fs.stat(tempPath)).size;

    await fs.rename(tempPath, inputPath);

    console.log(`${job.inputDir}/${file}: ${kb(oldSize)} -> ${kb(newSize)}`);
  }
}

console.log("Security images optimized successfully.");