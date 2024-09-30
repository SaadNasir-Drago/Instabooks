import { Book } from '../types'; // Assuming you have a Book type defined
import { esClient } from '../server';

export const getBooks = async (
  limit: number,
  offset: number,
  search: string,
  sort: string,
  genreId: number | null
): Promise<{ books: Book[]; totalBooks: number }> => {
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

    // Build the base query
    const mustQuery: any[] = [];

    // Search filter
    if (search) {
      mustQuery.push({
        multi_match: {
          query: search,
          fields: ['title^3', 'author', 'description'], // Boost title search
        },
      });
    }

    // Genre filter
    if (genreId) {
      mustQuery.push({
        term: {
          genre_id: genreId // Assuming genre_id is a field in your Elasticsearch index
        }
      });
    }

    // Execute the search
    const response = await esClient.search({
      index: 'book_index_1', // Replace with your Elasticsearch index name
      from: offset,
      size: limit,
      body: {
        query: {
          bool: {
            must: mustQuery,
          },
        },
        sort: sort === 'trending' ? [{ likes_count: { order: 'desc' } }] : 
              sort === 'recent' ? [{ created_at: { order: 'desc' } }] : 
              [{ book_id: { order: 'asc' } }],
      },
    });
    console.log(response);
    const totalBooks = response.hits.total.value; // Get total count of documents
    const books: Book[] = response.hits.hits.map((hit: any) => ({
      ...hit._source,
      likes: hit._source.likes_count || 0,
      dislikes: hit._source.dislikes_count || 0,
    })); // Adjust based on your field structure

    return { books, totalBooks };
  } catch (error) {
    console.error("Error in getBooks:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};
