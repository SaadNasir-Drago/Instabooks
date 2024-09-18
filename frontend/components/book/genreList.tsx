import React, { useState } from 'react'
import { Genre } from '../../../backend/src/types';

function GenreList(  ) {
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const genres = [
    { genre_id: 1, genre_name: "Science Fiction" },
    { genre_id: 2, genre_name: "Fantasy" },
    { genre_id: 3, genre_name: "Mystery" },
    { genre_id: 4, genre_name: "Romance" },
    { genre_id: 5, genre_name: "Horror" },
    // Add more genres as needed
  ];
  
  // Optional: Fetch genres if not passed as props
  // useEffect(() => {
  //   async function fetchGenres() {
  //     const response = await fetch('/api/genres');
  //     const data = await response.json();
  //     setGenres(data);
  //   }
  //   fetchGenres();
  // }, []);

  return (
    <div className=" mb-6">
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre.genre_id}
            className={`px-4 py-2 text-sm rounded-full border-gray-300 border transition-colors ${
              selectedGenre?.genre_id === genre.genre_id
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-secondary"
            }`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre.genre_name}
          </button>
        ))}
      </div>
      {/* {selectedGenre && (
        <div className="p-4 border border-border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Selected Genre</h3>
          <p>{selectedGenre.genre_name}</p>
        </div>
      )} */}
    </div>
  )
}

export default GenreList