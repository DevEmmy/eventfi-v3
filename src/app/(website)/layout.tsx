import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import FloatingMessenger from '@/components/Messaging/FloatingMessenger'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
        <Navbar />
        {children}
        <Footer />
        <FloatingMessenger />
    </div>
  )
}

export default layout