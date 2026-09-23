/**
 * CYBERSECURITY · WEEK 2 · SECURING ACCOUNTS
 *
 * Harvard anchor: CS50 Cybersecurity, "Securing Accounts". The pillar on
 * balancing security against convenience.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * A note on the numbers in this week. Every figure quoted about how long a
 * password takes to guess is stated with the assumption it depends on, because
 * a guessing rate with no attack model attached is meaningless. "Eleven
 * trillion years" headlines assume online guessing against a rate limit;
 * offline cracking of a leaked fast hash is millions of times faster. Both are
 * given, because a learner who only meets the first will badly misjudge the
 * second.
 */

export const SECTION_ID = "cs-s2-accounts";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l5-how-passwords-break",
    moduleId: "cs-w2-accounts",
    sectionId: SECTION_ID,
    order: 1,
    title: "How Passwords Actually Break",
    subtitle: "Almost never the way films show it",
    estimatedMinutes: 11,
    intro:
      "Nobody sits at a keyboard typing guesses. Passwords fall in four specific ways, and knowing which one you are defending against decides everything about the advice you give. This lesson is about those four, in order of how often they happen.",

    atoms: [
      {
        id: "a-cs-acct-authn-authz",
        title: "Authentication is not authorisation",
        explain:
          "Authentication answers \"who are you?\". Authorisation answers \"what are you allowed to do?\". They are separate systems, they fail separately, and confusing them produces a specific and very common bug.",
        why: "A site that checks who you are at the front door and then trusts every request afterwards has authenticated you and forgotten to authorise you. Change a number in the URL and you are reading somebody else's invoice. You will meet this again in Week 8 as broken access control, the single most common serious web vulnerability there is.",
        table: {
          caption: "Two questions, two answers, two ways to get it wrong.",
          headers: ["", "Question", "Failure looks like"],
          rows: [
            ["Authentication", "Are you really Ada?", "Someone logs in as Ada"],
            [
              "Authorisation",
              "Is Ada allowed to see this?",
              "Ada logs in as herself and reads the payroll",
            ],
          ],
        },
        mistake:
          "Saying \"they were logged in, so it was fine\". Being logged in is authentication. Whether a logged-in person should have been able to open that particular record is a completely separate check, and it is usually the missing one.",
      },
      {
        id: "a-cs-acct-four-attacks",
        title: "The four ways in",
        explain:
          "Credential stuffing reuses passwords leaked from somewhere else. Phishing asks you for the password directly. Dictionary attacks try common passwords and their obvious variations. Brute force tries everything, and is the rarest by a very long way.",
        why: "Most security advice is aimed at brute force, which is the attack you are least likely to face. The two that actually happen to ordinary people are reuse and phishing, and neither is solved by making a password harder to type.",
        table: {
          caption: "How accounts really get taken, roughly in order of frequency.",
          headers: ["Attack", "What the attacker needs", "What stops it"],
          rows: [
            [
              "Credential stuffing",
              "A password you used somewhere that got breached",
              "A different password on every site",
            ],
            ["Phishing", "You, typing it into their page", "A second factor that cannot be relayed"],
            ["Dictionary", "Your password to be a common one", "Length, and a manager that generates it"],
            ["Brute force", "Time, and no rate limit at all", "Rate limiting, or a slow password hash"],
          ],
          note: "Notice that only the last row is affected by adding a symbol and a capital letter.",
        },
        mistake:
          "Treating password strength as the whole of account security. A 24-character password that you also used on a forum that got breached in 2019 is already known.",
      },
      {
        id: "a-cs-acct-length",
        title: "Why length beats complexity",
        explain:
          "Every character you add multiplies the number of possibilities by the size of the alphabet. Every rule you add about symbols and capitals narrows the space people actually choose from, because everybody satisfies it the same way: capital at the front, one at the end, exclamation mark.",
        why: "Guessing software knows the rules too. A cracking wordlist does not try random strings. It tries real passwords from real breaches, with exactly the substitutions the rules push people towards. P@ssw0rd! satisfies every complexity policy ever written and is in the first thousand guesses.",
        example:
          "Two passwords, both satisfying a strict policy:\n\n  P@ssw0rd!            8 characters, in every cracking list ever built\n  correct horse battery staple   28 characters, four ordinary words\n\nThe second is easier to remember, easier to type on a phone,\nand vastly harder to guess. It also fails many corporate password policies,\nwhich is a fact about the policies rather than about the password.",
        decision: {
          scenario:
            "Your company's policy requires 8 characters with an uppercase letter, a number and a symbol, changed every 60 days. Staff complain constantly, and the help desk resets about forty passwords a month.",
          question: "What do you propose?",
          options: [
            {
              id: "a",
              text: "Raise it to 12 characters with the same rules and a 30-day rotation",
              whyWrong:
                "This makes every problem worse. Shorter rotation drives people to sequential passwords, and the composition rules keep pushing everyone into the same predictable shapes. The help desk load doubles and the passwords do not improve.",
            },
            {
              id: "b",
              text: "Drop the composition rules and the routine rotation, require a 14-character minimum, screen against known breached passwords, and turn on multi-factor",
              why: "This is current NIST guidance, and each part addresses a real attack. Length beats the dictionary, breach screening beats reuse, multi-factor beats phishing, and dropping rotation stops pushing people towards Password1, Password2, Password3.",
            },
            {
              id: "c",
              text: "Keep the policy and run quarterly awareness training on choosing strong passwords",
              whyWrong:
                "Training cannot fix a policy that actively rewards the wrong behaviour. If the rules make a good password inconvenient and a bad one compliant, people will be compliant. Change the rules, not the people.",
            },
            {
              id: "d",
              text: "Move to 60-day rotation but ban the previous 12 passwords",
              whyWrong:
                "History checks are easily defeated by the same incrementing pattern, and forced rotation is exactly the practice modern guidance dropped. Rotate on evidence of compromise, not on a calendar.",
            },
          ],
          correct: "b",
          aftermath:
            "Forced rotation was removed from NIST's guidance for a specific measured reason: it made passwords worse, because a password that has to change every 60 days becomes a password with a counter in it.",
        },
      },
      {
        id: "a-cs-acct-online-vs-offline",
        title: "Online guessing and offline cracking",
        explain:
          "Guessing against a live login is slow, because the server can count attempts and slow down or stop. Cracking a stolen password database is a completely different problem: the attacker has the hashes on their own hardware and can try billions of guesses a second with nobody watching.",
        why: "This is the single most misunderstood point in password advice. \"It would take a thousand years to guess\" is usually an online number. Once a database leaks, the same password might fall in minutes. It is also why how a site stores your password matters as much as what your password is.",
        table: {
          caption: "The same password, two attack models.",
          headers: ["", "Online, against a rate-limited login", "Offline, against a leaked fast hash"],
          rows: [
            ["Guesses per second", "Perhaps 10, then you are locked out", "Billions, on one rented graphics card"],
            ["Who sees it", "The site's logs and alerts", "Nobody"],
            ["What helps", "Rate limiting, lockout, multi-factor", "A slow hash, a salt, and real length"],
          ],
        },
        mistake:
          "Quoting a crack-time estimate without saying which model it assumes. The two answers differ by a factor of about a billion, and the difference decides whether your advice is correct.",
      },
      {
        id: "a-cs-acct-reuse",
        title: "Reuse is the real problem",
        explain:
          "When a site is breached, the attacker gets a list of email addresses and passwords. They do not spend much time on that site. They take the list and try it against banking, email and social accounts, automatically, at scale. This is credential stuffing, and it works because most people have three passwords in total.",
        why: "Your password is only as strong as the worst-run site you used it on. That forum from 2016 with no maintainer and no encryption decides the security of your bank account, and you will never hear when it is breached.",
        analogy:
          "One key that opens your house, your car, your office and your safe. The security of all four is now set by whichever door you lent the key to most carelessly.",
        practice: {
          prompt:
            "Someone uses one very strong 20-character password everywhere. Is that better or worse than using twenty weak but different ones?",
          answer:
            "Against the attack that actually happens, it is worse. One breach anywhere exposes everything. Twenty weak passwords fall individually and only where they are used. The right answer is neither: long and different, which is only practical with a manager.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l6-credential-hygiene",
    moduleId: "cs-w2-accounts",
    sectionId: SECTION_ID,
    order: 2,
    title: "Choosing and Keeping Credentials",
    subtitle: "What modern guidance actually says",
    estimatedMinutes: 10,
    intro:
      "Most of what people were taught about passwords in 2010 has since been formally withdrawn by the organisation that taught it. This lesson is the current position, and why each piece of it changed.",

    atoms: [
      {
        id: "a-cs-acct-nist",
        title: "What NIST changed, and why",
        explain:
          "NIST Special Publication 800-63B is the guidance most organisations follow. In 2017 it removed three things it had previously recommended: mandatory composition rules, routine expiry, and password hints. It added one: screening new passwords against lists of known breached ones.",
        why: "Each change came from measurement rather than opinion. Composition rules made passwords predictable. Expiry made them sequential. What actually reduces compromise is length, screening against known-breached values, and a second factor.",
        table: {
          caption: "Then and now.",
          headers: ["Old advice", "Current guidance", "The reason"],
          rows: [
            ["Must contain a symbol and a digit", "No composition rules", "Everybody satisfies them identically"],
            ["Change every 60 or 90 days", "Change on evidence of compromise", "Rotation produces Password1, Password2"],
            ["Minimum 8 characters", "Minimum 8, allow at least 64", "Long passphrases must not be blocked"],
            ["Security questions as backup", "Do not use them", "The answers are public or guessable"],
            ["(nothing)", "Screen against breached password lists", "Stops the reuse attack directly"],
          ],
        },
        mistake:
          "Silently truncating passwords or banning spaces. A site with a 16-character limit is telling you something worrying about how it stores your password, because a proper hash produces the same size output whatever goes in.",
      },
      {
        id: "a-cs-acct-passphrase",
        title: "Passphrases, and how to make one properly",
        explain:
          "A passphrase is several random words. The important word is random. Four words you chose yourself are not random, because human beings pick related words and famous phrases. Four words picked by dice or by software from a large list genuinely are.",
        why: "Randomness is the only thing that makes length count. \"my name is adaeze\" is 16 characters and essentially guessable. Four genuinely random words from a 7,776-word list is about 2 to the 51 possibilities, which no offline attack finishes in a human lifetime.",
        example:
          "Chosen by a person:      manchester united forever 2024\nChosen by dice:          pelican rubble ivory dockyard\n\nThe same length. Nothing alike in strength.\nThe first is a team, a sentiment and a year, which is a shape a cracking rule covers.",
        mistake:
          "Using a memorable quote, song lyric or Bible verse. Cracking lists include entire books. Anything ever written down has been tried.",
      },
      {
        id: "a-cs-acct-manager",
        title: "The password manager is the actual answer",
        explain:
          "One long passphrase you memorise, protecting a vault that generates and remembers a different random password for every site. This is the only approach that satisfies both requirements at once: long, and different everywhere.",
        why: "Everything else is a compromise between what is secure and what a human can remember. A manager removes the trade entirely. It also defends against phishing in a way people underestimate: it will not autofill your bank password into a site that is not your bank, because it matches on the domain and not on how the page looks.",
        decision: {
          scenario:
            "A colleague objects: \"putting all my passwords in one place is dangerous. If someone gets into the manager, they get everything.\"",
          question: "What is the honest response?",
          options: [
            {
              id: "a",
              text: "They are right, so keep the important passwords out of the manager and memorise those",
              whyWrong:
                "This produces the worst of both. The memorised ones will be reused or weak, because they have to be memorable, and they will be the important ones. The objection sounds careful and leads to a worse outcome.",
            },
            {
              id: "b",
              text: "The concern is real, but the alternative is reuse across dozens of sites, which is a far more likely failure. Protect the vault with a long passphrase and a second factor, and the risk moves to something you control",
              why: "This takes the objection seriously and answers it with the comparison that matters. A single well-defended vault versus one password shared with a forum that gets breached is not a close call, and the second factor on the vault addresses the specific fear.",
            },
            {
              id: "c",
              text: "It is not a real risk, because managers encrypt everything",
              whyWrong:
                "Dismissing it is both wrong and unpersuasive. Vaults have been breached, and a weak master password is genuinely a single point of failure. The argument is about which risk is larger, not about pretending one does not exist.",
            },
            {
              id: "d",
              text: "Use the browser's built-in password saving instead, since it is not a separate vault",
              whyWrong:
                "Browser storage is a vault too, usually a less well protected one, and it is tied to a browser profile that anyone with access to the unlocked machine can read. It does not answer the objection, it just hides it.",
            },
          ],
          correct: "b",
          aftermath:
            "Every security control concentrates risk somewhere. The skill is knowing where you moved it to and making sure that is the place you can defend best.",
        },
      },
      {
        id: "a-cs-acct-reset-flow",
        title: "The reset flow is the real front door",
        explain:
          "Attackers frequently do not attack the password at all. They attack the process for replacing it. If a reset link goes to an email account, then that email account is the password for everything, whatever the individual sites think.",
        why: "This reframes your whole account security. Your primary email is not one account among many. It is the master key, and it deserves the strongest protection you have: the longest passphrase and a phishing-resistant second factor, before anything else.",
        analogy:
          "You can fit the best lock in the world, and it does not matter if the locksmith will cut a new key for anyone who knows your date of birth.",
        mistake:
          "Securing the bank account carefully and leaving the email account that can reset it on a password from 2018.",
      },
      {
        id: "a-cs-acct-security-questions",
        title: "Security questions are a second, weaker password",
        explain:
          "Mother's maiden name. First school. First pet. These are not secrets. They are facts, often published on the social media profile of the person being asked, and unlike a password they can never be changed after a breach.",
        why: "Current guidance is simply not to use them. Where a service forces you to, the correct move is to treat each answer as another random string and store it in your password manager. Your first school can be xQ4tp-rubble-99.",
        example:
          "Q: What was the name of your first pet?\nA: Bingo\n\nThis answer is on Facebook, is in every cracking list as a common pet name,\nand cannot be changed once a support agent has seen it.",
        practice: {
          prompt:
            "A bank verifies callers using date of birth and the last three digits of their account number. What is wrong with that?",
          answer:
            "Neither is a secret. A date of birth is public or easily bought, and account digits appear on every invoice and bank transfer the customer has ever sent. It authenticates anyone holding one old statement, which includes the person who stole the post.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l7-multi-factor",
    moduleId: "cs-w2-accounts",
    sectionId: SECTION_ID,
    order: 3,
    title: "Multi-Factor, and Its Failure Modes",
    subtitle: "Not all second factors are the same",
    estimatedMinutes: 11,
    intro:
      "Multi-factor authentication is the highest-value control most people can turn on. It is also routinely bypassed, and the bypasses depend entirely on which kind you chose. This lesson is about the differences that matter.",

    atoms: [
      {
        id: "a-cs-acct-factors",
        title: "The three kinds of factor",
        explain:
          "Something you know, such as a password. Something you have, such as a phone or a hardware key. Something you are, such as a fingerprint. Multi-factor means using more than one kind. Two passwords is not multi-factor, because both are the same kind and both fall to the same attack.",
        why: "The categories exist because each kind fails differently. A password can be stolen at a distance and copied infinitely. A hardware key cannot be copied at all, but can be left in a taxi. Combining kinds means one attack is not enough.",
        table: {
          caption: "What each kind is actually good and bad at.",
          headers: ["Kind", "Example", "Strong against", "Weak against"],
          rows: [
            ["Know", "Password, PIN", "Losing a device", "Phishing, reuse, guessing"],
            ["Have", "Phone app, hardware key", "Remote attacks", "Theft, loss, SIM swap"],
            ["Are", "Fingerprint, face", "Forgetting it", "Coercion, and it can never be reissued"],
          ],
          note: "Biometrics cannot be changed after a compromise, which is why they are best used to unlock a device rather than as a credential sent to a server.",
        },
      },
      {
        id: "a-cs-acct-sms-vs-app",
        title: "SMS codes, app codes, and the gap between them",
        explain:
          "An SMS code is sent over the phone network to your number. An authenticator app generates a code from a shared secret and the current time, entirely on the device, with no network involved. They look identical to the user and are not remotely equivalent.",
        why: "Phone numbers can be moved. A SIM swap, arranged with a bribed or deceived shop employee, sends every future code to the attacker's phone, and the victim's first clue is that their phone stops working. The authenticator app has no such path, because there is nothing to intercept.",
        table: {
          caption: "Second factors, worst to best against a determined attacker.",
          headers: ["Method", "Beats password theft", "Beats SIM swap", "Beats real-time phishing"],
          rows: [
            ["SMS code", "Yes", "No", "No"],
            ["Authenticator app code", "Yes", "Yes", "No"],
            ["Push approval", "Yes", "Yes", "No, and it adds fatigue attacks"],
            ["Hardware key or passkey", "Yes", "Yes", "Yes"],
          ],
          note: "SMS is still far better than nothing. The order here is about what to move to, not a reason to turn anything off.",
        },
        mistake:
          "Refusing SMS multi-factor because it is imperfect, and therefore having no second factor at all. It stops the overwhelming majority of real attacks, which are automated and not aimed at you personally.",
      },
      {
        id: "a-cs-acct-mfa-fatigue",
        title: "Push fatigue, and real-time phishing",
        explain:
          "Two bypasses that work against every code-based method. In a fatigue attack the attacker, holding your password, simply requests approval over and over until you tap accept to make it stop, often at 3am. In real-time phishing the fake site takes your code and immediately uses it on the real site, within the thirty seconds it is valid.",
        why: "Both defeat the mental model people have of multi-factor as a wall. The code is not a wall. It is a token that can be relayed, and a human who is tired can be worn down. Knowing this is what makes the next atom matter.",
        example:
          "3:04am  Approve sign-in?  [ Deny ]  [ Approve ]\n3:04am  Approve sign-in?  [ Deny ]  [ Approve ]\n3:05am  Approve sign-in?  [ Deny ]  [ Approve ]\n... forty-one more ...\n3:22am  a message on Teams: \"IT here, sorry about the alerts,\n        just approve one so we can finish the migration\"",
        decision: {
          scenario:
            "You are woken at 3am by repeated sign-in approval prompts for your work account. You did not try to sign in.",
          question: "What do you do?",
          options: [
            {
              id: "a",
              text: "Approve one so the notifications stop, then change your password in the morning",
              whyWrong:
                "That single approval is the entire objective of the attack. The attacker already has your password, and the approval is the only thing standing between them and your account. By morning they are in, and may have registered their own second factor.",
            },
            {
              id: "b",
              text: "Deny them all, turn the phone to silent, and deal with it at work",
              whyWrong:
                "Denying is right; waiting is not. Someone is holding your working password right now. Silencing the phone also removes your only warning if they keep trying, and the attacker has all night.",
            },
            {
              id: "c",
              text: "Deny, change the password immediately from a device you trust, and report it tonight",
              why: "The prompts prove the attacker already has a valid password, so the password is the thing that must change, now. Reporting matters because you are almost certainly not the only person receiving these tonight.",
            },
            {
              id: "d",
              text: "Ignore it, since denying and approving both confirm the account is active",
              whyWrong:
                "They already know the account is active, because they have its password. Ignoring it leaves the prompts running until one is approved by accident, and leaves your organisation unaware of an active attack.",
            },
          ],
          correct: "c",
          aftermath:
            "Several very large breaches began with exactly this, at exactly this hour. The fix on the organisation's side is number matching, where the screen shows a number you must type, so approval cannot be a reflex.",
        },
      },
      {
        id: "a-cs-acct-passkeys",
        title: "Passkeys, and what phishing-resistant means",
        explain:
          "A passkey is a cryptographic key pair. The private half never leaves your device, and the public half is registered with the site. Signing in means your device proves it holds the private key, and that proof is tied to the site's real domain. There is no code to read out, and nothing to type into the wrong page.",
        why: "This is what makes it phishing-resistant, and it is a genuinely different property rather than a stronger version of the same thing. A fake site cannot relay the proof, because the proof is bound to the domain that requested it, and the fake domain is not that domain. There is nothing for a convincing page to extract.",
        analogy:
          "A code is a password with a short shelf life, and it can be passed to whoever asks convincingly. A passkey is more like a signature that only means anything on one specific document.",
        table: {
          caption: "Why the attacks above stop working.",
          headers: ["Attack", "Against an app code", "Against a passkey"],
          rows: [
            ["Fake login page", "Works, if used within 30 seconds", "Fails. The key will not sign for that domain"],
            ["Push fatigue", "Works on a tired human", "There is nothing to approve repeatedly"],
            ["SIM swap", "Not applicable", "Not applicable"],
            ["Database breach at the site", "Shared secret may be exposed", "Only the public half is stored"],
          ],
        },
        mistake:
          "Believing the fingerprint is the authentication. It is not. It unlocks the private key on your own device. The site never receives your fingerprint and could not use it if it did.",
      },
      {
        id: "a-cs-acct-sso",
        title: "Single sign-on, and where the risk moves",
        explain:
          "Single sign-on lets one identity provider vouch for you to many applications. Sign in once, and every connected application trusts that. Organisations use it because it makes joining, leaving and auditing tractable.",
        why: "It is genuinely good security, and it concentrates risk. One account now opens everything, so that account needs the strongest protection in the organisation. The real benefit is on the day somebody leaves: one switch removes their access to sixty systems, instead of sixty tickets that will not all get done.",
        mistake:
          "Rolling out single sign-on without also enforcing phishing-resistant multi-factor on the identity provider. You have just built a master key and protected it with a password.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l8-reading-a-phish",
    moduleId: "cs-w2-accounts",
    sectionId: SECTION_ID,
    order: 4,
    title: "Reading a Phishing Message",
    subtitle: "The parts to look at, in order",
    estimatedMinutes: 14,
    intro:
      "This lesson is mostly practice. You will dissect two real-shaped messages, one bulk and one targeted, and be marked on both what you catch and what you wrongly accuse. The second part matters: a person who learns to suspect everything stops being able to work.",

    atoms: [
      {
        id: "a-cs-acct-anatomy",
        title: "The five places to look",
        explain:
          "Always in the same order, because the order is what makes it fast enough to actually do. The real sending domain, not the display name. The real link target, not its text. What the message is asking you to do. Whether it is applying time pressure. And whether this channel is how this thing normally happens.",
        why: "Every one of those five is something an attacker has to get right, and most attacks fail at least one. Spelling and grammar are not on the list on purpose. That advice is fifteen years out of date and it makes people trust well-written attacks.",
        table: {
          caption: "The checklist, and what each one catches.",
          headers: ["Look at", "Ask", "Catches"],
          rows: [
            ["The sending domain", "Is this really their domain, character by character?", "Lookalike domains"],
            ["The link target", "Where does this actually go?", "Fake login pages"],
            ["The ask", "Is it credentials, money, or an attachment?", "Almost every phish has one of the three"],
            ["The urgency", "Why does this have to happen now?", "Pressure that stops people checking"],
            ["The channel", "Is this how this normally arrives?", "Payroll changes by email, HR by WhatsApp"],
          ],
        },
        mistake:
          "Judging by how the message looks. Attackers copy the real email pixel for pixel, because it is a copy. The logo being perfect is evidence of nothing at all.",
      },
      {
        id: "a-cs-acct-dissect-phish",
        title: "Practice: a bulk phishing message",
        explain:
          "Here is a message of the kind that arrives in tens of thousands of inboxes at once. Work through the five checks and mark every part that should stop you. Be precise. Flagging parts that are perfectly ordinary is marked wrong too.",
        why: "Doing this deliberately a few times builds the reflex. Most people who get caught never looked at any of the five, because the message did not feel like something that needed checking, which was the whole design.",
        phishExercise: {
          task:
            "Click every part of this message that should stop you trusting it. There are three. Ordinary parts count against you.",
          tolerance: 0,
          message: {
            headers: [
              {
                id: "p-from",
                label: "From",
                value: "GTBank Security <alerts@gtbank-secure-verify.com>",
                flag: true,
                why: "The display name says GTBank. The actual domain is gtbank-secure-verify.com, which is not gtbank.com and belongs to whoever registered it last week. This is the single highest-value check, and it is the one people skip.",
              },
              {
                id: "p-to",
                label: "To",
                value: "you@example.com",
                safe: "Your own address in the To field is completely ordinary. Bulk phishing is often sent with recipients hidden, but seeing your own address proves nothing either way.",
              },
              {
                id: "p-subject",
                label: "Subject",
                value: "Account verification required",
                safe: "Plain and unremarkable. Real banks send subjects like this constantly. Suspecting a subject line on its own would mean suspecting most legitimate mail.",
              },
              {
                id: "p-date",
                label: "Date",
                value: "Tue, 14 Sep 2026, 09:14",
                safe: "An ordinary weekday morning. Odd hours are worth noticing in a targeted attack, but this timestamp is unremarkable.",
              },
            ],
            body: [
              {
                id: "p-greeting",
                text: "Dear Customer,",
                safe: "Generic greetings are weak evidence at best. Plenty of genuine bulk mail from real banks opens exactly this way, and plenty of phishing uses your correct full name.",
              },
              {
                id: "p-urgency",
                text: "Our records show unusual activity. Your account will be suspended within 24 hours unless verification is completed.",
                flag: true,
                why: "This is manufactured time pressure, and it is doing the real work of the attack. The deadline exists so that you act before you check. A genuine bank freezes the account and asks you to call, rather than setting a countdown that ends in you losing access.",
              },
              {
                id: "p-link",
                text: "Verify my account now",
                link: "https://gtbank-secure-verify.com/login/session?id=8831",
                flag: true,
                why: "The link text says verify your account. The destination is the attacker's domain. Always read the actual target, and note that https and a padlock prove only that the connection is encrypted, not that the site belongs to your bank.",
              },
              {
                id: "p-footer",
                text: "This is an automated message. Please do not reply to this email.",
                safe: "An entirely standard footer, present on most legitimate automated mail. It is copied from the real thing because it is copied from the real thing.",
              },
            ],
          },
          verdict:
            "Three signals: a lookalike sending domain, a manufactured deadline, and a link going somewhere that is not the bank. Notice what was NOT a signal. The greeting, the subject and the footer are all perfectly ordinary, and a person trained to flag those will be flagging their own bank's real mail by Thursday.",
          successMessage:
            "Exactly right, and nothing extra. That is the standard: catch what matters and leave the ordinary alone.",
        },
      },
      {
        id: "a-cs-acct-lookalike",
        title: "How lookalike domains actually work",
        explain:
          "An attacker cannot register gtbank.com. They can register almost anything that reads like it at a glance: a hyphen inserted, a word appended, a letter swapped for one that looks similar, or a completely different domain with the real name as a subdomain.",
        why: "Your eye reads the shape of a word and not its letters. That is a fact about human reading, not carelessness, and it is exactly what these registrations exploit. Reading the domain right to left from the final slash is the habit that defeats all of them.",
        table: {
          caption: "The real domain is the last two labels before the first single slash.",
          headers: ["What you see", "The real domain", "Trick"],
          rows: [
            ["gtbank-secure-verify.com", "gtbank-secure-verify.com", "Words appended with hyphens"],
            ["gtbank.com.login-session.net", "login-session.net", "Real name pushed into a subdomain"],
            ["gtbanl.com", "gtbanl.com", "One letter changed, reads identically at speed"],
            ["gtbank.com.ng.verify.io", "verify.io", "Longest and most convincing version of the same trick"],
          ],
          note: "In every row, read backwards from the first single slash. The two labels immediately before it are the only part that decides where you are going.",
        },
        mistake:
          "Trusting the padlock. It means the connection to that site is encrypted. Certificates are free and automatic, so the attacker's fake page has one too. The padlock has never meant the site is honest.",
      },
      {
        id: "a-cs-acct-spear",
        title: "Practice: a targeted message",
        explain:
          "This one was written for you. The attacker has read your company's website, knows your manager's name and knows there is a supplier relationship. Everything obvious about the bulk message is gone. Find what is left.",
        why: "Targeted messages are how organisations actually lose money. There is no deadline shouting at you, no bad grammar and no generic greeting, so a person trained only on the bulk version has nothing to fall back on except the five checks.",
        phishExercise: {
          task:
            "Three parts of this message should stop you. The pressure here is much quieter than in the last one.",
          tolerance: 0,
          message: {
            headers: [
              {
                id: "s-from",
                label: "From",
                value: "Ngozi Eze <n.eze@memorasmart-ng.com>",
                flag: true,
                why: "The name is real and correct. The domain is not: the company is memorasmart.com, and this is memorasmart-ng.com, registered separately. A hyphen and a country code is all it took, and against a name you recognise your eye will not stop on it.",
              },
              {
                id: "s-to",
                label: "To",
                value: "you@memorasmart.com",
                safe: "Your correct work address. In a targeted attack this is expected, and it tells you nothing about whether the sender is genuine.",
              },
              {
                id: "s-subject",
                label: "Subject",
                value: "Re: Q3 supplier reconciliation",
                safe: "A plausible subject on a real topic, with a Re: suggesting an existing thread. Suspicious-sounding subjects are a bulk-phishing trait; a targeted attacker picks something boring on purpose.",
              },
            ],
            body: [
              {
                id: "s-greeting",
                text: "Hi, hope the week is going well. Following up on the reconciliation before month end.",
                safe: "Ordinary, correctly spelled, and consistent with a colleague who has a real reason to write to you. Nothing here is evidence.",
              },
              {
                id: "s-ask",
                text: "Can you send me the supplier list with the bank details in a spreadsheet? I need it for the audit and I am in meetings all afternoon, so email is easiest.",
                flag: true,
                why: "The ask is the payload. Bank details for every supplier, in one file, by email. Notice also the pre-emptive excuse for why you cannot just walk over and ask, which removes the verification step before you think of it.",
              },
              {
                id: "s-link",
                text: "Shared folder for the audit",
                link: "https://memorasmart.sharepoint-docs.net/audit/q3",
                flag: true,
                why: "Read the domain backwards from the slash: sharepoint-docs.net, which is not Microsoft and not your company. Your real tenant would be memorasmart.sharepoint.com. Pushing the familiar name into a subdomain is the most effective version of this trick.",
              },
              {
                id: "s-signature",
                text: "Ngozi Eze · Finance Manager · Memora Smart Technologies",
                safe: "Correct name, correct title, correct company. All of it is on the website, which is where the attacker got it. A correct signature is evidence of research, not of legitimacy.",
              },
            ],
          },
          verdict:
            "A lookalike domain, an ask for exactly the data a fraudster needs, and a link to a domain that is not yours. The single control that would have caught all of it: verify unusual requests for data or money on a channel you chose, not the one the message arrived on.",
          successMessage:
            "That is the hard one done. Notice how little there was to go on, and how the five checks still found all three.",
        },
      },
      {
        id: "a-cs-acct-what-to-do",
        title: "What to do, and why deleting is the wrong answer",
        explain:
          "Report it, using whatever the organisation's reporting button or address is. Do not just delete it, and do not forward it round the team as a warning. If you already clicked, say so immediately.",
        why: "You are almost never the only recipient. Reporting lets the response team pull the same message from everyone else's inbox before the tenth person clicks. Deleting protects only you, and silently removes the evidence that would have protected everyone.",
        analogy:
          "Putting out the fire in your own kitchen and not mentioning it to the neighbours in the same building.",
        mistake:
          "Punishing people who report clicking on something. An organisation where admitting a mistake is career-limiting is an organisation that finds out about its breaches from somebody else, months later.",
        practice: {
          prompt:
            "You clicked a link in a phishing email and typed your password before realising. It is 11pm. What is the first thing you do?",
          answer:
            "Change that password immediately, from a device you trust, and then report it tonight rather than in the morning. Attackers automate the use of stolen credentials within minutes, so the hours you spend feeling embarrassed are the hours they are working in. If the account has multi-factor, also check whether a new factor has been registered, because that is the first thing they do.",
        },
      },
    ],

    task: {
      title: "This week's lab",
      intro:
        "Harden your own accounts, then build the artefact that will go in your portfolio.",
      prompts: [
        "Install a password manager and move your five most important accounts into it, with a newly generated password for each. Start with the email account that can reset the others.",
        "Turn on the strongest multi-factor each of those five supports. Where a passkey is offered, use it. Where only SMS is offered, use it anyway and note the gap.",
        "Check your main email address on a breach notification service and list every site where you have reused a password that appears in a breach.",
        "Take the two messages you dissected in this lesson and write an annotated phishing checklist: the five checks, and one real example of each signal.",
        "Write a before and after risk assessment: what an attacker holding your old password could have reached, and what they could reach now.",
      ],
      closing:
        "The annotated checklist is a genuine portfolio piece. It is also the thing you will be asked to produce in about a third of entry-level security interviews.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
