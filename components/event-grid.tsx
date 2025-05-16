"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, MapPin, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useTranslation } from "@/contexts/language-context"
import { fetchEvents, getUserBookings } from "@/lib/api"
import type { Event, Booking } from "@/types"

export function EventGrid() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [bookedEventIds, setBookedEventIds] = useState<string[]>([])
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await fetchEvents()
        setEvents(eventsData)

        if (isAuthenticated) {
          const bookings = await getUserBookings()
          setBookedEventIds(bookings.map((booking: Booking) => booking.eventId))
        }
      } catch (error) {
        toast({
          title: t("error"),
          description: t("events_load_error"),
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [isAuthenticated, toast, t])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <Skeleton className="h-[200px] w-full rounded-t-lg" />
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">{t("no_events_found")}</h2>
        <p className="mb-6">{t("no_events")}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const isBooked = bookedEventIds.includes(event.id)

        return (
          <Card key={event.id} className="overflow-hidden">
            <div className="relative h-[200px]">
              <Image
                src={event.imageUrl || "/placeholder.svg?height=200&width=400"}
                alt={event.name}
                fill
                className="object-cover"
              />
              {event.category && (
                <Badge className="absolute top-2 right-2 flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {event.category.name}
                </Badge>
              )}
            </div>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
                <MapPin className="h-4 w-4 ml-3 mr-1" />
                <span>{event.venue}</span>
              </div>
              <p className="text-sm line-clamp-2">{event.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="font-medium">${event.price.toFixed(2)}</span>
              {isBooked ? (
                <Badge>{t("booked")}</Badge>
              ) : (
                <Button asChild>
                  <Link href={`/events/${event.id}`}>{t("book_now")}</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
