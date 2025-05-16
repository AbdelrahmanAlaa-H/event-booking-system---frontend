"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "@/contexts/language-context";
import { EventsManagement } from "@/components/admin/events-management";
import { CategoriesManagement } from "@/components/admin/categories-management";
import { TagsManagement } from "@/components/admin/tags-management";
import { getApiUrl, apiRequest } from "@/lib/api";

export default function AdminPage() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      router.push("/");
    } else if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("admin_panel")}</h1>

      <Tabs defaultValue="events">
        <TabsList className="mb-8">
          <TabsTrigger value="events">{t("events")}</TabsTrigger>
          <TabsTrigger value="categories">{t("categories")}</TabsTrigger>
          <TabsTrigger value="tags">{t("tags")}</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <EventsManagement />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesManagement />
        </TabsContent>

        <TabsContent value="tags">
          <TagsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const createEvent = (eventData: Partial<Event>): Promise<Event> => {
  return apiRequest(getApiUrl("/api/events"), "POST", eventData);
};
