import Link from "next/link";

export default function Congratulations() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Congratulations!</h1>
      <p className="text-lg mb-8">Your booking was successful.</p>
      <Link href="/bookings" className="text-blue-600 underline">
        View My Bookings
      </Link>
    </div>
  );
}
