"use client"
import { Book } from "../../backend/src/types";
import { useState } from "react";
import Navigation from "@/components/book/navigation";
import BookDetails from "@/components/book/bookDetails";
import BookList from "@/components/book/bookList";
import { bookContext, selectedBookContext } from "@/context/bookContext";

export default function Home() {
  const [books, setBooks] = useState<Book[] | []>([
    {
      book_id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description:
        "A novel set in the 1920s, exploring themes of wealth, love, and the American Dream.",
      rating: 4.5,
      pages: 180,
      publishDate: new Date("1925-04-10"),
      numRatings: 2500,
      coverImg:
        "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1433182986l/25644601._SY475_.jpg",
      publisher: "Scribner",
      price: 10.99,
      created_at: new Date(),
      user_id: 123,
    },
    {
      book_id: "2",
      title: "1984",
      author: "George Orwell",
      description:
        "A dystopian novel depicting a totalitarian society under constant surveillance.",
      rating: 4.8,
      pages: 328,
      publishDate: new Date("1949-06-08"),
      numRatings: 5000,
      coverImg: "https://example.com/1984-cover.jpg",
      publisher: "Secker & Warburg",
      price: 12.49,
      created_at: new Date(),
      user_id: 124,
    },
  ]);

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // sort books by trending
  // const sortedBooks = useMemo(() => {
  //   if (sortBy === "trending") {
  //     return filteredBooks.sort((a, b) => {
  //       // here like to dislike ratio has been used as an indicator of trend
  //       const aScore = a.likes - a.dislikes;
  //       const bScore = b.likes - b.dislikes;
  //       return bScore - aScore; //the higher the ratio the earlier it appears on the list (descending)
  //     });
  //   } else {
  //     return filteredBooks.sort((a, b) => {
  //       const aDate: any = new Date(a.createdAt);
  //       const bDate: any = new Date(b.createdAt);
  //       return bDate - aDate;
  //     });
  //   }
  // }, [filteredBooks, sortBy]);

  // const handleLike = (bookId: any) => {
  //   setBooks((prevBooks) =>
  //     prevBooks.map((book) =>
  //       book.id === bookId ? { ...book, likes: book.likes + 1 } : book
  //     )
  //   );
  // };

  // const handleDislike = (bookId: any) => {
  //   setBooks((prevBooks) =>
  //     prevBooks.map((book) =>
  //       book.id === bookId ? { ...book, dislikes: book.dislikes + 1 } : book
  //     )
  //   );
  // };

  return (
    <div className="container mx-auto px-6 py-6">
      <Navigation />
      <bookContext.Provider value={{books, setBooks}}>
        <selectedBookContext.Provider value={{ selectedBook, setSelectedBook }}>
          {selectedBook ? <BookDetails /> : <BookList />}
        </selectedBookContext.Provider>
      </bookContext.Provider>
    </div>
  );
}
