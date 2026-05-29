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
import PercentagePage from '@/pages/PercentagePage'
import OtpuskPage from '@/pages/OtpuskPage'
import StazhPage from '@/pages/StazhPage'
import DaysBetweenPage from '@/pages/DaysBetweenPage'
import DiscountPage from '@/pages/DiscountPage'
import AgePage from '@/pages/AgePage'
import AutocreditPage from '@/pages/AutocreditPage'
import CreditCardPage from '@/pages/CreditCardPage'
import CompoundInterestPage from '@/pages/CompoundInterestPage'
import DateAddPage from '@/pages/DateAddPage'
import TimeBetweenPage from '@/pages/TimeBetweenPage'

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
  )
}
