import fs from 'fs';
import path from 'path';
import * as url from 'url';

// const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const transfersDBpath = path.join(__dirname, '../db/transfers.json');

//* ---------------------utility functions---------------------
export const loadTransfersFromDB = () => {
  try {
    return JSON.parse(fs.readFileSync(transfersDBpath).toString());
  }
  catch (err) {
    return {};
  }
};

export const saveTransfersToDB = (transfers) => {
  fs.writeFileSync(transfersDBpath, JSON.stringify(transfers));
};