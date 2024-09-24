import Navigation from "@/components/book/navigation";
import BookList from "@/components/book/bookList";
import GenreList from "@/components/book/genreList";
export default function Home() {
  return (
    <div className="container mx-auto px-8 py-7">
      <Navigation />
      <GenreList />
      <BookList />
    </div>
  );
}
