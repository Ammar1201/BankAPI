import { loadAccountsFromDB, saveAccountsToDB, attachNewAccountToUser } from "../services/accounts.service.js";
import { checkSenderUserAccountBalance, checkReqBody } from "../utils.js";

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
  const reqBody = checkReqBody(req.body);
  if (reqBody.status === 'bad request') {
    console.log('bad request');
    res.status(400).send(reqBody.error);
    return;
  }

  const { accountNumber, amountToDeposit } = req.body;

  if (accountNumber === undefined) {
    res.status(404).send({ error: 404, message: 'You must provide the account number' });
  }

  if (amountToDeposit === undefined) {
    res.status(404).send({ error: 404, message: 'You must provide the amount to deposit' });
  }

  const { userID } = req.params;
  const accounts = loadAccountsFromDB();
  if (accounts[userID] === undefined) {
    res.status(404).send({ error: 404, message: 'User Not Found!' });
  }

  if (accounts[userID][accountNumber] === undefined) {
    res.status(404).send({ error: 404, message: 'Account Not Found!' });
  }

  if (amountToDeposit < 0) {
    res.status(404).send({ error: 404, message: 'Cash must be a positive number!' });
  }

  accounts[userID][accountNumber].cash += amountToDeposit;
  saveAccountsToDB(accounts);
  res.status(201).send(accounts[userID][accountNumber]);
};

export const updateCredit = (req, res) => {
  const reqBody = checkReqBody(req.body);
  if (reqBody.status === 'bad request') {
    console.log('bad request');
    res.status(400).send(reqBody.error);
    return;
  }

  const { accountNumber, newCredit } = req.body;

  if (accountNumber === undefined) {
    res.status(404).send({ error: 404, message: 'You must provide the account number' });
  }

  if (newCredit === undefined) {
    res.status(404).send({ error: 404, message: 'You must provide the new credit amount' });
  }


  const { userID } = req.params;
  const accounts = loadAccountsFromDB();
  if (accounts[userID] === undefined) {
    res.status(404).send({ error: 404, message: 'User Not Found!' });
  }

  if (accounts[userID][accountNumber] === undefined) {
    res.status(404).send({ error: 404, message: 'Account Not Found!' });
  }

  if (newCredit < 0) {
    res.status(404).send({ error: 404, message: 'Credit must be a positive number!' });
  }

  accounts[userID][accountNumber].credit = newCredit;
  saveAccountsToDB(accounts);
  res.status(201).send(accounts[userID][accountNumber]);
};

export const withdrawFromAccount = (req, res) => {
  const reqBody = checkReqBody(req.body);
  if (reqBody.status === 'bad request') {
    console.log('bad request');
    res.status(400).send(reqBody.error);
    return;
  }

  const { accountNumber, amountToWithdraw } = req.body;

  if (accountNumber === undefined) {
    res.status(404).send({ error: 404, message: 'You must provide the account number' });
  }

  if (amountToWithdraw === undefined) {
    res.status(404).send({ error: 404, message: 'You must provide the amount to withdraw' });
  }

  const { userID } = req.params;
  const accounts = loadAccountsFromDB();
  if (accounts[userID] === undefined) {
    res.status(404).send({ error: 404, message: 'User Not Found!' });
  }

  if (accounts[userID][accountNumber] === undefined) {
    res.status(404).send({ error: 404, message: 'Account Not Found!' });
  }

  if (amountToWithdraw < 0) {
    res.status(404).send({ error: 404, message: 'Credit must be a positive number!' });
  }

  const account = accounts[userID][accountNumber];
  if (!checkSenderUserAccountBalance(account, amountToWithdraw)) {
    res.status(404).send({ error: 404, message: 'user doesn\'t have enough credit and cash to withdraw' });
  }
  saveAccountsToDB(accounts);
  res.status(201).send(accounts[userID][accountNumber]);
};