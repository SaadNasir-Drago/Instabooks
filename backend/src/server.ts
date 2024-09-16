//configure the server
import express from 'express';
const server = express();
const port = 4000;

import cors from 'cors';
import { corsOptions } from './middlewares/middleware';

server.use(cors(corsOptions)); //cors middleware
server.use(express.json()) //middleware for parsing JSON

//configure the routes
import bookRoutes from './routes/bookRoutes';
server.use(bookRoutes);

//start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});