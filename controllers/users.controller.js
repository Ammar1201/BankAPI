import { loadUsersFromDB, saveUsersToDB } from "../services/users.service.js";
import { attachNewAccountToUser } from "../services/accounts.service.js";

export const addNewUser = (req, res) => {
  const newUser = req.body;
  const users = loadUsersFromDB();

  if (users[newUser.id] !== undefined) {
    res.status(409).send({ error: 409, message: 'User already exists!' });
  }

  newUser.accounts = [];
  users[newUser.id] = newUser;
  saveUsersToDB(users);
  attachNewAccountToUser(newUser.id);
  const updatedUsers = loadUsersFromDB();
  res.status(201).send(updatedUsers[newUser.id]);
};

export const getAllUsers = (req, res) => {
  const users = loadUsersFromDB();
  res.status(200).send(users);
};

export const getUser = (req, res) => {
  const { userID } = req.params;
  const users = loadUsersFromDB();
  if (users[userID] === undefined) {
    res.status(404).send({ error: 404, message: 'User Not Found!' });
  }

  res.status(200).send(users[userID]);
};