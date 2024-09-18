"use client"
import { Book } from "../../backend/src/types";
import { useState } from "react";
import Navigation from "@/components/book/navigation";
import BookDetails from "@/components/book/bookDetails";
import BookList from "@/components/book/bookList";
import { bookContext, selectedBookContext } from "@/context/bookContext";

export default function Home() {
  const [books, setBooks] = useState<Book[] | []>([]);

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
