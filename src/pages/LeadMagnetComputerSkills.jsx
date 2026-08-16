import LeadMagnetPage from "../components/LeadMagnetPage";
import logo from "../assets/memora logo.PNG";

// TODO: replace with your real links
const DOWNLOAD_URL = "https://your-storage-link.com/digital-skills-starter-kit.pdf";
const SELAR_URL = "https://selar.co/your-computer-skills-book-link";

export default function LeadMagnetComputerSkills() {
  return (
    <LeadMagnetPage
      slug="computer-digital-skills"
      bookTitle="Complete Computer and Digital Skills Handbook"
      eyebrow="Free Starter Kit"
      headline={
        <>
          The Digital Skills{" "}
          <span className="lm-gradient-text">Starter Kit</span> Every Beginner Needs
        </>
      }
      subhead="Get the free cheat sheet of essential computer shortcuts, terms, and skills — perfect if you're just getting comfortable with a computer."
      benefits={[
        "Keyboard shortcuts that instantly save you time",
        "Plain-English glossary of common computer terms",
        "A simple roadmap of what to learn first",
      ]}
      mockupIcon="fa-solid fa-computer"
      mockupTag="Free Starter Kit"
      mockupTitle="Digital Skills Starter Kit"
      insideItems={[
        {
          icon: "fa-solid fa-keyboard",
          title: "Essential Shortcuts",
          description: "The shortcuts that make you look like a pro.",
        },
        {
          icon: "fa-solid fa-book-open",
          title: "Plain-English Glossary",
          description: "Computer terms explained without the jargon.",
        },
        {
          icon: "fa-solid fa-folder-tree",
          title: "File Basics",
          description: "Organize files and folders like a professional.",
        },
        {
          icon: "fa-solid fa-route",
          title: "What to Learn First",
          description: "A simple roadmap so you're never stuck guessing.",
        },
      ]}
      ctaLabel="Send Me the Free Starter Kit"
      successTitle="Your starter kit is on its way 🎉"
      successMessage="Check your inbox (and spam folder) for your free digital skills starter kit."
      downloadUrl={DOWNLOAD_URL}
      fullBookHeadline="Ready to become fully computer confident?"
      fullBookDescription="The Complete Computer and Digital Skills Handbook takes you from total beginner to confident, capable computer user — step by step."
      selarUrl={SELAR_URL}
      brandName="Memora Smart Technologies"
      logoSrc={logo}
    />
  );
}
