import { loadUsersFromDB, saveUsersToDB } from "../services/users.service.js";
import { attachNewAccountToUser } from "../services/accounts.service.js";
import { checkReqBody } from "../utils.js";

//* -------------------------------------------post functions------------------------------------------------------
export const addNewUser = (req, res) => {
  const reqBody = checkReqBody(req.body);
  if (reqBody.status === 'bad request') {
    console.log('bad request');
    res.status(400).send(reqBody.error);
    return;
  }

  const newUser = req.body;

  if (newUser.id === undefined) {
    res.status(404).send({ errorStatus: 404, message: 'You must provide user id number' });
  }

  const users = loadUsersFromDB();

  if (users[newUser.id] !== undefined) {
    res.status(409).send({ errorStatus: 409, message: 'User already exists!' });
  }

  newUser.accounts = [];
  users[newUser.id] = newUser;
  users[newUser.id].transfersSent = [];
  users[newUser.id].transfersReceived = [];
  saveUsersToDB(users);
  const addedUserAccount = attachNewAccountToUser(newUser.id);
  const addedUser = users[newUser.id];
  addedUser.accounts.push(addedUserAccount.accountNumber);
  res.status(201).send(addedUser);
};

//* -------------------------------------------get functions------------------------------------------------------
export const getAllUsers = (req, res) => {
  const users = loadUsersFromDB();
  res.status(200).send(users);
};

export const getUser = (req, res) => {
  const { userID } = req.params;
  const users = loadUsersFromDB();
  if (users[userID] === undefined) {
    res.status(404).send({ errorStatus: 404, message: 'User Not Found!' });
  }

  res.status(200).send(users[userID]);
};