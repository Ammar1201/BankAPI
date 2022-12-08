import fs from 'fs';
import path from 'path';
import * as url from 'url';

// const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const usersDBpath = path.join(__dirname, '../db/users.json');

//* ---------------------utility functions---------------------
export const loadUsersFromDB = () => {
  try {
    return JSON.parse(fs.readFileSync(usersDBpath).toString());
  }
  catch (err) {
    return {};
  }
};

export const saveUsersToDB = (users) => {
  fs.writeFileSync(usersDBpath, JSON.stringify(users));
};