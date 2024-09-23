"use client";

import React, { useState, useEffect } from "react";
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
import { useSearch } from "@/context/searchContext";
import { useSort } from "@/context/sortContext";
import { User, ChevronDown } from "lucide-react";
// highlight-next-line
import Image from "next/image";

function Navigation() {
  const router = useRouter();
  const { searchTerm, setSearchTerm } = useSearch();
  const { sortBy, setSortBy } = useSort();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    setIsLoggedIn(false);
  };

  return (
    <div className="flex justify-between flex-wrap items-center mb-6 p-4">
      {/* highlight-start */}
      <Link href="/">
        <Image
          src="/instabooks-high-resolution-logo-transparent.svg"
          alt="Instabooks Logo"
          width={250}
          height={50}
          className="cursor-pointer"
        />
      </Link>
      {/* highlight-end */}
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
              {sortBy
                ? sortBy === "trending"
                  ? "Trending"
                  : "Recent"
                : "Sort By"}
              <ChevronDown className="w-4 h-4 ml-2" />
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

        {isLoggedIn ? (
          <>
            <Link href="/addBook">
              <Button variant="default" className="bg-orange-600">
                Add Book
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="icon" aria-label="Profile">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </>
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

export default Navigation;
