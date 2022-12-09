import uniqid from 'uniqid';
import { loadTransfersFromDB, saveTransfersToDB } from "../services/transfers.service.js";
import { loadAccountsFromDB, saveAccountsToDB } from "../services/accounts.service.js";
import { loadUsersFromDB, saveUsersToDB } from "../services/users.service.js";
import { checkSenderUserAccountBalance, checkReqBody } from '../utils.js';

export const transferMoney = (req, res) => {
	const reqBody = checkReqBody(req.body);
	if (reqBody.status === 'bad request') {
		console.log('bad request');
		res.status(400).send(reqBody.error);
		return;
	}

	const { senderUserID, senderUserAccountNumber, receiverUserID, receiverUserAccountNumber, amountToTransfer } = req.body;

	if (amountToTransfer === undefined) {
		res.status(404).send({ error: 404, message: 'you have to provide the amountToTransfer!' });
	}

	if (amountToTransfer <= 0) {
		res.status(404).send({ error: 404, message: 'amountToTransfer must be a positive number! greater than zero' });
		return;
	}

	if (amountToTransfer < 100) {
		res.status(404).send({ error: 404, message: 'minimum amount to transfer should be 100!' });
		return;
	}

	const accounts = loadAccountsFromDB();
	const users = loadUsersFromDB();
	const transfers = loadTransfersFromDB();

	if (users[senderUserID] === undefined) {
		res.status(404).send({ error: 404, message: 'senderUserID not Found!' });
	}

	if (users[receiverUserID] === undefined) {
		res.status(404).send({ error: 404, message: 'receiverUserID not Found!' });
	}

	if (accounts[senderUserID][senderUserAccountNumber] === undefined) {
		res.status(404).send({ error: 404, message: 'senderUserAccountNumber not Found!' });
	}


	if (accounts[receiverUserID][receiverUserAccountNumber] === undefined) {
		res.status(404).send({ error: 404, message: 'receiverUserAccountNumber not Found!' });
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
		saveAccountsToDB(accounts);
		saveUsersToDB(users);
		saveTransfersToDB(transfers);
		res.status(201).send(transfers[transferID]);
	}
	else {
		res.status(404).send({ error: 404, message: `sender user doesn't have enough balance!` })
	}
};