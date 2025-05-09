import fs from "fs";
import path from "path";

import prompt from "../lib/prompt.js";

/**
 * Move files from subdirectories to the root directory
 * 
 * @param dirPath - The path to the directory where files will be moved
 * @param currentPath - The current path being processed (default is the same as dirPath)
 * 
 * @returns {void} - No return value
 */
export default async function moveToRoot(
  dirPath: string, 
  currentPath: string = dirPath
): Promise<void> {

  let elements: string[] = [];
  try {
    elements = await fs.promises.readdir(currentPath);
  } catch (err: unknown) {
    prompt.error(String(err));
    return;
  }

  for (const element of elements) {
    const elementPath: string = path.join(currentPath, element);

    let fileStats: fs.Stats;
    try {
      fileStats = await fs.promises.stat(elementPath);
    } catch (err: unknown) {
      prompt.error(String(err));
      return;
    }

    if (fileStats.isDirectory()) {
      await moveToRoot(dirPath, elementPath);
    } else {
      const fileExt: string = path.extname(element);
      const baseName = path.basename(element, fileExt);

      let newFileName: string = `${baseName}${fileExt}`;
      let newFilePath: string = path.join(dirPath, newFileName);
      let counter: number = 1;

      while (fs.existsSync(newFilePath)) {
        newFileName = `${baseName}__${counter}${fileExt}`;
        newFilePath = path.join(dirPath, newFileName);
        counter++;
      }

      try {
        await fs.promises.rename(elementPath, newFilePath);
      } catch (err: unknown) {
        prompt.error(String(err));
      }
    }
  }
}