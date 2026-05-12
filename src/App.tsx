import { lazy, Suspense, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useSEO } from '@/hooks/useSEO'
import HomePage from '@/pages/HomePage'
import { hasAnalytics, initAnalytics, trackPageview } from '@/lib/analytics'

const InvesticiiPage = lazy(() => import('@/pages/InvesticiiPage'))
const VkladPage = lazy(() => import('@/pages/VkladPage'))
const KreditPage = lazy(() => import('@/pages/KreditPage'))
const NdsPage = lazy(() => import('@/pages/NdsPage'))
const NdflPage = lazy(() => import('@/pages/NdflPage'))
const ZarplataPage = lazy(() => import('@/pages/ZarplataPage'))
const RashodPage = lazy(() => import('@/pages/RashodPage'))
const TransportPage = lazy(() => import('@/pages/TransportPage'))
const ImtPage = lazy(() => import('@/pages/ImtPage'))
const BeremenostPage = lazy(() => import('@/pages/BeremenostPage'))
const ObligaciiPage = lazy(() => import('@/pages/ObligaciiPage'))
const IpotekaPage = lazy(() => import('@/pages/IpotekaPage'))
const KreditDosrochnoePage = lazy(() => import('@/pages/KreditDosrochnoePage'))
const PeniPage = lazy(() => import('@/pages/PeniPage'))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
const TermsPage = lazy(() => import('@/pages/TermsPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ContactsPage = lazy(() => import('@/pages/ContactsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const CategoryPage = lazy(() => import('@/pages/CategoryPage'))
const MethodologyPage = lazy(() => import('@/pages/MethodologyPage'))

export default function App() {
  useSEO()
  const location = useLocation()
  const didTrackInitialPageview = useRef(false)

  useEffect(() => {
    initAnalytics()
    if (hasAnalytics) {
      trackPageview(location.pathname + location.search)
      didTrackInitialPageview.current = true
    }
    // Initial hit is sent after analytics has been initialized.
    // Route changes are tracked by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!hasAnalytics) return
    if (didTrackInitialPageview.current) {
      didTrackInitialPageview.current = false
      return
    }
    trackPageview(location.pathname + location.search)
  }, [location.key])

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/investicii" element={<InvesticiiPage />} />
        <Route path="/investicii/vznoj" element={<InvesticiiPage />} />
        <Route path="/investicii/srok" element={<InvesticiiPage />} />
        <Route path="/investicii/stavka" element={<InvesticiiPage />} />
        <Route path="/investicii/kapital" element={<InvesticiiPage />} />
        <Route path="/investicii/sravnenie" element={<InvesticiiPage />} />
        <Route path="/vklad" element={<VkladPage />} />
        <Route path="/kredit" element={<KreditPage />} />
        <Route path="/nds" element={<NdsPage />} />
        <Route path="/ndfl" element={<NdflPage />} />
        <Route path="/zarplata" element={<ZarplataPage />} />
        <Route path="/rashod-topliva" element={<RashodPage />} />
        <Route path="/transportnyj-nalog" element={<TransportPage />} />
        <Route path="/imt" element={<ImtPage />} />
        <Route path="/beremennost" element={<BeremenostPage />} />
        <Route path="/obligacii" element={<ObligaciiPage />} />
        <Route path="/ipoteka" element={<IpotekaPage />} />
        <Route path="/kredit-dosrochnoe" element={<KreditDosrochnoePage />} />
        <Route path="/peni" element={<PeniPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/methodology" element={<MethodologyPage />} />
        <Route path="/finansy" element={<CategoryPage />} />
        <Route path="/kredity" element={<CategoryPage />} />
        <Route path="/nalogi" element={<CategoryPage />} />
        <Route path="/avto" element={<CategoryPage />} />
        <Route path="/zdorove" element={<CategoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
