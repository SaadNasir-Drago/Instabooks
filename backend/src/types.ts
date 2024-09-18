//create a separate folder for types if in surpasses more than 5 entries

export type Book = {
  book_id: string;
  title: string | null;
  author: string | null;
  description: string | null;
  rating: number;
  pages: number | null;
  publishDate: Date | null;
  numRatings: number | null;
  coverImg: string;
  publisher: string | null;
  price: number | null;
  created_at?: Date;
  user_id?: number; 
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

