import { query } from "../database";
import { Book, Genre, Like } from "../types";

export const getBooks = async (
  limit: number,
  offset: number,
  search: string,
  sort: string,
  genreId: number | null
) => {
  try {
  
    if (limit <= 0 || offset < 0) {
      throw new Error("Invalid limit or offset");
    }

    if (typeof search !== "string" || search.length > 255) {
      throw new Error("Invalid search parameter");
    }

    if (!["trending", "recent", ""].includes(sort)) {
      throw new Error("Invalid sort parameter");
    }

   
    let orderByClause;
    if (sort === "trending") {
      orderByClause = "ORDER BY COALESCE(l.likes_count, 0) DESC";
    } else if (sort === "recent") {
      orderByClause =
        "ORDER BY b.created_at DESC, COALESCE(l.likes_count, 0) DESC";
    } else {
      orderByClause = "ORDER BY b.book_id"; 
    }

    const genreFilter = genreId ? "AND gb.genre_id = $4" : "";

    const queryParams = [limit, offset, `%${search}%`];
    if (genreId !== null && genreId !== 0) {
      queryParams.push(genreId);
    }

    const result = await query(
      `
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
    `,
      queryParams
    );

    
    const genreFilter2 = genreId ? "AND gb.genre_id = $2" : "";
    const countResult = await query(
      `
      SELECT COUNT(DISTINCT b.book_id) AS total_books
      FROM books b
      LEFT JOIN genre_books gb ON b.book_id = gb.book_id
      WHERE b.title ILIKE $1 ${genreFilter2}
      `,
      queryParams.slice(2) // Only pass the search and genre parameters
    );

    const totalBooks = countResult.rows[0].total_books;

    return { books: result.rows, totalBooks };
  } catch (error) {
    console.error("Error in getBooks:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

//the placeholder $1 prevents sql injection attacks
export const getBookById = async (id: number): Promise<Book | null> => {
  const result = await query("SELECT * FROM books WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const createBook = async (book: any): Promise<void> => {
  try {
    console.log(book)
    const queryText1 = `
    INSERT INTO books (
      title, pages, publish_date,  cover_img, author, description, publisher, user_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )
    ON CONFLICT (book_id) DO NOTHING;
  `;

    const values1 = [
      book.title,
      book.pages,
      book.publishDate,
      book.cover_img,
      book.author,
      book.description,
      book.publisher,
      book.user_id,
    ];

    await query(queryText1, values1);

    // Parse genres if they are coming in as a JSON string
    let parsedGenres = typeof book.genres === 'string' ? JSON.parse(book.genres) : book.genres;
    
    for (let genre_name of parsedGenres) {

      const book_id_result = await query(
        `SELECT book_id from books ORDER BY book_id DESC LIMIT 1`
      );
      
      const genre_id_result = await query(
        `SELECT genre_id from genres WHERE genre_name = '${genre_name}'`
      );
      
      const queryText2 = `
      INSERT INTO genre_books (
        book_id, genre_id
      ) VALUES (
        $1, $2
      )
    `;
      const values2 = [
        book_id_result.rows[0].book_id,
        genre_id_result.rows[0].genre_id,
      ];
      await query(queryText2, values2);
    }
  } catch (error) {
    console.log("Database error", error);
  }
};

export const updateBook = async (id: number, book: Partial<Book>): Promise<void> => {
  await query(
    "UPDATE books SET title = $1, author = $2, published_date = $3, genre = $4 WHERE id = $5"
    
  );
};

export const deleteBook = async (id: number): Promise<void> => {
  await query("DELETE FROM books WHERE id = $1", [id]);
};

export const likeDislikeBook = async (
  likeDislike: Like
): Promise<{ success: boolean; message?: string }> => {
  try {
    
    const existingLike = await query(
      `SELECT * FROM likes WHERE user_id = $1 AND book_id = $2 AND liked = true`,
      [likeDislike.user_id, likeDislike.book_id]
    );

    if (existingLike.rows.length > 0) {
    
      await query(
        `UPDATE likes SET liked = null WHERE user_id = $1 AND book_id = $2`,
        [likeDislike.user_id, likeDislike.book_id]
      );
      return { success: false, message: "You have already liked this book" };
    }

    const existingDislike = await query(
      `SELECT * FROM likes WHERE user_id = $1 AND book_id = $2 AND liked = false`,
      [likeDislike.user_id, likeDislike.book_id]
    );

    if (existingDislike.rows.length > 0) {
      await query(
        `UPDATE likes SET liked = false WHERE user_id = $1 AND book_id = $2`,
        [likeDislike.user_id, likeDislike.book_id]
      );
      return { success: false, message: "You have already disliked this book" };
    }

    // If no existing like, proceed to insert the new like
    await query(
      `INSERT INTO likes (user_id, book_id, liked) VALUES ($1, $2, $3)`,
      [likeDislike.user_id, likeDislike.book_id, likeDislike.liked]
    );

    return { success: true }; // Success
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
    console.error("Error fetching genres:", error);
    return null; // or throw an error if you prefer
  }
};
