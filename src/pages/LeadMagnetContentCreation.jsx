import LeadMagnetPage from "../components/LeadMagnetPage";
import logo from "../assets/memora logo.PNG";

// TODO: replace with your real links
const DOWNLOAD_URL = "https://your-storage-link.com/content-calendar-template.pdf";
const SELAR_URL = "https://selar.co/your-content-creation-book-link";

export default function LeadMagnetContentCreation() {
  return (
    <LeadMagnetPage
      slug="content-creation"
      bookTitle="Content Creation"
      eyebrow="Free Template"
      headline={
        <>
          A Free Content Calendar +{" "}
          <span className="lm-gradient-text">Caption Formulas</span> That Convert
        </>
      }
      subhead="Stop staring at a blank page. Get a ready-to-use content calendar and caption formulas to plan a full month of content in one sitting."
      benefits={[
        "A fill-in-the-blank monthly content calendar",
        "Caption formulas for engagement, sales & storytelling",
        "Works for Instagram, TikTok, LinkedIn & more",
      ]}
      mockupIcon="fa-solid fa-photo-film"
      mockupTag="Free Template"
      mockupTitle="Content Calendar Template"
      insideItems={[
        {
          icon: "fa-solid fa-calendar-days",
          title: "30-Day Calendar",
          description: "Plan a full month of content in under an hour.",
        },
        {
          icon: "fa-solid fa-comment-dots",
          title: "Caption Formulas",
          description: "Proven structures for hooks, stories & CTAs.",
        },
        {
          icon: "fa-solid fa-hashtag",
          title: "Content Pillars",
          description: "Never run out of ideas with a repeatable system.",
        },
        {
          icon: "fa-solid fa-chart-simple",
          title: "What to Post When",
          description: "A simple weekly rhythm that keeps you consistent.",
        },
      ]}
      ctaLabel="Send Me the Free Template"
      successTitle="Your template is on its way 🎉"
      successMessage="Check your inbox (and spam folder) for your free content calendar."
      downloadUrl={DOWNLOAD_URL}
      fullBookHeadline="Want the complete content creation playbook?"
      fullBookDescription="Content Creation gives you the full system — planning, writing, filming, and growing an audience — in one practical guide."
      selarUrl={SELAR_URL}
      brandName="Memora Smart Technologies"
      logoSrc={logo}
    />
  );
}
