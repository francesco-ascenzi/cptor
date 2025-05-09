import fs from "fs/promises";
import path from "path";

import prompt from "./lib/prompt.js";
import moveToRoot from "./services/moveToRoot.js";
import deleteEmptyFolders from "./services/deleteEmptyFolders.js";

// Constants and variables
let dirPath: string = "";

(async () => {
  await prompt.intro();
  while (true) {
    let useNewPath: boolean = true;

    if (dirPath.length > 0) {
      const userInput: string = await prompt.getUserInput(`Do you want to use this dir path (${dirPath}) again? (y/n)`, 1);
      if (userInput.toLowerCase() == "y") useNewPath = false;
    }

    if (useNewPath) {
      dirPath = await prompt.getUserInput("\n" + "Paste your dir path between quotation marks (\"):", 8000);
      dirPath = path.join(dirPath.trim().replace(/"+/gm, ""));
    }

    // Check if the directory exists
    try {
      await fs.access(dirPath, fs.constants.R_OK);
    } catch (err: unknown) {
      prompt.error(String(err));
      break;
    }

    // Move files to the root directory
    await moveToRoot(dirPath);

    // Remove preferences
    const deleteChoice: string = await prompt.getUserInput("Do you want to delete empty folders?", 8000);
    if (deleteChoice.trim().toLowerCase() == "y") await deleteEmptyFolders(dirPath);

    const restartChoice: string = await prompt.getUserInput("Do you want to use restart it? (y/n)", 1);
    if (restartChoice.trim().toLowerCase() != "y") break;
  }

  prompt.info("\n" + 
    "If you liked this project, please consider supporting it with a small donation at:" + "\n" + 
    "\x1b[4mhttps://www.paypal.com/donate/?hosted_button_id=QL4PRUX9K9Y6A\x1b[0m" + "\n\n" +
    "Thanks"
  );
})();