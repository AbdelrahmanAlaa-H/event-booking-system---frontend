"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Clock, Tag, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "@/contexts/language-context";
import { fetchEventById, bookEvent, getUserBookings } from "@/lib/api";
import type { Event, Booking } from "@/types";
import EventsList from "@/components/EventsList";
import Link from "next/link";
import { EventSquareGrid } from "@/components/event-square-grid";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const { user, isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventData = await fetchEventById(id as string);
        setEvent(eventData);

        if (isAuthenticated && user) {
          const bookings = await getUserBookings();
          setIsBooked(
            bookings.some((booking: Booking) => booking.eventId === id)
          );
        }
      } catch (error) {
        toast({
          title: t("error"),
          description: t("event_load_error"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [id, isAuthenticated, user, toast, t]);

  const handleBookEvent = async () => {
    if (!isAuthenticated) {
      toast({
        title: t("login_required"),
        description: t("login_to_book"),
      });
      router.push("/auth/login");
      return;
    }

    setIsBooking(true);
    try {
      await bookEvent(id as string, token);
      setIsBooked(true);
      setShowCongrats(true);
    } catch (error) {
      toast({
        title: t("booking_failed"),
        description: t("booking_error"),
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (showCongrats) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">{t("congratulations")}</h1>
          <p className="text-xl mb-8">{t("booking_success_message")}</p>
          <Button onClick={() => router.push("/bookings")}>
            {t("view_my_bookings")}
          </Button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">{t("event_not_found")}</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{event.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
            <Image
              src={event.imageUrl || "/placeholder.svg?height=400&width=800"}
              alt={event.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-8">
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(event.date).toLocaleDateString()}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(event.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.venue}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                {event.category?.name || t("uncategorized")}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {typeof event.price === "number"
                  ? event.price.toFixed(2)
                  : "N/A"}
              </Badge>
            </div>
            <div className="mt-6 prose max-w-none">
              <h2 className="text-xl font-semibold mb-2">{t("description")}</h2>
              <p>{event.description}</p>
            </div>
          </div>
        </div>
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("booking_details")}
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("event_date")}
                  </p>
                  <p className="font-medium">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("event_time")}
                  </p>
                  <p className="font-medium">
                    {new Date(event.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("venue")}</p>
                  <p className="font-medium">{event.venue}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("price")}</p>
                  <p className="font-medium">
                    $
                    {typeof event.price === "number"
                      ? event.price.toFixed(2)
                      : "N/A"}
                  </p>
                </div>
                <div className="pt-4">
                  {isBooked ? (
                    <Badge className="w-full py-2 justify-center text-base">
                      {t("booked")}
                    </Badge>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleBookEvent}
                      disabled={isBooking}
                    >
                      {isBooking ? t("booking") : t("book_now")}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
