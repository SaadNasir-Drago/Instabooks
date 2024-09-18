import React, { useContext } from 'react'
import { Button } from '../ui/button'
import { selectedBookContext } from '@/context/bookContext';

function BookDetails() {

  const { selectedBook, setSelectedBook } = useContext(selectedBookContext);
  
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

  const handleBackToHome = () => {
    setSelectedBook(null);
  };

  return (
      <div className="grid grid-cols-1 gap-8">
        <div>
          <img
            src={selectedBook?.cover_img}
            alt=""
            width={200}
            height={100}
            className="w h-auto rounded-md"
            // style={{ aspectRatio: "400/200", objectFit: "cover" }}
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">{selectedBook?.title}</h2>
          <h3 className="text-gray-600 mb-2 text-lg">
            {selectedBook?.author}
          </h3>
          <p className="text-gray-800 mb-6">{selectedBook?.description}</p>
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleLike(selectedBook.id)}
            >
              <ThumbsUpIcon className="w-5 h-5 text-green-500" />
              <span className="sr-only">Like</span>
            </Button>
            {/* <div className="text-gray-500">{selectedBook.likes}</div> */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDislike(selectedBook.id)}
            >
              <ThumbsDownIcon className="w-5 h-5 text-red-500" />
              <span className="sr-only">Dislike</span>
            </Button>
            {/* <div className="text-gray-500">{selectedBook.dislikes}</div> */}
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
    )
  
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

export default BookDetails