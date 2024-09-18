import { Pool } from "pg";
import { seedBooks } from "./scripts/bookSeed";
import { seedUsers } from "./scripts/userSeed";
import { seedGenres } from "./scripts/genreSeed";
import { seedLikes } from "./scripts/likeSeed";

const bookData = require("./data/books.json");
const userData = require("./data/user.json");
const genreData = require("./data/Genre.json");
const likeData = require("./data/Like.json");

const sql = new Pool({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "postgres",
  password: "root",
});

export const query = (text: string, params?: any[]) => sql.query(text, params);

const createTableIfNotExists = async () => {
  const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

  const createBookTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
  book_id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description TEXT,
  rating VARCHAR(10) NOT NULL,
  pages INTEGER NOT NULL,
  publish_date DATE,
  num_ratings INTEGER NOT NULL,
  cover_img TEXT,
  publisher VARCHAR(255),
  price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(user_id)
  ); 
  `;

  const createLikeTableQuery = `
  CREATE TABLE IF NOT EXISTS likes (
  like_id SERIAL PRIMARY KEY,
  liked BOOLEAN NOT NULL,
  user_id INTEGER REFERENCES users(user_id),
  book_id VARCHAR(100) REFERENCES books(book_id),
  UNIQUE(user_id, book_id)
);
`;

  const createGenreTableQuery = `
CREATE TABLE IF NOT EXISTS genres (
  genre_id SERIAL PRIMARY KEY,
  genre_name VARCHAR(50) UNIQUE NOT NULL
);
`;

  const createGenreBookTableQuery = `
CREATE TABLE IF NOT EXISTS genre_books (
  id SERIAL PRIMARY KEY,
  genre_id INTEGER REFERENCES genres(genre_id),
  book_id VARCHAR(100) REFERENCES books(book_id),
  UNIQUE(genre_id, book_id)
);
`;

  try {
    await query(createUserTableQuery);
    await query(createBookTableQuery);
    await query(createGenreTableQuery);
    await query(createLikeTableQuery);
    await query(createGenreBookTableQuery);
    console.log("Tables created successfully or already exists");

    // Seed data after tables are created
    // await seedUsers(userData);
    // // await seedBooks(bookData, userData);
    // await seedLikes(likeData);
    // await seedGenres(genreData);
    // //  await seedGenreBooks(genreBookData);
    console.log("Data inserted successfully");

  } catch (error) {
    console.error("Error creating tables", error);
  }
};

createTableIfNotExists();
