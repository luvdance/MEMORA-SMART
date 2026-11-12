/**
 * VIRTUAL ASSISTANT · MODULE 2 · ESSENTIAL DIGITAL SKILLS
 *
 * Curriculum 2.1 – 2.9 and the practical 2.P. Computers, Windows and macOS,
 * files and folders, shortcuts and productivity, browsing, downloading and
 * sharing, cloud storage and sync, troubleshooting, and online safety; then a
 * filing system for a fictional company, shared with the right permissions.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "va-s2-digital";

const FOLDERS = [
  "01_Clients",
  "02_Finance/Invoices",
  "02_Finance/Receipts",
  "03_Marketing",
  "04_HR",
  "05_Admin/Contracts",
];

const NAMING_BRIEF = `You manage the shared drive of **Lumen Events Ltd**, an event-planning company. The owner has dumped eight files from her Downloads folder into the drive. Move each one into the right folder and rename it with the company's naming convention:

**YYYY-MM-DD_Topic_DocType_vNN.ext**

- **YYYY-MM-DD**: the document's own date (not today's date).
- **Topic**: the client, person or subject, with no spaces (BelloFoods, AdaOkoro, Q2Campaign).
- **DocType**: one word: Invoice, Receipt, Contract, Brochure, Payslip, Proposal, Offer.
- **vNN**: the version, two digits: v01, v02.
- **.ext**: keep the file's extension.

The folders are: ${FOLDERS.join(", ")}. Client proposals go in 01_Clients; staff documents (payslips, offer letters) go in 04_HR; signed agreements with suppliers and venues go in 05_Admin/Contracts.`;

const SYSTEM_BRIEF = `**Kaduna Fresh Farms** is a fictional agribusiness: it grows and sells vegetables to supermarkets and restaurants. It has a founder (Mr Ibrahim Danjuma), an accountant (external, Mrs Okeke), a sales manager (Ruth), two farm supervisors and you, the VA.

Its documents today are scattered across WhatsApp and three laptops: supermarket contracts, delivery notes, invoices, receipts, staff contracts and payslips, price lists, photos for social media, farm reports and licences.

Design its shared drive in Google Drive:

1. A folder structure: **5 to 8 numbered top-level folders** (01_, 02_ …) with sub-folders, no deeper than 3 levels.
2. A **naming convention**, with one example file name.
3. **Sharing**: who gets which folder and at what permission (Viewer, Commenter or Editor). Staff files are private to the founder and you. The accountant needs to see finance documents but not change them. The price list is published on the website for anyone with the link.
4. **Three rules** everyone follows.`;

const SYSTEM_DOC = `# Kaduna Fresh Farms: shared drive design

## Folder structure

[Nested bullets: numbered top-level folders, sub-folders indented under them.]

## Naming convention

- Pattern:
- Example:

## Sharing

| Folder | Shared with | Permission |
|---|---|---|
| | | |

## Rules

[Three rules everyone follows.]
`;

const SYSTEM_DONE = `# Kaduna Fresh Farms: shared drive design

## Folder structure

- 01_Customers
  - Supermarkets
  - Restaurants
- 02_Sales
  - Price_Lists
  - Delivery_Notes
- 03_Finance
  - Invoices
  - Receipts
  - Bank_Statements
- 04_Operations
  - Farm_Reports
  - Licences
- 05_Marketing
  - Photos
  - Social_Media
- 06_HR_Private
  - Staff_Contracts
  - Payslips

## Naming convention

- Pattern: YYYY-MM-DD_Topic_DocType_vNN.ext
- Example: 2026-04-02_ShopRiteIkeja_Invoice_v01.pdf

## Sharing

| Folder | Shared with | Permission |
|---|---|---|
| 01_Customers | Ruth (sales manager) | Editor |
| 02_Sales/Price_Lists | Anyone with the link | Viewer |
| 03_Finance | Mrs Okeke (accountant) | Viewer |
| 04_Operations | Farm supervisors | Editor |
| 05_Marketing | Ruth (sales manager) | Commenter |
| 06_HR_Private | Mr Danjuma and the VA only | Editor |

## Rules

- Save every file in the shared drive, never on a personal laptop or in WhatsApp only.
- Name every file with the convention before saving it.
- Ask the VA before creating a new top-level folder.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 2.1 – 2.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l7-computers",
    moduleId: "va-m2-digital",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1", "2.2"],
    title: "Computers, Windows and macOS",
    subtitle: "Hardware, software, the operating system, and getting around Windows and Mac",
    estimatedMinutes: 40,
    intro:
      "Your computer is your office. Clients will use Windows or Mac and expect you to find your way around both, and to fix small problems without calling for help.",

    atoms: [
      {
        id: "a-va-hardware-software",
        title: "Hardware, software and what a VA needs",
        explain:
          "Hardware is the physical equipment: the processor (CPU), which does the computing; memory (RAM), which holds what is open right now (more RAM means more tabs and apps open without slowing down); storage (an SSD or older hard disk), which keeps files when the computer is off; and input and output devices such as the keyboard, mouse, screen, webcam, microphone and headset. Software is the programs: the operating system, which runs the computer, and applications (apps) such as a browser, Word or Zoom, which you use to do work. For VA work, a laptop with at least 8 GB of RAM and an SSD, a webcam, a headset with a microphone (for clear calls), a reliable internet connection and backup power are the practical minimum. A second screen makes inbox and calendar work much faster.",
        table: {
          caption: "The parts, in plain words.",
          headers: ["Part", "What it does", "What it means for you"],
          rows: [
            ["CPU (processor)", "Does the calculations", "A faster CPU runs heavy apps smoothly"],
            ["RAM (memory)", "Holds what is open now", "8 GB or more for many tabs, Zoom and Excel at once"],
            ["Storage (SSD)", "Keeps files when off", "An SSD starts and opens files much faster than a hard disk"],
            ["Operating system", "Runs the computer and apps", "Windows or macOS: learn both"],
            ["Applications", "Do the work", "Browser, Office or Workspace, Zoom, Slack"],
          ],
        },
      },
      {
        id: "a-va-os",
        title: "The operating system: Windows and macOS side by side",
        explain:
          "The operating system (OS) manages the computer: it starts apps, stores files, connects to the internet and controls settings. Most business clients use Microsoft Windows; many creative and startup clients use Apple's macOS. The ideas are the same; the names and keys differ. The biggest difference in daily use is the main shortcut key: Ctrl on Windows, Cmd (⌘) on a Mac, so Ctrl+C becomes Cmd+C. Learn the equivalent names below, because client instructions will use their system's words.",
        table: {
          caption: "The same job on Windows and on a Mac.",
          headers: ["Job", "Windows", "macOS"],
          rows: [
            ["Browse files and folders", "File Explorer", "Finder"],
            ["Search for an app or file", "Start menu search (Windows key)", "Spotlight (Cmd+Space)"],
            ["Change settings", "Settings", "System Settings"],
            ["See what is slowing the computer", "Task Manager (Ctrl+Shift+Esc)", "Activity Monitor"],
            ["Force a frozen app to close", "Task Manager, then End task", "Force Quit (Cmd+Option+Esc)"],
            ["Deleted files go to", "Recycle Bin", "Bin (Trash)"],
            ["Screenshot of part of the screen", "Windows+Shift+S", "Cmd+Shift+4"],
            ["Two windows side by side", "Windows+Left or Right arrow (Snap)", "Hover the green button, choose a tile option"],
            ["Uninstall an app", "Settings > Apps", "Drag it from Applications to the Bin"],
          ],
        },
      },
      {
        id: "a-va-os-habits",
        title: "Everyday operating system habits",
        explain:
          "A few habits keep your computer fast and safe. Install updates when prompted (restart at the end of the day if needed): updates fix security holes. Install apps only from official sources (the Microsoft Store, the Mac App Store or the maker's own website). Restart the computer at least once a week; it clears memory and finishes updates. Keep the desktop clean and save work in proper folders (next lesson). Use separate user accounts or browser profiles for personal and client work. Know how to check your storage space (Settings > System > Storage on Windows; System Settings > General > Storage on a Mac), because a nearly full disk makes everything slow.",
        mistake:
          "Ignoring update notifications for months. Outdated systems are the easiest for attackers, and a client who learns their data was exposed through your unpatched laptop will not hire you again.",
      },
      {
        id: "a-va-os-desk",
        title: "Where do you do this on Windows and on a Mac?",
        explain:
          "A client says \"open Task Manager\"; another says \"check Activity Monitor\". They mean the same thing. For each job, choose where you do it on Windows and where on a Mac.",
        deskLab: {
          app: "tasks",
          title: "Windows and Mac: the same job, two names",
          task: "For each job, choose the Windows way and the Mac way.",
          fields: [
            { key: "win", label: "Windows", type: "select", options: ["File Explorer", "Start menu search", "Settings", "Task Manager", "Windows+Shift+S", "Windows+Left or Right arrow", "Recycle Bin"] },
            { key: "mac", label: "Mac", type: "select", options: ["Finder", "Spotlight (Cmd+Space)", "System Settings", "Activity Monitor or Force Quit", "Cmd+Shift+4", "Green button tile options", "Bin (Trash)"] },
          ],
          items: [
            { id: "o1", title: "Find the client's report you saved yesterday", expect: { win: "File Explorer", mac: "Finder" }, why: "File Explorer and Finder are the file browsers." },
            { id: "o2", title: "Open Zoom quickly by typing its name", expect: { win: "Start menu search", mac: "Spotlight (Cmd+Space)" }, why: "Search launches any app or file in seconds." },
            { id: "o3", title: "Chrome has frozen and will not close", expect: { win: "Task Manager", mac: "Activity Monitor or Force Quit" }, why: "Task Manager (End task) on Windows; Force Quit or Activity Monitor on a Mac." },
            { id: "o4", title: "Capture an error message to send to IT", expect: { win: "Windows+Shift+S", mac: "Cmd+Shift+4" }, why: "Both let you drag a box around part of the screen." },
            { id: "o5", title: "Put the inbox and calendar side by side", expect: { win: "Windows+Left or Right arrow", mac: "Green button tile options" }, why: "Snap on Windows; the green button's tile options on a Mac." },
            { id: "o6", title: "Recover a file you deleted by mistake", expect: { win: "Recycle Bin", mac: "Bin (Trash)" }, why: "Deleted files wait in the Recycle Bin or Bin until it is emptied." },
            { id: "o7", title: "Connect to a new Wi-Fi network and change the display brightness", expect: { win: "Settings", mac: "System Settings" }, why: "Both live in the system settings app." },
          ],
          solution: {
            o1: { win: "File Explorer", mac: "Finder" },
            o2: { win: "Start menu search", mac: "Spotlight (Cmd+Space)" },
            o3: { win: "Task Manager", mac: "Activity Monitor or Force Quit" },
            o4: { win: "Windows+Shift+S", mac: "Cmd+Shift+4" },
            o5: { win: "Windows+Left or Right arrow", mac: "Green button tile options" },
            o6: { win: "Recycle Bin", mac: "Bin (Trash)" },
            o7: { win: "Settings", mac: "System Settings" },
          },
          hint: "Use the table in the previous atom: each row is one job with its Windows and Mac names.",
          successMessage: "Now a client on either system can give you instructions in their own words.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 2.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l8-files",
    moduleId: "va-m2-digital",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.3"],
    title: "File and Folder Management",
    subtitle: "File types, folder structures and naming conventions that let anyone find anything",
    estimatedMinutes: 45,
    intro:
      "\"Where is that contract?\" should take you five seconds to answer. Good file management is invisible when it works and very expensive when it does not.",

    atoms: [
      {
        id: "a-va-files-basics",
        title: "Files, folders, extensions and the basic operations",
        explain:
          "A file is one document, image or video; a folder holds files and other folders. The extension, the letters after the last dot, tells you the type of file and which app opens it. In File Explorer or Finder you create a folder (right-click > New folder; or Ctrl+Shift+N on Windows, Cmd+Shift+N in Finder), rename (select and press F2 on Windows, Enter on a Mac), move (drag, or cut and paste), copy (copy and paste), and delete (Delete key; files go to the Recycle Bin or Bin). Sort a folder by name, date or type by clicking the column headers. Compress several files into one .zip to send them together (right-click > Compress), and extract a .zip before working on its files.",
        table: {
          caption: "Extensions you will meet every week.",
          headers: ["Extension", "Type", "Opens in"],
          rows: [
            [".docx", "Word document", "Word, Google Docs"],
            [".xlsx / .csv", "Spreadsheet / plain data table", "Excel, Google Sheets"],
            [".pptx", "Presentation", "PowerPoint, Google Slides"],
            [".pdf", "Fixed-layout document for sharing and printing", "Any browser, Acrobat"],
            [".jpg / .png", "Image (photo / graphic with sharp edges or transparency)", "Any image viewer"],
            [".mp4", "Video", "Any video player"],
            [".zip", "Compressed bundle of files", "Extract first"],
          ],
        },
      },
      {
        id: "a-va-folder-structure",
        title: "Designing a folder structure",
        explain:
          "A good folder structure mirrors how the business works. Start with five to eight top-level folders by function (Clients, Finance, Marketing, HR, Admin) or by client if you serve several. Put numbers in front (01_Clients, 02_Finance) so the folders stay in a fixed, logical order instead of alphabetical. Inside, divide by type or by year (02_Finance/Invoices/2026). Keep it shallow: three levels is usually enough, because every extra level is another click and another place to lose things. Never create folders called Misc, Stuff, New folder or Old: they become dumping grounds. Write the structure down so the whole team uses it.",
        example: "01_Clients/\n   BelloFoods/\n   AdaOkoroDesign/\n02_Finance/\n   Invoices/\n   Receipts/\n03_Marketing/\n04_HR/\n05_Admin/\n   Contracts/",
      },
      {
        id: "a-va-naming",
        title: "File naming conventions",
        explain:
          "A naming convention is a rule for naming every file the same way, so files sort correctly and can be found by search. A widely used pattern is YYYY-MM-DD_Topic_DocType_vNN.ext, for example 2026-03-14_BelloFoods_Invoice_v01.pdf. The date comes first, written year-month-day, because that order sorts chronologically (14-03-2026 would sort by day of the month). The topic is the client or subject. The document type says what it is. The version number (v01, v02) replaces names like \"final\", \"final2\" and \"final_REAL\". Avoid spaces in names that will be shared as links or uploaded to systems (use underscores or hyphens), and never use characters that operating systems reject: / \\ : * ? \" < > |.",
        samples: [
          { label: "Impossible to sort or find", tone: "bad", text: "invoice.pdf\nInvoice final.pdf\ninvoice FINAL (2).pdf\nbello march.pdf" },
          { label: "Sorts by date and explains itself", tone: "good", text: "2026-03-01_BelloFoods_Invoice_v01.pdf\n2026-03-14_BelloFoods_Invoice_v01.pdf\n2026-03-14_BelloFoods_Invoice_v02.pdf" },
        ],
      },
      {
        id: "a-va-files-desk",
        title: "Cleaning up a client's drive",
        explain:
          "Here are eight files dumped in Lumen Events' shared drive. Move each into the right folder and rename it with the convention. Type each new name exactly: date first (YYYY-MM-DD), then the topic with no spaces, the document type, the version and the extension, separated by underscores.",
        deskLab: {
          app: "files",
          title: "Lumen Events Ltd · Shared drive · Unsorted",
          task: "For each file, choose its folder and type its new name in the format YYYY-MM-DD_Topic_DocType_vNN.ext.",
          brief: NAMING_BRIEF,
          briefTitle: "The company's filing rules",
          fields: [
            { key: "folder", label: "Folder", type: "select", options: FOLDERS },
            { key: "name", label: "New name", type: "text", placeholder: "2026-03-14_Topic_DocType_v01.pdf", wide: true },
          ],
          items: [
            { id: "f1", title: "invoice bello.pdf", meta: "Invoice INV-207 to client Bello Foods · dated 14 March 2026 · first version", expect: { folder: "02_Finance/Invoices" }, check: String.raw`return re('^2026-03-14_bello-?foods_invoice_v01\\.pdf$', val.name.trim());`, hint: "Date 2026-03-14, topic BelloFoods, type Invoice, v01, keep .pdf.", why: "Invoices to clients go in Finance/Invoices. Name: 2026-03-14_BelloFoods_Invoice_v01.pdf." },
            { id: "f2", title: "Scan_0042.jpg", meta: "Receipt for printing brochures from Rapid Print · dated 2 March 2026 · first version", expect: { folder: "02_Finance/Receipts" }, check: String.raw`return re('^2026-03-02_rapid-?print_receipt_v01\\.jpg$', val.name.trim());`, hint: "The topic is the supplier, RapidPrint; keep the .jpg extension.", why: "Receipts for money spent go in Finance/Receipts." },
            { id: "f3", title: "venue agreement SIGNED.pdf", meta: "Signed hire agreement with Eko Hall (venue) · dated 20 February 2026 · first version", expect: { folder: "05_Admin/Contracts" }, check: String.raw`return re('^2026-02-20_eko-?hall_contract_v01\\.pdf$', val.name.trim());`, hint: "A signed agreement with a venue is a Contract.", why: "Signed supplier and venue agreements go in Admin/Contracts." },
            { id: "f4", title: "Proposal Ada Okoro wedding FINAL final.docx", meta: "Wedding proposal for client Ada Okoro · dated 9 March 2026 · this is the second version", expect: { folder: "01_Clients" }, check: String.raw`return re('^2026-03-09_ada-?okoro_proposal_v02\\.docx$', val.name.trim());`, hint: "\"FINAL final\" is version 2: v02.", why: "Client proposals go in Clients. \"FINAL final\" becomes v02." },
            { id: "f5", title: "brochure-new.pdf", meta: "Spring events brochure, topic Spring2026 · dated 1 March 2026 · first version", expect: { folder: "03_Marketing" }, check: String.raw`return re('^2026-03-01_spring-?2026_brochure_v01\\.pdf$', val.name.trim());`, hint: "Topic Spring2026, type Brochure.", why: "Brochures are marketing material." },
            { id: "f6", title: "payslip feb tunde.pdf", meta: "February payslip for staff member Tunde Bakare · dated 28 February 2026 · first version", expect: { folder: "04_HR" }, check: String.raw`return re('^2026-02-28_tunde-?bakare_payslip_v01\\.pdf$', val.name.trim());`, hint: "Staff documents go in HR; the topic is the person, TundeBakare.", why: "Payslips are confidential staff documents: HR." },
            { id: "f7", title: "Offer letter.docx", meta: "Job offer to new planner Kemi Adisa · dated 5 March 2026 · first version", expect: { folder: "04_HR" }, check: String.raw`return re('^2026-03-05_kemi-?adisa_offer_v01\\.docx$', val.name.trim());`, hint: "Offer letters are staff documents; DocType is Offer.", why: "An offer letter to a new staff member belongs in HR." },
            { id: "f8", title: "INV-209.pdf", meta: "Invoice INV-209 to client Ada Okoro · dated 16 March 2026 · first version", expect: { folder: "02_Finance/Invoices" }, check: String.raw`return re('^2026-03-16_ada-?okoro_invoice_v01\\.pdf$', val.name.trim());`, hint: "Same pattern as the first invoice, for Ada Okoro.", why: "Client invoices go in Finance/Invoices, named by date and client." },
          ],
          solution: {
            f1: { folder: "02_Finance/Invoices", name: "2026-03-14_BelloFoods_Invoice_v01.pdf" },
            f2: { folder: "02_Finance/Receipts", name: "2026-03-02_RapidPrint_Receipt_v01.jpg" },
            f3: { folder: "05_Admin/Contracts", name: "2026-02-20_EkoHall_Contract_v01.pdf" },
            f4: { folder: "01_Clients", name: "2026-03-09_AdaOkoro_Proposal_v02.docx" },
            f5: { folder: "03_Marketing", name: "2026-03-01_Spring2026_Brochure_v01.pdf" },
            f6: { folder: "04_HR", name: "2026-02-28_TundeBakare_Payslip_v01.pdf" },
            f7: { folder: "04_HR", name: "2026-03-05_KemiAdisa_Offer_v01.docx" },
            f8: { folder: "02_Finance/Invoices", name: "2026-03-16_AdaOkoro_Invoice_v01.pdf" },
          },
          hint: "Build each name in order: the date from the details (year-month-day), an underscore, the topic with no spaces, underscore, the type, underscore, the version, then the original extension.",
          successMessage: "Eight files that anyone in the company can now find, sorted by date, with no more \"FINAL final\".",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 2.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l9-shortcuts",
    moduleId: "va-m2-digital",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.4"],
    title: "Keyboard Shortcuts and Productivity Techniques",
    subtitle: "The shortcuts professionals use without thinking, and techniques that save hours",
    estimatedMinutes: 35,
    intro:
      "A VA who uses shortcuts and templates does the same work in half the time. Over a year, that is weeks of your life, or weeks of extra paid work.",

    atoms: [
      {
        id: "a-va-shortcuts-core",
        title: "The shortcuts that work almost everywhere",
        explain:
          "These shortcuts work in nearly every app on Windows (with Ctrl) and on a Mac (with Cmd). Learn the first eight this week; you will use them hundreds of times a day.",
        table: {
          caption: "Universal shortcuts.",
          headers: ["Action", "Windows", "Mac"],
          rows: [
            ["Copy / Cut / Paste", "Ctrl+C / Ctrl+X / Ctrl+V", "Cmd+C / Cmd+X / Cmd+V"],
            ["Undo / Redo", "Ctrl+Z / Ctrl+Y", "Cmd+Z / Cmd+Shift+Z"],
            ["Select all", "Ctrl+A", "Cmd+A"],
            ["Find on the page or in a document", "Ctrl+F", "Cmd+F"],
            ["Save / Print", "Ctrl+S / Ctrl+P", "Cmd+S / Cmd+P"],
            ["Paste without formatting", "Ctrl+Shift+V", "Cmd+Shift+Option+V"],
            ["Switch between open apps", "Alt+Tab", "Cmd+Tab"],
            ["Lock the screen", "Windows+L", "Ctrl+Cmd+Q"],
            ["New tab / Close tab", "Ctrl+T / Ctrl+W", "Cmd+T / Cmd+W"],
            ["Reopen the tab you just closed", "Ctrl+Shift+T", "Cmd+Shift+T"],
            ["Clipboard history", "Windows+V", "(use a clipboard app)"],
          ],
        },
        why: "\"Paste without formatting\" alone saves VAs hours: text copied from a website or email keeps its fonts and colours unless you paste it plain.",
      },
      {
        id: "a-va-shortcuts-text",
        title: "Editing text quickly",
        explain:
          "Most VA work is text: emails, documents, data. Move and select without the mouse. Ctrl+Left or Right arrow (Option+arrow on a Mac) jumps a whole word. Add Shift to select as you move: Shift+arrow selects a character, Ctrl+Shift+arrow selects a word. Home and End jump to the start and end of a line (Cmd+Left/Right on a Mac). Ctrl+Backspace (Option+Delete on a Mac) deletes a whole word. Ctrl+B, Ctrl+I and Ctrl+U make text bold, italic and underlined, and Ctrl+K adds a link (Cmd on a Mac). In Gmail, turn on keyboard shortcuts in Settings to archive (e), reply (r) and move between emails (j and k) without the mouse.",
      },
      {
        id: "a-va-productivity",
        title: "Productivity techniques",
        explain:
          "Shortcuts save seconds; these techniques save hours. Templates and canned responses: write your common emails once (meeting confirmation, invoice reminder, out-of-office) and reuse them (Gmail calls these templates; Outlook calls them Quick Parts or My Templates). Text expanders: type a short code such as ;addr and it becomes your full address. Batching: group similar tasks (all invoices at 14:00) instead of switching all day. Time blocking: give each client or task a block in your calendar. The two-minute rule: if it takes less than two minutes, do it now. The Pomodoro technique: 25 minutes of focus, 5 minutes of rest. Single-tasking: close tabs and notifications you do not need. Browser profiles: one Chrome or Edge profile per client keeps their logins, bookmarks and tabs separate.",
        decision: {
          scenario: "You send the same meeting-confirmation email, with small changes, about fifteen times a week.",
          question: "What is the most efficient habit?",
          options: [
            { id: "a", text: "Save it as an email template and fill in the changing details each time", why: "Right. Write it once, perfectly, and reuse it: faster, and no new typos each time." },
            { id: "b", text: "Type it fresh each time so it feels personal", whyWrong: "A template with the person's details filled in is just as personal and takes a fraction of the time." },
            { id: "c", text: "Copy an old sent email and edit it", whyWrong: "It works, but it is easy to leave the previous person's name or date in it." },
            { id: "d", text: "Ask the client to stop booking meetings", whyWrong: "Booking meetings is the job." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-shortcuts-desk",
        title: "Shortcut drill: Windows and Mac",
        explain:
          "Choose the right shortcut for each job, on Windows and on a Mac. Then practise each one on your own computer until your fingers know it.",
        deskLab: {
          app: "tasks",
          title: "Shortcut drill",
          task: "Choose the Windows and Mac shortcut for each job.",
          fields: [
            { key: "win", label: "Windows", type: "select", options: ["Ctrl+Shift+V", "Ctrl+Z", "Ctrl+F", "Alt+Tab", "Windows+L", "Ctrl+Shift+T", "Ctrl+A", "Windows+V"] },
            { key: "mac", label: "Mac", type: "select", options: ["Cmd+Shift+Option+V", "Cmd+Z", "Cmd+F", "Cmd+Tab", "Ctrl+Cmd+Q", "Cmd+Shift+T", "Cmd+A", "Not built in: use a clipboard app"] },
          ],
          items: [
            { id: "k1", title: "Paste a quote from a website into an email without its fonts and colours", expect: { win: "Ctrl+Shift+V", mac: "Cmd+Shift+Option+V" } },
            { id: "k2", title: "You deleted a paragraph by mistake", expect: { win: "Ctrl+Z", mac: "Cmd+Z" } },
            { id: "k3", title: "Find the word \"deposit\" in a 20-page contract", expect: { win: "Ctrl+F", mac: "Cmd+F" } },
            { id: "k4", title: "Jump from your email to the spreadsheet you have open", expect: { win: "Alt+Tab", mac: "Cmd+Tab" } },
            { id: "k5", title: "You step away from your laptop in a café", expect: { win: "Windows+L", mac: "Ctrl+Cmd+Q" }, hint: "Lock the screen.", why: "Always lock your screen when you leave it: client data is on it." },
            { id: "k6", title: "You closed the client's dashboard tab by accident", expect: { win: "Ctrl+Shift+T", mac: "Cmd+Shift+T" } },
            { id: "k7", title: "Select every row in a list before copying it", expect: { win: "Ctrl+A", mac: "Cmd+A" } },
            { id: "k8", title: "Paste something you copied three copies ago", expect: { win: "Windows+V", mac: "Not built in: use a clipboard app" }, why: "Windows has clipboard history built in (turn it on the first time); on a Mac you need a clipboard manager app." },
          ],
          solution: {
            k1: { win: "Ctrl+Shift+V", mac: "Cmd+Shift+Option+V" }, k2: { win: "Ctrl+Z", mac: "Cmd+Z" }, k3: { win: "Ctrl+F", mac: "Cmd+F" }, k4: { win: "Alt+Tab", mac: "Cmd+Tab" },
            k5: { win: "Windows+L", mac: "Ctrl+Cmd+Q" }, k6: { win: "Ctrl+Shift+T", mac: "Cmd+Shift+T" }, k7: { win: "Ctrl+A", mac: "Cmd+A" }, k8: { win: "Windows+V", mac: "Not built in: use a clipboard app" },
          },
          hint: "Most Mac shortcuts are the Windows one with Cmd instead of Ctrl. The exceptions are switching apps, locking the screen, paste without formatting and clipboard history.",
          successMessage: "Now use them for a week until you stop reaching for the mouse.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 2.5 – 2.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l10-browsing",
    moduleId: "va-m2-digital",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["2.5", "2.6"],
    title: "Browsing, Downloading, Uploading and Sharing",
    subtitle: "Use the browser like a professional, read web addresses, and move files the right way",
    estimatedMinutes: 40,
    intro:
      "Nearly all VA work happens in a browser. This lesson makes you fast and careful in it, and teaches the right way to send any file to anyone.",

    atoms: [
      {
        id: "a-va-browser",
        title: "Effective web browsing",
        explain:
          "A browser (Chrome, Edge, Firefox, Safari) opens websites. Work in it efficiently: type searches straight into the address bar; open links in new tabs (Ctrl+click, Cmd+click on a Mac) so you keep your place; pin tabs you use all day (the client's inbox and calendar); save useful pages as bookmarks in folders, one per client; use the history (Ctrl+H) to find a page you saw earlier; and use a private or incognito window to see a website as a logged-out visitor would, or to log in to a second account briefly. Create a separate browser profile for each client so their logins, bookmarks and extensions never mix with yours. Install extensions only from the official store and only when needed: extensions can read the pages you visit. When a site behaves strangely, a hard refresh (Ctrl+F5 or Ctrl+Shift+R; Cmd+Shift+R on a Mac) loads it fresh.",
      },
      {
        id: "a-va-urls",
        title: "Reading a web address",
        explain:
          "A web address (URL) has parts: https:// (the secure connection), then the host name such as www.gtbank.com, then a path such as /personal-banking. The part that tells you who owns the site is the registered domain: the name directly before the ending (.com, .ng, .co.uk, .org). Read the host name from right to left. In accounts.google.com the domain is google.com, so it is Google. In paypal.com.account-verify.co the domain is account-verify.co, so it is NOT PayPal: everything before is just a label the owner chose. Look-alike spellings (micros0ft, gtbamk) are another trick. The padlock and https only mean the connection is encrypted; criminals get padlocks too, so a padlock never proves a site is genuine.",
        example: "https://accounts.google.com/signin\n         └── domain: google.com  → Google\n\nhttp://paypal.com.account-verify.co/login\n                  └── domain: account-verify.co → NOT PayPal",
      },
      {
        id: "a-va-file-transfer",
        title: "Downloading, uploading and sharing files",
        explain:
          "Downloaded files go to the Downloads folder by default; move them into the right client folder at once and rename them, or Downloads becomes a mess. Before opening a download, check its extension: a \"PDF invoice\" that ends in .exe, .scr or .html is a trap. To upload, drag the file into the page or use the upload button, and check it arrived (the name and size appear). To send a file, choose the method by size and purpose. Small files (under about 20 MB) can be attached to email; Gmail's limit is 25 MB and Outlook's is usually 20 MB. Larger files, or files people will edit together, are shared as a link from Google Drive, OneDrive or Dropbox, with the right permission (next lesson). Send final documents as PDF so the layout cannot shift and the file is not accidentally edited; send editable files only when the person needs to edit.",
        decision: {
          scenario: "Your client wants you to send a 140 MB event video to a printer for a looping display, and a final price list to a customer.",
          question: "What is the right method for each?",
          options: [
            { id: "a", text: "Share the video as a Drive or Dropbox link with view access; send the price list as a PDF attachment", why: "Right. 140 MB is far over email limits, so share a link; the final price list should be a PDF so it cannot be changed or reformatted." },
            { id: "b", text: "Attach both to one email", whyWrong: "The video is far over the 20–25 MB email limit; the email will bounce." },
            { id: "c", text: "Send the price list as an editable Word file", whyWrong: "The customer could change prices or the layout could break; final documents go as PDF." },
            { id: "d", text: "Send the video on WhatsApp in five parts", whyWrong: "Unprofessional, and compression ruins the quality a display needs." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-url-desk",
        title: "Genuine or fake? Read the domain",
        explain:
          "A client forwards eight links from her inbox and asks which are safe. For each one, type the registered domain (the name plus its ending, for example google.com, without www) and decide whether it is genuine or suspicious.",
        deskLab: {
          app: "research",
          title: "Links from the client's inbox",
          task: "For each link, type the registered domain (for example google.com, no www) and decide whether the link is genuine or suspicious.",
          fields: [
            { key: "domain", label: "Registered domain", type: "text", placeholder: "example.com" },
            { key: "verdict", label: "Verdict", type: "select", options: ["Genuine", "Suspicious"] },
          ],
          items: [
            { id: "u1", title: "https://accounts.google.com/signin/v2", expect: { domain: "google.com", verdict: "Genuine" }, why: "The domain is google.com; accounts is just a part of Google's site." },
            { id: "u2", title: "http://paypal.com.account-verify.co/login", expect: { domain: "account-verify.co", verdict: "Suspicious" }, hint: "Read the host name from the right: what comes just before the ending?", why: "The domain is account-verify.co. \"paypal.com\" at the front is only a label." },
            { id: "u3", title: "https://www.gtbank.com/personal-banking", expect: { domain: "gtbank.com", verdict: "Genuine" }, why: "gtbank.com is the bank's real domain." },
            { id: "u4", title: "https://gtbank-secure.online/update-bvn", expect: { domain: "gtbank-secure.online", verdict: "Suspicious" }, hint: "A hyphen makes it a completely different name.", why: "gtbank-secure.online is not gtbank.com. Banks never ask you to update your BVN through a link." },
            { id: "u5", title: "https://docs.google.com/document/d/1xQ7…/edit", expect: { domain: "google.com", verdict: "Genuine" }, why: "Google Docs lives on google.com." },
            { id: "u6", title: "https://micros0ft-support.com/fix-your-pc", expect: { domain: "micros0ft-support.com", verdict: "Suspicious" }, hint: "Look closely at the letters.", why: "A zero instead of an o, plus \"-support\": a look-alike domain." },
            { id: "u7", title: "https://www.upwork.com/freelancers/settings", expect: { domain: "upwork.com", verdict: "Genuine" }, why: "upwork.com is Upwork's domain." },
            { id: "u8", title: "https://upwork.com.jobs-offer.site/apply-now", expect: { domain: "jobs-offer.site", verdict: "Suspicious" }, hint: "Same trick as the PayPal link.", why: "The domain is jobs-offer.site; it only pretends to be Upwork." },
          ],
          solution: {
            u1: { domain: "google.com", verdict: "Genuine" }, u2: { domain: "account-verify.co", verdict: "Suspicious" }, u3: { domain: "gtbank.com", verdict: "Genuine" }, u4: { domain: "gtbank-secure.online", verdict: "Suspicious" },
            u5: { domain: "google.com", verdict: "Genuine" }, u6: { domain: "micros0ft-support.com", verdict: "Suspicious" }, u7: { domain: "upwork.com", verdict: "Genuine" }, u8: { domain: "jobs-offer.site", verdict: "Suspicious" },
          },
          hint: "Find the first single slash after https://. Just before it is the host name; its last two parts (name and ending) are the domain.",
          successMessage: "Reading domains right to left is the single best defence against phishing links.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 2.7 – 2.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l11-cloud",
    moduleId: "va-m2-digital",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["2.7", "2.8"],
    title: "Cloud Storage, Sharing and Troubleshooting",
    subtitle: "Google Drive, OneDrive and Dropbox, sharing permissions, sync, and fixing common problems",
    estimatedMinutes: 45,
    intro:
      "Cloud storage is where client work lives. Sharing it with the wrong permission is one of the most common, and most damaging, mistakes a VA can make.",

    atoms: [
      {
        id: "a-va-cloud",
        title: "Cloud storage and file synchronisation",
        explain:
          "Cloud storage keeps files on the provider's servers so they can be opened from any device and shared. Google Drive comes with every Google account (15 GB free, shared with Gmail and Photos) and holds Google Docs, Sheets and Slides. OneDrive comes with Microsoft accounts and Microsoft 365 and works closely with Word, Excel and Teams; SharePoint is the company version. Dropbox is popular with creative businesses for large files. Each has a desktop app that synchronises (syncs) a folder on your computer with the cloud: change a file in one place and it updates everywhere. Sync can keep files online-only (saving disk space) or available offline. If two people edit the same synced file offline, you may get a \"conflicted copy\"; compare and merge them rather than deleting one. Every service keeps version history, so you can restore an earlier version of a file. In a company account, store client files in a shared drive (Google) or SharePoint library (Microsoft) owned by the business, not in your personal My Drive: if your account is removed, files you own can go with it.",
      },
      {
        id: "a-va-permissions",
        title: "Sharing permissions",
        explain:
          "When you share a file or folder, choose who and how much. Viewer: can open and read (and usually download or print). Commenter: can read and add comments or suggestions, but not change the content. Editor: can change, delete and share it further. Link sharing has two main settings: Restricted (only the people you added can open it, even if the link is forwarded) and Anyone with the link (anyone who gets the link can open it; use only for public material). Follow the principle of least privilege: give the lowest permission that lets the person do their job, for the shortest time needed. Share folders rather than dozens of single files. Remove access when someone leaves a project, and review sharing regularly.",
        table: {
          caption: "Choose the lowest permission that does the job.",
          headers: ["The person needs to…", "Give"],
          rows: [
            ["Read or download it", "Viewer"],
            ["Give feedback without changing it", "Commenter"],
            ["Change it, add files, reorganise", "Editor"],
            ["Public material for anyone (a price list on the website)", "Anyone with the link: Viewer"],
            ["Nothing any more (left the project)", "Remove access"],
          ],
        },
      },
      {
        id: "a-va-troubleshooting",
        title: "Basic troubleshooting",
        explain:
          "Most technical problems are fixed by a short, ordered routine. 1. Identify the problem exactly: what you did, what happened, any error message (take a screenshot). 2. Check the obvious: is the internet working, is the device charged, is the cable or Wi-Fi connected, is the right account signed in? 3. Restart the app, then the device: this fixes a surprising number of problems. 4. Try another way: another browser, a private window (which ignores extensions and cached data), or another device. 5. Update the app or browser, or clear its cache. 6. Check whether the service itself is down (its status page, or a site such as Downdetector). 7. Search the exact error message in quotes. 8. If you still cannot fix it, escalate: tell the client or their IT person what happened, what you tried and the screenshot, and how it affects deadlines.",
        decision: {
          scenario: "Ten minutes before a client's Zoom call, you cannot hear anyone, although they can hear you.",
          question: "What should you try first?",
          options: [
            { id: "a", text: "Check Zoom's speaker setting (the arrow beside the microphone) and your volume, then leave and rejoin if needed", why: "Right. Start with the most likely, quickest fix: the wrong output device or muted volume." },
            { id: "b", text: "Reinstall Windows", whyWrong: "A drastic step for a problem that is almost always a setting." },
            { id: "c", text: "Buy a new headset", whyWrong: "Check the settings first; they can hear you, so the headset probably works." },
            { id: "d", text: "Cancel the call without telling the client", whyWrong: "Never disappear; fix it quickly or tell them you are rejoining by phone." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-share-desk",
        title: "Setting the right permissions",
        explain:
          "Your client, the owner of a small bakery, asks you to share parts of the business drive. For each request, choose the lowest permission that lets the person do their job.",
        deskLab: {
          app: "files",
          title: "Sweet Crumbs Bakery · Sharing requests",
          task: "For each request, choose the permission that follows the principle of least privilege.",
          fields: [{ key: "perm", label: "Permission", type: "select", options: ["Editor", "Commenter", "Viewer", "Anyone with the link: Viewer", "Remove access"] }],
          items: [
            { id: "p1", title: "The external accountant needs to download this year's receipts folder", expect: { perm: "Viewer" }, why: "Reading and downloading needs only Viewer; the accountant should not be able to change records." },
            { id: "p2", title: "The co-owner rewrites the menu and price documents with you", expect: { perm: "Editor" }, why: "She changes the content, so she needs Editor." },
            { id: "p3", title: "A designer should review the new brochure draft and leave feedback", expect: { perm: "Commenter" }, why: "Feedback without changing the file: Commenter." },
            { id: "p4", title: "The public price list linked from the bakery's website", expect: { perm: "Anyone with the link: Viewer" }, why: "Public material for anyone: link sharing, view only." },
            { id: "p5", title: "A former manager who left last month still has Editor on the Staff folder", expect: { perm: "Remove access" }, hint: "Does she still need anything?", why: "People who leave lose access on their last day." },
            { id: "p6", title: "The landlord wants to read the signed lease", expect: { perm: "Viewer" }, why: "Reading needs Viewer only, and only on that one document." },
            { id: "p7", title: "Your fellow VA updates the order spreadsheet every afternoon", expect: { perm: "Editor" }, why: "Updating data needs Editor." },
            { id: "p8", title: "The bank asks you to make the payroll folder available to \"anyone with the link\" for a loan review", expect: { perm: "Remove access" }, hint: "Would you ever make payroll public?", why: "Payroll is confidential; never make it link-public. Share specific documents with named bank staff only, after the owner approves, or not at all." },
          ],
          solution: {
            p1: { perm: "Viewer" }, p2: { perm: "Editor" }, p3: { perm: "Commenter" }, p4: { perm: "Anyone with the link: Viewer" },
            p5: { perm: "Remove access" }, p6: { perm: "Viewer" }, p7: { perm: "Editor" }, p8: { perm: "Remove access" },
          },
          hint: "Ask for each: read, comment or change? And should this ever be public?",
          successMessage: "Least privilege, every time: that is how you protect a client's business.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 2.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l12-safety",
    moduleId: "va-m2-digital",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["2.9"],
    title: "Internet Safety and Digital Hygiene",
    subtitle: "Passwords, two-factor authentication, phishing and the habits that keep client data safe",
    estimatedMinutes: 40,
    intro:
      "A VA holds the keys to a client's email, files and sometimes money. Attackers know that. Your security habits are part of the service you sell.",

    atoms: [
      {
        id: "a-va-passwords",
        title: "Passwords, password managers and two-factor authentication",
        explain:
          "Use a different strong password for every account. A long passphrase (four or more random words, such as \"lantern-mango-river-9-quietly\") is both strong and memorable. You cannot remember dozens of them, so use a password manager (Bitwarden, 1Password, LastPass or the one built into your browser with a strong main password): it creates, stores and fills passwords. Clients should share logins with you through a password manager's sharing feature, never by email, chat or text, so access can be removed later. Turn on two-factor authentication (2FA) everywhere: after the password, the site asks for a second proof, ideally a code from an authenticator app (Google Authenticator, Microsoft Authenticator) rather than SMS, which can be intercepted. Never share a one-time code (OTP) with anyone: a bank, a platform or a client never needs you to read out your code.",
      },
      {
        id: "a-va-phishing",
        title: "Spotting phishing and invoice fraud",
        explain:
          "Phishing is a message that pretends to be from someone you trust to make you click, log in, open an attachment or pay. Warning signs: urgency or threats (\"account suspended in 24 hours\"); a sender whose real address does not match the name (\"GTBank <alerts@gtb-secure.online>\"); links whose real domain is not the company's; unexpected attachments, especially .zip, .html or .exe files; requests for passwords, OTPs, card details or payments; and poor grammar or a generic greeting (\"Dear customer\"). Invoice fraud (business email compromise) targets VAs directly: an email that seems to be from a real supplier or from your client says the bank details have changed or asks for an urgent transfer. Always verify changes of bank details and unusual payment requests through a different channel, such as a phone number you already have, never one in the email. When in doubt, do not click: report it to the client and delete it.",
        samples: [
          { label: "Phishing", tone: "bad", text: "From: Microsoft 365 <no-reply@m365-securemail.info>\nSubject: Your mailbox will be deleted today\n\nDear user, your password expires in 2 hours. Click here to keep your mailbox." },
          { label: "Invoice fraud", tone: "bad", text: "From: Accounts, Rapid Print <accounts@rapidprint-ng.co>\n\nPlease note our bank details have changed. Kindly pay today's invoice to our new account at Access Bank." },
        ],
      },
      {
        id: "a-va-hygiene",
        title: "Digital hygiene habits",
        explain:
          "Digital hygiene means small, regular habits that keep devices and data safe. Keep the operating system, browser and apps updated. Keep the built-in antivirus on (Microsoft Defender on Windows; macOS has protection built in). Lock your screen whenever you step away and set it to lock automatically. Avoid logging in to client accounts on public Wi-Fi; use your mobile hotspot or a reputable VPN. Back up important work using the 3-2-1 rule (three copies, on two kinds of storage, one off-site or in the cloud). Keep client work in client accounts and separate browser profiles. Never install pirated software: it is a common way malware arrives. At the end of a contract, log out of every client account, delete local copies of their files and ask the client to remove your access.",
        decision: {
          scenario: "You receive an email that looks exactly like your client's usual cleaning supplier: \"Our bank details have changed. Please pay invoice #4471 (₦310,000) to our new Opay account today.\"",
          question: "What do you do?",
          options: [
            { id: "a", text: "Do not pay; call the supplier on the number you already have to verify, and tell your client", why: "Right. Changes of bank details are the classic invoice fraud. Verify through a known channel, never through the email itself." },
            { id: "b", text: "Reply to the email to ask if it is genuine", whyWrong: "If the email is fraudulent, the fraudster will simply reply \"yes\"." },
            { id: "c", text: "Pay it, since the invoice number looks right", whyWrong: "Fraudsters often copy real invoice numbers from hacked email accounts." },
            { id: "d", text: "Call the phone number in the email's signature", whyWrong: "That number may belong to the fraudster too. Use the number you already have." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-safety-desk",
        title: "Screening a suspicious inbox",
        explain:
          "It is Monday morning and your client's inbox has eight new emails. Decide for each one: is it safe to act on, phishing to report and delete, or something to verify through another channel before acting?",
        deskLab: {
          app: "inbox",
          title: "Mrs Okafor's inbox · Monday 08:10",
          task: "Open each email and decide: safe, phishing (report and delete), or verify through another channel before acting.",
          fields: [{ key: "verdict", label: "Decision", type: "select", options: ["Safe to act on", "Phishing: report and delete", "Verify by another channel first"] }],
          items: [
            { id: "s1", title: "Your mailbox is full: verify within 24 hours", meta: "From: Mail Admin <admin@okafor-mail-support.xyz>", body: "Dear user, your mailbox has exceeded its limit. Click the link below and sign in to avoid deletion.", expect: { verdict: "Phishing: report and delete" }, why: "Urgency, a generic greeting, a strange domain and a request to sign in: classic phishing." },
            { id: "s2", title: "Agenda for Thursday's board meeting", meta: "From: Chika Eze <chika.eze@okaforholdings.com> (her colleague, known sender)", body: "Hi Mrs Okafor, attached is the draft agenda (Board_Agenda_v2.docx). Comments by Wednesday, please.", expect: { verdict: "Safe to act on" }, why: "A known colleague, the company domain, an expected document." },
            { id: "s3", title: "Updated bank details for invoice 1182", meta: "From: Accounts <accounts@cleanpro-services.com.ng> (your usual cleaning supplier)", body: "Please note we have moved banks. Kindly pay invoice 1182 (₦310,000) to our new account today.", expect: { verdict: "Verify by another channel first" }, hint: "Even if it is the real supplier's address, what must you do before paying a changed account?", why: "A change of bank details must always be verified by phone on a number you already have." },
            { id: "s4", title: "You have received a DHL parcel: pay ₦2,500 customs fee", meta: "From: DHL Express <notify@dhl-parcel-ng.top>", body: "Your parcel is held. Pay the fee with your card using this link to release it.", expect: { verdict: "Phishing: report and delete" }, why: "A look-alike domain and a small card payment request: a common parcel scam." },
            { id: "s5", title: "Your Zoom meeting has been rescheduled", meta: "From: Zoom <no-reply@zoom.us>", body: "Your meeting \"Weekly sales review\" has been moved to Tuesday 10:00. View it in your Zoom account.", expect: { verdict: "Safe to act on" }, why: "zoom.us is Zoom's real domain and the meeting is one she has." },
            { id: "s6", title: "URGENT: CEO request", meta: "From: Mrs Ngozi Okafor <ngozi.okafor.ceo@gmail.com>", body: "I am in a meeting and cannot talk. Buy five ₦50,000 gift cards for a client and send me the codes. Do not call.", expect: { verdict: "Phishing: report and delete" }, hint: "Does your client use a Gmail address? Would she forbid you to call?", why: "A personal Gmail address pretending to be the CEO, gift cards, secrecy and \"do not call\": CEO fraud." },
            { id: "s7", title: "Shared with you: Q3_Sales_Report.xlsx", meta: "From: Google Drive <drive-shares-noreply@google.com> (shared by Chika Eze)", body: "Chika Eze has shared a spreadsheet with you. Open in Sheets.", expect: { verdict: "Safe to act on" }, why: "google.com is genuine and the sharer is a known colleague." },
            { id: "s8", title: "Your Microsoft 365 password expires today", meta: "From: Microsoft <security@m1crosoft-365.com>", body: "Keep your password. Click here and enter your current password.", expect: { verdict: "Phishing: report and delete" }, why: "m1crosoft (with a one) is a look-alike domain, and real services never ask for your current password by email." },
          ],
          solution: {
            s1: { verdict: "Phishing: report and delete" }, s2: { verdict: "Safe to act on" }, s3: { verdict: "Verify by another channel first" }, s4: { verdict: "Phishing: report and delete" },
            s5: { verdict: "Safe to act on" }, s6: { verdict: "Phishing: report and delete" }, s7: { verdict: "Safe to act on" }, s8: { verdict: "Phishing: report and delete" },
          },
          hint: "Check the real sender domain first, then ask: is this asking for a login, a code, a payment or a change of bank details?",
          successMessage: "You have just protected a client from four scams and one possible fraud before breakfast.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 2.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l13-practical",
    moduleId: "va-m2-digital",
    sectionId: SECTION_ID,
    order: 7,
    covers: ["2.P"],
    title: "Practical: A Company Filing System",
    subtitle: "Design a shared drive, a naming convention and permissions for a fictional company",
    estimatedMinutes: 50,
    intro:
      "Clients often hire a VA because their files are chaos. This practical is a real deliverable you can offer: a filing system they can actually use, shared safely.",

    atoms: [
      {
        id: "a-va-m2-plan",
        title: "How to set up a client's filing system",
        explain:
          "Setting up a filing system is a small project. Ask what documents the business has and who needs them. Design the structure (numbered top-level folders by function, at most three levels deep). Agree a naming convention and write one example. Decide sharing folder by folder, using least privilege and keeping confidential folders (HR, payroll) private. Create it in the company's own Google Drive shared drive or SharePoint, so the business owns the files. Move existing files in and rename them. Then write a one-page guide with the structure, the naming rule and three or four rules everyone follows, and walk the team through it on a short call.",
      },
      {
        id: "a-va-m2-practical",
        title: "Practical: design the shared drive",
        explain:
          "Design Kaduna Fresh Farms' shared drive. When you pass the checks, build it for real in your own Google Drive: create the folders, add a few sample files named with your convention, and share one folder with a friend as Viewer to see how the permission behaves. Take screenshots for your portfolio.",
        writingLab: {
          task:
            "Complete the design. Folder structure: 5 to 8 top-level folders written as \"- 01_Name\" bullets (numbered in order, no spaces in names), with at least one indented sub-folder under most of them. Naming convention: a Pattern and an Example that follows it (it must start with a YYYY-MM-DD date). Sharing: at least 5 table rows, each with Viewer, Commenter or Editor; the accountant on finance as Viewer; the price list for anyone with the link as Viewer; HR or staff files limited to the founder and the VA. Rules: three bullet rules.",
          brief: SYSTEM_BRIEF,
          doc: SYSTEM_DOC,
          tests: [
            { label: "5 to 8 numbered top-level folders, in order", check: String.raw`const s = section('Folder structure') || ''; const top = s.split('\n').filter((l) => /^[-*] /.test(l)).map((l) => l.replace(/^[-*]\s+/, '').trim()); const okNames = top.every((t, i) => new RegExp('^0?' + (i + 1) + '_\\S+$').test(t)); return top.length >= 5 && top.length <= 8 && okNames;`, fail: "Write 5 to 8 top-level folders as unindented bullets numbered in order: \"- 01_Customers\", \"- 02_Sales\"… with no spaces in the names." },
            { label: "Sub-folders under most top-level folders", check: String.raw`const s = section('Folder structure') || ''; const ls = s.split('\n'); let groups = 0; let withSub = 0; ls.forEach((l, i) => { if (/^[-*] /.test(l)) { groups += 1; if (/^\s{2,}[-*] \S/.test(ls[i + 1] || '')) withSub += 1; } }); return groups > 0 && withSub >= Math.ceil(groups * 0.6);`, fail: "Indent sub-folders (two spaces, then \"- \") under at least most of the top-level folders." },
            { label: "A naming pattern and an example that follows it", check: String.raw`const s = section('Naming') || ''; const ex = field(s, 'Example') || ''; return (field(s, 'Pattern') || '').length >= 8 && /^\d{4}-\d{2}-\d{2}_[A-Za-z0-9-]+_[A-Za-z]+_v\d{2}\.[a-z0-9]{2,4}$/.test(ex.trim());`, fail: "Give a Pattern, and an Example like 2026-04-02_ShopRiteIkeja_Invoice_v01.pdf (date first, underscores, version, extension)." },
            { label: "At least 5 sharing rows with valid permissions", check: String.raw`const r = rows(section('Sharing') || ''); return r.length >= 5 && r.every((x) => x.length >= 3 && /^(viewer|commenter|editor)$/i.test(x[2]) && x[0] && x[1]);`, fail: "Fill at least five rows: the folder, who it is shared with, and Viewer, Commenter or Editor." },
            { label: "Accountant: finance as Viewer; price list public as Viewer", check: String.raw`const r = rows(section('Sharing') || ''); const acc = r.some((x) => /account/i.test(x[1]) && /financ/i.test(x[0]) && /^viewer$/i.test(x[2])); const pub = r.some((x) => /price/i.test(x[0]) && /anyone with the link/i.test(x[1]) && /^viewer$/i.test(x[2])); return acc && pub;`, fail: "Share the finance folder with the accountant as Viewer, and the price list with \"Anyone with the link\" as Viewer." },
            { label: "Staff files private to the founder and the VA", check: String.raw`const r = rows(section('Sharing') || ''); const hr = r.filter((x) => /(hr|staff|payslip|payroll)/i.test(x[0])); return hr.length >= 1 && hr.every((x) => /(danjuma|founder)/i.test(x[1]) && /\b(va|you|assistant)\b/i.test(x[1]) && !/(anyone|all staff|everyone|supervisor|accountant|ruth)/i.test(x[1]));`, fail: "Add a row for HR or staff files shared only with the founder (Mr Danjuma) and the VA." },
            { label: "Three rules", check: String.raw`return bullets(section('Rules') || '').length >= 3;`, fail: "Write three rules as bullets." },
          ],
          solution: SYSTEM_DONE,
          hint: "Start from the documents in the brief and ask, for each, which department owns it. Those departments are your top-level folders.",
          successMessage: "A filing system a real business could adopt tomorrow. Now build it in Google Drive and screenshot it for your portfolio.",
        },
      },
    ],

    task: {
      title: "Module 2 practical: build it for real",
      intro: "Turn the design into a working shared drive.",
      prompts: [
        "In your own Google Drive (or OneDrive), create the Kaduna Fresh Farms folder structure exactly as you designed it.",
        "Create or upload six sample files and name every one with your convention.",
        "Share one folder with a friend as Viewer and another as Commenter; ask them to try to edit, and note what happens.",
        "Turn on two-factor authentication with an authenticator app on your email account and install a password manager.",
        "Learn ten shortcuts from this module and use only the keyboard for one full hour of work.",
      ],
      closing: "Module 3 turns to the skill clients mention most in reviews: professional communication.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
