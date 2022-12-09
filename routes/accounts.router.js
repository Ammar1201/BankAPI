import { Router } from "express";
import { getUserAccounts, addAccount, depositToAccount, updateCredit, withdrawFromAccount } from "../controllers/accounts.controller.js";

export const accountsRouter = Router({ mergeParams: true });

accountsRouter.get('', getUserAccounts);

accountsRouter.post('/new-account', addAccount);

accountsRouter.put('/deposit', depositToAccount);
accountsRouter.put('/updateCredit', updateCredit);
accountsRouter.put('/withdraw', withdrawFromAccount);