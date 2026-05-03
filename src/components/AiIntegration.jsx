import aiImage from "../assets/ai integration.png";

function AIIntegration() {
  return (
    <section className="ai-section">

      {/* TEXT CONTENT */}
      <div className="ai-text">
        <h2>
          Automate Workflows with <br />
          <span className="gradient-text">AI Intelligence</span>
        </h2>

        <p>
          Transform the way your business operates with intelligent automation.
          We integrate AI-powered systems that handle repetitive tasks,
          analyze data in real-time, and support smarter decision-making —
          allowing you to focus on growth, innovation, and strategy.
        </p>

        <a href="#" className="service-btn">
          Explore AI Solutions
        </a>
      </div>

      {/* WORKFLOW ICONS */}
      <div className="ai-workflows">

        <div className="workflow-item">
          <i className="fas fa-robot"></i>
          <span>Chatbots</span>
        </div>

        <div className="workflow-item">
          <i className="fas fa-cogs"></i>
          <span>Automation</span>
        </div>

        <div className="workflow-item">
          <i className="fas fa-chart-line"></i>
          <span>Analytics</span>
        </div>

        <div className="workflow-item">
          <i className="fas fa-database"></i>
          <span>Data Processing</span>
        </div>

        <div className="workflow-item">
          <i className="fas fa-brain"></i>
          <span>AI Models</span>
        </div>

      </div>

      {/* FULL WIDTH IMAGE */}
      <div className="ai-image">
        <img src={aiImage} alt="AI Workflow Automation" />
      </div>

    </section>
  );
}

export default AIIntegration;