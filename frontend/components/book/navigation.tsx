"use client"
import React, { useState } from 'react'
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';

function Navigation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [user, setUser] = useState<{user_id: number} | null>(null);
  
  //filter books by a search term
  // const filteredBooks = useMemo(() => {
  //   return books.filter((book) =>
  //     book.title?.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }, [books, searchTerm]);

  const handleLogin = () => {
    setUser({user_id: 102});
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="flex justify-between flex-wrap items-center mb-6">
        <h1 className="text-3xl font-bold ">Instabooks</h1>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {sortBy === "trending" ? "Trending" : "Recent"}
                {/* <ChevronDownIcon className="w-4 h-4 ml-2" /> */}
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
          {user ? (
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="outline" onClick={handleLogin}>
              Login
            </Button>
          )}
        </div>
      </div>
  )
}

export default React.memo(Navigation);