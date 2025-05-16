"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "@/contexts/language-context";
import { fetchEvents, getUserBookings } from "@/lib/api";
import type { Event, Booking } from "@/types";

export function EventSquareGrid() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedEventIds, setBookedEventIds] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();
  const token = useAuth().token;
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);

        if (isAuthenticated && token) {
          const bookings = await getUserBookings(token);
          setBookedEventIds(
            bookings.map((booking: Booking) => booking.eventId)
          );
        }
      } catch (error) {
        toast({
          title: t("error"),
          description: t("events_load_error"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [isAuthenticated, token, toast, t]);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">{t("upcoming_events")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-3">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">{t("no_events_found")}</h2>
        <p className="mb-6">{t("no_events")}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t("upcoming_events")}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {events.map((event) => {
          const isBooked = bookedEventIds.includes(event.id);
          const eventDate = new Date(event.date);

          return (
            <Card
              key={event.id}
              className="overflow-hidden group hover:shadow-md transition-shadow"
            >
              <Link href={`/events/${event.id}`} className="block">
                <div className="relative aspect-square">
                  <Image
                    src={
                      event.imageUrl || "/placeholder.svg?height=300&width=300"
                    }
                    alt={event.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isBooked && (
                    <div className="absolute top-2 right-2">
                      <Badge>{t("booked")}</Badge>
                    </div>
                  )}
                  {event.category && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {event.category.name}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {event.name}
                  </h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{eventDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0">
                  <span className="text-sm font-medium">
                    $
                    {typeof event.price === "number"
                      ? event.price.toFixed(2)
                      : "N/A"}
                  </span>
                </CardFooter>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
