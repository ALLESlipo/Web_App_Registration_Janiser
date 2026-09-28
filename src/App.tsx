import { About } from './components/About'
import { Contact } from './components/Contact'
import { Eligibility } from './components/Eligibility'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Privacy } from './components/Privacy'
import { RegisterForm } from './components/RegisterForm'
import { SafetyStrip } from './components/SafetyStrip'
import { StudyArea } from './components/StudyArea'
import { Timeline } from './components/Timeline'
import { useLanguage } from './i18n/useLanguage'

export default function App() {
  const { t } = useLanguage()
  return (
    <>
      <a className="skip-link" href="#main">{t.meta.skipLink}</a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Eligibility />
        <Timeline />
        <Privacy />
        <RegisterForm />
        <StudyArea />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <SafetyStrip />
    </>
  )
}
