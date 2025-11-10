import React from 'react'
import Banner from './Banner'
import SearchSection from './SearchSection'
import TrendingEventsSection from './TrendingEventsSection'
import DualValueSection from './DualValueSection'
import EcosystemSection from './EcosystemSection'
import HowItWorksSection from './HowItWorksSection'
import PerfectForSection from './PerfectForSection'
import FinalCTASection from './FinalCTASection'
import Footer from '../Footer'

const Homepage = () => {
  return (
    <div>
        <Banner />
        <SearchSection />
        <TrendingEventsSection />
        <DualValueSection />
        <EcosystemSection />
        <HowItWorksSection />
        <PerfectForSection />
        <FinalCTASection />
    </div>
  )
}

export default Homepage