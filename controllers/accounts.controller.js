import { loadAccountsFromDB, saveAccountsToDB, attachNewAccountToUser } from "../services/accounts.service.js";

//* /users/:userID/accounts → GET → all user accounts.
//* /users/:userID/accounts → PUT → req.body → {accountNumber, amountToDeposit}
//* /users/:userID/accounts → PUT → req.body → {accountNumber, newCredit}
//* /users/:userID/accounts → PUT → transfer.
//* /users/:userID/accounts/new-account → POST → add new account to user.

export const getUserAccounts = (req, res) => {
  const { userID } = req.params;
  const accounts = loadAccountsFromDB();
  if (accounts[userID] === undefined) {
    res.status(404).send({ error: 404, message: 'User Not Found!' });
  }
  res.status(200).send(accounts[userID]);
};

export const addAccount = (req, res) => {
  const { userID } = req.params;
  const accounts = loadAccountsFromDB();
  if (accounts[userID] === undefined) {
    res.status(404).send({ error: 404, message: 'User Not Found!' });
  }

  attachNewAccountToUser(userID);
  const updatedAccounts = loadAccountsFromDB();
  res.status(201).send(updatedAccounts[userID]);
};