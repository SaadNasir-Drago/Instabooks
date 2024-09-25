import elasticClient from '../config/elasticSearch';

const INDEX_NAME = 'books';

export default {
  async createIndex() {
    await elasticClient.indices.create({ index: INDEX_NAME });
  },

  async addBook(book: any) {
    return await elasticClient.index({
      index: INDEX_NAME,
      body: book
    });
  },

  async searchBooks(query: any): Promise<any>{
    return await elasticClient.search({
      index: INDEX_NAME,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['title', 'author', 'description']
          }
        }
      }
    });
  }
};