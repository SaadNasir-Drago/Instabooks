import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "next/link";
import { bookContext, selectedBookContext } from "@/context/bookContext";
import { Button } from "../ui/button";
import Image from "next/image";
import Cookies from "js-cookie";
import { useSearch } from "@/context/searchContext";
import { useSort } from "@/context/sortContext";
import { useGenre } from "@/context/genreContext";
import { Book, Genre } from "../../../backend/src/types";

function BookList() {
  const placeholder = "https://placehold.jp/150x150.png";

  const { books, setBooks } = useContext(bookContext);
  const { setSelectedBook } = useContext(selectedBookContext);
  const { searchTerm } = useSearch();
  const { sortBy } = useSort();
  const { selectedGenre } = useGenre();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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

      console.log(data);
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


  const handleLike = async (book_id: string) => {
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

  const handleDislike = async (book_id: string) => {
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

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book: any) => (
          <Card
            key={book.book_id}
            className="shadow-md overflow-hidden flex flex-col h-[700px] justify-between"
            onClick={() => handleBookClick(book)}
          >
            <Link href="#" prefetch={false} className="block">
              <div className="relative w-full pt-[140%]">
                <Image
                  src={book.cover_img || placeholder}
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
                <p className="text-gray-600 line-clamp-4">{book.description}</p>
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
                  <ThumbsUpIcon className="w-5 h-5 text-green-500" />
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
                  <ThumbsDownIcon className="w-5 h-5 text-red-500" />
                  <span className="sr-only">Dislike</span>
                </Button>
                <div className="text-gray-500">{book.dislikes}</div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
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

function ThumbsDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

function ThumbsUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

export default BookList;
