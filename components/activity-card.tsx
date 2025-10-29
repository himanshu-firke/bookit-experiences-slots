"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Activity {
  id: string | number
  title: string
  location: string
  image: string
  price: number
  description: string
}

export default function ActivityCard({ activity }: { activity: Activity }) {
  return (
    /* Responsive card dimensions */
    <div
      className="flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 w-full max-w-[280px] mx-auto"
      style={{ minHeight: "312px", borderRadius: "12px" }}
    >
      {/* Image Container */}
      <div className="relative w-full bg-gray-200" style={{ height: "160px", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}>
        <Image
          src={activity.image || "/placeholder.svg?height=160&width=280&query=activity"}
          alt={activity.title}
          fill
          className="object-cover"
          style={{ borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-3 gap-2 relative">
        {/* First Row - Title and Location Badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm text-gray-900 flex-1">{activity.title}</h3>
          
          {/* Location Badge */}
          <div
            className="text-xs font-medium text-gray-900 flex-shrink-0"
            style={{
              minWidth: "auto",
              height: "24px",
              paddingTop: "4px",
              paddingRight: "8px",
              paddingBottom: "4px",
              paddingLeft: "8px",
              borderRadius: "4px",
              background: "#D6D6D6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {activity.location}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 leading-tight flex-1 line-clamp-2">{activity.description}</p>

        {/* Price and Button */}
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-gray-600">From</span>
            <span className="font-bold text-sm text-gray-900">₹{activity.price}</span>
          </div>
          <Link href={`/products/${activity.id}`} suppressHydrationWarning>
            <button 
              className="w-full text-gray-900 font-semibold text-xs hover:opacity-90 transition-opacity"
              style={{
                background: "#FFD643",
                height: "32px",
                borderRadius: "4px",
              }}
              suppressHydrationWarning
            >
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
