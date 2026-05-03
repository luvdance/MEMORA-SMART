import aboutImg from "../assets/memora board.JPG";

function AboutUs() {
  return (
    <section className="about-section" id="about">

      <div className="about-container">

        {/* LEFT - IMAGE */}
        <div className="about-img">
          <img src={aboutImg} alt="About us" />
        </div>

        {/* RIGHT - CONTENT */}
        <div className="about-content">

          <h2>
            About <span className="gradient-text">Us</span>
          </h2>

          <p className="about-intro">
            We are a forward-thinking digital solutions team focused on building
            modern, scalable, and intelligent systems that help businesses grow.
            From web development to AI-powered automation, we combine creativity
            with engineering precision.
          </p>

          {/* FEATURES */}
          <div className="about-features">
            <div className="about-card">
              <i className="fas fa-code"></i>
              <h4>Clean Development</h4>
              <p>Maintainable, scalable and modern code architecture.</p>
            </div>

            <div className="about-card">
              <i className="fas fa-brain"></i>
              <h4>AI Integration</h4>
              <p>Smart automation and intelligent workflows for efficiency.</p>
            </div>

            <div className="about-card">
              <i className="fas fa-mobile-alt"></i>
              <h4>Cross-Platform</h4>
              <p>Seamless experiences across web and mobile platforms.</p>
            </div>
          </div>

        </div>

      </div>

      {/* CONTACT STRIP */}
      <div className="about-contact" id="contact">

        <div className="contact-container">

          <h2>Let’s Build Something Great</h2>
          <p>
            Have a project, idea, or business need? Reach out and let’s turn it
            into something impactful.
          </p>

          <div className="contact-methods">

            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>memorasmart@gmail.com</span>
              <span>support@memorasmart.com</span>
            </div>

            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>+234 706 426 5426</span>
            </div>

            <div className="contact-item">
              <i className="fab fa-whatsapp"></i>
              <span>Chat on WhatsApp</span>
            </div>

          </div>

          <a href="#contact" className="contact-btn">
            Start a Project <i className="fas fa-arrow-right"></i>
          </a>

        </div>

      </div>

    </section>
  );
}

export default AboutUs;