import { createContext, Dispatch, SetStateAction } from 'react';
import { Book } from '../../backend/src/types';

// Define the shape of the context value
interface SelectedBookContextType {
  selectedBook: Book | null;
  setSelectedBook: Dispatch<SetStateAction<Book | null>>;
}

// Create the context with default values
export const selectedBookContext = createContext<SelectedBookContextType>({
  selectedBook: null,
  setSelectedBook: () => {}
});

interface BookContextType {
  books: Book[] | [];
  setBooks: Dispatch<SetStateAction<Book[] | []>>;
}

export const bookContext = createContext<BookContextType>({
  books: [],
  setBooks: () => {}
});