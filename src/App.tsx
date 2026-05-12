import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSEO } from '@/hooks/useSEO'
import HomePage from '@/pages/HomePage'

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

export default function App() {
  useSEO()
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/investicii" element={<InvesticiiPage />} />
        <Route path="/investicii/:mode" element={<InvesticiiPage />} />
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
      </Routes>
    </Suspense>
  )
}
