import { loadAccountsFromDB, saveAccountsToDB, attachNewAccountToUser } from "../services/accounts.service.js";

//? /users/:userID/accounts → GET → all user accounts. - done.
//! /users/:userID/accounts/deposit → PUT → req.body → {accountNumber, amountToDeposit} - done but not fully sure
//! /users/:userID/accounts/withdraw → PUT → req.body → {accountNumber, amountToWithdraw} - done but not fully sure
//! /users/:userID/accounts/updateCredit → PUT → req.body → {accountNumber, newCredit} - done but not fully sure
//* /users/:userID/accounts → PUT → transfer.
//? /users/:userID/accounts/new-account → POST → add new account to user. - done.

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

  const newAccount = attachNewAccountToUser(userID);
  res.status(201).send(newAccount);
};

export const depositToAccount = (req, res) => {
  const info = req.body;
  const { userID } = req.params;
  const accounts = loadAccountsFromDB();
  if (accounts[userID] === undefined) {
    res.status(404).send({ error: 404, message: 'User Not Found!' });
  }

  if (accounts[userID][info.accountNumber] === undefined) {
    res.status(404).send({ error: 404, message: 'Account Not Found!' });
  }

  if (info.amountToDeposit < 0) {
    res.status(404).send({ error: 404, message: 'Cash must be a positive number!' });
  }

  accounts[userID][info.accountNumber].cash += info.amountToDeposit;
  saveAccountsToDB(accounts);
  res.status(201).send(accounts[userID][info.accountNumber]);
};

export const updateCredit = (req, res) => {
  const info = req.body;
  const { userID } = req.params;
  const accounts = loadAccountsFromDB();
  if (accounts[userID] === undefined) {
    res.status(404).send({ error: 404, message: 'User Not Found!' });
  }

  if (accounts[userID][info.accountNumber] === undefined) {
    res.status(404).send({ error: 404, message: 'Account Not Found!' });
  }

  if (info.newCredit < 0) {
    res.status(404).send({ error: 404, message: 'Credit must be a positive number!' });
  }

  accounts[userID][info.accountNumber].credit = info.newCredit;
  saveAccountsToDB(accounts);
  res.status(201).send(accounts[userID][info.accountNumber]);
};

export const withdrawFromAccount = (req, res) => {
  const info = req.body;
  const { userID } = req.params;
  const accounts = loadAccountsFromDB();
  if (accounts[userID] === undefined) {
    res.status(404).send({ error: 404, message: 'User Not Found!' });
  }

  if (accounts[userID][info.accountNumber] === undefined) {
    res.status(404).send({ error: 404, message: 'Account Not Found!' });
  }

  if (info.newCredit < 0) {
    res.status(404).send({ error: 404, message: 'Credit must be a positive number!' });
  }

  const account = accounts[userID][info.accountNumber];
  if (account.cash - info.amountToWithdraw < 0) {
    if (account.cash + account.credit - info.amountToWithdraw < 0) {
      res.status(404).send({ error: 404, message: 'user doesn\'t have enough credit and cash to withdraw' });
      return;
    }

    account.cash -= info.amountToWithdraw;
    account.credit += account.cash;
    account.cash = 0;
  }
  else {
    account.cash -= info.amountToWithdraw;
  }
  saveAccountsToDB(accounts);
  res.status(201).send(accounts[userID][info.accountNumber]);
};