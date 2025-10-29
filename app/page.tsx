"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import ActivityGrid from "@/components/activity-grid"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <main className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />
      <ActivityGrid searchQuery={searchQuery} />
    </main>
  )
}
