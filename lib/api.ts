// API utility functions to interact with the backend

import type { Event, Category, Tag, Booking } from "@/types";

const getApiUrl = (path: string): string => {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

// Helper function to get the auth token
const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Helper function for API requests
async function apiRequest<T>(
  url: string,
  method = "GET",
  data?: any
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}

// LOGIN
export const login = async (email: string, password: string) => {
  const response = await fetch(getApiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
};

// REGISTER
export const register = async (userData: any) => {
  const response = await fetch(getApiUrl("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Registration failed");
  return response.json();
};

// GET EVENTS
export const fetchEvents = async () => {
  const response = await fetch(getApiUrl("/api/events"), {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch events");
  return response.json();
};

// GET EVENT BY ID
export const fetchEventById = async (id: string) => {
  const response = await fetch(getApiUrl(`/api/events/${id}`), {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch event");
  return response.json();
};

// BOOK EVENT
export const bookEvent = async (eventId: string, token: string) => {
  const response = await fetch(getApiUrl(`/api/bookings/${eventId}`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Booking failed");
  return response.json();
};

// GET USER BOOKINGS
export const getUserBookings = async (token: string) => {
  const response = await fetch(getApiUrl("/api/bookings/me"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch bookings");
  return response.json();
};

// Events
export const createEvent = async (formData: FormData) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: any = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  // Do NOT set Content-Type, browser will set it for FormData
  const response = await fetch(getApiUrl("/api/events"), {
    method: "POST",
    headers,
    body: formData,
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to create event");
  return response.json();
};

export const updateEvent = (
  id: string,
  eventData: Partial<Event>
): Promise<Event> => {
  return apiRequest(getApiUrl(`/api/events/${id}`), "PUT", eventData);
};

export const deleteEvent = (id: string): Promise<void> => {
  return apiRequest(getApiUrl(`/api/events/${id}`), "DELETE");
};

// Categories
export const fetchCategories = (): Promise<Category[]> => {
  return apiRequest(getApiUrl("/api/categories"));
};

export const createCategory = (
  categoryData: Partial<Category>
): Promise<Category> => {
  return apiRequest(getApiUrl("/api/categories"), "POST", categoryData);
};

export const deleteCategory = (id: string): Promise<void> => {
  return apiRequest(getApiUrl(`/api/categories/${id}`), "DELETE");
};

// Tags
export const fetchTags = (): Promise<Tag[]> => {
  return apiRequest(getApiUrl("/api/tags"));
};

export const createTag = (tagData: Partial<Tag>): Promise<Tag> => {
  return apiRequest(getApiUrl("/api/tags"), "POST", tagData);
};

export const deleteTag = (id: string): Promise<void> => {
  return apiRequest(getApiUrl(`/api/tags/${id}`), "DELETE");
};

export const getBookingById = (id: string): Promise<Booking> => {
  return apiRequest(getApiUrl(`/bookings/${id}`));
};

export { getApiUrl, apiRequest };
