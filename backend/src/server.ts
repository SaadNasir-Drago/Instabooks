import express from 'express';
const cookieParser = require('cookie-parser');
import cors from 'cors';
import bookRoutes from './routes/bookRoutes';
import authRoutes from './routes/authRoute';
import userRoutes from './routes/userRoute';
import { corsOptions } from './middlewares/cors';
import bodyParser from 'body-parser';
const { Client } = require('@elastic/elasticsearch');
import { query as pgQuery } from './database'; // Adjust the import path as necessary

// Configure the server
const server = express();
const port = 4000;

server.use(cookieParser()); // Middleware for parsing cookies
server.use(cors(corsOptions)); // CORS middleware
server.use(bodyParser.json()); // Middleware for parsing JSON
server.use(bodyParser.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data
server.use('/uploads', express.static('src/uploads')); // Middleware to serve static files

// Create Elasticsearch client
export const esClient = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic', // Replace with your username
    password: 'qEc-GaadE7RX+qNlhfQ2'  // Replace with your password
  },
  tls: {
    rejectUnauthorized: false // This will disable certificate validation
  },
  ssl: {
    rejectUnauthorized: false // This will disable certificate validation
  }
});

// Function to test Elasticsearch connection
const testElasticSearchConnection = async () => {
  try {
    const health = await esClient.cluster.health();
    console.log('Elasticsearch is up and running');
    console.log('Full Health Response:', health);
    // console.log('Elasticsearch is up and running:', health.body); // Ensure you're accessing the body
    // console.log('Cluster Health Status:', health.body.status); // Log the specific status
  } catch (error) {
    console.error('Elasticsearch connection failed:', error);
  }
};

// Configure the routes
server.use(authRoutes, bookRoutes, userRoutes);

// Start the server
server.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  await testElasticSearchConnection(); // Test the Elasticsearch connectionkend

  // await transferData(); // Transfer data from PostgreSQL to Elasticsearch
});
