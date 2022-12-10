import { Router } from "express";
import { transferMoney, getAllTransfers, getSingleTransfer } from "../controllers/transfers.controller.js";

export const transfersRouter = Router();

transfersRouter.post('/newTransfer', transferMoney); //* /api/transfers

transfersRouter.get('', getAllTransfers);
transfersRouter.get('/:transferID', getSingleTransfer);