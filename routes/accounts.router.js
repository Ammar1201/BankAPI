import { Router } from "express";
import { getUserAccounts, addAccount } from "../controllers/accounts.controller.js";

export const accountsRouter = Router({ mergeParams: true });

accountsRouter.get('', getUserAccounts);
accountsRouter.post('/new-account', addAccount);