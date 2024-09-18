import { Like } from "../types"; // Import the Like type
import { query } from "../database";

// Function to validate and clean Like data
const cleanLikeData = (like: Like): Like => {
  return {
    like_id: like.like_id, // Assuming like_id is always present and valid
    liked: typeof like.liked === 'boolean' ? like.liked : false, // Ensure liked is a boolean
    
  };
};

// Function to insert like data into PostgreSQL
export const seedLikes = async (likes: Like[]) => {
  for (const likeData of likes) {
    const cleanedLike = cleanLikeData(likeData);

    try {
      const queryText = `
        INSERT INTO likes (
          like_id, liked
        ) VALUES (
          $1, $2
        )
        ON CONFLICT (like_id) DO NOTHING;
      `;

      const values = [
        cleanedLike.like_id,
        cleanedLike.liked,
        
      ];

      await query(queryText, values);
    } catch (error) {
      console.error(`Error inserting like with ID ${cleanedLike.like_id}:`, error);
    }
  }
  console.log("Like data inserted successfully");
};
