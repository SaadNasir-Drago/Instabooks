import { query } from "../database";
import { Book, User } from "../types";


export const createUser = async (user: User): Promise<void> => {
  try {
    

    const result = await query(
      `
      INSERT INTO users (
            first_name, last_name, email, password
          ) VALUES (
            $1, $2, $3, $4
          )
        `,
      [user.first_name, user.last_name, user.email, user.password]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.log("database error", error);
  }
};

// export const updateBook = async (id: number, book: Book): Promise<void> => {
//   await query(
//     'UPDATE books SET title = $1, author = $2, published_date = $3, genre = $4 WHERE id = $5',
//     // [book.title, book.author, book.publishDate, book.genre, id]
//   );
// };

// export const deleteBook = async (id: number): Promise<void> => {
//   await query('DELETE FROM books WHERE id = $1', [id]);
// };
