"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import Navbar from "@/components/navbar"

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get reference ID from URL or generate one
  const refId = searchParams.get("refId") || "HUF56&SO"

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar disableSearch={true} />

      {/* Main Content - Centered */}
      <div className="w-full max-w-[1440px] mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center justify-center text-center space-y-6 md:space-y-8">
          {/* Success Icon */}
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: "60px",
              height: "60px",
              background: "#24AC39",
            }}
          >
            <CheckCircle2 
              size={40} 
              className="text-white"
              strokeWidth={2}
            />
          </div>

          {/* Booking Confirmed Text */}
          <h1
            className="text-2xl md:text-3xl font-medium"
            style={{
              fontFamily: "Inter",
              color: "#161616",
            }}
          >
            Booking Confirmed
          </h1>

          {/* Reference ID */}
          <p
            className="text-base md:text-lg"
            style={{
              fontFamily: "Inter",
              color: "#656565",
            }}
          >
            Ref ID: {refId}
          </p>

          {/* Back to Home Button */}
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 hover:bg-gray-300 transition-colors rounded mt-4"
            style={{
              background: "#E3E3E3",
              fontFamily: "Inter",
              fontSize: "14px",
              color: "#656565",
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
