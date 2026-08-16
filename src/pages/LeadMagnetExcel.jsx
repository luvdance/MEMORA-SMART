import LeadMagnetPage from "../components/LeadMagnetPage";
import logo from "../assets/memora logo.PNG";

// TODO: replace with your real links
const DOWNLOAD_URL = "https://your-storage-link.com/excel-cheatsheet.pdf";
const SELAR_URL = "https://selar.co/your-excel-book-link";

export default function LeadMagnetExcel() {
  return (
    <LeadMagnetPage
      slug="excel-masterclass"
      bookTitle="Excel Master Class — Beginner to Pro"
      eyebrow="Free Cheat Sheet"
      headline={
        <>
          25 Excel Formulas That'll{" "}
          <span className="lm-gradient-text">Save You Hours</span> Every Week
        </>
      }
      subhead="Grab the free cheat sheet used by beginners and professionals to work faster in Excel — no fluff, just the formulas you'll actually use."
      benefits={[
        "The exact formulas for reports, budgets & data cleanup",
        "Quick-reference layout you can keep open while you work",
        "Written for total beginners — no jargon",
      ]}
      mockupIcon="fa-solid fa-table-cells"
      mockupTag="Free Cheat Sheet"
      mockupTitle="25 Excel Formulas Cheat Sheet"
      insideItems={[
        {
          icon: "fa-solid fa-magnifying-glass",
          title: "Lookup Formulas",
          description: "VLOOKUP, XLOOKUP, INDEX/MATCH explained simply.",
        },
        {
          icon: "fa-solid fa-calculator",
          title: "Everyday Calculations",
          description: "SUMIFS, COUNTIFS and formulas you'll use daily.",
        },
        {
          icon: "fa-solid fa-broom",
          title: "Data Cleanup",
          description: "Fix messy spreadsheets in minutes, not hours.",
        },
        {
          icon: "fa-solid fa-chart-line",
          title: "Quick Reference",
          description: "One page you can screenshot and keep handy.",
        },
      ]}
      ctaLabel="Send Me the Cheat Sheet"
      successTitle="Your cheat sheet is on its way 🎉"
      successMessage="Check your inbox (and spam folder) for your free Excel cheat sheet."
      downloadUrl={DOWNLOAD_URL}
      fullBookHeadline="Want to go from beginner to pro in Excel?"
      fullBookDescription="Excel Master Class — Beginner to Pro takes you from the basics to advanced formulas, dashboards, and automation, step by step."
      selarUrl={SELAR_URL}
      brandName="Memora Smart Technologies"
      logoSrc={logo}
    />
  );
}
