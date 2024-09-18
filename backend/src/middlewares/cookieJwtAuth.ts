import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to add custom properties like cookies and user
declare module 'express-serve-static-core' {
  interface Request {
    user?: string | jwt.JwtPayload; // Adjust based on your JWT payload structure
  }
}

export const cookieJwtAuth = (req: Request, res: Response, next: NextFunction) => {
  // Safely access the token from cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    // Verify the JWT and attach the decoded user data to the request object
    const user = jwt.verify(token, 'hello'); // Ensure process.env.SECRET is defined
    req.user = user; // Now TypeScript will recognize `user` on the Request object
    res.send()
  } catch (error) {
    // Handle invalid token: clear the token cookie and redirect to the homepage
    res.clearCookie('token');
    return res.redirect('/');
  }
};
