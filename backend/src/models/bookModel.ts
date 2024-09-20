import { query } from "../database";
import { Book } from "../types";

//put error handling in all routes
export const getBooks = async (limit: number, offset: number) => {
  const result = await query("SELECT * FROM books LIMIT $1 OFFSET $2", [
    limit,
    offset,
  ]);
  return result.rows;
};

export const getTotalBooks = async () => {
  const totalBooksResult = await query("SELECT COUNT(*) FROM books");
  return parseInt(totalBooksResult.rows[0].count);
};

//the placeholder $1 prevents sql injection attacks
export const getBookById = async (id: number): Promise<Book[] | null> => {
  const result = await query("SELECT * FROM books WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const createBook = async (book: Book): Promise<void> => {
  try {
    const queryText = `
    INSERT INTO books (
      book_id, title, rating, pages, publish_date, num_ratings, cover_img, price, author, description, publisher
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
    )
    ON CONFLICT (book_id) DO NOTHING;
  `;

    // Assuming `getRandomUserId` is a function that gets a random user_id from the `users` table
    // const randomUserId = await getRandomUserId(user);

    const values = [
      book.book_id,
      book.title,
      book.rating,
      book.pages,
      book.publishDate,
      book.numRatings,
      book.coverImg,
      book.price,
      book.author,
      book.description,
      book.publisher,
      // randomUserId, // Insert a random user_id as the foreign key
    ];

    await query(queryText, values);
  } catch (error) {

  }
};

export const updateBook = async (id: number, book: Book): Promise<void> => {
  await query(
    "UPDATE books SET title = $1, author = $2, published_date = $3, genre = $4 WHERE id = $5"
    // [book.title, book.author, book.publishDate, book.genre, id]
  );
};

export const deleteBook = async (id: number): Promise<void> => {
  await query("DELETE FROM books WHERE id = $1", [id]);
};
