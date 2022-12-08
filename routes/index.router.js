import { Router } from "express";
import { accountsRouter } from "./accounts.router.js";
import { userRouter } from "./users.router.js";

export const indexRouter = Router();

indexRouter.use('/users', userRouter);
indexRouter.use('/users/:userID/accounts', accountsRouter);