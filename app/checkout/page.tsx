"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Plus, Minus } from "lucide-react"
import { useState, Suspense } from "react"
import Navbar from "@/components/navbar"
import { createBooking, validatePromoCode } from "@/lib/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [quantity, setQuantity] = useState(Number(searchParams.get("quantity")) || 1)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const [discount, setDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)
  const [isLoadingPromo, setIsLoadingPromo] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{name?: string; email?: string; terms?: string; promo?: string}>({})
  const [promoError, setPromoError] = useState("")
  const [promoSuccess, setPromoSuccess] = useState("")

  // Get data from URL params
  const activityTitle = searchParams.get("title") || "Kayaking"
  const activityDate = searchParams.get("date") || "2025-10-22"
  const activityTime = searchParams.get("time") || "09:00 am"
  const activityLocation = searchParams.get("location") || "Udupi"
  const price = Number(searchParams.get("price")) || 999
  const taxes = Number(searchParams.get("taxes")) || 59

  const experienceId = searchParams.get("id") || ""
  const subtotal = price * quantity
  const totalAfterDiscount = subtotal - discount
  const total = totalAfterDiscount + taxes

  const validateForm = () => {
    const newErrors: {name?: string; email?: string; terms?: string} = {}
    
    if (!fullName.trim()) {
      newErrors.name = "Name is required"
    } else if (fullName.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format"
    }
    
    if (!agreedToTerms) {
      newErrors.terms = "You must agree to terms and safety policy"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code")
      return
    }
    
    try {
      setIsLoadingPromo(true)
      setPromoError("")
      setPromoSuccess("")
      
      const promoData = await validatePromoCode(promoCode, subtotal)
      setDiscount(promoData.discount)
      setPromoApplied(true)
      setPromoSuccess(`Promo code applied! You saved ₹${promoData.discount}`)
    } catch (err: any) {
      setPromoError(err.message || "Invalid promo code")
      setDiscount(0)
      setPromoApplied(false)
    } finally {
      setIsLoadingPromo(false)
    }
  }

  const handlePayAndConfirm = async () => {
    if (!validateForm()) {
      return
    }
    
    try {
      setIsSubmitting(true)
      setErrors({})
      
      const bookingData = {
        experienceId,
        experienceTitle: activityTitle,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        date: activityDate,
        time: activityTime,
        location: activityLocation,
        quantity,
        price,
        taxes,
        total,
        promoCode: promoApplied ? promoCode : undefined,
        discount,
        agreedToTerms
      }
      
      const result = await createBooking(bookingData)
      router.push(`/success?refId=${result.data.refId}`)
    } catch (err: any) {
      setErrors({ name: err.message || "Booking failed. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar disableSearch={true} />

      {/* Main Content */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[150px] py-6 md:py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-700 hover:text-gray-900 gap-2 mb-6"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Checkout</span>
        </button>

        {/* Form and Receipt Container */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Form Container */}
          <div className="bg-[#EFEFEF] rounded-xl p-5 md:p-6 w-full lg:w-[739px] lg:flex-shrink-0">
          {/* Form Row 1 - Full Name and Email */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
            {/* Full Name */}
            <div className="flex-1">
              <label
                className="block mb-2 text-sm"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 400,
                  color: "#5B5B5B",
                }}
              >
                Full name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (errors.name) setErrors({...errors, name: undefined})
                }}
                className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none px-4 py-3"
                style={{
                  borderRadius: "6px",
                  background: "#DDDDDD",
                  border: errors.name ? "2px solid #EF4444" : "none",
                }}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex-1">
              <label
                className="block mb-2 text-sm"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 400,
                  color: "#5B5B5B",
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({...errors, email: undefined})
                }}
                className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none px-4 py-3"
                style={{
                  borderRadius: "6px",
                  background: "#DDDDDD",
                  border: errors.email ? "2px solid #EF4444" : "none",
                }}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Promo Code Row */}
          <div className="flex items-center gap-4 mt-4">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none px-4 py-3"
              style={{
                borderRadius: "6px",
                background: "#DDDDDD",
                border: "none",
              }}
            />

            {/* Apply Button */}
            <button
              onClick={handleApplyPromo}
              disabled={isLoadingPromo || promoApplied}
              className="bg-[#161616] hover:bg-gray-800 text-white font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                width: "71px",
                height: "42px",
                paddingTop: "12px",
                paddingRight: "16px",
                paddingBottom: "12px",
                paddingLeft: "16px",
                gap: "10px",
                borderRadius: "8px",
              }}
            >
              {isLoadingPromo ? <LoadingSpinner size="sm" /> : promoApplied ? "Applied" : "Apply"}
            </button>
          </div>
          
          {/* Promo Messages */}
          {promoError && (
            <p className="text-xs text-red-500 mt-2">{promoError}</p>
          )}
          {promoSuccess && (
            <p className="text-xs text-green-600 mt-2">{promoSuccess}</p>
          )}

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-xs text-gray-600">
              I agree to the terms and safety policy
            </label>
          </div>
          {errors.terms && (
            <p className="text-xs text-red-500 mt-2">{errors.terms}</p>
          )}
        </div>

        {/* Receipt Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 w-full lg:w-[387px] lg:flex-shrink-0 self-start">
            {/* Experience */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Experience</span>
              <span className="text-sm font-semibold">{activityTitle}</span>
            </div>

            {/* Date */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Date</span>
              <span className="text-sm font-medium">{activityDate}</span>
            </div>

            {/* Time */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Time</span>
              <span className="text-sm font-medium">{activityTime}</span>
            </div>

            {/* Qty */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
              <span className="text-sm text-gray-600">Qty</span>
              <span className="text-sm font-medium">{quantity}</span>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-sm font-medium">₹{subtotal}</span>
            </div>

            {/* Discount */}
            {discount > 0 && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-green-600">Discount</span>
                <span className="text-sm font-medium text-green-600">-₹{discount}</span>
              </div>
            )}

            {/* Taxes */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
              <span className="text-sm text-gray-600">Taxes</span>
              <span className="text-sm font-medium">₹{taxes}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-base font-semibold">Total</span>
              <span className="text-xl font-bold">₹{total}</span>
            </div>

            {/* Pay and Confirm Button */}
            <button
              disabled={isSubmitting || !fullName || !email || !agreedToTerms}
              onClick={handlePayAndConfirm}
              className="w-full text-gray-900 font-semibold flex items-center justify-center transition-colors gap-2"
              style={{
                width: "339px",
                height: "44px",
                paddingTop: "12px",
                paddingRight: "20px",
                paddingBottom: "12px",
                paddingLeft: "20px",
                borderRadius: "8px",
                background: (fullName && email && agreedToTerms && !isSubmitting) ? "#FFD643" : "#E5E7EB",
                cursor: (fullName && email && agreedToTerms && !isSubmitting) ? "pointer" : "not-allowed",
                opacity: (fullName && email && agreedToTerms && !isSubmitting) ? 1 : 0.6,
              }}
            >
              {isSubmitting && <LoadingSpinner size="sm" />}
              {isSubmitting ? "Processing..." : "Pay and Confirm"}
            </button>
        </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"><Navbar disableSearch={true} /><div className="flex items-center justify-center min-h-screen"><LoadingSpinner /></div></div>}>
      <CheckoutContent />
    </Suspense>
  )
}
