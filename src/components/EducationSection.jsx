import eduImg from "../assets/education.png";

function EducationSection() {
  return (
    <section className="education-section">

      <div className="education-container">

        {/* TEXT SIDE */}
        <div className="education-text">
          <h2>
            Learn <span className="gradient-text">In-Demand Skills</span> with Ease
          </h2>

          <p>
            Our educational repository provides a wide range of certification
            courses designed to equip you with practical, real-world skills.
            Whether you're entering tech or strengthening your academic foundation,
            we make learning simple, structured, and effective.
          </p>

          {/* COURSE CATEGORIES */}
          <div className="education-list">

            <div className="edu-item">
              <i className="fas fa-laptop-code"></i>
              <span>Responsive Web Development</span>
            </div>

            <div className="edu-item">
              <i className="fas fa-chart-bar"></i>
              <span>Data Analysis</span>
            </div>

            <div className="edu-item">
              <i className="fas fa-database"></i>
              <span>Data Processing</span>
            </div>

            <div className="edu-item">
              <i className="fas fa-atom"></i>
              <span>Physics</span>
            </div>

            <div className="edu-item">
              <i className="fas fa-square-root-alt"></i>
              <span>Mathematics</span>
            </div>

            <div className="edu-item">
              <i className="fas fa-flask"></i>
              <span>Chemistry</span>
            </div>

          </div>

          <a href="#" className="btn-primary">
            <span>Start Learning</span>
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>

        {/* IMAGE SIDE */}
        <div className="education-img">
          <img src={eduImg} alt="Learning and Education" />
        </div>

      </div>

    </section>
  );
}

export default EducationSection;