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

function Home() {
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