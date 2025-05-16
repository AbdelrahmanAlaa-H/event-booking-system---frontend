import { EventSquareGrid } from "@/components/event-square-grid"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <div id="events-section" className="pt-8 scroll-mt-20">
        <EventSquareGrid />
      </div>
    </div>
  )
}
