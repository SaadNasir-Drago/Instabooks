import { Request, Response } from "express";
import * as authModel from "../models/authModel";
import bcrypt from 'bcrypt';  // Ensure bcrypt is installed and imported
import jwt from 'jsonwebtoken';
require('dotenv').config();

export const verifyUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userData = await authModel.getUserByEmail(email);

    // Check if the user exists
    if (!userData) {
      return res.status(404).send("User not found");  // Use return to prevent further execution
    }

    // Compare the provided password with the hashed password in the database
    // const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (userData.password !== password) {
      return res.status(403).send("Invalid Login");  // Use return to prevent further execution
    }

    delete userData.password;  // Remove the password from the user data

    // Create a JWT token
    const token = jwt.sign(userData, process.env.SECRET as string, { expiresIn: "1h" });

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,  // 1 hour
    });

    // Set response headers and send the response
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ message: 'Login successful', token, userData });  // Always return after sending a response

  } catch (error) {
    console.error('Error in verifyUser:', error);
    return res.status(500).send('Internal server error');  // Ensure only one response is sent in case of error
  }
};
