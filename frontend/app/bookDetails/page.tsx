"use client";

import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookContext, SelectedBookContext } from "@/context/bookContext";
import Navigation from "@/components/book/navigation";
import {
  ThumbsUp,
  ThumbsDown,
  Book,
  Calendar,
  User,
  Building,
} from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

export default function BookDetails() {
  const placeholder = "https://placehold.jp/150x150.png";

  const { selectedBook, setSelectedBook } = useContext(SelectedBookContext);
  const { setBooks } = useContext(BookContext);
  const [userLikes, setUserLikes] = useState<{
    [key: number]: boolean | null;
  }>();

  
  if (!selectedBook) {
    return <div>No book selected</div>;
  }

  const handleLikeDislike = async (book_id: number, isLike: boolean) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Authentication Required",
        description: `Please log in to ${isLike ? "like" : "dislike"} books.`,
        variant: "destructive",
      });
      return;
    }

    

    try {
      const response = await fetch(`http://localhost:4000/likeDislike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book_id, liked: isLike }),
      });

      const result = await response.json();

      if (response.ok) {
        setSelectedBook((prev: any) => ({
          ...prev,
          likes: isLike ? (prev?.likes || 0) + 1 : prev?.likes,
          dislikes: !isLike ? (prev?.dislikes || 0) + 1 : prev?.dislikes,
        }));

        toast({
          title: result.success ? "Success" : "Info",
          description: result.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || `Error processing your request`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error in handleLikeDislike:`, error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      
    }
  };

  const getImageSrc = (cover_img: string) => {
    if (!cover_img) return placeholder;
    if (cover_img.startsWith("http://") || cover_img.startsWith("https://")) {
      return cover_img;
    }
    return `http://localhost:4000/uploads/${cover_img}`;
  };

  return (
    <div className="container mx-auto px-8 py-7">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gray-200">
                <Image
                  src={getImageSrc(selectedBook.cover_img)}
                  alt={selectedBook.title}
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="md:w-2/3 p-8">
                <h1 className="text-4xl font-bold mb-4">
                  {selectedBook.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-6 text-xl">
                  <User className="mr-3 h-6 w-6" />
                  <span>{selectedBook.author}</span>
                </div>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  {selectedBook.description}
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center">
                    <Building className="mr-3 h-6 w-6 text-gray-500" />
                    <span className="text-base">
                      Publisher: {selectedBook.publisher}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-3 h-6 w-6 text-gray-500" />
                    <span className="text-base">
                      Published: {selectedBook.publish_date}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Book className="mr-3 h-6 w-6 text-gray-500" />
                    <span className="text-base">
                      Pages: {selectedBook.pages}
                    </span>
                  </div>
                </div>
                {/* <div className="flex items-center space-x-6">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleLikeDislike(selectedBook.book_id, true)}
                    className="flex items-center text-lg"
                  >
                    <ThumbsUp className="mr-3 h-6 w-6 text-green-500" />
                    <span>{selectedBook.likes}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleLikeDislike(selectedBook.book_id, false)}
                    className="flex items-center text-lg"
                  >
                    <ThumbsDown className="mr-3 h-6 w-6 text-red-500" />
                    <span>{selectedBook.dislikes}</span>
                  </Button>
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
