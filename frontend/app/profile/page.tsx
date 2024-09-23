// "use client"

// import React, { useState, useEffect } from "react"
// import { Button } from "../../components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
// import { Input } from "../../components/ui/input"
// import { Label } from "../../components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
// import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../components/ui/pagination"
// import Image from "next/image"
// import { useToast } from "../../hooks/use-toast"
// import Navigation from "@/components/book/navigation"

// type Book = {
//   id: string
//   title: string
//   author: string
//   description: string
//   publisher: string
//   cover_image: string
//   liked: boolean
// }

// type User = {
//   id: string
//   name: string
//   email: string
// }

// export default function ProfilePage() {
//   const [user, setUser] = useState<User | null>({ id: '',
//     name: '',
//     email: ''})
//   const [books, setBooks] = useState<Book[]>( [
//     {
//       id: 'book1',
//       title: 'The Great Gatsby',
//       author: 'F. Scott Fitzgerald',
//       description: 'A story of love, loss, and the American Dream set in the Jazz Age.',
//       publisher: 'Scribner',
//       cover_image: 'https://example.com/gatsby.jpg',
//       liked: true
//     },
//     {
//       id: 'book2',
//       title: 'To Kill a Mockingbird',
//       author: 'Harper Lee',
//       description: 'A classic novel about racial injustice and the loss of innocence.',
//       publisher: 'HarperCollins',
//       cover_image: 'https://example.com/mockingbird.jpg',
//       liked: false
//     },
//     {
//       id: 'book3',
//       title: '1984',
//       author: 'George Orwell',
//       description: 'A dystopian novel about a totalitarian society and the dangers of censorship.',
//       publisher: 'Harcourt Brace Jovanovich',
//       cover_image: 'https://example.com/1984.jpg',
//       liked: true
//     },
//     // Add more book data here
//   ])
//   const [currentPage, setCurrentPage] = useState(1)
//   const [booksPerPage] = useState(5)
//   const [displayMode, setDisplayMode] = useState<"all" | "liked">("all")
//   const [isLoading, setIsLoading] = useState(true)
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchUserData()
//     fetchBooks()
//   }, [])

//   const fetchUserData = async () => {
//     try {
//       const response = await fetch('/api/user')
//       if (!response.ok) throw new Error('Failed to fetch user data')
//       const userData = await response.json()
//       setUser(userData)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load user data. Please try again later.",
//         variant: "destructive",
//       })
//     }
//   }

//   const fetchBooks = async () => {
//     setIsLoading(true)
//     try {
//       const response = await fetch('/api/books')
//       if (!response.ok) throw new Error('Failed to fetch books')
//       const booksData = await response.json()
//       setBooks(booksData)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load books. Please try again later.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const indexOfLastBook = currentPage * booksPerPage
//   const indexOfFirstBook = indexOfLastBook - booksPerPage
//   const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook)

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

//   const handleUpdateBook = async (bookId: string) => {
//     // Implement update logic
//     console.log("Update book", bookId)
//     // After updating, refetch the books
//     await fetchBooks()
//   }

//   const handleDeleteBook = async (bookId: string) => {
//     try {
//       const response = await fetch(`/api/books/${bookId}`, { method: 'DELETE' })
//       if (!response.ok) throw new Error('Failed to delete book')
//       setBooks(books.filter(book => book.id !== bookId))
//       toast({
//         title: "Success",
//         description: "Book deleted successfully.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete book. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDisplayModeChange = (mode: "all" | "liked") => {
//     setDisplayMode(mode)
//     setCurrentPage(1)
//     fetchBooks() // Refetch books when changing display mode
//   }

//   if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>
//   if (!user) return <div className="flex justify-center items-center h-screen">User not found</div>

//   return (
//     <div className="container mx-auto p-4">
//       {/* <Navigation></Navigation> */}
//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>User Profile</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid w-full items-center gap-4">
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="name">Name</Label>
//               <Input id="name" value={user.name} readOnly />
//             </div>
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" value={user.email} readOnly />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="mb-4">
//         <Select onValueChange={(value) => handleDisplayModeChange(value as "all" | "liked")}>
//           <SelectTrigger>
//             <SelectValue placeholder="Display mode" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Books</SelectItem>
//             <SelectItem value="liked">Liked Books</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {currentBooks.map(book => (
//         <Card key={book.id} className="mb-4">
//           <CardHeader>
//             <CardTitle>{book.title}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="w-full md:w-1/4">
//                 <Image
//                   src={book.cover_image}
//                   alt={`Cover of ${book.title}`}
//                   width={200}
//                   height={300}
//                   className="object-cover rounded-md"
//                 />
//               </div>
//               <div className="w-full md:w-3/4">
//                 <p className="font-semibold">Author: {book.author}</p>
//                 <p className="font-semibold">Publisher: {book.publisher}</p>
//                 <p className="mt-2">{book.description}</p>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="flex justify-between">
//             <Button onClick={() => handleUpdateBook(book.id)}>Update</Button>
//             <Button variant="destructive" onClick={() => handleDeleteBook(book.id)}>Delete</Button>
//           </CardFooter>
//         </Card>
//       ))}

//       <Pagination>
//         <PaginationContent>
//           <PaginationItem>
//             <PaginationPrevious onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
//           </PaginationItem>
//           {Array.from({ length: Math.ceil(books.length / booksPerPage) }).map((_, index) => (
//             <PaginationItem key={index}>
//               <PaginationLink onClick={() => paginate(index + 1)} isActive={currentPage === index + 1}>
//                 {index + 1}
//               </PaginationLink>
//             </PaginationItem>
//           ))}
//           <PaginationItem>
//             <PaginationNext onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(books.length / booksPerPage)} />
//           </PaginationItem>
//         </PaginationContent>
//       </Pagination>
//       {/* <Button variant="ghost" onClick={handleBackToHome} className="mt-4">
//           Back to Homepage
//         </Button> */}
//     </div>
//   )
// }