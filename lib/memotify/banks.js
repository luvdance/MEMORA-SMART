/**
 * WORKPLACE SKILL BANKS
 *
 * SERVER ONLY. Every item carries its answer. Nothing in src/ may import this.
 *
 * The Academy's exam banks prove technical skills. Most Nigerian graduates are
 * going for support, operations, sales and writing roles, so these two banks
 * give them something real to prove as well. Written for this product. Each
 * item tests a decision a person makes at work, not a definition.
 *
 * Same item shape as lib/academy/finalExam banks. Option "a" is always the key
 * here; papers shuffle options per attempt.
 */

const mcq = (id, topic, prompt, options) => ({
  type: "mcq",
  id,
  topic,
  difficulty: 3,
  prompt,
  options: options.map((text, i) => ({ id: "abcd"[i], text })),
  correct: "a",
});

export const SUPPORT_ITEMS = [
  mcq("sup-01", "refund-angry", "A customer was charged twice and writes: \"This is theft. Fix it now.\" What is the best first reply?", [
    "Apologise for the double charge, confirm you can see it, and say when the refund will arrive.",
    "Explain that the bank caused it, so the customer should contact their bank.",
    "Ask the customer to calm down so you can help them properly.",
    "Send the refund policy and ask them to read section 4.",
  ]),
  mcq("sup-02", "unknown-answer", "A customer asks something you do not know, and your senior will only be back in two hours. What do you do?", [
    "Tell them you are checking, give a realistic time for your reply, and keep that promise.",
    "Give your best guess so they are not left waiting.",
    "Leave the ticket until your senior returns.",
    "Close the ticket and ask them to reopen it later.",
  ]),
  mcq("sup-03", "priority", "Four tickets are open. Which do you handle first?", [
    "A business customer whose payments have all stopped working this morning.",
    "A customer asking when the mobile app will get dark mode.",
    "A customer who wants a copy of last year's invoice.",
    "A customer suggesting a new feature.",
  ]),
  mcq("sup-04", "wrong-promise", "You realise you told a customer yesterday that their refund would arrive in 24 hours. It actually takes 5 working days. What do you do?", [
    "Contact them first, correct it, apologise, and give the accurate date.",
    "Wait and see whether they complain.",
    "Blame the finance team if they ask.",
    "Mark the ticket solved, since the refund will come eventually.",
  ]),
  mcq("sup-05", "verify-identity", "Someone on chat asks you to change the phone number on an account, and says they lost their SIM. What should you do first?", [
    "Follow the identity checks before changing anything.",
    "Change it, because they know the account email.",
    "Change it, because they sound stressed and you want to help.",
    "Ask them to send their password so you can confirm it is them.",
  ]),
  mcq("sup-06", "repeat-issue", "Ten customers report the same login error within an hour. What adds the most value?", [
    "Flag it to the engineering team as one incident, with examples, and keep customers updated.",
    "Reply to each customer separately and tell no one else.",
    "Tell customers to try again tomorrow.",
    "Wait for an eleventh report to be certain.",
  ]),
  mcq("sup-07", "tone-short", "Which reply best suits a customer who asked how to reset their PIN?", [
    "Go to Settings, tap Security, then Reset PIN. You will get a code by SMS. Tell me if it does not arrive.",
    "Dear Valued Customer, we acknowledge receipt of your esteemed enquiry regarding your PIN.",
    "It is in the app. Please check the FAQ.",
    "PIN resets are covered in the terms you accepted at sign-up.",
  ]),
  mcq("sup-08", "out-of-policy", "A customer asks for a refund 3 days past the deadline. You cannot approve it. What is the best response?", [
    "Say clearly that you cannot refund it, explain why, and offer whatever you are allowed to do.",
    "Stop replying so they give up.",
    "Tell them you will see what you can do, though you know the answer is no.",
    "Tell them the policy is silly but it is not your decision.",
  ]),
  mcq("sup-09", "handover", "You must pass a ticket to a colleague. What makes the handover good?", [
    "A short summary of the issue, what has been tried, and what is needed next, so the customer does not repeat themselves.",
    "Just the customer's name, since your colleague can read the history.",
    "Asking the customer to explain everything again to the new person.",
    "Reassigning it without a note, to save time.",
  ]),
  mcq("sup-10", "abuse", "A customer begins sending insults, though their problem is real. What is the right approach?", [
    "Stay calm, address the problem, and follow the abuse policy if it continues.",
    "Reply in the same tone so they know it is unacceptable.",
    "Ignore the problem until they apologise.",
    "Delete their account.",
  ]),
  mcq("sup-11", "measure", "Your team's first-response time is great, but customers keep contacting you again about the same issue. What does this suggest?", [
    "Replies are fast, but problems are not being fully solved the first time.",
    "Customers enjoy contacting support.",
    "The team should reply even faster.",
    "Nothing is wrong, because response time is the only measure that matters.",
  ]),
  mcq("sup-12", "scam-report", "A customer says someone claiming to be your company called and asked for their OTP. What should you do?", [
    "Secure the account, tell them never to share an OTP, and report it to your fraud team.",
    "Tell them it is not your company's problem.",
    "Ask them to share the OTP with you so you can check it.",
    "Advise them to wait and see if money leaves their account.",
  ]),
  mcq("sup-13", "feature-no", "A customer asks for a feature that does not exist and is not planned. What do you say?", [
    "Tell them honestly it is not available, give any workaround, and pass the request on.",
    "Promise it will arrive next month to keep them happy.",
    "Tell them nobody else has ever asked for it.",
    "Say you do not know and close the chat.",
  ]),
  mcq("sup-14", "typo-name", "You spot that you misspelt a customer's name in your last message. What do you do?", [
    "Send a brief correction and carry on helping.",
    "Write a long apology about the error.",
    "Leave it, since names do not affect the issue.",
    "Blame autocorrect.",
  ]),
  mcq("sup-15", "chat-load", "You are handling five chats at once and one customer has waited ten minutes. What is the best move?", [
    "Tell that customer you have not forgotten them and give a time, then deal with them next.",
    "Close the oldest chat so that your numbers improve.",
    "Copy and paste the same reply to all five.",
    "Say nothing, as they can see you are busy.",
  ]),
  mcq("sup-16", "clarify", "A customer writes: \"Your app is not working.\" What is the most useful reply?", [
    "Ask what they were trying to do and what happened, and whether they saw an error.",
    "Tell them to reinstall the app.",
    "Say the app is working for everyone else.",
    "Mark it as a duplicate of another ticket.",
  ]),
];

export const WRITING_ITEMS = [
  mcq("wri-01", "grammar-agreement", "Which sentence is correct?", [
    "Each of the reports has been reviewed.",
    "Each of the reports have been reviewed.",
    "Each of the report have been reviewed.",
    "Each of the reports were been reviewed.",
  ]),
  mcq("wri-02", "subject-line", "Which is the best subject line for an email asking a manager to approve a budget by Friday?", [
    "Approval needed by Friday: Q4 training budget",
    "Hello sir",
    "URGENT!!! PLEASE READ",
    "Budget",
  ]),
  mcq("wri-03", "concise", "Which is the clearest way to say this: \"Due to the fact that we are in possession of insufficient data at this point in time\"?", [
    "Because we do not have enough data yet",
    "Owing to the fact of data insufficiency presently",
    "As a result of the data situation at this moment",
    "Since data is currently being insufficient",
  ]),
  mcq("wri-04", "apostrophe", "Which sentence uses the apostrophe correctly?", [
    "The company has changed its address.",
    "The company has changed it's address.",
    "The company has changed its' address.",
    "The companies has changed it's address.",
  ]),
  mcq("wri-05", "request-first", "You need a colleague to send a file today. Where should the request go in your email?", [
    "In the first sentence, followed by any background.",
    "In the last paragraph, after all the background.",
    "In a P.S. at the end.",
    "In the subject line only, with an empty body.",
  ]),
  mcq("wri-06", "tone-delay", "A client's delivery will be two days late. Which is the most professional message?", [
    "Your order will now arrive on Thursday, two days later than promised. We are sorry, and here is how we will make it right.",
    "Unfortunately things happen and delays cannot always be avoided.",
    "Kindly note that delay is occurring.",
    "Our courier let us down, so this is not our fault.",
  ]),
  mcq("wri-07", "parallel", "Which list is written consistently?", [
    "Plan the launch, write the copy, and review the results.",
    "Plan the launch, writing the copy, and a review of results.",
    "Planning the launch, write the copy, and results reviewing.",
    "To plan the launch, writing copy, and review of the results.",
  ]),
  mcq("wri-08", "who-whom", "Which sentence is correct?", [
    "She is the manager who approved the request.",
    "She is the manager whom approved the request.",
    "She is the manager which approved the request.",
    "She is the manager who approve the request.",
  ]),
  mcq("wri-09", "kindly", "A Nigerian office habit reads oddly to international clients. Which is the better version of \"Kindly revert with the needful\"?", [
    "Please reply with the signed form by Tuesday.",
    "Kindly do the needful and revert back.",
    "Do revert on the matter at your earliest.",
    "I humbly await your needful response.",
  ]),
  mcq("wri-10", "summary", "Your manager asks for a one-line update on a project. Which is best?", [
    "On track for 12 May; the one risk is the vendor contract, due Friday.",
    "We have been working very hard on many aspects of the project.",
    "There is a lot to say, so let us have a meeting.",
    "Everything is fine for now, hopefully.",
  ]),
  mcq("wri-11", "numbers", "Which sentence would you put in a business report?", [
    "Revenue grew 18% in Q3, from ₦40m to ₦47m.",
    "Revenue grew massively in Q3.",
    "Revenue did really quite well in Q3.",
    "Revenue was up by a lot, as everyone expected.",
  ]),
  mcq("wri-12", "comma-splice", "Which sentence is punctuated correctly?", [
    "The meeting ended early; we still finished the agenda.",
    "The meeting ended early, we still finished the agenda.",
    "The meeting ended early we still finished the agenda.",
    "The meeting, ended early, we still finished, the agenda.",
  ]),
  mcq("wri-13", "audience", "You are writing about a server outage for customers who are not technical. What should you lead with?", [
    "What was affected, whether their money or data is safe, and when it will be fixed.",
    "The name of the failed database cluster and the stack trace.",
    "A history of your engineering team.",
    "An apology with no details, to keep it short.",
  ]),
  mcq("wri-14", "homophone", "Which sentence is correct?", [
    "The new policy will affect everyone in the team.",
    "The new policy will effect everyone in the team.",
    "The new policy will affects everyone in the team.",
    "The new policy will be effecting to everyone in the team.",
  ]),
  mcq("wri-15", "active-voice", "Which sentence makes it clearest who must act?", [
    "Tunde will send the invoice on Monday.",
    "The invoice is to be sent on Monday.",
    "It is expected that the invoice shall be sent.",
    "Sending of the invoice will be done.",
  ]),
  mcq("wri-16", "proof", "You have just written an important proposal. What is the best final step?", [
    "Read it aloud or have someone else read it, checking names, figures and dates.",
    "Send it at once while the ideas are fresh.",
    "Add more adjectives to make it sound stronger.",
    "Rely on the spell checker alone.",
  ]),
];

/**
 * Excel. The certification bank's other Excel items are tied to case-study
 * sheets a short check cannot show, so these top its six standalone items up.
 */
export const EXCEL_ITEMS = [
  mcq("xl-01", "xl-absolute", "You write =B2*$E$1 in C2 and fill it down to C50. What happens to the two references?", [
    "B2 changes row by row, and $E$1 stays fixed.",
    "Both change row by row.",
    "Both stay fixed.",
    "B2 stays fixed, and $E$1 changes row by row.",
  ]),
  mcq("xl-02", "xl-sumif", "Column A holds regions and column B holds sales. Which formula totals the sales for Lagos?", [
    "=SUMIF(A:A,\"Lagos\",B:B)",
    "=SUM(A:A,\"Lagos\",B:B)",
    "=COUNTIF(A:A,\"Lagos\",B:B)",
    "=SUMIF(B:B,A:A,\"Lagos\")",
  ]),
  mcq("xl-03", "xl-countif", "Which formula counts how many cells in C2:C100 contain the word Paid?", [
    "=COUNTIF(C2:C100,\"Paid\")",
    "=COUNT(C2:C100,\"Paid\")",
    "=SUM(C2:C100=\"Paid\")",
    "=COUNTA(C2:C100)",
  ]),
  mcq("xl-04", "xl-lookup-exact", "VLOOKUP returns a wrong name for a staff ID. The last argument was left out. What is the likely cause?", [
    "Leaving it out means approximate match; it should be FALSE for an exact match.",
    "VLOOKUP cannot search numbers.",
    "The table must be on another sheet.",
    "The formula needs to be typed in capitals.",
  ]),
  mcq("xl-05", "xl-lookup-left", "The ID is in column D and the name you want is in column B. Why does VLOOKUP struggle here?", [
    "It can only return values to the right of the lookup column; XLOOKUP or INDEX and MATCH can look left.",
    "It cannot read column B.",
    "It only works with text, not IDs.",
    "It needs the sheet to be sorted by name.",
  ]),
  mcq("xl-06", "xl-text-number", "A column of amounts will not sum, and the numbers sit on the left of their cells. What is the likely problem?", [
    "They are stored as text and need converting to numbers.",
    "The column is too narrow.",
    "SUM cannot handle more than 100 cells.",
    "The sheet is protected.",
  ]),
  mcq("xl-07", "xl-duplicates", "You must find repeated customer emails without deleting anything. What is the best first step?", [
    "Highlight duplicates with conditional formatting and review them.",
    "Use Remove Duplicates at once.",
    "Delete the rows that look alike.",
    "Sort by date and hope they line up.",
  ]),
  mcq("xl-08", "xl-pivot-refresh", "You changed figures in the source data, but the pivot table still shows the old totals. What do you do?", [
    "Refresh the pivot table.",
    "Rebuild it from scratch each time.",
    "Type the new totals over the pivot table.",
    "Save and reopen the file twice.",
  ]),
  mcq("xl-09", "xl-pivot-use", "A manager wants total sales by region and by month, from 40,000 rows. What is the best tool?", [
    "A pivot table.",
    "A calculator and a printed copy.",
    "One SUM typed per region and month by hand.",
    "A chart with no summary behind it.",
  ]),
  mcq("xl-10", "xl-if", "What does =IF(B2>=50,\"Pass\",\"Fail\") return when B2 is 50?", [
    "Pass",
    "Fail",
    "50",
    "An error",
  ]),
  mcq("xl-11", "xl-iferror", "A lookup shows #N/A for IDs that are not in the list, and you want it to show Not found. Which formula does that?", [
    "=IFERROR(XLOOKUP(A2,D:D,E:E),\"Not found\")",
    "=IF(XLOOKUP(A2,D:D,E:E),\"Not found\")",
    "=ERROR(XLOOKUP(A2,D:D,E:E),\"Not found\")",
    "=XLOOKUP(A2,D:D,E:E)+\"Not found\"",
  ]),
  mcq("xl-12", "xl-trim", "Lookups fail because some names carry extra spaces, as in \"  Ada Obi \". Which function cleans them?", [
    "TRIM",
    "UPPER",
    "ROUND",
    "LEN",
  ]),
  mcq("xl-13", "xl-chart", "You must show how monthly revenue changed across two years. Which chart suits it best?", [
    "A line chart.",
    "A pie chart.",
    "A doughnut chart with 24 slices.",
    "A single stacked bar.",
  ]),
  mcq("xl-14", "xl-table", "Why format a data range as an Excel Table before building formulas on it?", [
    "New rows join automatically, so formulas and pivots keep covering all the data.",
    "It makes the file impossible to edit.",
    "It removes the need for headers.",
    "It converts every value to text.",
  ]),
];
