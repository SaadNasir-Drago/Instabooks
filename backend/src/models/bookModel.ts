import { query } from "../database";
import { Book, Genre, Like } from "../types";

//put error handling in all routes


export const getBooks = async (
  limit: number,
  offset: number,
  search: string,
  sort: string,
  genre: number | null // Make genre optional or null to handle cases when no genre is provided
) => {
  // Determine the order clause based on sort value
  let orderByClause;
  if (sort === 'trending') {
    orderByClause = 'ORDER BY COALESCE(l.likes_count, 0) DESC';
  } else if (sort === 'recent') {
    orderByClause = 'ORDER BY b.created_at DESC, COALESCE(l.likes_count, 0) DESC'; // Adjust field name as necessary
  } else {
    orderByClause = 'ORDER BY b'; // Default order
  }

  const genreFilter = genre ? 'AND gb.genre_id = $4' : ''; // Filter for genre if provided

  const queryParams = [limit, offset, `%${search}%`];
  if (genre !== null && genre !== 0) {
    queryParams.push(genre);
  }

  const result = await query(`
   SELECT b.*, 
       COALESCE(l.likes_count, 0)::integer AS likes, 
       COALESCE(l.dislikes_count, 0)::integer AS dislikes 
FROM (
    SELECT DISTINCT b.book_id
    FROM books b
    LEFT JOIN genre_books gb ON b.book_id = gb.book_id
    WHERE b.title ILIKE $3 ${genreFilter}
) AS unique_books
JOIN books b ON b.book_id = unique_books.book_id
LEFT JOIN (
    SELECT book_id, 
           SUM(CASE WHEN liked = true THEN 1 ELSE 0 END) AS likes_count, 
           SUM(CASE WHEN liked = false THEN 1 ELSE 0 END) AS dislikes_count 
    FROM likes 
    GROUP BY book_id
) l ON b.book_id = l.book_id
${orderByClause}
LIMIT $1 OFFSET $2
  `, queryParams);

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
      book_id, title, rating, pages, publish_date, num_ratings, cover_img, price, author, description, publisher, user_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
    )
    ON CONFLICT (book_id) DO NOTHING;
  `;

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
      book.user_id
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

export const likeDislikeBook = async (likeDislike: Like): Promise<{ success: boolean; message?: string }> => {
  try {
    // Check if the user has already liked the book
    const existingLike = await query(
      `SELECT * FROM likes WHERE user_id = $1 AND book_id = $2 AND liked = true`,
      [likeDislike.user_id, likeDislike.book_id]
    );

    if (existingLike.rows.length > 0) {
      // If a like exists, return a failure response
      return { success: false, message: "You have already liked this book" };
    }

    const existingDislike = await query(
      `SELECT * FROM likes WHERE user_id = $1 AND book_id = $2 AND liked = false`,
      [likeDislike.user_id, likeDislike.book_id]
    );

    if (existingDislike.rows.length > 0) {
      // If a like exists, return a failure response
      return { success: false, message: "You have already disliked this book" };
    }

    // If no existing like, proceed to insert the new like
    await query(
      `INSERT INTO likes (user_id, book_id, liked) VALUES ($1, $2, $3)`,
      [likeDislike.user_id, likeDislike.book_id, likeDislike.liked]
    );

    return { success: true };  // Success
  } catch (error) {
    console.error("Error in likeDislikeBook:", error);
    throw error;  
  }
};

export const getGenres = async (): Promise<Genre[] | null> => {
  try {
    const result = await query("SELECT * FROM genres ORDER BY genre_id DESC");
    return result.rows || null;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return null; // or throw an error if you prefer
  }
};