"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Navigation() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [user, setUser] = useState<{ user_id: number } | null>(null);

  // sort books by trending
  // const sortedBooks = useMemo(() => {
  //   if (sortBy === "trending") {
  //     return filteredBooks.sort((a, b) => {
  //       // here like to dislike ratio has been used as an indicator of trend
  //       const aScore = a.likes - a.dislikes;
  //       const bScore = b.likes - b.dislikes;
  //       return bScore - aScore; //the higher the ratio the earlier it appears on the list (descending)
  //     });
  //   } else {
  //     return filteredBooks.sort((a, b) => {
  //       const aDate: any = new Date(a.createdAt);
  //       const bDate: any = new Date(b.createdAt);
  //       return bDate - aDate;
  //     });
  //   }
  // }, [filteredBooks, sortBy]);

  //filter books by a search term
  // const filteredBooks = useMemo(() => {
  //   return books.filter((book) =>
  //     book.title?.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }, [books, searchTerm]);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="flex justify-between flex-wrap items-center mb-6">
      <h1 className="text-4xl font-bold ">Instabooks</h1>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              {sortBy === "trending" ? "Trending" : "Recent"}
              <ChevronDownIcon className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy("trending")}>
              Trending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("recent")}>
              Recent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/createUser">
          <Button variant="default" className="bg-blue-700">
            Register
          </Button>
        </Link>
        <Link href="/createBook">
          <Button variant="default" className="bg-orange-600">
            Add Book
          </Button>
        </Link>
        {user ? (
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Link href="/login">
            <Button variant="default" onClick={handleLogin}>
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function ChevronDownIcon(props: any) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default React.memo(Navigation);
