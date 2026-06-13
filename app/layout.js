import './globals.css'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SaleBanner from '@/components/SaleBanner'
import WhatsAppButton from '@/components/WhatsAppButton'
import MaintenanceGate from '@/components/MaintenanceGate'

export const metadata = {
  title: 'PurePulse India | Organic Indian Pulses & Lentils',
  description: 'Premium organic Indian pulses, lentils, chickpeas, beans, and bulk exports delivered worldwide.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SaleBanner />
          <Navbar />
          <MaintenanceGate>
            <main>{children}</main>
          </MaintenanceGate>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  )
}
