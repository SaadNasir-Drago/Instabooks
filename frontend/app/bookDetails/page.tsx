"use client";

import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookContext, SelectedBookContext } from "@/context/bookContext";
import Navigation from "@/components/book/navigation";
import {
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  Book,
  Calendar,
  User,
  Building,
} from "lucide-react";
import Image from "next/image";

export default function BookDetails() {
  const { selectedBook, setSelectedBook } = useContext(SelectedBookContext);
  const { setBooks } = useContext(BookContext);

  const handleLike = async (book_id: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not logged in");
      return;
    }
    try {
      const response = await fetch(`http://localhost:4000/books/likeDislike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: "",
          book_id: book_id,
          liked: true,
        }),
      });

      const result = await response.json();

      // console.log(typeof result.books);

      if (response.status === 400) {
        console.log(result.message); // Show error if the user already liked the book
        return;
      }
      console.log(result, response);
      if (response.status === 201) {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.book_id === book_id
              ? {
                  ...book,
                  likes:
                    book.likes !== undefined && book.likes !== null
                      ? book.likes + 1
                      : 1,
                }
              : book
          )
        );
      } else {
        console.error("Error liking the book");
      }
    } catch (error) {
      console.error("Error in handleLike:", error);
    }
  };

  const handleDislike = async (book_id: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not logged in");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/books/likeDislike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: "",
          book_id: book_id,
          liked: false, // This indicates a dislike
        }),
      });

      const result = await response.json();

      if (response.status === 400) {
        console.log(result.message); // Show error if the user already disliked the book
        return;
      }

      if (response.status === 201) {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.book_id === book_id
              ? {
                  ...book,
                  dislikes:
                    book.dislikes !== undefined && book.dislikes !== null
                      ? book.dislikes + 1
                      : 1,
                }
              : book
          )
        );
      } else {
        console.error("Error disliking the book");
      }
    } catch (error) {
      console.error("Error in handleDislike:", error);
    }
  };

  const handleBackToHome = () => {
    setSelectedBook(null);
  };

  if (!selectedBook) {
    return <div>No book selected</div>;
  }

  return (
    <div className="container mx-auto px-8 py-7">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gray-200">
                <Image
                  src={selectedBook.cover_img}
                  alt={selectedBook.title}
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <h1 className="text-3xl font-bold mb-2">
                  {selectedBook.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <User className="mr-2 h-4 w-4" />
                  <span>{selectedBook.author}</span>
                </div>
                <p className="text-gray-700 mb-6">{selectedBook.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Publisher: {selectedBook.publisher}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Published: {selectedBook.publish_date}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Book className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-sm">Pages: {selectedBook.pages}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLike(selectedBook.book_id)}
                    className="flex items-center"
                  >
                    <ThumbsUp className="mr-2 h-4 w-4 text-green-500" />
                    <span>{selectedBook.likes}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDislike(selectedBook.book_id)}
                    className="flex items-center"
                  >
                    <ThumbsDown className="mr-2 h-4 w-4 text-red-500" />
                    <span>{selectedBook.dislikes}</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
