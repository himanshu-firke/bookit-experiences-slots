"use client"

import { useEffect, useState } from "react"
import ActivityCard from "./activity-card"
import { getExperiences, Experience } from "@/lib/api"
import { CardSkeleton } from "./ui/loading-spinner"
import { ErrorMessage } from "./ui/error-message"

interface ActivityGridProps {
  searchQuery?: string
}

const placeholderActivities = [
  {
    id: 1,
    title: "Kayaking",
    location: "Udupi",
    image: "/kayaking-in-river.jpg",
    price: 999,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
  },
  {
    id: 2,
    title: "Nandi Hills Sunrise",
    location: "Bangalore",
    image: "/sunrise-at-nandi-hills.jpg",
    price: 899,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
  },
  {
    id: 3,
    title: "Coffee Trail",
    location: "Coorg",
    image: "/coffee-plantation-trail.jpg",
    price: 1299,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
  },
  {
    id: 4,
    title: "Kayaking",
    location: "Idukki Karakala",
    image: "/kayaking-adventure.png",
    price: 999,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
  },
  {
    id: 5,
    title: "Nandi Hills Sunrise",
    location: "Bangalore",
    image: "/serene-sunrise-landscape.png",
    price: 899,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
  },
  {
    id: 6,
    title: "Boat Cruise",
    location: "Sagarikula",
    image: "/boat-cruise-on-water.jpg",
    price: 899,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
  },
  {
    id: 7,
    title: "Bunjee Jumping",
    location: "Marali",
    image: "/bungee-jumping-adventure.jpg",
    price: 999,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
  },
  {
    id: 8,
    title: "Coffee Trail",
    location: "Coorg",
    image: "/coffee-trail-forest.jpg",
    price: 1299,
    description: "Curated small group experience. Certified guide. Safety first and fun always.",
  },
]

export default function ActivityGrid({ searchQuery = "" }: ActivityGridProps) {
  const [activities, setActivities] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getExperiences()
      setActivities(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load experiences')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences()
  }, [])

  const filteredActivities = activities.filter((activity) => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return (
      activity.title.toLowerCase().includes(query) ||
      activity.location.toLowerCase().includes(query) ||
      activity.description.toLowerCase().includes(query)
    )
  })

  const convertActivity = (activity: Experience) => ({
    id: activity._id,
    title: activity.title,
    location: activity.location,
    image: activity.image,
    price: activity.price,
    description: activity.description
  })

  return (
    <div className="w-full flex justify-center bg-white">
      <div className="w-full max-w-[1440px] px-4 md:px-8 lg:px-[124px] py-6 md:py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchExperiences} />
        ) : filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard key={activity._id} activity={convertActivity(activity)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-sm md:text-lg">No experiences found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
