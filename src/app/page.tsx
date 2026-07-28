import type { Metadata } from 'next'

import Categories from '@/components/home/Categories'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import Hero from '@/components/home/Hero'
import StatBar from '@/components/home/StatBar'
import TestRide from '@/components/home/TestRide'
import Units from '@/components/home/Units'
import WhySection from '@/components/home/WhySection'

import './home.css'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatBar />
      <Categories />
      <FeaturedProducts />
      <WhySection />
      <Units />
      <div className="neon-divider" />
      <TestRide />
    </>
  )
}
