import { Book, jsonBook, Like, User } from "../types"; // Import the Like type
import { query } from "../database";
import { isAscii } from "./bookSeed";

// Function to validate and clean Like data
const cleanLikeData = (like: Like): Like => {
  return {
    like_id: like.like_id, // Assuming like_id is always present and valid
    liked: typeof like.liked === 'boolean' ? like.liked : false, // Ensure liked is a boolean
  };
};

// export const cleanBooksArray = (books: jsonBook[]) => {
//   return books.map((book) => ({
//     book_id: book.bookId,
//     title: isAscii(book.title) && book.title?.length ? book.title?.trim() : null,
//     rating: book.rating ? parseFloat(book.rating) : null,
//     pages: parseInt(book.pages) || 0,
//     publishDate: new Date(book.publishDate) || null,
//     numRatings: parseInt(book.numRatings) || null,
//     coverImg: book.coverImg || null,
//     price: parseFloat(book.price?.trim()) || null, // Remove any extra spaces or line breaks
//     author: isAscii(book.author) && book.author?.length ? book.author?.trim() : null, // Remove any extra spaces or line breaks
//     description: isAscii(book.description) ? book.description?.trim() : null, // Remove any extra spaces or line breaks
//     publisher: isAscii(book.publisher) ? book.publisher?.trim() : null, // Remove any extra spaces or line breaks
//   }));
// };

export const cleanBooksArray = (books: jsonBook[]) => {
  return books
    .filter(book => book.coverImg !== null && book.bookId !== null) // Filter out books with null coverImg or book_id
    .map((book) => ({
      book_id: book.bookId,
      title: isAscii(book.title) && book.title?.length ? book.title?.trim() : null,
      rating: book.rating ? parseFloat(book.rating) : null,
      pages: parseInt(book.pages) || 0,
      publishDate: new Date(book.publishDate) || null,
      numRatings: parseInt(book.numRatings) || null,
      coverImg: book.coverImg || null,
      price: parseFloat(book.price?.trim()) || null, // Remove any extra spaces or line breaks
      author: isAscii(book.author) && book.author?.length ? book.author?.trim() : null, // Remove any extra spaces or line breaks
      description: isAscii(book.description) ? book.description?.trim() : null, // Remove any extra spaces or line breaks
      publisher: isAscii(book.publisher) ? book.publisher?.trim() : null, // Remove any extra spaces or line breaks
    }));
};

const getRandomUserId = (users: User[]): number => {
  const randomIndex = Math.floor(Math.random() * users.length);
  return users[randomIndex].user_id;
};

const getRandomBookId = (books: Book[]): string => {
  const randomIndex = Math.floor(Math.random() * books.length);
  return books[randomIndex].book_id;
};

// Function to insert like data into PostgreSQL
export const seedLikes = async (likes: Like[], users: User[], books: jsonBook[]) => {
  const booksArray = cleanBooksArray(books);

  for (const likeData of likes) {
    const cleanedLike = cleanLikeData(likeData);
    
    try {
      const queryText = `
        INSERT INTO likes (
          like_id, liked, user_id, book_id
        ) VALUES (
          $1, $2, $3, $4
        )
        ON CONFLICT (like_id) DO NOTHING;
      `;

      const values = [
        cleanedLike.like_id,
        cleanedLike.liked,
        getRandomUserId(users), 
        getRandomBookId(booksArray)
      ];
      
      await query(queryText, values);
      // i++;
    } catch (error) {
      console.error(`Error inserting like with ID ${cleanedLike.like_id}:`, error);
    }
  }
  console.log("Like data inserted successfully");
};
