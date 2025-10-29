"use client"

import { useState } from "react"
import Image from "next/image"

interface NavbarProps {
  onSearch?: (query: string) => void
  searchQuery?: string
  disableSearch?: boolean
}

export default function Navbar({ onSearch, searchQuery: externalQuery, disableSearch = false }: NavbarProps = {}) {
  const [internalQuery, setInternalQuery] = useState("")
  const searchQuery = externalQuery !== undefined ? externalQuery : internalQuery
  
  const handleSearchChange = (value: string) => {
    if (externalQuery !== undefined && onSearch) {
      onSearch(value)
    } else {
      setInternalQuery(value)
    }
  }

  return (
    <nav className="w-full bg-white border-b border-gray-200 flex justify-center">
      <div className="flex items-center justify-between w-full max-w-[1440px] px-4 py-4 md:px-8 lg:px-[124px] h-auto lg:h-[87px] gap-4">
        {/* Logo */}
        <div className="relative w-16 h-9 md:w-20 md:h-11 lg:w-[100px] lg:h-[55px] flex-shrink-0">
          <Image src="/logo.png" alt="Highway Delite" fill className="object-contain" />
        </div>

        {/* Search Box Container - Responsive for all screens */}
        <div className="flex items-center flex-1 max-w-[443px] gap-2 md:gap-4">
          {/* Search Input */}
          <div
            className="relative flex items-center flex-1 max-w-[340px] px-3 md:px-4 py-2 md:py-3"
            style={{
              borderRadius: "4px",
              background: "#EDEDED",
              border: "none",
              opacity: 1,
            }}
          >
            <input
              type="text"
              placeholder={disableSearch ? "" : "Search experiences"}
              value={disableSearch ? "" : searchQuery}
              onChange={(e) => !disableSearch && handleSearchChange(e.target.value)}
              disabled={disableSearch}
              readOnly={disableSearch}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
              style={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "18px",
                letterSpacing: "0%",
                cursor: disableSearch ? "not-allowed" : "text",
              }}
            />
          </div>

          {/* Search Button */}
          <button
            disabled={disableSearch}
            className="text-gray-900 font-semibold flex items-center justify-center px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm whitespace-nowrap flex-shrink-0"
            style={{
              borderRadius: "8px",
              background: "#FFD643",
              border: "none",
              opacity: 1,
              cursor: disableSearch ? "not-allowed" : "pointer",
            }}
          >
            Search
          </button>
        </div>
      </div>
    </nav>
  )
}
