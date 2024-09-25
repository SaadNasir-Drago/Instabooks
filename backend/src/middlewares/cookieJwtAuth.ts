import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
require('dotenv').config();

// Extend the Request interface to include the user
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      user_id: number;
      // Add other properties from the JWT payload if necessary
    };
  }
}

export const cookieJwtAuth = (req: Request, res: Response, next: NextFunction) => {
  // Access the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.SECRET as string) as jwt.JwtPayload;
    console.log(req.body)
    // Attach the user_id to req.body
    if (decodedToken && decodedToken.user_id) {
      req.body.user_id = parseInt(decodedToken.user_id, 10);
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Clear the token and handle the error
    res.clearCookie('token');
    return res.status(403).send('Token expired or invalid.');
  }
};
