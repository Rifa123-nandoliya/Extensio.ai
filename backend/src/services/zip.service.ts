import archiver from "archiver";
import fs from "fs";
import { getZipPath } from "../utils/paths";

export async function createZip(
  sourceFolder: string,
  zipName: string
) {
  const zipPath = getZipPath(zipName);

  const output =
    fs.createWriteStream(zipPath);

  const archive =
    archiver("zip", {
      zlib: { level: 9 },
    });

  archive.pipe(output);

  archive.directory(
    sourceFolder,
    false
  );

  await archive.finalize();

  return zipPath;

}