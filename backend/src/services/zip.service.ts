import fs from "fs";
import path from "path";
import archiver from "archiver";

export function zipProject(projectFolder: string, projectId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const zipDir = path.join(process.cwd(), "temp", "zips");
    fs.mkdirSync(zipDir, { recursive: true });

    const zipPath = path.join(zipDir, `${projectId}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      resolve(zipPath);
    });

    output.on("error", (err) => {
      reject(err);
    });

    archive.on("error", (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(projectFolder, false);
    archive.finalize();
  });
}