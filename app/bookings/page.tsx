"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/contexts/language-context";
import { getUserBookings } from "@/lib/api";
import type { Booking } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const loadBookings = async () => {
      if (!isAuthenticated || !token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getUserBookings(token);
        setBookings(data);
      } catch (error) {
        toast({
          title: t("error"),
          description: t("bookings_load_error"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [isAuthenticated, token, toast, t]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">{t("login_required")}</h1>
        <p className="mb-8">{t("login_to_view_bookings")}</p>
        <Button asChild>
          <Link href="/auth/login">{t("login")}</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("my_bookings")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("my_bookings")}</h1>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">{t("no_bookings")}</h2>
          <p className="mb-6">{t("no_bookings_description")}</p>
          <Button asChild>
            <Link href="/">{t("browse_events")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("my_bookings")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden">
            <div className="relative h-[200px]">
              <Image
                src={
                  booking.event.imageUrl ||
                  "/placeholder.svg?height=200&width=400"
                }
                alt={booking.event.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">
                {booking.event.name}
              </h2>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(booking.event.date).toLocaleDateString()}</span>
                <MapPin className="h-4 w-4 ml-3 mr-1" />
                <span>{booking.event.venue}</span>
              </div>
              <p className="text-sm line-clamp-2">
                {booking.event.description}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/events/${booking.event._id}`}>
                  {t("view_details")}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
