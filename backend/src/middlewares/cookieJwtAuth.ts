import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
require('dotenv').config();

// Extend the Request interface to add custom properties like cookies and user
declare module 'express-serve-static-core' {
  interface Request {
    user?: string | jwt.JwtPayload; // Adjust based on your JWT payload structure
  }
}

export const cookieJwtAuth = (req: Request, res: Response, next: NextFunction) => {
  // Access the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  // console.log(token)
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
   
    const decodedToken = jwt.verify(token, process.env.SECRET as string) as jwt.JwtPayload;
    req.user = decodedToken;

    const user = req.body;
    console.log(user.user_id)

    
    if (decodedToken && decodedToken.user_id) {
      req.body.user_id = parseInt(decodedToken.user_id);
    }
    
    next();
  } catch (error) {
    // Handle invalid token: clear the token cookie and redirect to the homepage
    res.clearCookie('token');
    return res.status(403).send('token expired');
  }
};
