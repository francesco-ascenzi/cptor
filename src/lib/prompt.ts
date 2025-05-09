import readline from "readline";

/** 
 * Delete the last line in the console
 * 
 * @returns {void}
 */
function deleteLine(): void {
  process.stdout.write("\x1b[2K\r");
}

/** 
 * Display an error message in the console
 * 
 * @param {string} message - The error message to display
 * @returns {void} - No return value
 */
function error(message: string): void {
  process.stdout.write("\n" + `\x1b[31m> Error:\x1b[0m ${message}` + "\n");
}

/** 
 * Get user input from the console
 * 
 * @param {string} question - The question to ask the user
 * @param {number} bytes - The number of bytes to read from the input
 * @returns {string} - The user"s input as a string
 */
function getUserInput(question: string, bytes: number): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((res: (value: string | PromiseLike<string>) => void, rej: (reason?: any) => void) => {
    rl.question(question + "\n> ", (answer: string) => {
      rl.close();
      res(answer.trim().substring(0, bytes));
    });
  });
}

/** 
 * Display an info message to the user
 * 
 * @param {string} message - An info message to display to the user
 * @param {boolean} deleteAtTheEnd - Delete the info message at the end
 * @returns {void} - No return value
 */
function info(message: string, deleteAtTheEnd: boolean = false): void {
  process.stdout.write(message + (deleteAtTheEnd ? "" : "\n"));
}

/** 
 * Introductory animation
 * 
 * @returns {Promise<void>} - A promise that resolves when the animation is complete
 */
async function intro(): Promise<void> {
  info("\x1Bc");
  info("Cptor is a lightweight tool that helps you extract all subfiles from directories within your root path" + "\n\n" +
    "If you liked it, please consider to donating at:"
  );

  for (let i = 0; i < 6; i++) {
    await new Promise(resolve => setTimeout(resolve, 250));
    deleteLine();
    info(i % 2 ?
      "\x1b[4mhttps://www.paypal.com/donate/?hosted_button_id=QL4PRUX9K9Y6A\x1b[0m" :
      "\x1b[30m\x1b[4mhttps://www.paypal.com/donate/?hosted_button_id=QL4PRUX9K9Y6A\x1b[0m"
    , true);
  }

  deleteLine();

  info(`\x1b[4mhttps://www.paypal.com/donate/?hosted_button_id=QL4PRUX9K9Y6A\x1b[0m` + "\n");

  await new Promise(resolve => setTimeout(resolve, 250));

  info("\x1b[30m@author: Francesco 'Frash' Ascenzi " + "| \x1b[4mhttps://www.github.com/francesco-ascenzi\x1b[0m\n");

  await new Promise(resolve => setTimeout(resolve, 250));

  info("---------------------------");
}

// Export the functions
const prompt: {
  deleteLine: () => void;
  error: (message: string) => void;
  getUserInput: (question: string, bytes: number) => Promise<string>;
  info: (message: string, deleteAtTheEnd?: boolean) => void;
  intro: () => Promise<void>
} = {
  deleteLine,
  error,
  getUserInput,
  info,
  intro
};

export default prompt;