import express from 'express';
const cookieParser = require('cookie-parser');
import cors from 'cors';
import bookRoutes from './routes/bookRoutes';
import authRoutes from './routes/authRoute'
import userRoutes from './routes/userRoute'
import { corsOptions } from './middlewares/cors';

//configure the server
const server = express();
const port = 4000;

server.use(cookieParser()) //middleware for parsing cookies
server.use(cors(corsOptions)); //cors middleware
server.use(express.json()) //middleware for parsing JSON

//configure the routes
server.use(authRoutes, bookRoutes, userRoutes);

//start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});