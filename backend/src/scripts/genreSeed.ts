import { Genre } from "../types"; // Import the Genre type
import { query } from "../database";

// Function to check if a string contains only ASCII characters
const isAscii = (str: string | null): boolean => {
  if (!str) return true; // Treat null or undefined as valid
  return /^[\x00-\x7F]*$/.test(str);
};

// Function to clean and split genre data
const cleanAndSplitGenreData = (genre: Genre): string[] => {
  if (!isAscii(genre.genre_name) || !genre.genre_name?.length) {
    return [];
  }

  // Split genre_name by '|' and trim whitespace around each genre
  return genre.genre_name.split('|').map(g => g.trim());
};

// Function to insert genre data into PostgreSQL
export const seedGenres = async (genres: Genre[]) => {
  for (const genreData of genres) {
    const genreNames = cleanAndSplitGenreData(genreData); // Split and clean genre names

    for (const genreName of genreNames) {
      try {
        const queryText = `
          INSERT INTO genres (
            genre_name
          ) VALUES (
            $1
          )
          ON CONFLICT (genre_name) DO NOTHING;
        `;

        const values = [
          genreName, // Insert individual genre name
        ];

        await query(queryText, values);
      } catch (error) {
        console.error(`Error inserting genre with name ${genreName}:`, error);
      }
    }
  }
  console.log("Genre data inserted successfully");
};
