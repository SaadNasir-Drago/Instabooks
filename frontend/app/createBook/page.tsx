"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export default function AddBook() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [bookData, setBookData] = useState({
    book_id: "",
    title: "",
    rating: 0,
    pages: 0,
    publishDate: "",
    numRatings: 0,
    coverImg: "",
    price: 0,
    author: "",
    description: "",
    publisher: "",
    user_id: "" // This should be set to the current user's ID in a real application
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/createBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Book added successfully",
        });
        router.push('/'); // Redirect to books list page
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add book');
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add book. Please try again.",
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="book_id">Book ID</Label>
              <Input
                id="book_id"
                name="book_id"
                type="text"
                value={bookData.book_id}
                onChange={handleChange}
                required
              />
            </div>
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
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={bookData.rating}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="pages">Pages</Label>
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
              <Label htmlFor="numRatings">Number of Ratings</Label>
              <Input
                id="numRatings"
                name="numRatings"
                type="number"
                min="0"
                value={bookData.numRatings}
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
          <div className="grid grid-cols-2 gap-4">
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
          </div>
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
          onClick={() => router.push('/')}
        >
          Back to Homepage
        </Button>
      </div>
    </div>
  );
}