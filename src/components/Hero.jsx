import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero image.png";

const services = [
  { icon: "fas fa-laptop-code", label: "Build Websites" },
  { icon: "fas fa-mobile-alt", label: "Build Mobile Apps" },
  { icon: "fas fa-chart-line", label: "Learn Data Analysis" },
  { icon: "fas fa-code", label: "Learn Web Development" },
  { icon: "fas fa-file-alt", label: "Create a CV in Mins", path: "/cv-builder" },
  { icon: "fas fa-robot", label: "AI Automation for Businesses" },
  { icon: "fas fa-calculator", label: "Learn Elementary Mathematics" },
  { icon: "fas fa-atom", label: "Learn Physics" },
  { icon: "fas fa-flask", label: "Learn Chemistry" },
  { icon: "fas fa-ellipsis-h", label: "More" },
];

function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
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
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 1000,
            system: `You are a helpful assistant for a tech company that offers web development, 
            mobile apps, data analysis, AI automation, CV creation, and tech education services. 
            When a user searches for something, respond briefly in 1-2 sentences about whether 
            the company can help with it and how. Keep it friendly and concise. 
            Do not use markdown or bullet points.`,
            messages: [{ role: "user", content: `User searched for: "${query}"` }],
          }),
        });
        const data = await response.json();
        const text = data.content?.[0]?.text;
        if (text) setAiResult(text);
      } catch (err) {
        console.error("AI Search error:", err);
        setAiResult("Error: " + err.message);
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

  const handleSelect = (service) => {
    setQuery("");
    setShowDropdown(false);
    setAiResult(null);
    if (service.path) navigate(service.path);
  };

  const handleCardClick = (service) => {
    if (service.path) navigate(service.path);
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

          {/* STATIC SERVICE CARDS */}
          {services.map((service, index) => (
            <div
              key={index}
              className={`service-card ${service.path ? "service-card--clickable" : ""}`}
              onClick={() => handleCardClick(service)}
            >
              <i className={service.icon}></i>
              <p>{service.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;