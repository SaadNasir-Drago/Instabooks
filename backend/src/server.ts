import express from 'express';
const cookieParser = require('cookie-parser');
import cors from 'cors';
import bookRoutes from './routes/bookRoutes';
import authRoutes from './routes/authRoute'
import userRoutes from './routes/userRoute'
import { corsOptions } from './middlewares/cors';
import bodyParser from 'body-parser'
import elasticClient from './config/elasticSearch';

//configure the server
const server = express();
const port = 4000;

server.use(cookieParser()) //middleware for parsing cookies
server.use(cors(corsOptions)); //cors middleware
server.use(bodyParser.json()) //middleware for parsing JSON
server.use(bodyParser.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data
server.use('/uploads', express.static('src/uploads')); //Middleware to serve static files

// Test Elasticsearch connection
// elasticClient.ping()
//   .then(() => console.log('Connected to Elasticsearch'))
//   .catch(error => console.error('Elasticsearch connection error:', error));

//configure the routes
server.use(authRoutes, bookRoutes, userRoutes);

//start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});