import React from 'react'
import Banner from './Banner'
import SearchSection from './SearchSection'
import TrendingEventsSection from './TrendingEventsSection'
import DualValueSection from './DualValueSection'

const Homepage = () => {
  return (
    <div>
        <Banner />
        <SearchSection />
        <TrendingEventsSection />
        <DualValueSection />
    </div>
  )
}

export default Homepage