"use client"
import HeroSection from "@/components/navbar/HeroSection";
import DynamicBackground from "@/components/dynamicBackground";
import Image from "next/image";

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col container mx-auto px-12 py-4 relative">

            <DynamicBackground />
        
        
        <div className="w-full relative px-12 py-4">
          <HeroSection/>
        <footer className='max-w-4-xl mx-auto bottom-0 pb-4'>
          <p className='text-center text-sm text-gray-500'>
            @ 2025 NRacoo. All rights reserved
          </p>

        </footer>
        </div>
      </main>
  )
}
