import { Request, Response } from "express";
import * as userModel from "../models/userModel";


export const createUser = async (req: Request, res: Response) => {
  try {
    await userModel.createUser(req.body)
    res.status(201).send('Registration successful')
  } catch (error) {
    res.status(500).send('Error adding user')
  }
}
