import React, { useContext, useEffect } from 'react'
import { Card, CardContent, CardFooter } from '../ui/card';
import Link from 'next/link';
import { bookContext, selectedBookContext } from '@/context/bookContext';

function BookList() {
  
  const { books, setBooks } = useContext(bookContext);
  
  // useEffect(() => {
  //   fetch("http://localhost:4000/")
  //     .then((response) => response.json())
  //     .then((data) => setBooks(data));
  // }, [books]);

  const { selectedBook, setSelectedBook } = useContext(selectedBookContext);
  
  const handleBookClick = (book: any) => {
    setSelectedBook(book);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <Card
          key={book.book_id}
          className="shadow-md"
          onClick={() => {
            handleBookClick(book);
          }}
        >
          <Link href="#" prefetch={false}>
            <img
              src={book.coverImg}
              // alt={book.title}
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
          <CardFooter></CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default BookList