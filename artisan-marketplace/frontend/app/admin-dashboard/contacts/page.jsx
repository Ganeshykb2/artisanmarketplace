'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'

export default function ContactMessages() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/admin-dashboard/contacts/api', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })

      if (!response.ok) {
        throw new Error('No messages received')
      }

      const result = await response.json()
      console.log('Fetched data:', result) // Log the fetched data to inspect its structure

      if (!Array.isArray(result.data)) {
        throw new Error('Fetched data is not an array')
      }

      setMessages(result.data)
      setIsLoading(false)
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/admin-dashboard/contacts/api?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete message')
      }

      setMessages(messages.filter(msg => msg.id !== id))
      
    } catch (err) {
      console.error('Error deleting message:', err)
    }
  }

  if (isLoading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {messages.map((msg) => (
          <Card key={msg._id} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{msg.name}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleDelete(msg.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete message</span>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{msg.email}</p>
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Sent on: {new Date(msg.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
