"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Menu, User, LogOut, Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "@/contexts/language-context";
import { useMobile } from "@/hooks/use-mobile";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout, isLoading } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const isMobile = useMobile();

  // Wait for component to mount to access theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { label: t("home"), href: "/" },
    { label: t("my_bookings"), href: "/bookings" },
  ];

  if (isAdmin) {
    navItems.push({ label: t("admin"), href: "/admin" });
  }

  const renderNavItems = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            pathname === item.href ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  const renderAuthButtons = () => {
    if (isLoading) return null;

    console.log("Header: isAuthenticated", isAuthenticated, "user", user);

    return (
      <>
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">{t("account")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/bookings" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {t("my_bookings")}
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {t("admin_panel")}
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={logout} className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">{t("login")}</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/register">{t("register")}</Link>
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center font-bold mr-6">
          <Calendar className="h-6 w-6 mr-2" />
          <span>{t("event_booking")}</span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            <nav className="flex items-center gap-6 mr-6">
              {renderNavItems()}
            </nav>
            <div className="flex items-center gap-2 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">{t("language")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage("en")}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("ar")}>
                    العربية
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="focus:outline-none"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                  <span className="sr-only">{t("toggle_theme")}</span>
                </Button>
              )}
              {renderAuthButtons()}
            </div>
          </>
        )}

        {/* Mobile Navigation */}
        {isMobile && (
          <>
            <div className="flex items-center ml-auto">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col gap-4 mt-8">
                    {renderNavItems()}
                    <div className="h-px bg-border my-4" />
                    <div className="flex items-center justify-between">
                      {mounted && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                          }
                        >
                          {theme === "dark" ? (
                            <Sun className="h-5 w-5" />
                          ) : (
                            <Moon className="h-5 w-5" />
                          )}
                          <span className="sr-only">{t("toggle_theme")}</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setLanguage(language === "en" ? "ar" : "en")
                        }
                      >
                        {language === "en" ? "العربية" : "English"}
                      </Button>
                    </div>
                    <div className="h-px bg-border my-4" />
                    {isAuthenticated ? (
                      <>
                        <div className="text-sm font-medium">{user?.name}</div>
                        <Button variant="outline" size="sm" onClick={logout}>
                          {t("logout")}
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href="/auth/login">{t("login")}</Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href="/auth/register">{t("register")}</Link>
                        </Button>
                      </div>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
