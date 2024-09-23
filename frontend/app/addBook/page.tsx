"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

export default function AddBook() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [bookData, setBookData] = useState({
    title: "",
    pages: 0,
    publishDate: "",
    coverImg: "",
    price: 0,
    author: "",
    description: "",
    publisher: "",
    user_id: "", // This should be set to the current user's ID in a real application
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Retrieve the token from cookies
    const token = Cookies.get("token");

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/books/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Book added successfully",
        });
        router.push("/"); // Redirect to books list page
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold text-center">Add New Book</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                value={bookData.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                type="text"
                value={bookData.author}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="pages">Number of Pages</Label>
              <Input
                id="pages"
                name="pages"
                type="number"
                min="1"
                value={bookData.pages}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publishDate">Publish Date</Label>
              <Input
                id="publishDate"
                name="publishDate"
                type="date"
                value={bookData.publishDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={bookData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="coverImg">Cover Image URL</Label>
            <Input
              id="coverImg"
              name="coverImg"
              type="url"
              value={bookData.coverImg}
              onChange={handleChange}
              required
            />
          </div>
          {/* <div className="grid grid-cols-2 gap-4"></div> */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={bookData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="publisher">Publisher</Label>
            <Input
              id="publisher"
              name="publisher"
              type="text"
              value={bookData.publisher}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding Book..." : "Add Book"}
          </Button>
        </form>
        <Button
          variant="link"
          className="mt-4 w-full"
          onClick={() => router.push("/")}
        >
          Back to Homepage
        </Button>
      </div>
    </div>
  );
}
