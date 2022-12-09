import { Router } from "express";
import { transferMoney } from "../controllers/transfers.controller.js";

export const transfersRouter = Router();

transfersRouter.post('', transferMoney); //* /api/transfer