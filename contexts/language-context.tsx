"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translations
const translations = {
  en: {
    // General
    event_booking: "Event Booking",
    all_rights_reserved: "All rights reserved",
    home: "Home",
    events: "Events",
    categories: "Categories",
    tags: "Tags",
    login: "Login",
    register: "Register",
    logout: "Logout",
    account: "Account",
    my_bookings: "My Bookings",
    admin: "Admin",
    admin_panel: "Admin Panel",
    toggle_theme: "Toggle theme",
    language: "Language",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    create: "Create",
    update: "Update",
    delete: "Delete",
    edit: "Edit",
    saving: "Saving...",
    loading: "Loading...",

    // Hero
    hero_title: "Discover Amazing Events",
    hero_description: "Find and book the best events in your area",
    browse_events: "Browse Events",
    upcoming_events: "Upcoming Events",

    // Events
    event_name: "Event Name",
    description: "Description",
    date_and_time: "Date & Time",
    event_date: "Date",
    event_time: "Time",
    venue: "Venue",
    price: "Price",
    category: "Category",
    image: "Image",
    image_url: "Image URL",
    book_now: "Book Now",
    booking: "Booking...",
    booked: "Booked",
    booking_details: "Booking Details",
    view_details: "View Details",
    no_events_found: "No Events Found",
    no_events: "There are no events available at the moment",
    event_not_found: "Event Not Found",
    events_load_error: "Failed to load events",
    event_load_error: "Failed to load event details",

    // Auth
    login_description: "Enter your credentials to access your account",
    register_description: "Create an account to start booking events",
    email: "Email",
    password: "Password",
    name: "Name",
    your_name: "Your name",
    logging_in: "Logging in...",
    registering: "Registering...",
    dont_have_account: "Don't have an account?",
    already_have_account: "Already have an account?",
    login_success: "Login Successful",
    welcome_back: "Welcome back!",
    login_failed: "Login Failed",
    invalid_credentials: "Invalid email or password",
    register_success: "Registration Successful",
    account_created: "Your account has been created",
    register_failed: "Registration Failed",
    registration_error: "There was an error creating your account",
    login_required: "Login Required",
    login_to_book: "Please login to book this event",
    login_to_view_bookings: "Please login to view your bookings",

    // Bookings
    booking_success_message: "You have successfully booked this event!",
    view_my_bookings: "View My Bookings",
    congratulations: "Congratulations!",
    booking_failed: "Booking Failed",
    booking_error: "There was an error booking this event",
    no_bookings: "No Bookings Yet",
    no_bookings_description: "You haven't booked any events yet",
    browse_events: "Browse Events",
    bookings_load_error: "Failed to load bookings",

    // Admin
    manage_events: "Manage Events",
    manage_categories: "Manage Categories",
    manage_tags: "Manage Tags",
    add_event: "Add Event",
    edit_event: "Edit Event",
    add_category: "Add Category",
    add_tag: "Add Tag",
    select_category: "Select category",
    none: "None",
    no_events_yet: "No events added yet",
    no_categories_yet: "No categories added yet",
    no_tags_yet: "No tags added yet",
    actions: "Actions",
    confirm_delete_event: "Are you sure you want to delete this event?",
    confirm_delete_category: "Are you sure you want to delete this category?",
    confirm_delete_tag: "Are you sure you want to delete this tag?",
    event_created: "Event created successfully",
    event_updated: "Event updated successfully",
    event_deleted: "Event deleted successfully",
    category_created: "Category created successfully",
    category_deleted: "Category deleted successfully",
    tag_created: "Tag created successfully",
    tag_deleted: "Tag deleted successfully",
    event_create_error: "Failed to create event",
    event_update_error: "Failed to update event",
    event_delete_error: "Failed to delete event",
    category_create_error: "Failed to create category",
    category_delete_error: "Failed to delete category",
    tag_create_error: "Failed to create tag",
    tag_delete_error: "Failed to delete tag",
    data_load_error: "Failed to load data",
    category_name: "Category Name",
    tag_name: "Tag Name",

    // Footer
    terms: "Terms",
    privacy: "Privacy",
  },
  ar: {
    // General
    event_booking: "حجز الفعاليات",
    all_rights_reserved: "جميع الحقوق محفوظة",
    home: "الرئيسية",
    events: "الفعاليات",
    categories: "الفئات",
    tags: "العلامات",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    account: "الحساب",
    my_bookings: "حجوزاتي",
    admin: "المشرف",
    admin_panel: "لوحة الإدارة",
    toggle_theme: "تبديل السمة",
    language: "اللغة",
    error: "خطأ",
    success: "نجاح",
    cancel: "إلغاء",
    create: "إنشاء",
    update: "تحديث",
    delete: "حذف",
    edit: "تعديل",
    saving: "جاري الحفظ...",
    loading: "جاري التحميل...",

    // Hero
    hero_title: "اكتشف فعاليات مذهلة",
    hero_description: "ابحث واحجز أفضل الفعاليات في منطقتك",
    browse_events: "تصفح الفعاليات",
    upcoming_events: "الفعاليات القادمة",

    // Events
    event_name: "اسم الفعالية",
    description: "الوصف",
    date_and_time: "التاريخ والوقت",
    event_date: "التاريخ",
    event_time: "الوقت",
    venue: "المكان",
    price: "السعر",
    category: "الفئة",
    image: "الصورة",
    image_url: "رابط الصورة",
    book_now: "احجز الآن",
    booking: "جاري الحجز...",
    booked: "تم الحجز",
    booking_details: "تفاصيل الحجز",
    view_details: "عرض التفاصيل",
    no_events_found: "لم يتم العثور على فعاليات",
    no_events: "لا توجد فعاليات متاحة في الوقت الحالي",
    event_not_found: "الفعالية غير موجودة",
    events_load_error: "فشل تحميل الفعاليات",
    event_load_error: "فشل تحميل تفاصيل الفعالية",

    // Auth
    login_description: "أدخل بيانات الاعتماد للوصول إلى حسابك",
    register_description: "أنشئ حسابًا لبدء حجز الفعاليات",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    name: "الاسم",
    your_name: "اسمك",
    logging_in: "جاري تسجيل الدخول...",
    registering: "جاري التسجيل...",
    dont_have_account: "ليس لديك حساب؟",
    already_have_account: "لديك حساب بالفعل؟",
    login_success: "تم تسجيل الدخول بنجاح",
    welcome_back: "مرحبًا بعودتك!",
    login_failed: "فشل تسجيل الدخول",
    invalid_credentials: "بريد إلكتروني أو كلمة مرور غير صالحة",
    register_success: "تم التسجيل بنجاح",
    account_created: "تم إنشاء حسابك",
    register_failed: "فشل التسجيل",
    registration_error: "حدث خطأ أثناء إنشاء حسابك",
    login_required: "تسجيل الدخول مطلوب",
    login_to_book: "الرجاء تسجيل الدخول لحجز هذه الفعالية",
    login_to_view_bookings: "الرجاء تسجيل الدخول لعرض حجوزاتك",

    // Bookings
    booking_success_message: "لقد قمت بحجز هذه الفعالية بنجاح!",
    view_my_bookings: "عرض حجوزاتي",
    congratulations: "تهانينا!",
    booking_failed: "فشل الحجز",
    booking_error: "حدث خطأ أثناء حجز هذه الفعالية",
    no_bookings: "لا توجد حجوزات بعد",
    no_bookings_description: "لم تقم بحجز أي فعاليات بعد",
    browse_events: "تصفح الفعاليات",
    bookings_load_error: "فشل تحميل الحجوزات",

    // Admin
    manage_events: "إدارة الفعاليات",
    manage_categories: "إدارة الفئات",
    manage_tags: "إدارة العلامات",
    add_event: "إضافة فعالية",
    edit_event: "تعديل الفعالية",
    add_category: "إضافة فئة",
    add_tag: "إضافة علامة",
    select_category: "اختر الفئة",
    none: "لا شيء",
    no_events_yet: "لم تتم إضافة فعاليات بعد",
    no_categories_yet: "لم تتم إضافة فئات بعد",
    no_tags_yet: "لم تتم إضافة علامات بعد",
    actions: "الإجراءات",
    confirm_delete_event: "هل أنت متأكد من رغبتك في حذف هذه الفعالية؟",
    confirm_delete_category: "هل أنت متأكد من رغبتك في حذف هذه الفئة؟",
    confirm_delete_tag: "هل أنت متأكد من رغبتك في حذف هذه العلامة؟",
    event_created: "تم إنشاء الفعالية بنجاح",
    event_updated: "تم تحديث الفعالية بنجاح",
    event_deleted: "تم حذف الفعالية بنجاح",
    category_created: "تم إنشاء الفئة بنجاح",
    category_deleted: "تم حذف الفئة بنجاح",
    tag_created: "تم إنشاء العلامة بنجاح",
    tag_deleted: "تم حذف العلامة بنجاح",
    event_create_error: "فشل إنشاء الفعالية",
    event_update_error: "فشل تحديث الفعالية",
    event_delete_error: "فشل حذف الفعالية",
    category_create_error: "فشل إنشاء الفئة",
    category_delete_error: "فشل حذف الفئة",
    tag_create_error: "فشل إنشاء العلامة",
    tag_delete_error: "فشل حذف العلامة",
    data_load_error: "فشل تحميل البيانات",
    category_name: "اسم الفئة",
    tag_name: "اسم العلامة",

    // Footer
    terms: "الشروط",
    privacy: "الخصوصية",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    // Get language preference from localStorage
    const storedLanguage = localStorage.getItem("language")
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }

    // Set dir attribute on document for RTL support
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  const changeLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
  }

  const translate = (key: string): string => {
    const currentTranslations = translations[language as keyof typeof translations] || translations.en
    return (currentTranslations as Record<string, string>)[key] || key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t: translate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider")
  }
  return context
}
