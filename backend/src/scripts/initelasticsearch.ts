import Book from '../models/Book';

async function init() {
  try {
    await Book.createIndex();
    console.log('Index created successfully');

    const sampleBooks = [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', description: 'A novel about the American Dream' },
      { title: '1984', author: 'George Orwell', description: 'A dystopian novel about totalitarianism' },
      // Add more sample books...
    ];

    for (const book of sampleBooks) {
      await Book.addBook(book);
    }
    console.log('Sample books added successfully');
  } catch (error) {
    console.error('Error initializing Elasticsearch:', error);
  }
}

init();