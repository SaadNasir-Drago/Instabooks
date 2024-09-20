import { Request, Response } from "express";
import * as authModel from "../models/authModel";
const jwt = require('jsonwebtoken');
require('dotenv').config();

export const verifyUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
    
  try {
   const userData =  await authModel.getUserByEmail(email);
    
    if (userData.password !== password) {
      res.status(403).send("Invalid Login");
    }
    delete userData.password;

    const token = jwt.sign(userData, process.env.SECRET, {expiresIn: "1h"})
    res.cookie("token", token, {
      // httpOnly:true,
      maxAge: 60 * 60 * 1000 
    })
    
    res.setHeader('Content-Type', 'application/json');
   // Example of sending a JSON response
   res.status(200).json({ message: 'Login successful', token, userData });

  } catch (error) {

    res.status(500).send('error');
  }
};
