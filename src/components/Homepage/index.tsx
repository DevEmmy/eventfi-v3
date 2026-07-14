import React from 'react'
import Banner from './Banner'
import SearchSection from './SearchSection'
import TrendingEventsSection from './TrendingEventsSection'
import FinalCTASection from './FinalCTASection'

const Homepage = () => {
  return (
    <div>
        <Banner />
        <SearchSection />
        <TrendingEventsSection />
        <FinalCTASection />
    </div>
  )
}

export default Homepage