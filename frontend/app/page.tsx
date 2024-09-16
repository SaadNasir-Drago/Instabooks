"use client";

import { Book } from "../../backend/src/types";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/")
      .then((response) => response.json())
      .then((data) => setBooks(data));
  }, [books]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [selectedBook, setSelectedBook] = useState();
  const [user, setUser] = useState(null);

  //filter books by a search term
  const filteredBooks = useMemo(() => {
    return books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  // sort books by trending
  const sortedBooks = useMemo(() => {
    if (sortBy === "trending") {
      return filteredBooks.sort((a, b) => {
        // here like to dislike ratio has been used as an indicator of trend
        const aScore = a.likes - a.dislikes;
        const bScore = b.likes - b.dislikes;
        return bScore - aScore; //the higher the ratio the earlier it appears on the list (descending)
      });
    } else {
      return filteredBooks.sort((a, b) => {
        const aDate: any = new Date(a.createdAt);
        const bDate: any = new Date(b.createdAt);
        return bDate - aDate;
      });
    }
  }, [filteredBooks, sortBy]);

  const handleLike = (bookId: any) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, likes: book.likes + 1 } : book
      )
    );
  };

  const handleDislike = (bookId: any) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, dislikes: book.dislikes + 1 } : book
      )
    );
  };

  const handleBookClick = (book: any) => {
    setSelectedBook(book);
  };

  const handleBackToHome = () => {
    setSelectedBook(undefined);
  };

  const handleLogin = () => {
    setUser({user_id: 101});
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between flex-wrap items-center mb-6">
        <h1 className="text-3xl font-bold ">Instabooks</h1>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {sortBy === "trending" ? "Trending" : "Recent"}
                {/* <ChevronDownIcon className="w-4 h-4 ml-2" /> */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("trending")}>
                Trending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("recent")}>
                Recent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {user ? (
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="outline" onClick={handleLogin}>
              Login
            </Button>
          )}
        </div>
      </div>

      {selectedBook ? (
        <div className="grid grid-cols-1 gap-8">
          <div>
            <img
              src=""
              alt=""
              width={600}
              height={400}
              className="w-full h-auto object cover rounded-md"
              style={{ aspectRatio: "600/400", objectFit: "cover" }}
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">{selectedBook.title}</h2>
            <h3 className="text-gray-600 mb-2 text-lg">
              {selectedBook.author}
            </h3>
            <p className="text-gray-800 mb-6">{selectedBook.description}</p>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleLike(selectedBook.id)}
              >
                {/* <ThumbsUpIcon className="w-5 h-5 text-green-500" /> */}
                <span className="sr-only">Like</span>
              </Button>
              <div className="text-gray-500">{selectedBook.likes}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDislike(selectedBook.id)}
              >
                {/* <ThumbsDownIcon className="w-5 h-5 text-red-500" /> */}
                <span className="sr-only">Dislike</span>
              </Button>
              <div className="text-gray-500">{selectedBook.dislikes}</div>
            </div>
            <Button variant="outline" className="mr-4">
              Add to Cart
            </Button>
            <Button variant="outline">Add to Wishlist</Button>
            <Button variant="ghost" onClick={handleBackToHome} className="mt-4">
              Back to Homepage
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <Card
              key={book.id}
              className="shadow-md"
              onClick={() => {
                handleBookClick(book);
              }}
            >
              <Link href="#" prefetch={false}>
                <img
                  src=""
                  alt={book.title}
                  width={300}
                  height={200}
                  className="w-full h-30 object-cover rounded-t-md"
                  style={{ aspectRatio: "300/200", objectFit: "cover" }}
                />
                <CardContent>
                  <h2 className="text-xl font-bold mb-2">{book.title}</h2>
                  <p className="text-gray-500 mb-2">{book.author}</p>
                  <p className="text-gray-600 line-clamp-3">
                    {book.description}
                  </p>
                </CardContent>
              </Link>
              <CardFooter>
                
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
