import React, { useContext } from 'react'
import { Button } from '../ui/button'
import { selectedBookContext } from '@/context/bookContext';

function BookDetails() {

  const { selectedBook, setSelectedBook } = useContext(selectedBookContext);

  const handleBackToHome = () => {
    setSelectedBook(null);
  };

  return (
      <div className="grid grid-cols-1 gap-8">
        <div>
          <img
            src={selectedBook?.coverImg}
            alt=""
            width={600}
            height={400}
            className="w-full h-auto object cover rounded-md"
            style={{ aspectRatio: "600/400", objectFit: "cover" }}
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
              // onClick={() => handleLike(selectedBook.id)}
            >
              {/* <ThumbsUpIcon className="w-5 h-5 text-green-500" /> */}
              <span className="sr-only">Like</span>
            </Button>
            {/* <div className="text-gray-500">{selectedBook.likes}</div> */}
            <Button
              variant="ghost"
              size="icon"
              // onClick={() => handleDislike(selectedBook.id)}
            >
              {/* <ThumbsDownIcon className="w-5 h-5 text-red-500" /> */}
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

export default BookDetails