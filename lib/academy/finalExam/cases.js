/**
 * EXAM CASE STUDIES — four real projects
 *
 * Each case is a company, a brief from a named stakeholder, and a table small
 * enough to read on a phone but large enough to carry a genuine finding. Items
 * in the bank attach to a case by `caseId`, and the assembler shows each brief
 * once with all its items beneath it.
 *
 * WHY FOUR, AND WHY THESE FOUR
 * Every case carries a DIFFERENT trap, so a candidate who has learned one
 * pattern cannot coast:
 *
 *   adanna     a channel that is most of the revenue and little of the profit
 *   zuri       a rate/count inversion, plus a KPI whose definition changes the
 *              answer (does the no-show rate exclude cancellations?)
 *   solar      a product line that is profitable until warranty is counted
 *   logistics  a genuine IQR outlier, so mean and median disagree sharply
 *
 * A paper draws on two to four of them, so no two candidates read the same
 * combination of briefs.
 *
 * ── FIGURE VERIFICATION ──────────────────────────────────────────────────
 * Every number any item quotes about these tables was computed by running the
 * data, never by hand:
 *
 * adanna (18 orders) — verified against the spreadsheet, pivot, Power Query,
 *   model and DAX engines and against pandas; all six agree.
 *   revenue 3,033,500 · cost 2,690,700 · margin 342,800 (11.30%)
 *   Wholesale 2,090,500 / 147,500 / 7.06% · 68.9% of revenue, 43.0% of margin
 *   Retail 637,100 / 122,900 / 19.29% · Online 305,900 / 72,400 / 23.67%
 *
 * zuri (20 appointments) — pandas.
 *   booked 20 · attended 13 · no-shows 5 · cancelled 2
 *   no-show rate 25.0% of booked, 27.8% of kept appointments
 *   Ikeja 2 of 10 = 20.0% · Lekki 2 of 5 = 40.0% · Yaba 1 of 5 = 20.0%
 *   by channel: Phone 5 of 8 = 62.5% · App 0 of 6 · Walk-in 0 of 6
 *   attended fee revenue 236,000 · fee value of no-shows 101,000
 *
 * solar (12 jobs) — pandas.
 *   revenue 17,950,000 · gross 4,790,000 (26.69%) · warranty 963,000
 *   net 3,827,000 (21.32%)
 *   Home  7 jobs · gross 28.40% · net 27.01% · claim rate 28.6% · 11,857/job
 *   SME   5 jobs · gross 25.83% · net 18.50% · claim rate 80.0% · 176,000/job
 *   price ~ install_cost r = 0.9996 (price has only two distinct values)
 *
 * logistics (16 deliveries) — pandas.
 *   on time 10 of 16 = 62.5%
 *   delay mean 1.25 days · median 0.0 · std 3.733 · skew 3.766
 *   Q1 0.0 · Q3 1.0 · IQR 1.0 · upper fence 2.5 → flags DEL-511 at 15 days
 *   mean excluding it 0.333
 *   Lagos-Kano mean delay 4.00 but median 0.5 · on time 50%
 * ─────────────────────────────────────────────────────────────────────────
 *
 * These objects ARE sent to the candidate — they are the stimulus. They carry
 * no answers, and no derived figure appears here: only the raw rows, so a
 * candidate has to do the work.
 */

export const CASES = {
  /* ═══════════════════════════════════════════════════════════════════ */
  adanna: {
    id: "adanna",
    company: "Adanna Foods Ltd",
    sector: "Food distribution · Lagos",
    brief:
      "Mrs Okonkwo, Head of Sales, has sent you last quarter's cleaned order export. The company beat its revenue target, but the MD believes margins are thinning. She wants to know which channel to grow and whether any product should be dropped.",
    columns: ["Order", "Channel", "Product", "Units", "Amount", "Cost"],
    rows: [
      ["ORD-2101", "Wholesale", "Palm Oil 5L", 60, 462000, 432000],
      ["ORD-2102", "Wholesale", "Rice 25kg", 12, 366000, 336000],
      ["ORD-2103", "Wholesale", "Palm Oil 5L", 45, 346500, 324000],
      ["ORD-2104", "Wholesale", "Semolina 10kg", 25, 297500, 275000],
      ["ORD-2105", "Wholesale", "Groundnut Oil 5L", 40, 344000, 324000],
      ["ORD-2106", "Wholesale", "Rice 25kg", 9, 274500, 252000],
      ["ORD-2107", "Retail", "Rice 25kg", 4, 136000, 112000],
      ["ORD-2108", "Retail", "Tomato Paste", 8, 100000, 76000],
      ["ORD-2109", "Retail", "Palm Oil 5L", 10, 84000, 72000],
      ["ORD-2110", "Retail", "Semolina 10kg", 6, 84000, 66000],
      ["ORD-2111", "Retail", "Groundnut Oil 5L", 7, 68600, 56700],
      ["ORD-2112", "Retail", "Tomato Paste", 5, 62500, 47500],
      ["ORD-2113", "Retail", "Rice 25kg", 3, 102000, 84000],
      ["ORD-2114", "Online", "Tomato Paste", 6, 79200, 57000],
      ["ORD-2115", "Online", "Rice 25kg", 2, 71000, 56000],
      ["ORD-2116", "Online", "Semolina 10kg", 4, 59200, 44000],
      ["ORD-2117", "Online", "Groundnut Oil 5L", 5, 52000, 40500],
      ["ORD-2118", "Online", "Palm Oil 5L", 5, 44500, 36000],
    ],
    note: "Cost is the cost of goods for that order line. The quarter's revenue target was ₦2,900,000.",
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  zuri: {
    id: "zuri",
    company: "Zuri Medical Centre",
    sector: "Private healthcare · three Lagos clinics",
    brief:
      "Dr Balogun runs three clinics and is losing consultation slots to patients who do not turn up. He wants to know which clinic has the worst no-show problem and what he should change. Note that a cancelled appointment is not the same thing as a no-show: a cancellation frees the slot, a no-show wastes it.",
    columns: ["Appointment", "Clinic", "Booked via", "Status", "Fee"],
    rows: [
      ["APT-301", "Ikeja", "App", "Attended", 18000],
      ["APT-302", "Ikeja", "Phone", "No-show", 18000],
      ["APT-303", "Ikeja", "Walk-in", "Attended", 18000],
      ["APT-304", "Ikeja", "App", "Attended", 18000],
      ["APT-305", "Ikeja", "Phone", "Cancelled", 18000],
      ["APT-306", "Ikeja", "App", "Attended", 18000],
      ["APT-307", "Ikeja", "Phone", "No-show", 18000],
      ["APT-308", "Ikeja", "Walk-in", "Attended", 18000],
      ["APT-309", "Ikeja", "App", "Attended", 18000],
      ["APT-310", "Ikeja", "Phone", "Attended", 18000],
      ["APT-311", "Lekki", "Phone", "No-show", 25000],
      ["APT-312", "Lekki", "App", "Attended", 25000],
      ["APT-313", "Lekki", "Phone", "No-show", 25000],
      ["APT-314", "Lekki", "Walk-in", "Attended", 25000],
      ["APT-315", "Lekki", "Phone", "Cancelled", 25000],
      ["APT-316", "Yaba", "Walk-in", "Attended", 15000],
      ["APT-317", "Yaba", "App", "Attended", 15000],
      ["APT-318", "Yaba", "Walk-in", "Attended", 15000],
      ["APT-319", "Yaba", "Phone", "No-show", 15000],
      ["APT-320", "Yaba", "Walk-in", "Attended", 15000],
    ],
    note: "Fee is what the consultation would have earned. Ikeja runs many more slots than the other two clinics.",
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  solar: {
    id: "solar",
    company: "Sunbeam Solar",
    sector: "Solar installation · Lagos, Abuja, Kano",
    brief:
      "Sunbeam sells two packages: Home systems and larger SME systems. Finance reports a healthy gross margin, but cash is tighter than the reports suggest. Warranty call-outs are paid out of the installation business and have never been included in the margin figures. You have been asked which package the company should push.",
    columns: ["Job", "Month", "State", "Package", "Price", "Install cost", "Warranty cost"],
    rows: [
      ["JOB-401", "Apr", "Lagos", "Home", 850000, 610000, 0],
      ["JOB-402", "Apr", "Lagos", "SME", 2400000, 1750000, 180000],
      ["JOB-403", "Apr", "Abuja", "Home", 850000, 600000, 0],
      ["JOB-404", "Apr", "Abuja", "SME", 2400000, 1790000, 240000],
      ["JOB-405", "May", "Lagos", "Home", 850000, 615000, 45000],
      ["JOB-406", "May", "Lagos", "SME", 2400000, 1760000, 0],
      ["JOB-407", "May", "Kano", "Home", 850000, 605000, 0],
      ["JOB-408", "May", "Kano", "SME", 2400000, 1820000, 310000],
      ["JOB-409", "Jun", "Lagos", "Home", 850000, 600000, 0],
      ["JOB-410", "Jun", "Abuja", "Home", 850000, 620000, 0],
      ["JOB-411", "Jun", "Abuja", "SME", 2400000, 1780000, 150000],
      ["JOB-412", "Jun", "Kano", "Home", 850000, 610000, 38000],
    ],
    note: "Gross margin is Price minus Install cost. Net margin also subtracts Warranty cost. A zero warranty cost means no claim was made on that job.",
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  logistics: {
    id: "logistics",
    company: "Naija Logistics",
    sector: "Road freight · four routes out of Lagos",
    brief:
      "Naija Logistics promises a delivery window on every route and reports an average delay to its biggest client each month. The client has complained that the reported average does not match their experience. You have the last sixteen deliveries.",
    columns: ["Delivery", "Route", "Promised days", "Actual days"],
    rows: [
      ["DEL-501", "Lagos-Ibadan", 2, 2],
      ["DEL-502", "Lagos-Ibadan", 2, 3],
      ["DEL-503", "Lagos-Ibadan", 2, 2],
      ["DEL-504", "Lagos-Ibadan", 2, 1],
      ["DEL-505", "Lagos-Abuja", 4, 4],
      ["DEL-506", "Lagos-Abuja", 4, 6],
      ["DEL-507", "Lagos-Abuja", 4, 5],
      ["DEL-508", "Lagos-Abuja", 4, 4],
      ["DEL-509", "Lagos-Kano", 6, 7],
      ["DEL-510", "Lagos-Kano", 6, 6],
      ["DEL-511", "Lagos-Kano", 6, 21],
      ["DEL-512", "Lagos-Kano", 6, 6],
      ["DEL-513", "Lagos-PortHarc", 3, 3],
      ["DEL-514", "Lagos-PortHarc", 3, 4],
      ["DEL-515", "Lagos-PortHarc", 3, 3],
      ["DEL-516", "Lagos-PortHarc", 3, 3],
    ],
    note: "Delay is Actual days minus Promised days; a negative delay means it arrived early. A delivery is on time when Actual is less than or equal to Promised. DEL-511 was held at a checkpoint for two weeks.",
  },
};

/**
 * The same tables as spreadsheet cell maps, for `formula` items. Row 1 is the
 * header, so data starts at row 2 — the candidate's ranges must account for
 * that, which is itself part of what the item tests.
 */
export const CASE_SHEETS = (() => {
  const LETTERS = "ABCDEFGHIJ";
  const sheets = {};
  for (const [id, c] of Object.entries(CASES)) {
    const cells = {};
    c.columns.forEach((h, i) => {
      cells[`${LETTERS[i]}1`] = h;
    });
    c.rows.forEach((row, r) => {
      row.forEach((v, i) => {
        cells[`${LETTERS[i]}${r + 2}`] = v;
      });
    });
    sheets[id] = {
      cells,
      cols: c.columns.length,
      /** Data rows plus the header plus three spare rows for answers. */
      rows: c.rows.length + 4,
      firstDataRow: 2,
      lastDataRow: c.rows.length + 1,
    };
  }
  return sheets;
})();

export default CASES;
