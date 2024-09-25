"use client";

import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { BookContext, SelectedBookContext } from "@/context/bookContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSearch } from "@/context/searchContext";
import { useSort } from "@/context/sortContext";
import { useGenre } from "@/context/genreContext";
import { Genre } from "../../../backend/src/types";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
// import { BookOpenIcon } from '@heroicons/react/solid';
import { BookOpenIcon } from "@heroicons/react/24/solid";

export default function BookList() {
  const placeholder = "https://placehold.jp/150x150.png";
  const { books, setBooks } = useContext(BookContext);
  const { setSelectedBook } = useContext(SelectedBookContext);
  const { searchTerm } = useSearch();
  const { sortBy } = useSort();
  const { selectedGenre } = useGenre();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userLikes, setUserLikes] = useState<{ [key: number]: boolean | null }>(
    {}
  );

  console.log(searchTerm);

  useEffect(() => {
    fetchBooks(currentPage, searchTerm, sortBy, selectedGenre);
  }, [currentPage, searchTerm, sortBy, selectedGenre]);

  const fetchBooks = async (
    page: number,
    search: string,
    sort: string,
    genre: Genre
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/books?sort=${sort}&search=${search}&genre=${genre.genre_id}&page=${page}&limit=20`
      );
      const data = await response.json();
      // console.log(data);
      setBooks(data.books);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    setIsLoading(false);
  };

  const handleBookClick = (book: any) => {
    setSelectedBook(book);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleLike = async (book_id: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like books.",
        variant: "destructive",
      });
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

      if (response.status === 400) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      if (response.status === 201) {
        setUserLikes((prev) => ({
          ...prev,
          [book_id]: result.success === true ? null : true, // Update UI state
        }));

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
        toast({
          title: "Success",
          description: "Book liked successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Error liking the book",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleLike:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDislike = async (book_id: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to dislike books.",
        variant: "destructive",
      });
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
          liked: false,
        }),
      });

      const result = await response.json();

      if (response.status === 400) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      if (response.status === 201) {
        console.log(result.success);
        setUserLikes((prev) => ({
          ...prev,
          [book_id]: result.success === false ? null : false, // Update UI state
        }));

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
        toast({
          title: "Success",
          description: "Book disliked successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "Error disliking the book",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleDislike:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center h-64 space-y-4">
      <div className="relative">
        {/* <div className="absolute inset-0 rounded-full border-4 border-primary opacity-50 animate-pulse"></div> */}
        <BookOpenIcon
          className="relative text-primary animate-bounce"
          style={{ width: "96px", height: "96px" }}
        />
      </div>
      <div className="text-primary text-lg font-semibold ml-3">
        {" "}
        Loading<span className="animate-dot">.</span>
        <span className="animate-dot">.</span>
        <span className="animate-dot">.</span>
      </div>
    </div>
  );

  const getImageSrc = (cover_img: string) => {
    if (!cover_img) return placeholder;
    if (cover_img.startsWith("http://") || cover_img.startsWith("https://")) {
      return cover_img;
    }
    return `http://localhost:4000/uploads/${cover_img}`;
  };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book: any) => (
            <Card
              key={book.book_id}
              className="shadow-md overflow-hidden flex flex-col h-[700px] justify-between relative group transition-all duration-150 ease-in-out
           rounded-xl hover:shadow-[0_0_20px_10px_rgba(255,107,107,0.5),
                                 0_0_20px_10px_rgba(255,165,0,0.5),
                                 0_0_20px_10px_rgba(255,255,0,0.5)] hover:scale-105"
              onClick={() => handleBookClick(book)}
            >
              <div className="relative z-10 h-full flex flex-col">
                <Link href="/bookDetails" prefetch={false} className="block">
                  <div className="relative w-full pt-[140%]">
                    <Image
                      src={getImageSrc(book.cover_img)}
                      alt={book.title}
                      fill
                      className="rounded-xl object-fill"
                      unoptimized
                    />
                  </div>

                  <CardContent className="p-4 flex-grow h-[140px] overflow-y-auto scrollbar-hide">
                    <h2 className="text-xl font-bold mb-2 line-clamp-2">
                      {book.title}
                    </h2>
                    <p className="text-gray-500 mb-2">{book.author}</p>
                    <p className="text-gray-600 line-clamp-4">
                      {book.description}
                    </p>
                  </CardContent>
                </Link>
                <CardFooter className="flex justify-between items-center p-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(book.book_id);
                      }}
                    >
                      <ThumbsUpIcon className="w-6 h-6 text-green-500" />

                      <span className="sr-only">Like</span>
                    </Button>
                    <div className="text-gray-500">{book.likes}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDislike(book.book_id);
                      }}
                    >
                      <ThumbsDownIcon className="w-6 h-6 text-red-500" />
                      <span className="sr-only">Dislike</span>
                    </Button>
                    <div className="text-gray-500">{book.dislikes}</div>
                  </div>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-6 flex justify-center items-center">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          Previous
        </Button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
