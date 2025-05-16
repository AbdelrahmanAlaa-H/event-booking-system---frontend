"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  price: number;
  // Add other fields if needed
};

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all events
        const eventsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events`
        );
        const eventsData = await eventsRes.json();
        setEvents(
          Array.isArray(eventsData) ? eventsData : eventsData.events || []
        );

        // If logged in, fetch user bookings
        if (isAuthenticated) {
          const token = localStorage.getItem("token");
          const bookingsRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/me`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isAuthenticated]);

  // Get booked event IDs
  const bookedEventIds = new Set(bookings.map((b) => b.event._id));

  const handleBook = async (eventId: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${eventId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      router.push("/congratulations");
    } else {
      const data = await response.json();
      alert(data.message || "Booking failed");
    }
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">All Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.isArray(events) &&
          events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
            >
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-2">{event.description}</p>
              <p className="text-gray-500 mb-1">
                <span className="font-medium">Date:</span>{" "}
                {new Date(event.date).toLocaleString()}
              </p>
              <p className="text-gray-500 mb-1">
                <span className="font-medium">Location:</span> {event.location}
              </p>
              <p className="text-primary font-bold mt-2">${event.price}</p>
              {bookedEventIds.has(event._id) ? (
                <span className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
                  Booked
                </span>
              ) : (
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => handleBook(event._id)}
                >
                  Book Now
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
