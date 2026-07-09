import thumbPhoto from "../../assets/thumbnail.png";

export const SAMPLE_CV = {
  name: "Adaeze Okonkwo",
  jobTitle: "Senior Product Manager",
  email: "adaeze.okonkwo@email.com",
  phone: "+234 803 123 4567",
  address: "Lagos, Nigeria",
  linkedin: "linkedin.com/in/adaezeokonkwo",
  website: "adaezeokonkwo.com",
  github: "",
  summary: "Results-driven Product Manager with 6+ years leading cross-functional teams to deliver high-impact digital products. Increased user retention by 34% at a leading fintech startup.",
  objective: "Seeking to leverage data-driven product strategy and stakeholder leadership to drive growth at a high-scale technology company.",
  photo: thumbPhoto,
  experience: [
    {
      company: "Paystack",
      role: "Senior Product Manager",
      start: "Jan 2022",
      end: "",
      current: true,
      responsibilities:
        "- Led product strategy for payment infrastructure used by 60,000+ merchants\n- Increased checkout conversion rate by 22% through A/B testing\n- Managed a team of 5 engineers and 2 designers across 3 product lines\n- Launched 4 major features that contributed to 18% YoY revenue growth",
    },
    {
      company: "Flutterwave",
      role: "Product Manager",
      start: "Jun 2019",
      end: "Dec 2021",
      current: false,
      responsibilities:
        "- Owned the merchant onboarding flow, reducing time-to-first-transaction by 40%\n- Collaborated with engineering to ship 12 feature releases in 18 months\n- Conducted user research across 5 African markets to inform roadmap",
    },
  ],
  education: [
    {
      school: "University of Lagos",
      degree: "B.Sc.",
      field: "Computer Science",
      start: "2013",
      end: "2017",
    },
  ],
  skills: "Product Strategy, Agile/Scrum, SQL, Figma, A/B Testing, Stakeholder Management, Data Analysis, Roadmapping",
  languages: "English (Fluent), Igbo (Native), French (Basic)",
  hobbies: "Reading, Chess, Photography, Mentoring",
  certifications: [
    {
      name: "Certified Scrum Product Owner (CSPO)",
      issuer: "Scrum Alliance",
      issueDate: "Mar 2022",
      expiryDate: "",
      noExpiry: true,
      credentialId: "",
      credentialUrl: "",
    },
  ],
  achievements: [
    { title: "Product Leader of the Year", date: "2023", description: "Awarded for leading the highest-impact product launch company-wide." },
  ],
  volunteer: [],
  publications: [],
  references: [],
  dateOfBirth: "", placeOfBirth: "", stateOfOrigin: "", lga: "",
  nationality: "", religion: "", nin: "", gender: "", maritalStatus: "",
};

export const SAMPLE_FORMAT = {
  fontFamily: "'Helvetica Neue', Helvetica, 'Inter', sans-serif",
  nameFontSize: 30,
  bodyFontSize: 12,
  headingFontSize: 14,
  pagePadding: 28,
  lineHeight: 1.5,
  headingBold: true,
  headingItalic: false,
  headingUppercase: true,
  nameBold: true,
  nameItalic: false,
};

export const SAMPLE_SECTION_ORDER = [
  "summary", "experience", "education", "skills",
  "languages", "certifications", "achievements",
];

export const TEMPLATE_INFO = [
  { name: "Classic Pro", accent: "#6699FF", theme: { bg: "#ffffff", text: "#1a1a1a" } },
  { name: "Modern Edge", accent: "#9D00FF", theme: { bg: "#ffffff", text: "#1a1a1a" } },
  { name: "Executive Plus", accent: "#6699FF", theme: { bg: "#ffffff", text: "#1a1a1a", sidebar: "#1e293b" } },
  { name: "Minimal Clean", accent: "#16a34a", theme: { bg: "#ffffff", text: "#1a1a1a" } },
  { name: "Creative Side", accent: "#9D00FF", theme: { bg: "#ffffff", text: "#1a1a1a" } },
  { name: "Corporate Bold", accent: "#2563eb", theme: { bg: "#ffffff", text: "#1a1a1a", sidebar: "#0f1f3d" } },
  { name: "Traditional Profile", accent: "#0f172a", theme: { bg: "#ffffff", text: "#1a1a1a" }
 },
 { name: "Editorial Modern", accent: "#0f766e", theme: { bg: "#ffffff", text: "#1a1a1a" } },
{ name: "Modern Timeline", accent: "#7c3aed", theme: { bg: "#ffffff", text: "#1a1a1a" } },
{ name: "Compact Pro", accent: "#1e40af", theme: { bg: "#ffffff", text: "#1a1a1a" } },
{ name: "Bold Statement", accent: "#facc15", theme: { bg: "#ffffff", text: "#1a1a1a" } },
{ name: "Horizon", accent: "#0ea5e9", theme: { bg: "#ffffff", text: "#1a1a1a" } },
{ name: "Refined", accent: "#b45309", theme: { bg: "#ffffff", text: "#1a1a1a" } },
{ name: "Signature Edge", accent: "#d4a017", theme: { bg: "#ffffff", text: "#1a1a1a" } },
{ name: "Dark Geo", accent: "#f59e0b", theme: { bg: "#ffffff", text: "#1a1a1a" } },
];