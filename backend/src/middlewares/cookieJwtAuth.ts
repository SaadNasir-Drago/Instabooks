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
  
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    // Verify the JWT and attach the decoded user data to the request object
    const decodedToken = jwt.verify(token, process.env.SECRET as string) as jwt.JwtPayload;
    req.user = decodedToken;
    const user = req.body;
    console.log(user.user_id)

    // Assuming `user_id` is part of the decoded token payload
    if (decodedToken && decodedToken.user_id) {
      // Append the `user_id` to `req.body`
      req.body.user_id = decodedToken.user_id;
    }
    
    next();
  } catch (error) {
    // Handle invalid token: clear the token cookie and redirect to the homepage
    res.clearCookie('token');
    return res.status(400).send('Invalid token.');
  }
};
