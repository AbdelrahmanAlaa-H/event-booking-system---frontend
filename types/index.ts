// Type definitions for the application

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface Event {
  id: string
  name: string
  description: string
  date: string
  venue: string
  price: number
  imageUrl?: string
  categoryId?: string
  category?: Category
  tags?: Tag[]
}

export interface Category {
  id: string
  name: string
}

export interface Tag {
  id: string
  name: string
}

export interface Booking {
  id: string
  userId: string
  eventId: string
  createdAt: string
  event: Event
}
