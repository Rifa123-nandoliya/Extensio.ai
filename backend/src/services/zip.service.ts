import archiver from "archiver";

import fs from "fs";

import path from "path";

export async function
createZip(

  sourceFolder: string,

  zipName: string

) {

  const zipPath =
    path.join(
      process.cwd(),
      "temp",
      `${zipName}.zip`
    );

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