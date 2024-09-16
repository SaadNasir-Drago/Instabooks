//create a separate folder for types if in surpasses more than 5 entries
export type Book = {
  book_id: number;
  title: string;
  author: string;
  description: string;
  rating: string;
  pages: number;
  publishDate: Date;
  numRatings: number;
  coverImg: string;
  publisher: string;
  price: number;
  created_at: Date;
  user_id: number; // Foreign key to the User who created the book
};

type Genre = {
  genre_id: number;
  genre_name: string;
};

type GenreBook = {
  id: number;
  genre_id: number;
  book_id: number;
};

type Like = {
  like_id: number;
  liked: boolean;
  user_id: number; // Foreign key to User
  book_id: number; // Foreign key to Book
};

export type User = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
};

