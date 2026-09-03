import React from 'react';
import './PilotLandingPage.css';
import landingPhoto from '../assets/landing image.jpg';

export default function PilotLandingPage({ onGetStarted }) {
  return (
    <div className="pf-landing">
      {/* Navigation Header */}
      <header className="pf-landing__nav">
        <div className="pf-landing__nav-container">
          <div className="pf-header__badge">
            <div className="pf-brand-mark">
              <i className="fa-solid fa-file-circle-check" />
            </div>
            <div>
              <strong>ProjectPilot</strong>
              <span>by Memora Smart</span>
            </div>
          </div>

          <nav className="pf-landing__menu">
            <a href="#features">Features</a>
            <a href="#workflow">How It Works</a>
            <a href="#testimonials">Testimonials</a>
          </nav>

          <button className="pf-primary-button" onClick={onGetStarted}>
            Launch App
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pf-landing__hero">
        <div className="pf-landing__hero-content">
          <div className="pf-eyebrow">
            <span className="pf-eyebrow__icon">
              <i className="fa-solid fa-wand-magic-sparkles" />
            </span>
            AI-POWERED ACADEMIC FORMATTING
          </div>

          <h1>
            Transform Messy Papers Into
            <span> Flawless Academic Works</span>
          </h1>

          <p>
            ProjectPilot scans, structures, and formats your academic research, 
            dissertations, and projects automatically. Say goodbye to manual styling 
            headaches and focus on what matters most—your research.
          </p>

          <div className="pf-landing__hero-actions">
            <button className="pf-primary-button pf-primary-button--lg" onClick={onGetStarted}>
              <i className="fa-solid fa-cloud-arrow-up" />
              Upload Document Now
            </button>
            <a href="#workflow" className="pf-secondary-button">
              See How It Works
            </a>
          </div>

          <div className="pf-landing__trust-badge">
            <i className="fa-solid fa-shield-halved" />
            <span>Trusted by thousands of researchers & students worldwide</span>
          </div>
        </div>

        <div className="pf-landing__hero-preview">
          <div className="pf-landing__preview-card">
            <img 
              src={landingPhoto} 
              alt="ProjectPilot Dashboard Preview" 
              className="pf-hero-image" 
            />
          </div>
        </div>
      </section>

      {/* Interactive Feature Grid */}
      <section id="features" className="pf-landing__features">
        <div className="pf-landing__section-header">
          <span className="pf-eyebrow">SMART AUTOMATION</span>
          <h2>Designed for Seamless Formatting</h2>
          <p>Engineered to handle complex document elements with precision</p>
        </div>

        <div className="pf-landing__feature-grid">
          <div className="pf-capabilities">
            <div className="pf-capability__icon">
              <i className="fa-solid fa-book-open" />
            </div>
            <h3>Chapter & Heading Detection</h3>
            <p>Automatically organizes chapters, primary headings, and sub-sections accurately.</p>
          </div>

          <div className="pf-capabilities">
            <div className="pf-capability__icon">
              <i className="fa-solid fa-table" />
            </div>
            <h3>Tables & Captions</h3>
            <p>Identifies and standardizes academic table formats, figure captions, and plates.</p>
          </div>

          <div className="pf-capabilities">
            <div className="pf-capability__icon">
              <i className="fa-solid fa-quote-left" />
            </div>
            <h3>Reference Structuring</h3>
            <p>Detects citation lists and formats references according to academic guidelines.</p>
          </div>

          <div className="pf-capabilities">
            <div className="pf-capability__icon">
              <i className="fa-solid fa-wand-magic-sparkles" />
            </div>
            <h3>One-Click Styling</h3>
            <p>Applies clean typography, correct line spacing, and margin rules instantly.</p>
          </div>
        </div>
      </section>

      {/* Workflow Step Showcase */}
      <section id="workflow" className="pf-landing__workflow-section">
        <div className="pf-landing__section-header">
          <span className="pf-eyebrow">4 SIMPLE STEPS</span>
          <h2>How ProjectPilot Works</h2>
        </div>

        <div className="pf-workflow">
          <div className="pf-workflow__line" />

          <div className="pf-workflow-step is-active">
            <div className="pf-workflow-step__number">
              <i className="fa-solid fa-cloud-arrow-up" />
            </div>
            <div>
              <strong>1. Upload</strong>
              <span>Drop your .DOCX paper</span>
            </div>
          </div>

          <div className="pf-workflow-step is-active">
            <div className="pf-workflow-step__number">
              <i className="fa-solid fa-brain" />
            </div>
            <div>
              <strong>2. Analyze</strong>
              <span>AI scans layout structure</span>
            </div>
          </div>

          <div className="pf-workflow-step is-active">
            <div className="pf-workflow-step__number">
              <i className="fa-solid fa-layer-group" />
            </div>
            <div>
              <strong>3. Organize</strong>
              <span>Apply academic styling</span>
            </div>
          </div>

          <div className="pf-workflow-step is-active">
            <div className="pf-workflow-step__number">
              <i className="fa-solid fa-circle-check" />
            </div>
            <div>
              <strong>4. Finalize</strong>
              <span>Download polished file</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase Section */}
      <section className="pf-landing__showcase">
        <div className="pf-landing__showcase-card">
          <div className="pf-landing__showcase-text">
            <h2>Before and After, Powered by AI</h2>
            <p>
              Turn disorganized drafts with irregular spacing and broken headers 
              into publication-ready academic documents within seconds.
            </p>
            <button className="pf-primary-button" onClick={onGetStarted}>
              Try It Now
            </button>
          </div>
          <div className="pf-landing__showcase-visual">
            {/* Asset Placeholder for Before/After Comparison */}
            <div className="pf-asset-placeholder">
              <i className="fa-solid fa-file-pdf" />
              <span>[ Before / After Formatting Comparison Image Asset ]</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="pf-landing__cta">
        <h2>Ready to format your paper?</h2>
        <p>Join students and researchers using Memora Smart to save hours of manual editing.</p>
        <button className="pf-primary-button pf-primary-button--lg" onClick={onGetStarted}>
          Get Started For Free
          <i className="fa-solid fa-arrow-right" />
        </button>
      </section>

      {/* Footer */}
      <footer className="pf-landing__footer">
        <p>© 2026 ProjectPilot by Memora Smart. All rights reserved.</p>
      </footer>
    </div>
  );
}