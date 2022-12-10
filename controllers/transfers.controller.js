import uniqid from 'uniqid';
import { loadTransfersFromDB, saveTransfersToDB } from "../services/transfers.service.js";
import { loadAccountsFromDB, saveAccountsToDB } from "../services/accounts.service.js";
import { loadUsersFromDB, saveUsersToDB } from "../services/users.service.js";
import { checkSenderUserAccountBalance, checkReqBody } from '../utils.js';

//* -------------------------------------------validation functions------------------------------------------------------
const validateAmountToTransfer = (amountToTransfer, res) => {
	if (amountToTransfer === undefined) {
		res.status(404).send({ errorStatus: 404, message: 'you have to provide the amountToTransfer!' });
		return true;
	}

	if (amountToTransfer <= 0) {
		res.status(404).send({ errorStatus: 404, message: 'amountToTransfer must be a positive number! greater than zero' });
		return true;
	}

	if (amountToTransfer < 100) {
		res.status(404).send({ errorStatus: 404, message: 'minimum amount to transfer should be 100!' });
		return true;
	}

	return false;
};

const validateUsers = (users, senderUserID, receiverUserID, res) => {
	if (users[senderUserID] === undefined) {
		res.status(404).send({ errorStatus: 404, message: 'senderUserID not Found!' });
		return true;
	}

	if (users[receiverUserID] === undefined) {
		res.status(404).send({ errorStatus: 404, message: 'receiverUserID not Found!' });
		return true;
	}

	return false;
};

const validateAccounts = (accounts, senderUserID, receiverUserID, senderUserAccountNumber, receiverUserAccountNumber, res) => {
	if (accounts[senderUserID][senderUserAccountNumber] === undefined) {
		res.status(404).send({ errorStatus: 404, message: 'senderUserAccountNumber not Found!' });
		return true;
	}


	if (accounts[receiverUserID][receiverUserAccountNumber] === undefined) {
		res.status(404).send({ errorStatus: 404, message: 'receiverUserAccountNumber not Found!' });
		return true;
	}

	return false;
};

//* -------------------------------------------get functions------------------------------------------------------
export const getSingleTransfer = (req, res) => {
	const { transferID } = req.params;
	const transfers = loadTransfersFromDB();

	if (transfers[transferID] === undefined) {
		res.status(404).send({ errorStatus: 404, message: 'transferID not Found!' });
	}

	res.status(200).send(transfers[transferID]);
};

export const getAllTransfers = (req, res) => {
	const transfers = loadTransfersFromDB();
	res.status(200).send(transfers);
};

//* -------------------------------------------transfer money function------------------------------------------------------
export const transferMoney = (req, res) => {
	const reqBody = checkReqBody(req.body);
	if (reqBody.status === 'bad request') {
		console.log('bad request');
		res.status(400).send(reqBody.error);
		return;
	}

	const { senderUserID, senderUserAccountNumber, receiverUserID, receiverUserAccountNumber, amountToTransfer } = req.body;

	if (validateAmountToTransfer(amountToTransfer, res)) {
		return;
	}

	const accounts = loadAccountsFromDB();
	const users = loadUsersFromDB();
	const transfers = loadTransfersFromDB();

	if (validateUsers(users, senderUserID, receiverUserID, res)) {
		return;
	}

	if (validateAccounts(accounts, senderUserID, receiverUserID, senderUserAccountNumber, receiverUserAccountNumber, res)) {
		return;
	}


	if (checkSenderUserAccountBalance(accounts[senderUserID][senderUserAccountNumber], amountToTransfer)) {
		accounts[receiverUserID][receiverUserAccountNumber].cash += amountToTransfer;

		const transferID = uniqid();
		transfers[transferID] = {
			transferID,
			senderUserID,
			senderUserAccountNumber,
			receiverUserID,
			receiverUserAccountNumber,
			transferredAmount: amountToTransfer,
			transferTime: new Date().toUTCString()
		}

		users[senderUserID].transfersSent.push({
			transferID,
			sentFromAccountNumber: senderUserAccountNumber,
			amountSent: amountToTransfer
		});

		users[receiverUserID].transfersReceived.push({
			transferID,
			receivedToAccountNumber: receiverUserAccountNumber,
			amountReceived: amountToTransfer
		});

		saveAccountsToDB(accounts);
		saveUsersToDB(users);
		saveTransfersToDB(transfers);
		res.status(201).send(transfers[transferID]);
	}
	else {
		res.status(404).send({ errorStatus: 404, message: `sender user doesn't have enough balance!` })
	}
};