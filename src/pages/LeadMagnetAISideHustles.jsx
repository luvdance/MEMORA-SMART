import LeadMagnetPage from "../components/LeadMagnetPage";
import logo from "../assets/memora logo.PNG";

// TODO: replace with your real links
const DOWNLOAD_URL = "https://your-storage-link.com/ai-side-hustles-preview.pdf";
const SELAR_URL = "https://selar.co/your-ai-side-hustles-book-link";

export default function LeadMagnetAISideHustles() {
  return (
    <LeadMagnetPage
      slug="ai-side-hustles-nigeria"
      bookTitle="AI Side Hustles in Nigeria"
      eyebrow="Free Preview"
      headline={
        <>
          3 AI Side Hustles You Can{" "}
          <span className="lm-gradient-text">Start This Week</span>
        </>
      }
      subhead="Get a free preview of practical, low-cost ways to earn online with AI — no tech background needed, just your phone or laptop."
      benefits={[
        "Real side hustles people are already earning from",
        "No coding or design skills required to start",
        "Tools you can begin using today, most of them free",
      ]}
      mockupIcon="fa-solid fa-robot"
      mockupTag="Free Preview"
      mockupTitle="3 AI Side Hustles Preview"
      insideItems={[
        {
          icon: "fa-solid fa-pen-nib",
          title: "AI Writing Gigs",
          description: "Turn AI-assisted writing into paid client work.",
        },
        {
          icon: "fa-solid fa-image",
          title: "AI Content & Design",
          description: "Simple ways to sell AI-generated content and graphics.",
        },
        {
          icon: "fa-solid fa-bullhorn",
          title: "Where to Find Clients",
          description: "Platforms and communities to get your first gig.",
        },
        {
          icon: "fa-solid fa-wallet",
          title: "Getting Paid Locally",
          description: "How to receive payments as a Nigerian freelancer.",
        },
      ]}
      ctaLabel="Send Me the Free Preview"
      successTitle="Your preview is on its way 🎉"
      successMessage="Check your inbox (and spam folder) for your free AI side hustles preview."
      downloadUrl={DOWNLOAD_URL}
      fullBookHeadline="Want all 10 AI side hustles?"
      fullBookDescription="AI Side Hustles in Nigeria breaks down 10 practical ways to use AI to start earning online — with tools, steps, and where to find paying clients."
      selarUrl={SELAR_URL}
      brandName="Memora Smart Technologies"
      logoSrc={logo}
    />
  );
}
