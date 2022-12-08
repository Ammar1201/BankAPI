import { Router } from "express";
import { addNewUser, getAllUsers, getUser } from "../controllers/users.controller.js";

export const userRouter = Router();

userRouter.post('', addNewUser);

userRouter.get('', getAllUsers);
userRouter.get('/:userID', getUser);