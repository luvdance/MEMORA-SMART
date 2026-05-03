import logo from "../assets/memora logo.PNG";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT BRAND */}
        <div className="footer-brand">
          <div className="logo">
            <img src={logo} alt="logo" />
            <h2>
              Memora Smart Technologies
              <span className="tech">Building Smart Digital Futures</span>
            </h2>
          </div>

          <p>
            Building scalable digital experiences with modern web technologies,
            AI integration, and clean UI systems.
          </p>

          <div className="footer-socials">
            <a href="#"><i className="fab fa-github"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-x-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="footer-links">
          <h3>Navigation</h3>
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#projects">Projects</a>
          <a href="#ai">AI Integration</a>
          <a href="#mobile">Mobile Dev</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
        </div>

        {/* SERVICES */}
        <div className="footer-links">
          <h3>Services</h3>
          <a href="#">Web Development</a>
          <a href="#">UI/UX Design</a>
          <a href="#">AI Integration</a>
          <a href="#">Mobile Apps</a>
          <a href="#">IT Consulting</a>
          <a href="#">Digital Marketing</a>
        </div>

        {/* CONTACT / CTA */}
        <div className="footer-contact">
          <h3>Let’s Work Together</h3>
          <p>
            Got a project or idea? Let’s build something impactful together.
          </p>

          <a href="#contact" className="footer-btn">
            Contact Us <i className="fas fa-arrow-right"></i>
          </a>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Memora Smart Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;