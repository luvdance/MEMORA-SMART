import mobileImg from "../assets/mobile dev.png";

function MobileSection() {
  return (
    <section className="mobile-section">

      <div className="mobile-container">

        {/* LEFT IMAGE */}
        <div className="mobile-img">
          <img src={mobileImg} alt="Mobile App Development" />
        </div>

        {/* RIGHT TEXT */}
        <div className="mobile-text">
          <h2>
            Build <span className="gradient-text">Mobile Apps</span> That Users Love
          </h2>

          <p>
            We design and develop high-performance mobile applications that are fast,
            intuitive, and scalable. From idea to deployment, we help you bring your
            app to life with modern technologies and user-focused design.
          </p>

          {/* MOBILE TECH STACK */}
          <div className="mobile-tech">

            <div className="tech-item">
              <i className="fab fa-react"></i>
              <span>React Native</span>
            </div>

            <div className="tech-item">
              <i className="fas fa-mobile-alt"></i>
              <span>Responsive UI</span>
            </div>

            <div className="tech-item">
              <i className="fas fa-database"></i>
              <span>Realtime Database</span>
            </div>

            <div className="tech-item">
              <i className="fas fa-cloud"></i>
              <span>Cloud Sync</span>
            </div>

            <div className="tech-item">
              <i className="fas fa-bolt"></i>
              <span>Fast Performance</span>
            </div>

          </div>

          <a href="#contact" className="btn-primary">
            <span>Start a Project</span>
            <i className="fas fa-arrow-right"></i>
          </a>

        </div>

      </div>

    </section>
  );
}

export default MobileSection;