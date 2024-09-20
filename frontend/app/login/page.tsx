"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Make a POST request to the backend login endpoint
      const response = await fetch('http://localhost:4000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies with the request
      });

    
      if (!response.ok) {
        throw new Error('Login failed');
      }

      console.log('User authenticated', response)


      // Parse JSON response
      const data = await response.json();
      router.push('/');
      // Check if the response contains a JWT token
      if (data.token) {
        // Save the token in localStorage or cookies
        // localStorage.setItem('token', data.token);
        
        // Redirect to the main page or another authenticated route
       
      } else {
        throw new Error('Token not received');
      }
    } catch (error) {
      console.error('Error during login:', error);
      // setError('Login failed. Please check your credentials and try again.');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="mb-6 text-3xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <Button
          variant="link"
          className="mt-4 w-full"
          onClick={() => router.push('/')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  )
}


