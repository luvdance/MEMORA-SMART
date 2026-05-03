import { useEffect, useState } from "react";

function Projects() {
  const [activeTech, setActiveTech] = useState(null);

  const techData = [
    {
      icon: "fab fa-react",
      name: "React",
      desc: "React enables the development of fast, scalable, and highly interactive web applications, helping businesses deliver seamless user experiences, improve performance, and efficiently scale their digital products as they grow."
    },
    {
      icon: "fab fa-node-js",
      name: "Node.js",
      desc: "Node.js powers scalable backend systems using JavaScript."
    },
    {
      icon: "fas fa-fire",
      name: "Firebase",
      desc: "Firebase provides real-time database, authentication and hosting."
    },
    {
      icon: "fas fa-wind",
      name: "Tailwind",
      desc: "Tailwind CSS helps build modern UI quickly with utility classes."
    },
    {
      icon: "fab fa-bootstrap",
      name: "Bootstrap",
      desc: "Bootstrap enables responsive and mobile-first web design."
    },
    {
      icon: "fas fa-database",
      name: "MySQL",
      desc: "MySQL is a structured database for reliable data storage."
    },
    {
      icon: "fas fa-database",
      name: "PostgreSQL",
      desc: "PostgreSQL is an advanced open-source relational database."
    },
    {
      icon: "fas fa-server",
      name: "API Development",
      desc: "We build secure APIs to connect frontend and backend systems."
    },
    {
      icon: "fas fa-brain",
      name: "AI Integration",
      desc: "AI integration enables smart automation and intelligent systems."
    },
    {
      icon: "fas fa-cloud",
      name: "Cloud Services",
      desc: "Cloud platforms ensure scalability, speed, and reliability."
    },
    {
      icon: "fab fa-git-alt",
      name: "Git & GitHub",
      desc: "Version control tools for collaboration and code management."
    },
  ];

  useEffect(() => {
    const items = document.querySelectorAll(".tech-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((item, i) => {
              setTimeout(() => {
                item.classList.add("show");
              }, i * 100); // stagger effect 🔥
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector(".tech-stack");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="projects">

      <div className="projects-container">

        <h1>
          Build <span className="gradient-text">Web Projects</span> with <br />
          Modern Technologies
        </h1>

        <p>
          We leverage industry-leading tools to build fast, scalable, and
          high-performing applications tailored to your needs.
        </p>

        {/* TECH STACK */}
        <div className="tech-stack">

          {techData.map((tech, index) => (
            <div
              key={index}
              className="tech-item"
              onClick={() => setActiveTech(tech)}
            >
              <i className={tech.icon}></i>
              <span>{tech.name}</span>

              {/* TOOLTIP */}
              <div className="tech-tooltip">
                {tech.desc}
              </div>
            </div>
          ))}

        </div>

        {/* CTA */}
        <div className="projects-cta">
          <a href="#contact" className="btn-primary">
            <span>Contact Us</span>
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>

      </div>

      {/* MODAL */}
      {activeTech && (
        <div className="tech-modal" onClick={() => setActiveTech(null)}>
          <div
            className="tech-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{activeTech.name}</h3>
            <p>{activeTech.desc}</p>

            <button onClick={() => setActiveTech(null)}>
              Close
            </button>
          </div>
        </div>
      )}

    </section>
  );
}

export default Projects;