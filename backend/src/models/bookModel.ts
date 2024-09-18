import { query } from "../database";
import { Book } from "../types";

//put error handling in all routes
export const getBooks = async (limit: number, offset: number) => {
  const result = await query(
    'SELECT * FROM books LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
}

export const getTotalBooks = async () => {
  const totalBooksResult = await query('SELECT COUNT(*) FROM books');
  return parseInt(totalBooksResult.rows[0].count);
}

//the placeholder $1 prevents sql injection attacks
export const getBookById = async (id: number): Promise<Book[] | null> => {
  const result = await query('SELECT * FROM books WHERE id = $1', [id])
  return result.rows[0] || null
}

export const createBook = async (book: Book): Promise<void> => {
  await query(
    'INSERT INTO books (title, author, published_date, genre) VALUES ($1, $2, $3, $4)',
    // [book.title, book.author, book.publishDate, book.genre]
  );
};

export const updateBook = async (id: number, book: Book): Promise<void> => {
  await query(
    'UPDATE books SET title = $1, author = $2, published_date = $3, genre = $4 WHERE id = $5',
    // [book.title, book.author, book.publishDate, book.genre, id]
  );
};

export const deleteBook = async (id: number): Promise<void> => {
  await query('DELETE FROM books WHERE id = $1', [id]);
};

