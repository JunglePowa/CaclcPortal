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
const PercentagePage = lazy(() => import('@/pages/PercentagePage'))
const OtpuskPage = lazy(() => import('@/pages/OtpuskPage'))
const StazhPage = lazy(() => import('@/pages/StazhPage'))
const DaysBetweenPage = lazy(() => import('@/pages/DaysBetweenPage'))
const DiscountPage = lazy(() => import('@/pages/DiscountPage'))
const AgePage = lazy(() => import('@/pages/AgePage'))
const AutocreditPage = lazy(() => import('@/pages/AutocreditPage'))
const CreditCardPage = lazy(() => import('@/pages/CreditCardPage'))
const CompoundInterestPage = lazy(() => import('@/pages/CompoundInterestPage'))
const DateAddPage = lazy(() => import('@/pages/DateAddPage'))
const TimeBetweenPage = lazy(() => import('@/pages/TimeBetweenPage'))

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
        <Route path="/investment" element={<InvesticiiPage />} />
        <Route path="/capital-growth-calculator" element={<InvesticiiPage />} />
        <Route path="/investment/contribution" element={<InvesticiiPage />} />
        <Route path="/investment/term" element={<InvesticiiPage />} />
        <Route path="/investment/rate" element={<InvesticiiPage />} />
        <Route path="/investment/capital" element={<InvesticiiPage />} />
        <Route path="/investment/comparison" element={<InvesticiiPage />} />
        <Route path="/deposit" element={<VkladPage />} />
        <Route path="/deposit/capitalization" element={<VkladPage />} />
        <Route path="/deposit/replenishment" element={<VkladPage />} />
        <Route path="/deposit/tax" element={<VkladPage />} />
        <Route path="/credit" element={<KreditPage />} />
        <Route path="/credit/annuity" element={<KreditPage />} />
        <Route path="/credit/differentiated" element={<KreditPage />} />
        <Route path="/vat" element={<NdsPage />} />
        <Route path="/vat/add" element={<NdsPage />} />
        <Route path="/vat/extract" element={<NdsPage />} />
        <Route path="/income-tax" element={<NdflPage />} />
        <Route path="/income-tax/2026" element={<NdflPage />} />
        <Route path="/salary" element={<ZarplataPage />} />
        <Route path="/salary/gross-net" element={<ZarplataPage />} />
        <Route path="/salary/net-gross" element={<ZarplataPage />} />
        <Route path="/fuel-consumption" element={<RashodPage />} />
        <Route path="/fuel-consumption/trip-cost" element={<RashodPage />} />
        <Route path="/transport-tax" element={<TransportPage />} />
        <Route path="/bmi" element={<ImtPage />} />
        <Route path="/pregnancy" element={<BeremenostPage />} />
        <Route path="/bonds" element={<ObligaciiPage />} />
        <Route path="/mortgage" element={<IpotekaPage />} />
        <Route path="/early-repayment" element={<KreditDosrochnoePage />} />
        <Route path="/early-repayment/reduce-term" element={<KreditDosrochnoePage />} />
        <Route path="/early-repayment/reduce-payment" element={<KreditDosrochnoePage />} />
        <Route path="/credit-card" element={<CreditCardPage />} />
        <Route path="/tax-penalties" element={<PeniPage />} />
        <Route path="/tax-penalties/online" element={<PeniPage />} />
        <Route path="/tax-penalties/individuals" element={<PeniPage />} />
        <Route path="/tax-penalties/legal-entities" element={<PeniPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/methodology" element={<MethodologyPage />} />
        <Route path="/finance" element={<CategoryPage />} />
        <Route path="/loans" element={<CategoryPage />} />
        <Route path="/taxes" element={<CategoryPage />} />
        <Route path="/auto" element={<CategoryPage />} />
        <Route path="/health" element={<CategoryPage />} />
        <Route path="/math" element={<CategoryPage />} />
        <Route path="/work" element={<CategoryPage />} />
        <Route path="/percentage" element={<PercentagePage />} />
        <Route path="/percentage/percent-of-number" element={<PercentagePage />} />
        <Route path="/percentage/add-percent" element={<PercentagePage />} />
        <Route path="/percentage/subtract-percent" element={<PercentagePage />} />
        <Route path="/percentage/percentage-change" element={<PercentagePage />} />
        <Route path="/percentage/what-percent" element={<PercentagePage />} />
        <Route path="/compound-interest" element={<CompoundInterestPage />} />
        <Route path="/days-between-dates" element={<DaysBetweenPage />} />
        <Route path="/date-add" element={<DateAddPage />} />
        <Route path="/time-between" element={<TimeBetweenPage />} />
        <Route path="/discount" element={<DiscountPage />} />
        <Route path="/age" element={<AgePage />} />
        <Route path="/vacation-pay" element={<OtpuskPage />} />
        <Route path="/work-experience" element={<StazhPage />} />
        <Route path="/autocredit" element={<AutocreditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
