"use client";
import { Book } from "../../backend/src/types";
import { useState } from "react";
import Navigation from "@/components/book/navigation";
import BookDetails from "@/components/book/bookDetails";
import BookList from "@/components/book/bookList";
import { bookContext, selectedBookContext } from "@/context/bookContext";
import GenreList from "@/components/book/genreList";

export default function Home() {
  const [books, setBooks] = useState<Book[] | []>([]);

  const [selectedBook, setSelectedBook] = useState<any | null>(null);

  return (
    <div className="container mx-auto px-8 py-7">
      <Navigation />
      <GenreList />
      <bookContext.Provider value={{ books, setBooks }}>
        <selectedBookContext.Provider value={{ selectedBook, setSelectedBook }}>
          {selectedBook ? <BookDetails /> : <BookList />}
        </selectedBookContext.Provider>
      </bookContext.Provider>
    </div>
  );
}
