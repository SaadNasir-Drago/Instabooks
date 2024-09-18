import React, { useContext, useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import Link from 'next/link'
import { bookContext, selectedBookContext } from '@/context/bookContext'
import { Button } from '../ui/button'

function BookList() {
  const { books, setBooks } = useContext(bookContext)
  const { setSelectedBook } = useContext(selectedBookContext)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchBooks(currentPage)
  }, [currentPage])

  const fetchBooks = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:4000/books?page=${page}&limit=28`)
      const data = await response.json()
      console.log(data.books);
    
      setBooks(data.books)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching books:', error)
    }
    setIsLoading(false)
  }

  const handleBookClick = (book: any) => {
    
    setSelectedBook(book)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book: any) => (
          <Card
            key={book.book_id}
            className="shadow-md"
            onClick={() => {
              handleBookClick(book)
            }}
          >
           
            <Link href="#" prefetch={false}>
            
              <img
                src={book.cover_img}
                width={300}
                height={200}
                className="w-full h-30 rounded-t-md"
                // style={{ aspectRatio: "300/200", objectFit: "cover" }}
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
  )
}

export default BookList