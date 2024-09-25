import Book from '../models/Book.js';

export default {
  async searchBooks(req: any, res: any) {
    try {
      const { query } = req.query;
      const results = await Book.searchBooks(query);
      res.json(results.body.hits.hits);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
};
