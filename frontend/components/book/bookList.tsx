"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { BookContext, SelectedBookContext } from "@/context/bookContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSearch } from "@/context/searchContext";
import { useSort } from "@/context/sortContext";
import { useGenre } from "@/context/genreContext";
import { Book, Genre } from "../../../backend/src/types";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [userLikes, setUserLikes] = useState<{ [key: number]: boolean | null }>(
    {}
  );
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastBookElementRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
  }, [searchTerm, sortBy, selectedGenre]);

  const loadMoreBooks = useCallback(() => {
    if (!isLoading && hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreBooks();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [loadMoreBooks, hasMore]);

  useEffect(() => {
    const currentObserver = observerRef.current;
    const currentLastElement = lastBookElementRef.current;

    if (currentLastElement && currentObserver) {
      currentObserver.observe(currentLastElement);
    }

    return () => {
      if (currentLastElement && currentObserver) {
        currentObserver.unobserve(currentLastElement);
      }
    };
  }, [books]);

  const fetchBooks = useCallback(
    async (page: number, search: string, sort: string, genre: Genre) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/books?sort=${sort}&search=${search}&genre=${genre.genre_id}&page=${page}&limit=20`
        );
        const data = await response.json();

        setBooks((prevBooks) =>
          page === 1 ? data.books : [...prevBooks, ...data.books]
        );

        setHasMore(data.books.length > 0);
      } catch (error) {
        console.error("Error fetching books:", error);
        toast({
          title: "Error Fetching Books",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, setBooks, toast]
  );

  useEffect(() => {
    fetchBooks(currentPage, searchTerm, sortBy, selectedGenre);
  }, [currentPage, searchTerm, sortBy, selectedGenre]);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleLikeDislike = async (book_id: number, isLike: boolean) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast({
        title: "Authentication Required",
        description: `Please log in to ${isLike ? "like" : "dislike"} books.`,
        variant: "destructive",
      });
      return;
    }

    const currentUserLikeStatus = userLikes[book_id];
    const oppositeAction = isLike ? false : true;

    try {
      if (currentUserLikeStatus === oppositeAction) {
        await fetch(
          `https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/likeDislike`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              book_id: book_id,
              liked: oppositeAction,
            }),
          }
        );

        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.book_id === book_id
              ? {
                  ...book,
                  likes: oppositeAction
                    ? Math.max((book.likes || 0) - 1, 0)
                    : book.likes,
                  dislikes: !oppositeAction
                    ? Math.max((book.dislikes || 0) - 1, 0)
                    : book.dislikes,
                }
              : book
          )
        );
      }

      const response = await fetch(
        `https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/likeDislike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            book_id: book_id,
            liked: isLike,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setUserLikes((prev) => ({
          ...prev,
          [book_id]: result.message.includes("removed") ? null : isLike,
        }));

        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.book_id === book_id
              ? {
                  ...book,
                  likes: isLike
                    ? result.message === "Book liked successfully"
                      ? (book.likes || 0) + 1
                      : result.message === "Like removed"
                      ? Math.max((book.likes || 0) - 1, 0)
                      : book.likes
                    : book.likes,
                  dislikes: !isLike
                    ? result.message === "Book disliked successfully"
                      ? (book.dislikes || 0) + 1
                      : result.message === "Dislike removed"
                      ? Math.max((book.dislikes || 0) - 1, 0)
                      : book.dislikes
                    : book.dislikes,
                }
              : book
          )
        );

        toast({
          title: result.success ? "Success" : "Info",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Error processing your request",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleLikeDislike:", error);
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
        <BookOpenIcon
          className="relative text-primary animate-bounce"
          style={{ width: "96px", height: "96px" }}
        />
      </div>
    </div>
  );

  const getImageSrc = (cover_img: string) => {
    if (!cover_img) return placeholder;
    if (cover_img.startsWith("http://") || cover_img.startsWith("https://")) {
      return cover_img;
    }
    return `https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/uploads/${cover_img}`;
  };

  return (
    <>
      {isLoading && currentPage === 1 ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xxl:grid-cols-6 gap-6">
          {books.map((book: Book, index: number) => (
            <Card
              key={book.book_id}
              className="flex flex-col h-full overflow-hidden shadow-md transition-all duration-120 ease-in-out rounded-xl hover:shadow-[0_0_20px_10px_rgba(0,0,255,0),0_0_20px_10px_rgba(0,0,255,0.1),0_0_20px_10px_rgba(0,0,255,0.1)] hover:scale-105"
              onClick={() => handleBookClick(book)}
              ref={index === books.length - 1 ? lastBookElementRef : null}
            >
              <div className="relative z-10 h-full flex flex-col">
                <Link href="/bookDetails" prefetch={false} className="block">
                  <div className="relative pt-[140%]">
                    <Image
                      src={getImageSrc(book.cover_img)}
                      alt={book.title}
                      fill
                      className="rounded-xl object-fill"
                      unoptimized
                    />
                  </div>

                  <CardContent className="p-3 flex-grow h-[140px] overflow-y-auto scrollbar-hide">
                    <h2 className="text-xl font-bold mb-0 line-clamp-2">
                      {book.title}
                    </h2>
                    <p className="text-gray-500 mb-2">{book.author}</p>
                    <p className="text-gray-600 line-clamp-4">
                      {book.description}
                    </p>
                  </CardContent>
                </Link>
                <CardFooter className="flex p-2">
                  <div className="flex items-center justify-between gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeDislike(book.book_id, true);
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
                        handleLikeDislike(book.book_id, false);
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
      {isLoading && currentPage > 1 && <LoadingSpinner />}
    </>
  );
}
