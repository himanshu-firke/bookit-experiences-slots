"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Plus, Minus } from "lucide-react"
import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { getExperienceById, Experience } from "@/lib/api"
import { PageLoader } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"

export default function ProductDetails() {
  const params = useParams()
  const router = useRouter()
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const fetchExperience = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getExperienceById(params.id as string)
      setExperience(data)
      if (data.dates && data.dates.length > 0) {
        setSelectedDate(data.dates[0])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load experience')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchExperience()
    }
  }, [params.id])

  if (loading) {
    return <PageLoader />
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar disableSearch={true} />
        <ErrorMessage message={error || 'Experience not found'} onRetry={fetchExperience} />
      </div>
    )
  }

  const subtotal = experience.price * quantity
  const total = subtotal + experience.taxes

  return (
    <div className="min-h-screen bg-white">
      <Navbar disableSearch={true} />

      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[124px] py-6 md:py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-700 hover:text-gray-900 gap-2 mb-6"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Details</span>
        </button>

        {/* Main Content - Image and Receipt */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8">
          {/* Product Image */}
          <div className="relative w-full lg:w-[765px] h-[250px] md:h-[381px] overflow-hidden rounded-xl flex-shrink-0">
            <Image src={experience.image} alt={experience.title} fill className="object-cover" />
          </div>

          {/* Receipt Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 w-full lg:w-[387px] lg:flex-shrink-0 self-start">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Starts at</span>
            <span className="text-lg font-semibold">₹{experience.price}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-medium w-4 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm font-medium">₹{subtotal}</span>
          </div>

          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
            <span className="text-sm text-gray-600">Taxes</span>
            <span className="text-sm font-medium">₹{experience.taxes}</span>
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-base font-semibold">Total</span>
            <span className="text-xl font-bold">₹{total}</span>
          </div>

          <button
            disabled={!selectedTime}
            onClick={() => {
              if (selectedTime) {
                const params = new URLSearchParams({
                  id: experience._id,
                  title: experience.title,
                  date: selectedDate,
                  time: selectedTime,
                  location: experience.location,
                  price: experience.price.toString(),
                  taxes: experience.taxes.toString(),
                  quantity: quantity.toString(),
                })
                router.push(`/checkout?${params.toString()}`)
              }
            }}
            className="w-full text-gray-900 font-semibold flex items-center justify-center transition-colors"
            style={{
              height: "44px",
              borderRadius: "8px",
              background: selectedTime ? "#FFD643" : "#E5E7EB",
              cursor: selectedTime ? "pointer" : "not-allowed",
              opacity: selectedTime ? 1 : 0.6,
            }}
          >
            Confirm
          </button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="w-full max-w-[765px]">
          <h1
            style={{
              fontFamily: "Inter",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              marginBottom: "8px",
            }}
          >
            {experience.title}
          </h1>

          <p className="text-sm text-gray-700 mb-6">{experience.description}</p>

          <div className="mb-6">
            <h3
              style={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "22px",
                marginBottom: "12px",
              }}
            >
              Choose date
            </h3>
            <div className="flex gap-2 flex-wrap">
              {experience.dates?.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className="px-3 md:px-4 py-2 border rounded text-xs md:text-sm font-medium text-gray-900 whitespace-nowrap"
                  style={{
                    background: selectedDate === date ? "#FFD643" : "#FFFFFF",
                    borderColor: selectedDate === date ? "#FFD643" : "#D1D5DB",
                  }}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3
              style={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "22px",
                marginBottom: "12px",
              }}
            >
              Choose time
            </h3>
            <div className="flex gap-2 flex-wrap">
              {experience.times?.map((timeSlot, idx) => (
                <button
                  key={idx}
                  onClick={() => !timeSlot.status && setSelectedTime(timeSlot.time)}
                  disabled={!!timeSlot.status}
                  className={`px-4 py-2 border rounded text-xs ${
                    timeSlot.status
                      ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                      : selectedTime === timeSlot.time
                        ? "bg-gray-700 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {timeSlot.time}
                  {timeSlot.available && (
                    <span className="ml-1 text-red-500">{timeSlot.available} left</span>
                  )}
                  {timeSlot.status && <span className="ml-1">{timeSlot.status}</span>}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">All times are in IST (GMT +5:30)</p>
          </div>

          <div>
            <h3
              style={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "22px",
                marginBottom: "8px",
              }}
            >
              About
            </h3>
            <p
              className="text-sm text-gray-700"
              style={{
                background: "#EEEEEE",
                padding: "12px",
                borderRadius: "4px",
              }}
            >
              {experience.about}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
