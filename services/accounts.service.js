import fs from 'fs';
import path from 'path';
import * as url from 'url';

// const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const accountsDBpath = path.join(__dirname, '../db/accounts.json');

//* ---------------------utility functions---------------------
export const loadAccountsFromDB = () => {
  try {
    return JSON.parse(fs.readFileSync(accountsDBpath).toString());
  }
  catch (err) {
    return {};
  }
};

export const saveAccountsToDB = (accounts) => {
  fs.writeFileSync(accountsDBpath, JSON.stringify(accounts));
};