import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { startAcademyJourney } from "../academy/services/intent";
import heroImage from "../assets/hero image.png";

// Order matters: the first VISIBLE_SERVICES are what a visitor sees before
// pressing "More", so the most-used destinations come first.
const services = [
  { icon: "fas fa-graduation-cap", label: "Memora Academy", path: "/academy" },
  { icon: "fas fa-briefcase", label: "Find Checked Jobs", path: "/memotify" },
  // `course` sends the visitor into that course's enrolment, signing them in
  // first if needed, instead of dropping them on the Academy landing page.
  {
    icon: "fab fa-node-js",
    label: "Become a Backend Engineer",
    path: "/academy/enroll/backend-engineering",
    course: "backend-engineering",
  },
  {
    icon: "fab fa-react",
    label: "Learn React",
    path: "/academy/enroll/react",
    course: "react",
  },
  {
    icon: "fas fa-mobile-alt",
    label: "Build Mobile Apps",
    path: "/academy/enroll/mobile-development",
    course: "mobile-development",
  },
  {
    icon: "fas fa-database",
    label: "Learn Databases & SQL",
    path: "/academy/enroll/rdbms",
    course: "rdbms",
  },
  {
    icon: "fas fa-code",
    label: "Learn Responsive Web Development",
    path: "/academy/enroll/web-development",
    course: "web-development",
  },
  { icon: "fas fa-chart-line", label: "Learn Data Analysis", path: "/academy" },
  {
    icon: "fab fa-python",
    label: "Learn Python Programming",
    path: "/academy/enroll/python",
    course: "python",
  },
  { icon: "fas fa-file-alt", label: "Create a CV in Mins", path: "/cv-builder" },
  { icon: "fas fa-laptop-code", label: "Build Websites" },
  {
    icon: "fab fa-js",
    label: "Learn JavaScript (OOP)",
    path: "/academy/enroll/javascript",
    course: "javascript",
  },
  {
    icon: "fas fa-microchip",
    label: "Learn C++ Programming",
    path: "/academy/enroll/cpp",
    course: "cpp",
  },
  {
    icon: "fas fa-sitemap",
    label: "Learn Algorithms & Complexity",
    path: "/academy/enroll/algorithms",
    course: "algorithms",
  },
  {
    icon: "fas fa-brain",
    label: "Learn Machine Learning & AI",
    path: "/academy/enroll/machine-learning",
    course: "machine-learning",
  },
  {
    icon: "fas fa-pen-ruler",
    label: "Learn UI/UX Design",
    path: "/academy/enroll/uiux-design",
    course: "uiux-design",
  },
  {
    icon: "fas fa-pen-nib",
    label: "Learn Content Writing & Copywriting",
    path: "/academy/enroll/content-writing",
    course: "content-writing",
  },
  {
    icon: "fas fa-headset",
    label: "Become a Virtual Assistant",
    path: "/academy/enroll/virtual-assistant",
    course: "virtual-assistant",
  },
  {
    icon: "fas fa-diagram-project",
    label: "Learn Codebase Engineering",
    path: "/academy/enroll/codebase-engineering",
    course: "codebase-engineering",
  },
  {
    icon: "fas fa-network-wired",
    label: "Learn Computer Networking",
    path: "/academy/enroll/networking",
    course: "networking",
  },
  {
    icon: "fas fa-money-bill-trend-up",
    label: "Learn Forex Trading",
    path: "/academy/enroll/forex-trading",
    course: "forex-trading",
  },
  { icon: "fas fa-robot", label: "AI Automation for Businesses" },
  { icon: "fas fa-calculator", label: "Learn Elementary Mathematics", path: "/academy" },
  { icon: "fas fa-atom", label: "Learn Physics", path: "/academy" },
  { icon: "fas fa-flask", label: "Learn Chemistry", path: "/academy" },
  { icon: "fas fa-book", label: "Read & Buy E-books", path: "/library" },
];

// Seven cards and the More button fill two rows of four on a laptop and four
// rows of two on a phone. The search box still searches every service.
const VISIBLE_SERVICES = 7;

function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const filteredServices = services.filter((service) =>
    service.label.toLowerCase().includes(query.toLowerCase())
  );

  const hasLocalMatch = filteredServices.length > 0;

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || hasLocalMatch) {
      setAiResult(null);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setAiLoading(true);
      setAiResult(null);
      try {
        // The server holds the key and limits searches per visitor
        // (lib/cv/handlers.js site-search). An empty answer is normal.
        const response = await fetch("/api/cv/site-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const data = await response.json();
        const text = data.text;
        if (text) setAiResult(text);
      } catch (err) {
        console.error("AI Search error:", err);
        setAiResult(null);
      } finally {
        setAiLoading(false);
      }
    }, 600);

    return () => clearTimeout(debounceRef.current);
  }, [query, hasLocalMatch]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowDropdown(e.target.value.length > 0);
  };

  const open = (service) => {
    if (service.course) startAcademyJourney(navigate, user, service.course);
    else if (service.path) navigate(service.path);
  };

  const handleSelect = (service) => {
    setQuery("");
    setShowDropdown(false);
    setAiResult(null);
    open(service);
  };

  const handleCardClick = (service) => {
    open(service);
  };

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-container">
        {/* LEFT CONTENT */}
        <div className="hero-text">
          <h1>
            Building Smart <br />
            Digital Futures
          </h1>
          <p>
            We help businesses and individuals grow through modern web development,
            digital solutions, and practical tech education.
          </p>
          <div className="hero-buttons">
            <a href="#" className="btn-primary">
              <span>Click to Sign Up</span>
              <i className="fas fa-arrow-right"></i>
            </a>
            <a href="#" className="btn-secondary">Projects? Contact Us</a>
          </div>
        </div>

        {/* RIGHT SERVICE CARDS */}
        <div className="hero-services">
          <div className="service-search" ref={searchRef}>
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search services..."
              value={query}
              onChange={handleInputChange}
              onFocus={() => query.length > 0 && setShowDropdown(true)}
            />

            {/* DROPDOWN */}
            {showDropdown && (
              <div className="search-dropdown">
                {hasLocalMatch ? (
                  filteredServices.map((service, index) => (
                    <div
                      className="search-dropdown-item"
                      key={index}
                      onClick={() => handleSelect(service)}
                    >
                      <i className={service.icon}></i>
                      <span>{service.label}</span>
                      {service.path && (
                        <i className="fas fa-arrow-right" style={{ marginLeft: "auto", fontSize: "0.7rem", opacity: 0.5 }}></i>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="search-dropdown-ai">
                    {aiLoading ? (
                      <div className="search-dropdown-loading">
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Searching...</span>
                      </div>
                    ) : aiResult ? (
                      <div className="search-dropdown-ai-result">
                        <i className="fas fa-robot"></i>
                        <span>{aiResult}</span>
                      </div>
                    ) : (
                      <div className="search-dropdown-empty">
                        <i className="fas fa-search"></i>
                        <span>Looking up "{query}"...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="floating-search">
            <i className="fas fa-search"></i>
          </div>

          {/* SERVICE CARDS: the first few, then the rest behind More */}
          {(showAll ? services : services.slice(0, VISIBLE_SERVICES)).map((service) => (
            <div
              key={service.label}
              className={`service-card ${service.path ? "service-card--clickable" : ""}`}
              onClick={() => handleCardClick(service)}
            >
              <i className={service.icon}></i>
              <p>{service.label}</p>
            </div>
          ))}
          {services.length > VISIBLE_SERVICES && (
            <button
              type="button"
              className="service-card service-card--more"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
            >
              <i className={showAll ? "fas fa-chevron-up" : "fas fa-ellipsis-h"}></i>
              <p>{showAll ? "Show less" : `More (${services.length - VISIBLE_SERVICES})`}</p>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;