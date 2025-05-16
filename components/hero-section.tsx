"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/language-context";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-16 lg:py-20 text-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              {t("hero_title")}
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              {t("hero_description")}
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <Button asChild size="lg" className="mt-4">
              <Link href="/allEvents" className="flex items-center">
                {t("browse_events")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
