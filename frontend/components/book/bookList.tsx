import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "next/link";
import { bookContext, selectedBookContext } from "@/context/bookContext";
import { Button } from "../ui/button";
import Image from "next/image";
function BookList() {

  const placeholder = "https://placehold.jp/150x150.png";

  const { books, setBooks } = useContext(bookContext);
  const { setSelectedBook } = useContext(selectedBookContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  const fetchBooks = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/books?page=${page}&limit=20`
      );
      const data = await response.json();
      console.log(data.books);

      setBooks(data.books);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    setIsLoading(false);
  };

  // const fetchLikes = async () => {
  //   setIsLoading(true)
  //   try {
  //     const response = await fetch(`http://localhost:4000/books?page=${page}&limit=28`)
  //     const data = await response.json()
  //     console.log(data.books);

  //     setBooks(data.books)
  //     setTotalPages(data.totalPages)
  //   } catch (error) {
  //     console.error('Error fetching books:', error)
  //   }
  //   setIsLoading(false)
  // }

  const handleBookClick = (book: any) => {
    setSelectedBook(book);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleLike = (bookId: any) => {
    // setBooks((prevBooks) =>
    //   prevBooks.map((book) =>
    //     book.id === bookId ? { ...book, likes: book.likes + 1 } : book
    //   )
    // );
  };

  const handleDislike = (bookId: any) => {
    // setBooks((prevBooks) =>
    //   prevBooks.map((book) =>
    //     book.id === bookId ? { ...book, dislikes: book.dislikes + 1 } : book
    //   )
    // );
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book: any) => (
          <Card
            key={book.book_id}
            className="shadow-md overflow-hidden"
            onClick={() => handleBookClick(book)}
          >
            <Link href="#" prefetch={false} className="block">
              <div className="aspect-[2/3] relative p-2 bg-gray-100">
                <Image
                  src={book.cover_img || placeholder}
                  // placeholder = 'empty'
                  alt={book.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  unoptimized
                />
              </div>
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-2 line-clamp-2">
                  {book.title}
                </h2>
                <p className="text-gray-500 mb-2">{book.author}</p>
                <p className="text-gray-600 line-clamp-3">{book.description}</p>
              </CardContent>
            </Link>
            <CardFooter className="flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(book.id);
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
                    handleDislike(book.id);
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
    // <div>
    //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    //     {books.map((book: any) => (
    //       <Card
    //         key={book.book_id}
    //         className="shadow-md"
    //         onClick={() => {
    //           handleBookClick(book)
    //         }}
    //       >

    //         <Link href="#" prefetch={false}>
    //           <img
    //             src={book.cover_img}
    //             alt={book.title}

    //             // width={400}
    //             // height={300}
    //             // className="w-full h-30 rounded-t-md"
    //             // style={{ aspectRatio: "68/100", objectFit: "contain" }}
    //           />
    //           <CardContent>
    //             <h2 className="text-xl font-bold mb-2">{book.title}</h2>
    //             <p className="text-gray-500 mb-2">{book.author}</p>
    //             <p className="text-gray-600 line-clamp-3">
    //               {book.description}
    //             </p>
    //           </CardContent>
    //         </Link>
    //         <CardFooter className="flex justify-between items-center p-4">
    //             <div className="flex items-center gap-2">
    //               <Button
    //                 variant="ghost"
    //                 size="icon"
    //                 onClick={(e) => {
    //                   e.stopPropagation();
    //                   handleLike(book.id);
    //                 }}
    //               >
    //                 <ThumbsUpIcon className="w-5 h-5 text-green-500" />
    //                 <span className="sr-only">Like</span>
    //               </Button>
    //               <div className="text-gray-500">{book.likes}</div>
    //               <Button
    //                 variant="ghost"
    //                 size="icon"
    //                 onClick={(e) => {
    //                   e.stopPropagation();
    //                   handleDislike(book.id);
    //                 }}
    //               >
    //                 <ThumbsDownIcon className="w-5 h-5 text-red-500" />
    //                 <span className="sr-only">Dislike</span>
    //               </Button>
    //               <div className="text-gray-500">{book.dislikes}</div>
    //             </div>
    //         </CardFooter>
    //       </Card>
    //     ))}
    //   </div>
    //   <div className="mt-6 flex justify-center items-center">
    //     <Button
    //       onClick={() => handlePageChange(currentPage - 1)}
    //       disabled={currentPage === 1 || isLoading}
    //     >
    //       Previous
    //     </Button>
    //     <span className="mx-4">
    //       Page {currentPage} of {totalPages}
    //     </span>
    //     <Button
    //       onClick={() => handlePageChange(currentPage + 1)}
    //       disabled={currentPage === totalPages || isLoading}
    //     >
    //       Next
    //     </Button>
    //   </div>
    // </div>
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
