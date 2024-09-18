import { Request, Response } from "express";
import * as authModel from "../models/authModel";
const jwt = require('jsonwebtoken');
require('dotenv').config();

export const verifyUser = async (req: Request, res: Response) => {
  // const { email, password } = req.body;
    //test data
    const email = "saad@gmail.com"
    const password = "12345"
  try {
    const userEmailPass = await authModel.getUserByEmail(email);
   
    
    if (userEmailPass.password !== password) {
      res.status(403).send("Invalid Login");
    }
    // delete userEmailPass.password;

    const token = jwt.sign(userEmailPass, process.env.SECRET, {expiresIn: "1h"})
    res.cookie("token", token, {
      httpOnly:true
    })

    res.status(200).send("Login successful")
   
  } catch (error) {

    res.status(500).send('error');
  }
};
