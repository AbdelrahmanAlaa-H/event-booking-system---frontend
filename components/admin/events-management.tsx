"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/contexts/language-context";
import {
  fetchEvents,
  fetchCategories,
  fetchTags,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/api";
import type { Event, Category, Tag } from "@/types";

export function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    venue: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    tags: [] as string[],
  });

  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, categoriesData, tagsData] = await Promise.all([
          fetchEvents(),
          fetchCategories(),
          fetchTags(),
        ]);
        setEvents(eventsData);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        toast({
          title: t("error"),
          description: t("data_load_error"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast, t]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      date: "",
      venue: "",
      price: "",
      imageUrl: "",
      categoryId: "",
      tags: [],
    });
    setSelectedEvent(null);
  };

  const handleOpenDialog = (event?: Event) => {
    if (event) {
      // Format date for datetime-local input
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toISOString().slice(0, 16);

      setFormData({
        name: event.name,
        description: event.description,
        date: formattedDate,
        venue: event.venue,
        price: event.price?.toString() || "",
        imageUrl: event.imageUrl || "",
        categoryId:
          (event.categoryId || event.category?._id || event.category) ?? "",
        tags: event.tags?.map((tag: any) => tag._id || tag.id || tag) || [],
      });
      setSelectedEvent(event);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (tagId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      tags: checked
        ? [...prev.tags, tagId]
        : prev.tags.filter((id) => id !== tagId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting event", formData);
    setIsSubmitting(true);

    // Validation
    if (!formData.categoryId) {
      toast({
        title: t("error"),
        description: "Category is required",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    if (!formData.tags.length) {
      toast({
        title: t("error"),
        description: "At least one tag is required",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const eventData = {
        title: formData.name,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        location: formData.venue,
        price: Number.parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        category: formData.categoryId,
        tags: formData.tags.filter(Boolean),
      };

      let updatedEvent;

      if (selectedEvent) {
        updatedEvent = await updateEvent(selectedEvent.id, eventData);
        setEvents(
          events.map((event) =>
            event.id === selectedEvent.id ? updatedEvent : event
          )
        );
        toast({
          title: t("success"),
          description: t("event_updated"),
        });
      } else {
        updatedEvent = await createEvent(eventData);
        setEvents([...events, updatedEvent]);
        toast({
          title: t("success"),
          description: t("event_created"),
        });
      }

      handleCloseDialog();
    } catch (error) {
      toast({
        title: t("error"),
        description: selectedEvent
          ? t("event_update_error")
          : t("event_create_error"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t("confirm_delete_event"))) {
      try {
        await deleteEvent(id);
        setEvents(events.filter((event) => (event._id || event.id) !== id));
        toast({
          title: t("success"),
          description: t("event_deleted"),
        });
      } catch (error) {
        toast({
          title: t("error"),
          description: t("event_delete_error"),
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-0">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("manage_events")}</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          {t("add_event")}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("image")}</TableHead>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("venue")}</TableHead>
                <TableHead>{t("price")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("tags")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {t("no_events_yet")}
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event._id || event.id}>
                    <TableCell>
                      <div className="relative h-10 w-16 overflow-hidden rounded">
                        <Image
                          src={
                            event.imageUrl ||
                            "/placeholder.svg?height=40&width=64"
                          }
                          alt={event.name || "Event image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{event.venue}</TableCell>
                    <TableCell>
                      {typeof event.price === "number"
                        ? `$${event.price.toFixed(2)}`
                        : "-"}
                    </TableCell>
                    <TableCell>{event.category?.name || "-"}</TableCell>
                    <TableCell>
                      {Array.isArray(event.tags) && event.tags.length > 0
                        ? event.tags
                            .filter((tag) => tag && tag.name)
                            .map((tag) => tag.name)
                            .join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(event)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">{t("edit")}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(event._id || event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t("delete")}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="sm:max-w-[600px]"
          aria-describedby="event-dialog-description"
        >
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? t("edit_event") : t("add_event")}
            </DialogTitle>
          </DialogHeader>
          <div id="event-dialog-description" className="sr-only">
            {selectedEvent
              ? t("edit_event_description")
              : t("add_event_description")}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    {t("event_name")}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    {t("date_and_time")}
                  </label>
                  <Input
                    id="date"
                    name="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  {t("description")}
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="venue" className="text-sm font-medium">
                    {t("venue")}
                  </label>
                  <Input
                    id="venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    {t("price")}
                  </label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="categoryId" className="text-sm font-medium">
                    {t("category")}
                  </label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      handleSelectChange("categoryId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select_category")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category._id || category.id}
                          value={category._id || category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="imageUrl" className="text-sm font-medium">
                    {t("image_url")}
                  </label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              {/* Tag selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("tags")}</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <label
                      key={tag._id || tag.id}
                      className="flex items-center gap-1"
                    >
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(tag.id)}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tags: e.target.checked
                              ? [...prev.tags, tag.id]
                              : prev.tags.filter((id) => id !== tag.id),
                          }))
                        }
                      />
                      {tag.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t("saving")
                  : selectedEvent
                  ? t("update")
                  : t("create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
