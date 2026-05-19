import { Route, Routes } from 'react-router-dom'
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
import ObligaciiPage from '@/pages/ObligaciiPage'
import IpotekaPage from '@/pages/IpotekaPage'
import KreditDosrochnoePage from '@/pages/KreditDosrochnoePage'
import PeniPage from '@/pages/PeniPage'
import PrivacyPage from '@/pages/PrivacyPage'
import TermsPage from '@/pages/TermsPage'
import AboutPage from '@/pages/AboutPage'
import ContactsPage from '@/pages/ContactsPage'
import MethodologyPage from '@/pages/MethodologyPage'
import CategoryPage from '@/pages/CategoryPage'
import NotFoundPage from '@/pages/NotFoundPage'

export function ServerApp() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/investment" element={<InvesticiiPage />} />
      <Route path="/investment/contribution" element={<InvesticiiPage />} />
      <Route path="/investment/term" element={<InvesticiiPage />} />
      <Route path="/investment/rate" element={<InvesticiiPage />} />
      <Route path="/investment/capital" element={<InvesticiiPage />} />
      <Route path="/investment/comparison" element={<InvesticiiPage />} />
      <Route path="/deposit" element={<VkladPage />} />
      <Route path="/credit" element={<KreditPage />} />
      <Route path="/vat" element={<NdsPage />} />
      <Route path="/income-tax" element={<NdflPage />} />
      <Route path="/salary" element={<ZarplataPage />} />
      <Route path="/fuel-consumption" element={<RashodPage />} />
      <Route path="/transport-tax" element={<TransportPage />} />
      <Route path="/bmi" element={<ImtPage />} />
      <Route path="/pregnancy" element={<BeremenostPage />} />
      <Route path="/bonds" element={<ObligaciiPage />} />
      <Route path="/mortgage" element={<IpotekaPage />} />
      <Route path="/early-repayment" element={<KreditDosrochnoePage />} />
      <Route path="/tax-penalties" element={<PeniPage />} />
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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
