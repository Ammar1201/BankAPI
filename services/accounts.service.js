import fs from 'fs';
import path from 'path';
import * as url from 'url';
import { randomAccountNumber } from '../utils.js';
import { attachAccountNumberToUser } from './users.service.js';

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

export const attachNewAccountToUser = (userID) => {
  const accountNumber = randomAccountNumber();
  const accounts = loadAccountsFromDB();
  accounts[userID] = {
    ...accounts[userID],
    [accountNumber]: {
      userID: userID,
      accountNumber: accountNumber,
      cash: 0,
      credit: 0
    }
  };
  attachAccountNumberToUser(userID, accountNumber);
  saveAccountsToDB(accounts);
};