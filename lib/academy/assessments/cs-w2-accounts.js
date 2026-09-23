/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 2 · SECURING ACCOUNTS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l5-how-passwords-break": {
    lessonId: "cs-l5-how-passwords-break",
    passMark: 70,
    questions: [
      {
        id: "csq5-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-acct-four-attacks",
        prompt:
          "Which attack is stopped by using a different password on every site, and by almost nothing else?",
        options: [
          { id: "a", text: "Brute force" },
          { id: "b", text: "Credential stuffing" },
          { id: "c", text: "Phishing" },
          { id: "d", text: "Dictionary attacks" },
        ],
        correct: "b",
        explanation:
          "Credential stuffing takes passwords leaked from one breached site and tries them everywhere else. Uniqueness is the direct answer, because there is nothing to reuse.",
        whyWrong: {
          a: "Brute force is defeated by length, rate limiting and slow hashing. Using a different password on each site does not slow a brute force attempt down at all.",
          c: "Phishing works even with a unique password, because you hand over the correct one for that exact site. A phishing-resistant second factor is what stops it.",
          d: "Dictionary attacks are defeated by not choosing a common password. A unique but common password still falls.",
        },
      },
      {
        id: "csq5-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-acct-online-vs-offline",
        prompt:
          "A tool says a password would take 3,000 years to crack. What is the missing information that decides whether that is reassuring?",
        options: [
          { id: "a", text: "Which country the attacker is in" },
          {
            id: "b",
            text: "Whether it assumes online guessing against a rate limit, or offline cracking of a leaked hash",
          },
          { id: "c", text: "Whether the password contains a symbol" },
          { id: "d", text: "How long the user has had the password" },
        ],
        correct: "b",
        explanation:
          "The two attack models differ by roughly a factor of a billion. Online, a server counts attempts and stops you. Offline, the attacker runs billions of guesses a second on their own hardware with nobody watching.",
        whyWrong: {
          a: "Geography affects who might come after you, not how fast hardware computes hashes.",
          c: "Symbols are already accounted for in the estimate. They change the size of the alphabet, not which attack model applies.",
          d: "Age matters for whether it has been exposed in a breach, which is a different question from how long guessing would take.",
        },
      },
      {
        id: "csq5-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-acct-length",
        prompt:
          "Why does a policy demanding an uppercase letter, a digit and a symbol often produce weaker passwords in practice?",
        options: [
          { id: "a", text: "Because symbols are harder for software to hash" },
          {
            id: "b",
            text: "Because almost everyone satisfies it the same way, and cracking rules know exactly what those ways are",
          },
          { id: "c", text: "Because it forces passwords to be shorter" },
          { id: "d", text: "It does not. Composition rules always increase strength" },
        ],
        correct: "b",
        explanation:
          "Capital at the front, digit and exclamation mark at the end. Cracking wordlists apply exactly those transformations to real breached passwords, so the rule narrows the space people actually choose from.",
        whyWrong: {
          a: "Hashing treats all characters identically. There is no performance difference and no security difference from the algorithm's point of view.",
          c: "The rules do not set the length. They do tend to make people stop at the minimum, because satisfying the rules already feels like effort.",
          d: "This is the belief the guidance was changed to correct. Measured outcomes showed composition rules made passwords more predictable, not less.",
        },
      },
      {
        id: "csq5-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-acct-authn-authz",
        prompt:
          "A logged-in customer changes the invoice number in a URL and sees somebody else's invoice. Which control failed?",
        options: [
          { id: "a", text: "Authentication" },
          { id: "b", text: "Authorisation" },
          { id: "c", text: "Encryption" },
          { id: "d", text: "Rate limiting" },
        ],
        correct: "b",
        explanation:
          "Authentication worked perfectly. The site knows exactly who they are. What is missing is the check asking whether this particular person is allowed to see this particular invoice.",
        whyWrong: {
          a: "Authentication succeeded. The customer logged in as themselves with their own valid credentials.",
          c: "Encryption protects data in transit or at rest. It has no opinion about who is allowed to request a record.",
          d: "Rate limiting would slow the enumeration down. It would not stop a single unauthorised record from being returned.",
        },
      },
      {
        id: "csq5-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-acct-reuse",
        prompt:
          "One very strong password used on every site is safer than different weak passwords on each site.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False, against the attack that actually happens. One breach anywhere exposes everything, and you will never hear about the breach at the abandoned forum. Different weak passwords fall individually, which is less catastrophic, though neither is the right answer.",
        whyWrong: {
          a: "This reasons only about guessing strength and ignores reuse entirely. Your password is only as strong as the worst-run site you gave it to.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l6-credential-hygiene": {
    lessonId: "cs-l6-credential-hygiene",
    passMark: 70,
    questions: [
      {
        id: "csq6-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-acct-nist",
        prompt: "Why did NIST drop routine password expiry from its guidance?",
        options: [
          { id: "a", text: "Because it was too expensive for help desks to support" },
          {
            id: "b",
            text: "Because measurement showed it produced predictable sequential passwords rather than better ones",
          },
          { id: "c", text: "Because modern hashing made it unnecessary" },
          { id: "d", text: "Because users objected to it" },
        ],
        correct: "b",
        explanation:
          "A password that has to change every 60 days becomes a password with a counter on the end. Guidance now says change on evidence of compromise, which is when changing actually helps.",
        whyWrong: {
          a: "Help desk load was a real consequence, but the guidance changed because rotation made security worse, not because it was inconvenient.",
          c: "Hashing protects stored passwords. It says nothing about how often a user should be made to pick a new one.",
          d: "Users objected for decades without the guidance moving. What moved it was evidence about the passwords rotation actually produced.",
        },
      },
      {
        id: "csq6-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-acct-passphrase",
        prompt:
          "Why is \"manchester united forever 2024\" much weaker than \"pelican rubble ivory dockyard\", despite being a similar length?",
        options: [
          { id: "a", text: "It contains numbers, which are easier to guess" },
          {
            id: "b",
            text: "It was chosen by a person, so it follows a predictable shape that cracking rules cover",
          },
          { id: "c", text: "It contains spaces, which some systems strip" },
          { id: "d", text: "It is shorter once the spaces are removed" },
        ],
        correct: "b",
        explanation:
          "Randomness is what makes length count. A team, a sentiment and a year is a pattern, and patterns are exactly what cracking rules encode. The second was generated, so there is no pattern to exploit.",
        whyWrong: {
          a: "Digits are not inherently weak. The year is guessable because it is a year attached to a football club, not because it is numeric.",
          c: "Both contain spaces. Stripping would affect them equally, and would be a flaw in the system rather than in the passphrase.",
          d: "They are close in length either way. Length is not the difference here; predictability is.",
        },
      },
      {
        id: "csq6-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-acct-reset-flow",
        prompt:
          "Which account should get your strongest protection first, and why?",
        options: [
          { id: "a", text: "The bank account, because it holds the money" },
          {
            id: "b",
            text: "The primary email account, because it can reset the password on almost everything else",
          },
          { id: "c", text: "The social media account, because it is the most public" },
          { id: "d", text: "Whichever account is used most often" },
        ],
        correct: "b",
        explanation:
          "Password reset links go to email, so whoever controls that mailbox controls every account that resets through it. The email account is effectively the master key regardless of what the individual sites think.",
        whyWrong: {
          a: "The bank matters enormously, and it is reachable through the email account. Securing it while leaving the reset path open protects the wrong door.",
          c: "Public exposure affects reputation and social engineering. It does not give an attacker a path into your other accounts.",
          d: "Frequency of use is not the same as blast radius. A rarely-used mailbox that can reset your bank is more dangerous than a daily-use app that cannot.",
        },
      },
      {
        id: "csq6-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-acct-security-questions",
        prompt: "What is the fundamental problem with security questions?",
        options: [
          { id: "a", text: "Users forget the answers" },
          {
            id: "b",
            text: "The answers are facts rather than secrets, and unlike a password they can never be changed",
          },
          { id: "c", text: "They are stored in plain text" },
          { id: "d", text: "They only work for English speakers" },
        ],
        correct: "b",
        explanation:
          "Your mother's maiden name and your first school are matters of record. Once exposed, they are exposed permanently, because you cannot get a different first school.",
        whyWrong: {
          a: "Forgetting is an inconvenience, and it is a real one. It is not the security problem, which is that the correct answer was never secret.",
          c: "Some services do store them badly, but even perfectly hashed answers would still be guessable facts.",
          d: "Language is irrelevant. The weakness is that the answers are public information in any language.",
        },
      },
      {
        id: "csq6-5",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cs-acct-manager",
        prompt:
          "Beyond remembering passwords, what protection does a password manager give against phishing?",
        options: [
          { id: "a", text: "It scans links for malware before you click them" },
          {
            id: "b",
            text: "It will not autofill a password on a domain that does not match the saved one",
          },
          { id: "c", text: "It warns you when an email is suspicious" },
          { id: "d", text: "It blocks known phishing sites" },
        ],
        correct: "b",
        explanation:
          "The manager matches on the domain, not on how the page looks. A pixel-perfect fake gets no autofill, and that silence is a signal worth learning to notice.",
        whyWrong: {
          a: "Managers do not scan links. That is a mail gateway or browser function, and it is not what makes a manager useful here.",
          c: "It never sees your email. Its view is limited to the page you are currently on.",
          d: "Some bundle blocklists, but that is an extra feature rather than the mechanism. Domain matching works even against a site nobody has reported yet.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l7-multi-factor": {
    lessonId: "cs-l7-multi-factor",
    passMark: 70,
    questions: [
      {
        id: "csq7-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-acct-factors",
        prompt: "Why is a password plus a security question not multi-factor authentication?",
        options: [
          { id: "a", text: "Because security questions are optional" },
          { id: "b", text: "Because both are things you know, so a single attack can capture both" },
          { id: "c", text: "Because a security question is not encrypted" },
          { id: "d", text: "It is multi-factor, because there are two steps" },
        ],
        correct: "b",
        explanation:
          "Multi-factor means factors of different kinds. Two things you know both fall to the same phishing page, so the second one adds steps without adding a different kind of protection.",
        whyWrong: {
          a: "Whether it is optional is a policy detail. Even when mandatory it is still the same kind of factor.",
          c: "Encryption of the answer does not change its category. It is still something you know.",
          d: "Two steps is not two factors. The categories exist because each kind fails differently, and these two fail identically.",
        },
      },
      {
        id: "csq7-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-acct-sms-vs-app",
        prompt: "What specific attack does an authenticator app defeat that SMS does not?",
        options: [
          { id: "a", text: "Real-time phishing" },
          { id: "b", text: "SIM swapping" },
          { id: "c", text: "Password guessing" },
          { id: "d", text: "Malware on the phone" },
        ],
        correct: "b",
        explanation:
          "An app generates codes from a stored secret and the clock, with no network involved. Moving the phone number to a new SIM therefore moves nothing. SMS codes follow the number.",
        whyWrong: {
          a: "Neither defeats real-time phishing. Both produce a code that a fake site can relay to the real one within its validity window. Only a passkey or hardware key stops that.",
          c: "Both defeat password guessing equally, because the guessed password alone is not enough.",
          d: "Malware on the phone can read both. If anything the app's secret is a more attractive target, since it does not expire.",
        },
      },
      {
        id: "csq7-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-acct-mfa-fatigue",
        prompt:
          "You are woken at 3am by repeated sign-in approval prompts you did not trigger. What does that already tell you?",
        options: [
          { id: "a", text: "That someone is guessing your password" },
          { id: "b", text: "That someone already has a working password for your account" },
          { id: "c", text: "That the authentication service is malfunctioning" },
          { id: "d", text: "That your phone has malware on it" },
        ],
        correct: "b",
        explanation:
          "The approval prompt only appears after the password stage succeeds. Every prompt is proof that the attacker holds a valid password, which is why changing it immediately is the first move rather than the morning's task.",
        whyWrong: {
          a: "Failed guesses never reach the second factor. Reaching it means they are past the first.",
          c: "Possible in principle and vanishingly unlikely, and assuming it costs you the night. Treat it as real until proven otherwise.",
          d: "Malware on the phone would not generate legitimate sign-in requests to your account from elsewhere. The prompts are coming from the login service.",
        },
      },
      {
        id: "csq7-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-acct-passkeys",
        prompt: "What makes a passkey phishing-resistant rather than just stronger?",
        options: [
          { id: "a", text: "The code it generates is longer" },
          {
            id: "b",
            text: "The proof is cryptographically bound to the real domain, so a fake site cannot obtain or relay it",
          },
          { id: "c", text: "It requires a fingerprint, which cannot be stolen" },
          { id: "d", text: "It changes every 30 seconds instead of every 60" },
        ],
        correct: "b",
        explanation:
          "There is no shared code at all. The device signs a challenge for one specific domain, and a lookalike domain is not that domain, so there is nothing a convincing page can extract.",
        whyWrong: {
          a: "There is no code. Length is the wrong axis entirely, which is why this is a different property and not a stronger version of the same one.",
          c: "The fingerprint unlocks the private key on your own device. The site never receives it, and a passkey works with a PIN instead just as well.",
          d: "Rotation speed describes time-based codes. A passkey has no rotating value to shorten.",
        },
      },
      {
        id: "csq7-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-acct-sso",
        prompt:
          "Single sign-on reduces risk overall, but concentrates it, so the identity provider needs the strongest protection in the organisation.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "a",
        explanation:
          "True. One switch removing sixty accesses on a leaver's last day is a real security gain. The cost is that one compromised identity now opens everything, so phishing-resistant multi-factor on the provider is not optional.",
        whyWrong: {
          b: "Denying this usually means either refusing single sign-on outright, which gives up the leaver-management benefit, or adopting it without hardening the provider, which builds a master key protected by a password.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l8-reading-a-phish": {
    lessonId: "cs-l8-reading-a-phish",
    passMark: 70,
    questions: [
      {
        id: "csq8-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-acct-anatomy",
        prompt:
          "Why is spelling and grammar deliberately left off the five-point checklist?",
        options: [
          { id: "a", text: "Because most phishing is machine translated and reads perfectly" },
          {
            id: "b",
            text: "Because it is out of date advice that makes people trust well-written attacks",
          },
          { id: "c", text: "Because grammar varies too much between countries" },
          { id: "d", text: "Because attackers deliberately include errors to filter out careful readers" },
        ],
        correct: "b",
        explanation:
          "Targeted attacks are written carefully, often by a fluent speaker, and frequently copied from a genuine email. A checker whose main test is spelling will pass exactly the attacks that cost the most money.",
        whyWrong: {
          a: "Some is, and that is a fact about tooling rather than the reason the advice fails. The reason is that good writing is trivially achievable and therefore proves nothing.",
          c: "Regional variation is real, and it is not why the test fails. It fails because passing it is easy for the attacker.",
          d: "This claim circulates and applies at best to some bulk scams. It does not describe targeted attacks, which are written to be believed.",
        },
      },
      {
        id: "csq8-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-acct-lookalike",
        prompt: "Where does a browser actually take you if the link is https://gtbank.com.login-session.net/verify ?",
        options: [
          { id: "a", text: "gtbank.com" },
          { id: "b", text: "login-session.net" },
          { id: "c", text: "gtbank.com.login-session.net, which is owned by GTBank" },
          { id: "d", text: "It depends on the browser" },
        ],
        correct: "b",
        explanation:
          "Read backwards from the first single slash. The two labels immediately before it are the registered domain, and everything to their left is a subdomain that whoever owns that domain can name anything they like.",
        whyWrong: {
          a: "gtbank.com appears in the string as a subdomain label. Anyone owning login-session.net can create it, and it belongs to them.",
          c: "Owning a domain lets you create any subdomain under it. The presence of a familiar name to the left proves nothing about who owns the address.",
          d: "Domain resolution is a standard and does not vary by browser. Every browser goes to the same place.",
        },
      },
      {
        id: "csq8-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-acct-spear",
        prompt:
          "A targeted message has a correct name, a correct job title and a plausible subject. What does that tell you?",
        options: [
          { id: "a", text: "That it is almost certainly genuine" },
          { id: "b", text: "That the attacker did their research, which is evidence of effort rather than legitimacy" },
          { id: "c", text: "That it came from inside the network" },
          { id: "d", text: "That the sender's mailbox has been compromised" },
        ],
        correct: "b",
        explanation:
          "Names, titles and relationships are usually on the company website. Correct details mean somebody read it, and in a targeted attack that is exactly what you would expect.",
        whyWrong: {
          a: "This is the reasoning the attack is designed to produce. Accuracy is cheap to obtain and is the first thing a targeted attacker gets right.",
          c: "Nothing about a correct signature indicates where the message originated. The sending domain does, and in this case it was a lookalike.",
          d: "Possible, and not shown by these details alone. A compromised mailbox would send from the real domain, which is what makes that case harder.",
        },
      },
      {
        id: "csq8-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-acct-what-to-do",
        prompt: "Why is deleting a phishing email the wrong response even when you did not fall for it?",
        options: [
          { id: "a", text: "Because deleted mail can be recovered by the attacker" },
          {
            id: "b",
            text: "Because you are rarely the only recipient, and reporting lets it be pulled from everyone else's inbox",
          },
          { id: "c", text: "Because company policy requires keeping all email" },
          { id: "d", text: "Because deleting it confirms to the sender that the address is live" },
        ],
        correct: "b",
        explanation:
          "The same message went to many colleagues. Reporting it starts a process that removes it from all of their inboxes before the tenth person clicks. Deleting protects only you and removes the evidence.",
        whyWrong: {
          a: "Deletion in your mailbox is not something the sender can reverse or observe. That is not the mechanism.",
          c: "Retention policy is a separate concern and is not the security argument for reporting.",
          d: "Deleting sends nothing anywhere. Read receipts and remote images can signal a live address; deletion does not.",
        },
      },
      {
        id: "csq8-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-acct-what-to-do",
        prompt:
          "You typed your password into a phishing page at 11pm and realised immediately. What is the first action?",
        options: [
          { id: "a", text: "Report it to IT in the morning so the incident is logged properly" },
          {
            id: "b",
            text: "Change that password now from a device you trust, then report it tonight",
          },
          { id: "c", text: "Run a full antivirus scan on your laptop" },
          { id: "d", text: "Delete the email and monitor the account for unusual activity" },
        ],
        correct: "b",
        explanation:
          "Stolen credentials are used within minutes by automation. The hours between 11pm and the morning are the attacker's working hours, so the password has to change before anything else, and reporting has to be tonight.",
        whyWrong: {
          a: "Waiting is the single most expensive choice available. By morning the account may have a new second factor registered on it.",
          c: "No malware was involved. You typed a password into a web page, so scanning the laptop finds nothing and costs you the time that mattered.",
          d: "Monitoring is watching it happen. The credential is already gone and has to be invalidated, not observed.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
