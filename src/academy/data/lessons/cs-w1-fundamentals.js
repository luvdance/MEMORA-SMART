/**
 * CYBERSECURITY · WEEK 1 · FUNDAMENTALS & THE THREAT LANDSCAPE
 *
 * Authored from the Memora Smart Technologies curriculum
 * "Cybersecurity Mastery Program, Week 1".
 *
 * Harvard anchor: frames the whole course as CS50 does, with security as a
 * relative, risk-based discipline rather than a product you buy.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. It ships in the browser bundle.
 * Assessment questions and their answers live in lib/academy/assessments/
 * and are graded on the server, so correct answers are never downloadable.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * ATOM SHAPE — the same as every other course in this Academy, plus the
 * cybersecurity practice props:
 *   decision          a graded judgement call. Gates the atom.
 *   terminal          a recorded terminal. `terminalExercise` grades it.
 *   phish/capture/perms/firewall/hunt/risk/crypto — see the components.
 *
 * HOUSE STYLE: plain sentences. Do not join two clauses with a dash; end the
 * sentence and start a new one. Most of this is read on a phone.
 */

export const SECTION_ID = "cs-s1-foundations";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l1-security-is-a-tradeoff",
    moduleId: "cs-w1-fundamentals",
    sectionId: SECTION_ID,
    order: 1,
    title: "Security Is a Trade-off",
    subtitle: "Not a product, and never a finished job",
    estimatedMinutes: 10,
    intro:
      "Almost everything you have heard about cybersecurity is framed as a thing you buy or a state you reach. Neither is true, and starting from either one will make the next sixteen weeks confusing. Security is a trade-off you make on purpose, over and over, and this lesson is about learning to see the trade.",

    atoms: [
      {
        id: "a-cs-tradeoff",
        title: "There is no such thing as secure",
        explain:
          "A bank in Lagos could make its money completely safe from theft. Pour the vault in concrete and never open it again. Nobody would ever steal a naira from it, and nobody would ever bank there either. The bank does not want the safest possible vault. It wants the safest vault that customers can still withdraw from on a Saturday morning.",
        why: "Every security decision you will ever make sits on that line. More security almost always costs something: money, speed, convenience, or someone's willingness to use the thing at all. A control that people route around has made the system less secure, not more, because now you do not even know where the data is going.",
        analogy:
          "A door with seven locks is more secure than a door with one. It is also a door that stays propped open all day because nobody wants to unlock it seven times.",
        mistake:
          "Asking \"is this secure?\" It has no answer. The question that has an answer is \"secure enough against whom, protecting what, at what cost?\"",
      },
      {
        id: "a-cs-risk-language",
        title: "Threat, vulnerability, risk",
        explain:
          "These three words get used as if they mean the same thing. They do not, and mixing them up is why so many security conversations go nowhere. A threat is who or what might cause harm. A vulnerability is the weakness they could use. Risk is what it would actually cost you if they did.",
        why: "You cannot remove threats. Criminals exist whether you like it or not. You can often remove vulnerabilities, and you can always change your exposure. Knowing which of the three you are talking about tells you which lever you are allowed to pull.",
        table: {
          caption: "One scenario, split into the three words.",
          headers: ["Word", "In this scenario", "Can you change it?"],
          rows: [
            ["Threat", "Criminals who steal and resell customer databases", "No"],
            [
              "Vulnerability",
              "The customer database is reachable from the internet with one password",
              "Yes, and this is usually where the work is",
            ],
            [
              "Risk",
              "40,000 customer records exposed, regulator fines, customers leaving",
              "Yes, by reducing the vulnerability or the value of what is exposed",
            ],
          ],
        },
        mistake:
          "Reporting a threat as though it were a risk. \"Hackers exist\" is true and useless. \"A hacker could reach our customer database through this one exposed login, and that is 40,000 records\" is something a manager can act on.",
        practice: {
          prompt:
            "A shop's card machine runs software the vendor stopped updating in 2021. Which of the three words is that?",
          answer:
            "A vulnerability. The threat is whoever would want to steal card data. The risk is the money and trust lost if they succeed. The unpatched software is the weakness in between, and it is the one thing on that list you can personally fix.",
        },
      },
      {
        id: "a-cs-attack-surface",
        title: "Attack surface",
        explain:
          "Your attack surface is every point where someone outside could interact with your system. Every login page, every open port, every USB socket, every employee who can be phoned and lied to. Each one is a door. Most of them you did not decide to install.",
        why: "Reducing attack surface is the cheapest security work there is, because it costs nothing to turn off something nobody uses. Most real breaches come through a door the organisation had forgotten was there: an old test server, a former employee's account, a file share that was meant to be temporary in 2019.",
        example:
          "A small company thinks its attack surface is its website.\nIt is actually:\n  the website\n  the admin panel on the same server\n  the database port someone left open for a contractor\n  17 staff email accounts\n  the WiFi in reception\n  the accountant's laptop, which has the payroll file on it",
        analogy:
          "You lock your front door every night. The attack surface of your house also includes the back door, six windows, the gate the landlord has a key to, and your cousin who knows where you hide the spare.",
      },
      {
        id: "a-cs-who-attacks",
        title: "Who is actually attacking",
        explain:
          "\"Hackers\" is not a useful category. The people who might attack you have wildly different motives, skills and budgets, and what you should do about them differs completely. Most organisations will never be targeted by a nation state and will absolutely be targeted by organised crime looking for money.",
        why: "Defending against the wrong adversary wastes everything. A small business that buys nation-state-grade tooling and still lets staff reuse passwords has spent its whole budget on the attacker it does not have.",
        table: {
          caption: "Who they are, what they want, and what they will spend.",
          headers: ["Actor", "Motive", "Effort they will spend", "Who they hit"],
          rows: [
            [
              "Opportunistic criminals",
              "Fast money",
              "Almost none. Automated scans, mass phishing",
              "Anyone at all",
            ],
            [
              "Organised crime",
              "Serious money, usually ransomware",
              "Weeks, real research on you",
              "Businesses that can pay",
            ],
            ["Insiders", "Grievance, money, or simple carelessness", "They are already inside", "Their own employer"],
            ["Hacktivists", "A cause, and attention", "Varies wildly", "Anyone symbolic"],
            [
              "Nation states",
              "Intelligence, disruption",
              "Years, and effectively unlimited",
              "Governments, infrastructure, large firms",
            ],
          ],
        },
        mistake:
          "Assuming you are too small to be attacked. The most common attacker does not know who you are. They scanned the whole internet, your machine answered, and that was the entire selection process.",
        decision: {
          scenario:
            "You look after IT for a 30-person accounting firm in Ikeja. The budget for security this year is small and you have to choose where it goes first.",
          question: "Which adversary should the first spend defend against?",
          options: [
            {
              id: "a",
              text: "Nation-state attackers, because they are the most capable",
              whyWrong:
                "Capability is not the same as likelihood. A nation state has no reason to spend months on a 30-person accounting firm, and nothing you can buy this year would stop one if it did. Spending here means the attacker you will actually meet walks in unopposed.",
            },
            {
              id: "b",
              text: "Opportunistic and organised criminals, because they attack indiscriminately and you hold client money data",
              why: "This is the attacker that will actually arrive, usually by email, usually within the year. Multi-factor authentication, patching and backups stop most of it and cost almost nothing.",
            },
            {
              id: "c",
              text: "Hacktivists, because accountancy is politically sensitive",
              whyWrong:
                "Hacktivists pick targets that make a statement. A mid-sized accounting firm is not one, and building your defence around an attacker with no reason to come leaves the ordinary criminal unopposed.",
            },
            {
              id: "d",
              text: "Insiders, because staff are the biggest risk",
              whyWrong:
                "Insider risk is real and worth managing, but \"biggest risk\" is a slogan rather than a measurement. With a small first budget, the control that stops the most attacks per naira is the one aimed at the criminal sending phishing mail to all 30 of your staff this month.",
            },
          ],
          correct: "b",
          aftermath:
            "Notice what you just did. You did not ask which attacker was scariest. You asked which one was likely, against what you actually hold. That question is the job.",
        },
      },
      {
        id: "a-cs-defence-in-depth",
        title: "Defence in depth, and least privilege",
        explain:
          "Two ideas that will come up in every single week of this course. Defence in depth means never relying on one control, because every control fails eventually. Least privilege means every person and every program gets exactly the access they need to do their job and nothing more.",
        why: "Together they decide how bad a breach is. A phishing email that gets one password is an incident. The same email, where that password opened everything because there was one login for the whole company, is the end of the company.",
        analogy:
          "Defence in depth is why a bank has a locked door, a guard, a vault, a camera and an alarm. Any one of them can fail on any given Tuesday. Least privilege is why the cleaner has a key to the office and not to the vault.",
        table: {
          caption: "The same break-in, with and without the two ideas.",
          headers: ["", "One control, broad access", "Layers, least privilege"],
          rows: [
            ["Attacker gets a password", "They are in", "They hit a second factor and stop"],
            [
              "Second factor also fails",
              "n/a, they were already in",
              "They land in one mailbox, not the file server",
            ],
            ["Outcome", "Everything", "One mailbox, and an alert somebody sees"],
          ],
        },
        mistake:
          "Treating least privilege as a one-time setup. Access is granted in a hurry and almost never taken back. Most organisations, audited honestly, find staff who still have access to systems from a job they left three roles ago.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l2-cia-triad",
    moduleId: "cs-w1-fundamentals",
    sectionId: SECTION_ID,
    order: 2,
    title: "The CIA Triad",
    subtitle: "Three words that organise the whole field",
    estimatedMinutes: 10,
    intro:
      "Confidentiality, integrity, availability. Every security control that has ever existed protects at least one of these three, and most of the hard decisions in this course come from the fact that protecting one can damage another.",

    atoms: [
      {
        id: "a-cs-confidentiality",
        title: "Confidentiality",
        explain:
          "Only the people who should see the data can see it. This is the one everybody thinks of first, and it is the one encryption, passwords and permissions mostly exist to protect.",
        why: "A confidentiality failure is usually the one that makes the news, because the harm is obvious and public. Customer records, medical files, salaries and private messages are all confidentiality problems.",
        example:
          "A hospital clerk can look up any patient's file, including their neighbour's.\nNothing was stolen. Nothing was broken. The data is exactly as it was.\nIt is still a confidentiality failure, and in most countries it is illegal.",
        mistake:
          "Thinking confidentiality only fails when data leaves the building. Someone inside seeing what they have no business seeing is the same failure, and it is far more common.",
      },
      {
        id: "a-cs-integrity",
        title: "Integrity",
        explain:
          "The data is what it is supposed to be, and has not been changed by anyone who should not have changed it. Not secret. Correct.",
        why: "Integrity failures are quieter than confidentiality failures and often worse. If someone steals your bank statement, that is bad. If someone edits your bank balance, that is a different order of problem, and you might not notice for months.",
        analogy:
          "A leaked exam paper is a confidentiality failure. A changed exam grade is an integrity failure. The school will survive the first one.",
        example:
          "A payroll file where one account number has been quietly changed.\nNothing is missing. Nothing is encrypted or locked.\nSalaries just go to the wrong place, every month, until someone checks.",
        mistake:
          "Assuming integrity is only about attackers. A botched import, a spreadsheet formula copied one row too far, and a failing disk all destroy integrity just as effectively, and they happen far more often.",
      },
      {
        id: "a-cs-availability",
        title: "Availability",
        explain:
          "The people who need the data can actually get to it, when they need it. A system nobody can reach is not secure. It is broken.",
        why: "Availability is the one security people forget, and the one the business never forgets. A hospital whose records system is down is in an emergency even though not one byte has leaked. This is exactly why ransomware works: it does not steal your data, it just takes it away from you.",
        analogy:
          "The safest way to protect the vault is to weld it shut. The bank will not thank you.",
        mistake:
          "Designing a control that quietly destroys availability. Locking an account after three wrong passwords sounds sensible until an attacker locks out every employee on a Monday morning on purpose.",
      },
      {
        id: "a-cs-cia-conflict",
        title: "The three fight each other",
        explain:
          "This is the part that makes the triad useful rather than decorative. Almost every strong control for one leg costs you something on another. Encrypt the backups and you protect confidentiality, right up until the day you need to restore and nobody can find the key.",
        why: "Naming the conflict out loud turns an argument into a decision. Once a team can say \"we are trading availability for confidentiality here, on purpose, because the data is medical\", the conversation is finished in ten minutes instead of a month.",
        table: {
          caption: "Common controls, and what they cost.",
          headers: ["Control", "Protects", "Costs you"],
          rows: [
            ["Full-disk encryption on laptops", "Confidentiality", "Availability, if a key is lost"],
            ["Account lockout after failed logins", "Confidentiality", "Availability, and it can be triggered on purpose"],
            ["Read-only backups nobody can edit", "Integrity", "Speed of recovery, and storage cost"],
            ["Letting everyone read everything", "Availability", "Confidentiality, completely"],
          ],
        },
        decision: {
          scenario:
            "A clinic keeps patient records in a system that also handles emergency admissions. The board wants every record encrypted and every access to require a manager's approval.",
          question: "What is the honest thing to say in that meeting?",
          options: [
            {
              id: "a",
              text: "Agree. Patient data is sensitive, so maximum confidentiality is always right.",
              whyWrong:
                "Maximum confidentiality here means a doctor in an emergency waits for a manager. That is not a theoretical cost. It is the kind of control that gets bypassed within a fortnight, usually with a shared account, and then you have neither confidentiality nor a record of who looked at what.",
            },
            {
              id: "b",
              text: "Refuse. Clinical systems have to be available, so encryption will slow things down.",
              whyWrong:
                "This trades away confidentiality for a cost that mostly is not real. Modern disk encryption is close to free in performance terms, and patient data has a legal duty of confidentiality attached to it. Refusing outright is as unbalanced as agreeing outright.",
            },
            {
              id: "c",
              text: "Name the trade: encrypt everything, but replace approval-before-access with break-glass access that is logged and reviewed.",
              why: "This protects confidentiality where it is cheap, protects availability where a life depends on it, and replaces the blocking control with a detective one. Emergency access works instantly and every use is reviewed the next morning.",
            },
            {
              id: "d",
              text: "Ask the board to choose between confidentiality and availability.",
              whyWrong:
                "That is the question passed back unanswered. Your job is to bring them a design that gets most of both and to be explicit about what it gives up. A board asked to pick one leg of the triad will pick whichever one was in the news that week.",
            },
          ],
          correct: "c",
          aftermath:
            "Break-glass access is a real pattern, used in hospitals worldwide. Notice that the answer was not a product. It was a redesign of when the control fires.",
        },
      },
      {
        id: "a-cs-cia-diagnose",
        title: "Using the triad to diagnose",
        explain:
          "When something goes wrong, the first useful question is which leg broke. It sounds academic. It is actually the fastest route to knowing what to do next, because each leg has a different response.",
        why: "A confidentiality breach means notification, and possibly a regulator. An integrity breach means you cannot trust your own records until you find out what was changed. An availability breach means restore, now, and investigate afterwards. Three different first hours.",
        table: {
          caption: "Same incident report, three very different answers.",
          headers: ["What happened", "Leg broken", "First move"],
          rows: [
            ["Customer list found for sale online", "Confidentiality", "Contain, then notify who is affected"],
            ["Invoices show amounts nobody entered", "Integrity", "Freeze changes and find the last known-good copy"],
            ["Ransomware has encrypted the file server", "Availability, and probably confidentiality too", "Restore from an offline backup, assume data was copied"],
          ],
          note: "Ransomware breaks two legs at once, which is exactly why it is so effective.",
        },
        practice: {
          prompt:
            "A disgruntled employee deletes six months of delivery records on their last day. Which leg broke?",
          answer:
            "Availability, and integrity. The records are gone, so nobody can get to them. And until you restore and check, you cannot trust that what remains is complete. Confidentiality did not break at all, which is why \"was anything stolen?\" is the wrong first question here.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l3-how-attacks-happen",
    moduleId: "cs-w1-fundamentals",
    sectionId: SECTION_ID,
    order: 3,
    title: "How Attacks Actually Happen",
    subtitle: "The four shapes you will meet again and again",
    estimatedMinutes: 9,
    intro:
      "Before any tool, it is worth knowing what you are defending against in plain terms. Almost every attack you will ever see is one of four shapes, or a combination of them. You will meet all four in detail later in the course. Right now the goal is recognition.",

    atoms: [
      {
        id: "a-cs-malware",
        title: "Malware",
        explain:
          "Software that does something to your machine you did not ask for. The names describe how it spreads or what it does rather than how dangerous it is. A virus attaches itself to something else. A worm spreads on its own. A trojan pretends to be something you wanted. Ransomware encrypts your files and sells you the key. Spyware watches.",
        why: "Nearly all of it arrives the same way: somebody ran it. Attachments, pirated software, fake installers, a USB stick found in a car park. The technical sophistication is usually in staying hidden afterwards, not in getting in.",
        table: {
          caption: "The families, by what they do rather than how scary they sound.",
          headers: ["Family", "What it does", "How it usually arrives"],
          rows: [
            ["Ransomware", "Encrypts your files, demands payment", "Phishing attachment, or a stolen remote login"],
            ["Trojan", "Pretends to be useful software", "A download that was not from the vendor"],
            ["Worm", "Copies itself across the network with no help", "An unpatched service reachable from elsewhere"],
            ["Spyware / infostealer", "Steals passwords, cookies and card details", "Cracked software, malicious browser extensions"],
          ],
        },
        mistake:
          "Believing antivirus is the answer. It is one layer and it catches what it recognises. Attackers test their malware against the popular scanners before they send it.",
      },
      {
        id: "a-cs-social-engineering",
        title: "Social engineering",
        explain:
          "Attacking the person instead of the machine. No exploit, no vulnerability in any software. Somebody is simply convinced to open the door, because the request looked normal and came at the right moment.",
        why: "It is the single most successful category of attack in existence, and it works on technical people too. It does not rely on the target being stupid. It relies on them being busy, and on the attacker understanding how the organisation works.",
        example:
          "A call to the help desk at 4:50pm on a Friday.\n\"This is Tunde from Finance, I am with the auditors and I cannot get into the portal.\nCan you just reset it while I have them here? They are waiting.\"\n\nEverything in that sentence is engineering: a real department, a plausible reason,\na deadline, and a witness who makes refusing feel rude.",
        analogy:
          "The strongest door in the world, opened from the inside by someone who was told there was a delivery.",
        mistake:
          "Training people to \"be suspicious\" and stopping there. Suspicion with no procedure just makes staff uncomfortable. What works is a rule they can follow without needing to judge: we never reset a password on a phone call, and nobody will ever be annoyed with you for calling back on the number in the directory.",
      },
      {
        id: "a-cs-phishing-shape",
        title: "Phishing, and its expensive relatives",
        explain:
          "Phishing is social engineering delivered at scale, usually by email. The attacker does not know who you are. They sent the same message to two hundred thousand people and are waiting for the few hundred who click. Its targeted relatives are the ones that cost real money.",
        why: "You will practise dissecting these next week. The distinction to hold onto now is volume versus research, because it changes entirely what the message will look like and what will give it away.",
        table: {
          caption: "Same technique, different amount of homework.",
          headers: ["Name", "Who it targets", "How much they know about you"],
          rows: [
            ["Phishing", "Everyone, in bulk", "Nothing. Your address was on a list"],
            ["Spear phishing", "You specifically", "Your name, your role, who your manager is"],
            ["Whaling", "Executives", "A great deal, gathered over weeks"],
            [
              "Business email compromise",
              "Whoever can move money",
              "Enough to imitate a real supplier mid-conversation",
            ],
          ],
          note: "Business email compromise steals more money worldwide than ransomware, and almost never involves any malware at all.",
        },
        decision: {
          scenario:
            "An email arrives at Accounts. It is from a supplier your company genuinely uses, it refers to the correct open invoice by number, and it says their bank details have changed. The payment is due tomorrow.",
          question: "What is the right move?",
          options: [
            {
              id: "a",
              text: "Pay it. The invoice number matches, so the sender clearly has access to the real account.",
              whyWrong:
                "That is precisely the reasoning the attack is built on. Either the supplier's mailbox is compromised, in which case the sender does have access and is still not the supplier, or the details came from a forwarded email chain. A matching invoice number proves the attacker did their homework, not that they are legitimate.",
            },
            {
              id: "b",
              text: "Reply to the email asking them to confirm the new account.",
              whyWrong:
                "You would be asking the attacker whether the attacker is real. If the mailbox is compromised, or the sending address is a lookalike domain, your confirmation request goes straight back to them and comes back reassuring.",
            },
            {
              id: "c",
              text: "Call the supplier on the number you already had on file, not any number in the email, and confirm the change.",
              why: "Verification out of band is the only thing that reliably breaks this attack. The key detail is the number you already had. Any contact detail supplied by the message itself is part of the message.",
            },
            {
              id: "d",
              text: "Pay a small test amount first to see if it goes through.",
              whyWrong:
                "The test will succeed. The account is real and belongs to the attacker. All you have done is confirm the account works and lose the test amount, and you may now feel safer about sending the rest.",
            },
          ],
          correct: "c",
          aftermath:
            "This is business email compromise, and it costs organisations billions a year. The control that stops it is a policy, not a product: bank detail changes are verified by phone, on a known number, every time, with no exceptions for urgency.",
        },
      },
      {
        id: "a-cs-denial-of-service",
        title: "Denial of service",
        explain:
          "Attacking availability directly. Rather than break in, the attacker makes the service unusable, usually by sending far more traffic than it can handle. Distributed denial of service means the traffic comes from thousands of machines at once, most of them belonging to people who have no idea.",
        why: "It is worth understanding early because it is the attack that proves availability is a security property. Nothing is stolen, nothing is changed, and the business is still on the floor.",
        analogy:
          "Nobody broke into the shop. Two thousand people are standing in the doorway asking for directions, and no customer can get in.",
        mistake:
          "Treating every outage as an attack. Most are not. A bad deployment, a full disk or a failed certificate renewal will take a service down far more often than anybody attacking it, and jumping to \"we are under attack\" wastes the first hour of the response.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l4-your-lab",
    moduleId: "cs-w1-fundamentals",
    sectionId: SECTION_ID,
    order: 4,
    title: "Building Your Lab",
    subtitle: "A machine you are allowed to break",
    estimatedMinutes: 12,
    intro:
      "From here on, most weeks ask you to do something. You need somewhere safe to do it. This lesson sets up the lab you will use for the rest of the course, and explains the one setting that matters more than all the others.",

    atoms: [
      {
        id: "a-cs-why-a-vm",
        title: "Why a virtual machine, and not your laptop",
        explain:
          "A virtual machine is a whole computer running as a program inside your real one. It has its own disk, its own network settings and its own operating system, and when you delete it, all of that goes away and your real machine is untouched.",
        why: "You are going to run scanning tools, deliberately vulnerable software and, later, samples of real attacker behaviour. Doing that on the laptop that holds your bank app and your family photos is how learners end up with a problem that is no longer a lesson.",
        analogy:
          "A chemistry student does not mix reagents on the kitchen table. The fume cupboard exists so that being wrong is survivable.",
        table: {
          caption: "What you will install. All of it is free.",
          headers: ["Piece", "What it is", "Choose"],
          rows: [
            [
              "Hypervisor",
              "The program that runs virtual machines",
              "VirtualBox on Windows or Linux. VMware Fusion or UTM on a Mac",
            ],
            [
              "Guest operating system",
              "The system inside the virtual machine",
              "Ubuntu to learn Linux. Kali later, for the tooling",
            ],
            ["Memory", "How much RAM you give it", "4GB is workable, 8GB is comfortable"],
            ["Disk", "How much space it takes", "40GB, growing as needed"],
          ],
          note: "If your machine cannot run a virtual machine at all, every exercise in this platform still works in the browser. The virtual machine is for the weekly labs.",
        },
      },
      {
        id: "a-cs-snapshots",
        title: "Snapshots, and why you will be glad of them",
        explain:
          "A snapshot saves the exact state of the virtual machine at a moment in time: disk, memory, settings, everything. Later, one click puts it back exactly as it was, including the things you broke in between.",
        why: "This turns the lab from something you are careful with into something you can genuinely experiment in. Take a snapshot called \"clean\" as soon as the machine is installed and before you have configured anything. You will restore to it more than once, and that is a sign the lab is working.",
        mistake:
          "Taking the first snapshot after a week of setup. The snapshot you want is the one from before anything could have gone wrong, taken when the machine is boring and empty.",
      },
      {
        id: "a-cs-lab-isolation",
        title: "The setting that actually matters",
        explain:
          "A virtual machine's network adapter can be set several ways. Bridged puts it directly onto your real network, as if it were another laptop in the house. NAT lets it reach the internet but hides it behind your machine. Host-only lets it talk to your computer and to other virtual machines, and to nothing else at all.",
        why: "Every scanning and attack exercise in this course happens on host-only networking. A scan is not polite. Pointed at your flatmate's laptop, your employer's network or your internet provider's equipment, it is at best rude and in many countries a criminal offence, whether or not you meant anything by it.",
        table: {
          caption: "Three settings, three very different blast radiuses.",
          headers: ["Mode", "The VM can reach", "Use it for"],
          rows: [
            ["NAT", "The internet, but nothing on your local network can reach it", "Installing updates and software"],
            ["Bridged", "Everything on your real network, and it can be reached back", "Almost nothing in this course"],
            ["Host-only", "Your machine and other VMs. Nothing else. No internet", "Every scanning and attack lab"],
          ],
        },
        decision: {
          scenario:
            "You are about to run your first port scan, as part of the Week 4 lab. Your lab VM is currently set to Bridged so that you could download the tools, and you are on the WiFi at home, which you share with three other people.",
          question: "What do you do before running the scan?",
          options: [
            {
              id: "a",
              text: "Run it. It is your own home network, so you are allowed to scan it.",
              whyWrong:
                "Two problems. You share that network, so \"your own\" is not true of every device that will answer. And a home network usually includes equipment owned by your internet provider, which is not yours at all. This is exactly how a first-week learner ends up with a letter from their ISP.",
            },
            {
              id: "b",
              text: "Switch the adapter to Host-only, confirm the target is your other lab VM, then scan.",
              why: "The scan now cannot leave your own machine. Whatever the tool does, whatever you mistype in the target range, nothing outside the lab can hear it. This is the habit the whole course is built on.",
            },
            {
              id: "c",
              text: "Leave it bridged but scan only one specific IP address so nothing else is touched.",
              whyWrong:
                "This relies on you never mistyping a range, and a scanner given 10.0.0.0/24 instead of 10.0.0.5 will find every device in the house in about nine seconds. The whole point of isolation is that it does not depend on you being careful.",
            },
            {
              id: "d",
              text: "Turn off the VM's network entirely and scan localhost.",
              whyWrong:
                "Safe, but it teaches you nothing. A scan against localhost does not exercise the thing the lab is about, which is discovering a host you did not already know everything about. Host-only gives you a real target with none of the risk.",
            },
          ],
          correct: "b",
          aftermath:
            "Write this one down. \"Which network mode am I in?\" is the question to ask before every offensive exercise for the rest of this course, and for the rest of your career.",
        },
      },
      {
        id: "a-cs-first-commands",
        title: "Your first four commands",
        explain:
          "You do not need to learn Linux this week. You need four commands, because every lab from here starts with the same question: what machine am I on, who am I on it as, and what is here?",
        why: "Security work is mostly orientation. An attacker who lands on a machine runs almost exactly these commands in almost exactly this order, for exactly the same reason: they have no idea where they are either.",
        terminalExercise: {
          prompt: "learner@lab:~$",
          intro:
            "This is a recording of a real Ubuntu virtual machine. Type a command and press Enter.",
          goal:
            "You have just logged into the lab machine for the first time. Find out which account you are logged in as.",
          commands: {
            whoami: "learner",
            id: "uid=1000(learner) gid=1000(learner) groups=1000(learner),27(sudo)",
            "uname -a":
              "Linux lab 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux",
            pwd: "/home/learner",
            ls: "Desktop  Documents  Downloads  notes.txt",
            "ls -l":
              "total 16\ndrwxr-xr-x 2 learner learner 4096 Sep 14 09:02 Desktop\ndrwxr-xr-x 2 learner learner 4096 Sep 14 09:02 Documents\ndrwxr-xr-x 2 learner learner 4096 Sep 14 09:02 Downloads\n-rw-r--r-- 1 learner learner   86 Sep 14 09:11 notes.txt",
            "cat notes.txt":
              "lab machine, week 1\nsnapshot taken before any config\nnetwork: host-only",
            "ip a":
              "1: lo: <LOOPBACK,UP> inet 127.0.0.1/8 scope host lo\n2: enp0s3: <BROADCAST,MULTICAST,UP> inet 192.168.56.10/24 scope global enp0s3",
          },
          available: ["whoami", "id", "uname -a", "pwd", "ls -l", "cat notes.txt", "ip a"],
          accept: ["whoami", "id"],
          near: [
            {
              command: "pwd",
              why: "That tells you where you are, not who you are. Useful, and you will use it constantly, but the question was about the account.",
            },
            {
              command: "ls -l",
              why: "That lists what is here. Look at the third column in that output though: it names the account that owns each file, which is a hint about the command you want.",
            },
          ],
          hint: "One word. It is the question, spelled the way a computer would spell it.",
          success:
            "You are logged in as learner. Now run `id` as well, and look at the groups: this account is in the sudo group, which means it can become root when it needs to. That one line is the difference between a locked-down account and a dangerous one.",
        },
        mistake:
          "Working as root because it is easier and nothing gets in the way. That is exactly why it is dangerous. On a normal account, a mistake or a piece of malware is limited to your files. As root it is limited to nothing.",
      },
    ],

    task: {
      title: "This week's lab",
      intro:
        "Build the lab you will use for the next fifteen weeks, and write the audit that tells you what you are actually defending.",
      prompts: [
        "Install VirtualBox, or VMware Fusion on a Mac, and create an Ubuntu virtual machine with 4GB of memory and a 40GB disk.",
        "Update it, install nothing else yet, and take a snapshot named \"clean\". You will come back to this.",
        "Set the network adapter to Host-only and confirm that the VM can reach your machine and cannot reach the internet.",
        "Write a one-page attack-surface audit of your own digital life: every account that can reset another account, every device that holds something you would not want copied, and every place you reuse a password.",
        "For each line in that audit, write what it would cost you if it were lost, and what it would cost you to fix. Three of them will be almost free to fix. Fix those three this week.",
      ],
      closing:
        "Keep the audit. You will look at it again in Week 13 when you assess an organisation instead of yourself, and you will find you have been doing risk assessment all along.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
