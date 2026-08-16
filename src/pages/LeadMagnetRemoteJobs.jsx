import LeadMagnetPage from "../components/LeadMagnetPage";
import logo from "../assets/memora logo.PNG";

// TODO: replace with your real links
const DOWNLOAD_URL = "https://your-storage-link.com/remote-jobs-checklist.pdf";
const SELAR_URL = "https://selar.co/your-remote-jobs-book-link";

export default function LeadMagnetRemoteJobs() {
  return (
    <LeadMagnetPage
      slug="remote-jobs-guide"
      bookTitle="The Nigerian's Guide to Remote Jobs"
      eyebrow="Free Checklist"
      headline={
        <>
          7 Remote Job Platforms That{" "}
          <span className="lm-gradient-text">Actually Hire From Nigeria</span>
        </>
      }
      subhead="Get the free checklist of remote job sites, what they pay, and how to get noticed — without wasting weeks on applications that go nowhere."
      benefits={[
        "Platforms that genuinely accept Nigerian applicants",
        "What to fix on your CV before you apply",
        "Simple steps to land your first international interview",
      ]}
      mockupIcon="fa-solid fa-earth-africa"
      mockupTag="Free Checklist"
      mockupTitle="Remote Job Platforms Checklist"
      insideItems={[
        {
          icon: "fa-solid fa-list-check",
          title: "Vetted Platforms",
          description: "Where to actually look — no dead-end job boards.",
        },
        {
          icon: "fa-solid fa-file-lines",
          title: "CV Quick Fixes",
          description: "Small changes that get past first screening.",
        },
        {
          icon: "fa-solid fa-video",
          title: "Interview Readiness",
          description: "What international employers ask, and how to answer.",
        },
        {
          icon: "fa-solid fa-money-bill-wave",
          title: "Getting Paid",
          description: "How international payments work from Nigeria.",
        },
      ]}
      ctaLabel="Send Me the Free Checklist"
      successTitle="Your checklist is on its way 🎉"
      successMessage="Check your inbox (and spam folder) for your free remote job checklist."
      downloadUrl={DOWNLOAD_URL}
      fullBookHeadline="Ready to land your first remote job?"
      fullBookDescription="The Nigerian's Guide to Remote Jobs walks you through finding, applying for, and landing international remote jobs — from Nigeria, step by step."
      selarUrl={SELAR_URL}
      brandName="Memora Smart Technologies"
      logoSrc={logo}
    />
  );
}
