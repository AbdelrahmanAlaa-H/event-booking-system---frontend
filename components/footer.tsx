"use client"

import Link from "next/link"
import { Calendar } from "lucide-react"
import { useTranslation } from "@/contexts/language-context"

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {t("event_booking")}. {t("all_rights_reserved")}
          </p>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/" className="text-sm text-muted-foreground hover:underline underline-offset-4">
            {t("home")}
          </Link>
          <Link href="/bookings" className="text-sm text-muted-foreground hover:underline underline-offset-4">
            {t("my_bookings")}
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
            {t("terms")}
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
            {t("privacy")}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
