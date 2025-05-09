import fs from "fs";
import path from "path";

import prompt from "../lib/prompt.js";

/**
 * Delete empty folders in a directory
 * 
 * @param {string} dirPath - The path to the directory where empty folders will be deleted
 * 
 * @returns {void} - No return value
 */
export default async function deleteEmptyFolders(dirPath: string): Promise<void> {
  let elements: string[] = [];
  try {
    elements = await fs.promises.readdir(dirPath);
  } catch (err: unknown) {
    prompt.error(String(err));
    return;
  }

  for (const element of elements) {
    const elementPath: string = path.join(dirPath, element);

    let fileStats: fs.Stats;
    try {
      fileStats = await fs.promises.stat(elementPath);
    } catch (err: unknown) {
      prompt.error(String(err));
      return;
    }

    if (fileStats.isDirectory()) {
      await deleteEmptyFolders(elementPath);
    }
  }

  // Check again if the directory is empty
  try {
    const remaining: string[] = await fs.promises.readdir(dirPath);
    if (remaining.length === 0) {
      await fs.promises.rmdir(dirPath);
    }
  } catch (err: unknown) {
    prompt.error(String(err));
  }
}