import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Services from "../components/Services"
import Projects from "../components/Projects"
import MobileSection from "../components/MobileSection"
import EducationSection from "../components/EducationSection"
import AiIntegration from "../components/AiIntegration"
import Footer from "../components/Footer"
import AboutUs from "../components/AboutUs"
import BackToTop from "../components/BackToTop"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

function Home() {
  const { hash } = useLocation()

  // Links like /#about arrive before the sections have rendered, and React
  // Router does not scroll to hashes, so scroll once the target exists.
  useEffect(() => {
    if (!hash) return undefined
    let tries = 0
    const timer = setInterval(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el || ++tries > 20) {
        clearInterval(timer)
        el?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
    return () => clearInterval(timer)
  }, [hash])

  return (
    <div>
      <Navbar />
      <Hero />
      <Services />
      <Projects />
      <MobileSection />
      <EducationSection />
      <AiIntegration />
      <AboutUs />
      <Footer />
      <BackToTop />
    </div>
  )
}

export default Home