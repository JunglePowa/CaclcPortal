import { Routes, Route } from 'react-router-dom'
import { useSEO } from '@/hooks/useSEO'
import HomePage from '@/pages/HomePage'
import InvesticiiPage from '@/pages/InvesticiiPage'
import VkladPage from '@/pages/VkladPage'
import KreditPage from '@/pages/KreditPage'
import NdsPage from '@/pages/NdsPage'
import NdflPage from '@/pages/NdflPage'
import ZarplataPage from '@/pages/ZarplataPage'
import RashodPage from '@/pages/RashodPage'
import TransportPage from '@/pages/TransportPage'
import ImtPage from '@/pages/ImtPage'
import BeremenostPage from '@/pages/BeremenostPage'

export default function App() {
  useSEO()
  return (
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
    </Routes>
  )
}
