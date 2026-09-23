/**
 * CYBERSECURITY · WEEK 3 · SECURING DATA — CRYPTOGRAPHY & HASHING
 *
 * Harvard anchor: CS50 Cybersecurity, "Securing Data". Cryptography as the
 * mechanism behind everyday privacy.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * EVERY HASH IN THIS FILE IS REAL. The digests quoted are genuine SHA-256
 * output and are recomputed by lib/academy/cyber/validate.mjs on every build,
 * so a typo cannot ship. A learner can verify any of them with
 * `echo -n "password123" | sha256sum` on any machine, and they should, because
 * a cryptography lesson that asks for trust while printing invented hex is
 * teaching the opposite of what cryptography is for.
 */

export const SECTION_ID = "cs-s3-data";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l9-hashing",
    moduleId: "cs-w3-data",
    sectionId: SECTION_ID,
    order: 1,
    title: "Hashing Is Not Encryption",
    subtitle: "A fingerprint, not a locked box",
    estimatedMinutes: 12,
    intro:
      "These two words are used interchangeably by almost everyone and they describe opposite things. One is designed to be reversible. The other is designed to be impossible to reverse. Getting them the wrong way round leads directly to systems that store passwords wrongly, so this lesson starts here.",

    atoms: [
      {
        id: "a-cs-data-what-is-hash",
        title: "What a hash actually is",
        explain:
          "A hash function takes any input, of any size, and produces a fixed-length output. The same input always gives the same output. A different input gives a completely different output. And there is no practical way to work backwards from the output to the input.",
        why: "That last property is the whole point, and it is why hashing is used for passwords. A site can check that you typed the right password without ever storing the password. It stores the fingerprint and compares fingerprints.",
        analogy:
          "A fingerprint identifies a person reliably and cannot be used to reconstruct them. You cannot grow a human from a fingerprint, and you cannot recover a password from its hash.",
        crypto: {
          mode: "hash",
          task:
            "Type in the boxes below. Both digests are real SHA-256, computed by your browser right now. Change one character in the second box and watch what happens.",
          samples: ["password", "Password"],
          note: "A one-character change produces an output with no visible relationship to the first. That is called the avalanche effect, and it is why you cannot work backwards by guessing closer and closer.",
        },
        mistake:
          "Saying a password is \"encrypted\" in a database. If it were encrypted, somebody holds a key that turns it back into your password. Properly stored passwords are hashed, and nobody, including the company, can recover them.",
      },
      {
        id: "a-cs-data-hash-vs-encrypt",
        title: "Encryption, and when you want each one",
        explain:
          "Encryption is reversible by design. You encrypt so that the right person can decrypt later. Hashing is one-way by design. You hash when you never want the original back, only the ability to check whether something matches.",
        why: "The choice follows from one question: does anybody ever need to read this again? A password, no. A customer's address, yes, because you have to print it on a parcel. Hash the first, encrypt the second.",
        table: {
          caption: "The same question, answered by the requirement.",
          headers: ["Data", "Does anyone need it back?", "Use"],
          rows: [
            ["A password", "Never", "Hash, with a salt and a slow algorithm"],
            ["A customer's home address", "Yes, to deliver to it", "Encrypt at rest"],
            ["A downloaded file's integrity check", "No, only compare", "Hash"],
            ["A message to a colleague", "Yes, they must read it", "Encrypt"],
          ],
        },
        practice: {
          prompt:
            "A support agent tells you they can see your password in their system to read it back to you. What does that tell you?",
          answer:
            "That it is not hashed. It is either stored in the clear or encrypted with a key their system holds. Either way, a breach of that system exposes every customer's actual password, and since people reuse passwords, it exposes their other accounts too.",
        },
      },
      {
        id: "a-cs-data-crack-hash",
        title: "Why a hash alone is not protection",
        explain:
          "Hashing is one-way, and that is not the same as safe. The attacker does not need to reverse anything. They take a list of common passwords, hash every one, and compare. If your password is in the list, the comparison finds it instantly.",
        why: "This is the single most important thing to understand about stored passwords, and the fastest way to understand it is to do it. Below is one row from a stolen database, stored the way far too many systems still store them: SHA-256, no salt. Crack it.",
        cryptoExercise: {
          mode: "crack",
          task:
            "This hash came from a breached database. The attacker's wordlist is below. Work out which password produced it. Each attempt hashes your guess for real and compares.",
          target: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
          candidates: ["letmein", "password123", "Adaeze2024", "qwerty", "correcthorse", "naija123"],
          salt: "",
          successMessage:
            "That took you four clicks. Software does 10 billion of those a second. The hash was never protecting this password, because the password was in the list.",
          note: "Notice what did the work here. Not cleverness about SHA-256, which nobody has broken. Just a list, and the fact that the same password always produces the same hash.",
        },
        mistake:
          "Concluding that SHA-256 is broken. It is not. What failed is using a fast, unsalted hash for passwords, which is a design choice, not a flaw in the mathematics.",
      },
      {
        id: "a-cs-data-rainbow",
        title: "Rainbow tables, and why speed is the enemy",
        explain:
          "If everyone's password is hashed the same way, an attacker can compute the table once and reuse it against every breached database forever. That precomputed table is what a rainbow table is. And because hashes like SHA-256 are designed to be fast, computing it is cheap.",
        why: "Here is the counter-intuitive part. For passwords you want a hash that is deliberately slow. bcrypt, scrypt and Argon2 exist precisely to be expensive to compute. A hash that takes a quarter of a second is imperceptible when you log in once, and it turns ten billion guesses a second into forty.",
        table: {
          caption: "The same wordlist attack, against different storage choices.",
          headers: ["Stored as", "Guesses per second on one GPU", "Time for a 10-million word list"],
          rows: [
            ["SHA-256, no salt", "About 10 billion", "Under a second"],
            ["SHA-256, salted per user", "About 10 billion, but once per user", "Under a second, per user"],
            ["bcrypt, cost 12", "About 25", "Around five days, per user"],
            ["Argon2id, tuned", "Around 10", "Weeks, per user"],
          ],
          note: "Salting stops one table cracking everyone at once. Slowness is what stops any single password falling quickly. You need both.",
        },
        analogy:
          "A salt means the thief has to pick every lock individually instead of using one master key. A slow hash means each lock takes five days.",
      },
      {
        id: "a-cs-data-salt-it",
        title: "Practice: salt the database",
        explain:
          "A salt is a value stored alongside the hash, in the clear, that is mixed into the password before hashing. Its only job is to make sure two people with the same password do not end up with the same stored hash.",
        why: "Beginners almost always assume the salt is a second secret. It is not, and it does not need to be. Below are three accounts, two of which chose the same password. Give each one a salt and watch the stored values separate.",
        cryptoExercise: {
          mode: "salt",
          task:
            "Adaeze and Chuka chose the same password, which you cannot change. Give each account a salt so that no two stored hashes are alike. Try giving them all the same salt first, and read what happens.",
          users: [
            { id: "u1", name: "Adaeze", password: "Lagos2026!" },
            { id: "u2", name: "Chuka", password: "Lagos2026!" },
            { id: "u3", name: "Ngozi", password: "octopus-rail-4" },
          ],
          successMessage:
            "Done. Two people, one password, two completely different stored values, and the salts are sitting there in the clear where anyone can read them. The secrecy was never the point.",
          note: "In a real system the salt is generated randomly per account and stored in the same row as the hash. Nobody memorises it and nobody hides it.",
        },
        mistake:
          "Using the username as a salt. It is unique per account, which helps, and it is also predictable across every system in the world, so an attacker targeting users named admin can still precompute. Use random values.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l10-symmetric-asymmetric",
    moduleId: "cs-w3-data",
    sectionId: SECTION_ID,
    order: 2,
    title: "Two Kinds of Encryption",
    subtitle: "One key, or a pair",
    estimatedMinutes: 11,
    intro:
      "Symmetric and asymmetric encryption solve different problems, and almost every real system uses both together. Understanding why they are combined explains most of how the secure internet works.",

    atoms: [
      {
        id: "a-cs-data-symmetric",
        title: "Symmetric: one key, both directions",
        explain:
          "The same key encrypts and decrypts. AES is the one you will meet everywhere: in disk encryption, in backups, in the body of every HTTPS connection. It is fast, well understood, and has resisted serious attack for over twenty years.",
        why: "Speed is why it dominates. Encrypting a 40GB backup with symmetric cryptography is a background task. Doing the same with public-key cryptography would be absurdly slow, which is the constraint that shapes everything in the next atom.",
        mistake:
          "Thinking the algorithm is the hard part. AES is not where symmetric systems fail. They fail on key management: where the key is stored, who can read it, and what happens when the person who set it up leaves.",
      },
      {
        id: "a-cs-data-key-problem",
        title: "The problem symmetric cryptography cannot solve",
        explain:
          "To send you an encrypted message I need you to have the key. To send you the key safely, I would need to encrypt it. To encrypt it, I need a key you already have. This is circular, and for most of the history of cryptography it was solved by physically carrying keys around.",
        why: "This is the exact problem you have when your browser connects to a bank it has never spoken to before. You cannot agree a shared secret over a channel that anyone might be listening to, and that is the problem public-key cryptography was invented to solve.",
        analogy:
          "You want to post a locked box to someone in another city. You have the only key. Posting the key in a separate envelope means anyone who intercepts both has everything.",
      },
      {
        id: "a-cs-data-asymmetric",
        title: "Asymmetric: a pair that only works one way round",
        explain:
          "Two mathematically linked keys. Anything encrypted with the public key can only be decrypted with the private key, and the reverse. You publish the public key to the entire world and keep the private key on your own machine, forever.",
        why: "This breaks the circle. Anyone can encrypt something for you without ever having spoken to you, because your public key is public. Only you can read it, because only you hold the private half.",
        table: {
          caption: "The two operations, and what each one is for.",
          headers: ["Encrypt with", "Decrypt with", "Gives you"],
          rows: [
            ["Recipient's public key", "Recipient's private key", "Confidentiality. Only they can read it"],
            ["Your private key", "Your public key, which is everyone", "A signature. Proof it came from you"],
          ],
          note: "The second row is not encryption for secrecy. Everyone can read it. Its value is that only you could have produced it.",
        },
        mistake:
          "Mixing up which key does what. If you encrypt with your own private key, you have signed something, not hidden it. Anyone in the world can read it, which is the whole point of a signature.",
      },
      {
        id: "a-cs-data-signatures",
        title: "Digital signatures, and what they actually prove",
        explain:
          "A signature is the hash of a document, encrypted with the signer's private key. To verify it, you hash the document yourself and decrypt the signature with the signer's public key. If the two match, the document has not changed and it came from the holder of that private key.",
        why: "Notice what it proves and what it does not. It proves integrity and origin. It does not provide confidentiality, and it does not prove the signer is who they claim to be in the real world. That last part is what certificates exist for, and it is the next lesson.",
        analogy:
          "A wax seal shows the letter has not been opened and that whoever sealed it had the ring. It says nothing about whether the person holding the ring was entitled to it.",
        decision: {
          scenario:
            "A software vendor publishes an installer with a digital signature, and the signature verifies correctly on your machine. A colleague says this proves the file is safe.",
          question: "What is the accurate statement?",
          options: [
            {
              id: "a",
              text: "It proves the file is safe to run, because the signature is valid",
              whyWrong:
                "A valid signature proves the file has not been altered since signing and that it was signed by the holder of that key. If the vendor's own build system was compromised, they signed malware and the signature verifies perfectly. That is exactly how several major supply-chain attacks worked.",
            },
            {
              id: "b",
              text: "It proves the file has not been modified since it was signed, and that whoever holds that private key signed it. Nothing more",
              why: "This is precisely what a signature asserts. It is genuinely valuable, because it rules out tampering in transit and on the download mirror. It says nothing about whether the signed content was good.",
            },
            {
              id: "c",
              text: "It proves the vendor is a legitimate company",
              whyWrong:
                "Identity is asserted by the certificate authority that issued the signing certificate, not by the signature itself, and the level of checking varies. A signature verifying tells you a key was used, not who deserves your trust.",
            },
            {
              id: "d",
              text: "It proves nothing useful, since anyone can sign a file",
              whyWrong:
                "Anyone can sign a file with their own key, and that is not the same as signing with the vendor's key. The signature rules out modification after signing, which is a real and frequently exploited attack path.",
            },
          ],
          correct: "b",
          aftermath:
            "Being precise about what a control proves is most of security engineering. A signature that everyone believes means \"safe\" is a control that will be trusted in exactly the situation where it does not apply.",
        },
      },
      {
        id: "a-cs-data-hybrid",
        title: "Why real systems use both",
        explain:
          "Asymmetric cryptography solves key exchange and is slow. Symmetric cryptography is fast and cannot start a conversation. So every real system does the obvious thing: use asymmetric to agree on a fresh symmetric key, then use that symmetric key for the actual data.",
        why: "This is what happens in the first few milliseconds of every HTTPS connection you make. Understanding the split is what makes TLS comprehensible instead of magical, and it is the next lesson.",
        example:
          "Opening a connection to your bank:\n\n  1. asymmetric  the server proves who it is, and both sides agree a secret\n  2. symmetric   everything after that is AES, because there is a lot of it\n\nThe expensive operation happens once. The cheap one happens for every byte.",
        practice: {
          prompt: "Why not use asymmetric encryption for the whole conversation?",
          answer:
            "Speed. Public-key operations are orders of magnitude more expensive than symmetric ones, and a page with fifty resources on it would crawl. The design uses each kind where its strength lies: asymmetric to solve the introduction, symmetric to move the data.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l11-tls-certificates",
    moduleId: "cs-w3-data",
    sectionId: SECTION_ID,
    order: 3,
    title: "HTTPS, TLS and Certificates",
    subtitle: "What the padlock does and does not promise",
    estimatedMinutes: 10,
    intro:
      "Everyone has been told to look for the padlock. Very few people have been told what it means, and the gap between what it means and what people think it means is where a great deal of fraud lives.",

    atoms: [
      {
        id: "a-cs-data-what-tls-does",
        title: "The three things TLS gives you",
        explain:
          "Confidentiality, so that nobody between you and the server can read the traffic. Integrity, so that nobody can change it undetected. And authentication of the server, so that you are talking to the machine that holds the certificate for that domain.",
        why: "All three matter, and the third is the one that gets misread. TLS authenticates the DOMAIN. It says you are really talking to gtbank-secure-verify.com. It has no opinion whatsoever about whether gtbank-secure-verify.com is your bank.",
        table: {
          caption: "What a padlock on a phishing site means.",
          headers: ["Claim", "True?", "Why"],
          rows: [
            ["Nobody can read what I type here", "Yes", "The connection really is encrypted"],
            ["This is really the domain shown in the bar", "Yes", "That is what the certificate proves"],
            ["This site belongs to my bank", "No", "Nothing in TLS checks that"],
            ["This site is honest", "No", "Certificates are free and automatic"],
          ],
        },
        mistake:
          "Teaching people to \"look for the padlock\". Well over 80% of phishing sites have one, because certificates cost nothing and issue in seconds. The padlock tells you the line is private. It does not tell you who is on the other end of it.",
      },
      {
        id: "a-cs-data-certificates",
        title: "What a certificate actually is",
        explain:
          "A certificate binds a public key to a domain name, and is signed by a certificate authority. Your browser ships with a list of authorities it trusts. When the site presents a certificate, the browser checks the signature chain back to one of those, checks the domain matches, and checks it has not expired.",
        why: "So the trust is transitive: you trust the browser vendor, who trusts the authority, who checked that whoever requested the certificate controlled the domain. Each link is a place things can go wrong, and historically each one has.",
        example:
          "Certificate chain for gtbank.com\n\n  gtbank.com                          issued to the domain\n    signed by  DigiCert TLS RSA CA     an intermediate\n      signed by  DigiCert Global Root  in your browser's trust store\n\nThe browser walks upward until it reaches something it already trusts.",
        mistake:
          "Assuming a certificate says something about the organisation. Most certificates issued today only prove control of the domain. Nobody checked a company registration, because for a domain-validated certificate nobody is meant to.",
      },
      {
        id: "a-cs-data-mitm",
        title: "Machine-in-the-middle, and why it usually fails",
        explain:
          "An attacker between you and the server can see and change traffic. Against plain HTTP that is total control. Against TLS they hit a wall: to impersonate the server they need a certificate for that domain, signed by an authority your browser trusts, and they do not have one.",
        why: "This is why the certificate warning matters so much and why clicking through it is genuinely dangerous. That warning is the one moment the whole system tells you something is wrong, and it is trained out of people by every badly configured internal site they have ever used.",
        analogy:
          "The interceptor can copy the sealed envelope, delay it, or throw it away. What they cannot do is open it, change the contents and reseal it with a seal your recipient recognises.",
        decision: {
          scenario:
            "You connect to the WiFi in a hotel lobby and your browser shows a certificate warning for your webmail: the certificate is not signed by a trusted authority.",
          question: "What is happening, and what do you do?",
          options: [
            {
              id: "a",
              text: "It is a hotel captive portal quirk. Accept the warning and continue, then sign in",
              whyWrong:
                "This is the reasoning that makes the attack work, and it is reasonable-sounding because captive portals really do cause warnings. The difference is that a portal warning appears for a portal domain, not for your webmail. Accepting here hands your password to whoever issued that certificate.",
            },
            {
              id: "b",
              text: "Stop. Do not accept it, do not sign in, and use mobile data if you need that account",
              why: "A warning on your webmail domain means something is presenting a certificate it should not have. That is the exact signature of interception, and the correct response is to not complete the connection at all.",
            },
            {
              id: "c",
              text: "Accept it but avoid typing your password, just read what is already loaded",
              whyWrong:
                "Once you accept the certificate the attacker is inside the session. Existing session cookies are sent on the next request, which is enough to take the account without ever seeing a password.",
            },
            {
              id: "d",
              text: "Clear the browser cache and try again on the same network",
              whyWrong:
                "The warning is about the certificate the network is presenting, not about anything cached locally. Retrying on the same network gets the same certificate, and repeated attempts mainly wear down your resolve.",
            },
          ],
          correct: "b",
          aftermath:
            "This is one of very few moments in ordinary computing where the security system positively tells you an attack may be in progress. Treating those warnings as noise is the single most trained-in bad habit in the industry.",
        },
      },
      {
        id: "a-cs-data-tls-versions",
        title: "Why the version matters",
        explain:
          "TLS 1.0 and 1.1 are withdrawn. SSL, its predecessor, has been broken for years, and the word survives only because people kept saying it. Current systems use TLS 1.2 or 1.3, and 1.3 removed every cipher that had turned out to be a problem rather than leaving them configurable.",
        why: "A server that still accepts an old version can be forced down onto it by an attacker in the middle, and then the encryption it advertises is not the encryption you get. This is called a downgrade attack, and it is why scanning reports flag old protocol support as a finding rather than a preference.",
        table: {
          caption: "What a scan report is telling you when it lists these.",
          headers: ["Protocol", "Status", "What to do"],
          rows: [
            ["SSL 2.0 / 3.0", "Broken, for years", "Disable. There is no argument for keeping it"],
            ["TLS 1.0 / 1.1", "Withdrawn in 2021", "Disable, after checking for ancient clients"],
            ["TLS 1.2", "Current, if configured well", "Keep, with weak ciphers removed"],
            ["TLS 1.3", "Current and simpler", "Prefer it. Bad options were removed, not just discouraged"],
          ],
        },
        mistake:
          "Leaving old versions enabled \"for compatibility\" without ever checking whether anything actually needs them. In most organisations the answer is nothing has for years, and nobody checked because nobody was asked to.",
      },
      {
        id: "a-cs-data-e2ee",
        title: "End-to-end encryption is a different claim",
        explain:
          "TLS protects data between you and the server. End-to-end encryption protects data between you and the other person, so the server in the middle holds only ciphertext it cannot read. These are different guarantees and they are constantly conflated in marketing.",
        why: "It decides who has to be trusted. With TLS alone, the provider can read everything, because they hold the key at their end. With end-to-end encryption they cannot, even under a court order, because they never had it.",
        table: {
          caption: "Who can read your message.",
          headers: ["", "You", "The provider", "Someone on the WiFi"],
          rows: [
            ["Plain HTTP", "Yes", "Yes", "Yes"],
            ["TLS only", "Yes", "Yes", "No"],
            ["End-to-end encrypted", "Yes", "No", "No"],
          ],
        },
        mistake:
          "Reading \"your data is encrypted\" as end-to-end. Almost always it means encrypted in transit and at rest, with the provider holding the keys. Both are worth having and neither is the stronger claim.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cs-l12-data-at-rest",
    moduleId: "cs-w3-data",
    sectionId: SECTION_ID,
    order: 4,
    title: "Data at Rest, Deletion and Ransomware",
    subtitle: "Protecting what is sitting still",
    estimatedMinutes: 10,
    intro:
      "Encryption in transit is largely solved and largely automatic. Data sitting on disks is where most organisations actually lose control, and it is where the decisions are still yours to make.",

    atoms: [
      {
        id: "a-cs-data-fde",
        title: "Full-disk encryption, and exactly what it protects",
        explain:
          "Full-disk encryption means the contents of the drive are unreadable without the key, which is released when the machine boots and the user authenticates. BitLocker, FileVault and LUKS all do this.",
        why: "It protects against one scenario extremely well: somebody physically takes the device while it is off. That is not a small scenario. It is the most common way organisations lose data, because laptops get stolen from cars constantly.",
        mistake:
          "Believing it protects a running machine. Once booted and logged in, the disk is decrypted for anything running on it, including malware and anyone who walks up to the unlocked screen. Full-disk encryption answers theft, not intrusion.",
        table: {
          caption: "One control, honestly scoped.",
          headers: ["Scenario", "Does full-disk encryption help?"],
          rows: [
            ["Laptop stolen from a car, powered off", "Yes, completely"],
            ["Laptop stolen while suspended and logged in", "Often not. The key may be in memory"],
            ["Malware running as the user", "No. It sees exactly what the user sees"],
            ["Someone copying files over the network", "No. The disk is decrypted to the running system"],
            ["Old drive sent for disposal", "Yes, and it makes secure disposal trivial"],
          ],
        },
      },
      {
        id: "a-cs-data-deletion",
        title: "Deleting does not delete",
        explain:
          "Deleting a file usually removes the pointer to it, not the contents. The data stays on the disk until something else happens to be written over it, which is why recovery tools work and why they are the first thing a forensic examiner reaches for.",
        why: "It matters in two directions. When you dispose of a device, deleted files are still there. And in Week 12, when you are the one investigating, the same fact is what lets you recover what an attacker tried to remove.",
        table: {
          caption: "How to actually get rid of data.",
          headers: ["Medium", "What works", "What does not"],
          rows: [
            ["Magnetic hard disk", "Overwrite the whole drive, or destroy it physically", "Deleting files, or a quick format"],
            [
              "SSD",
              "The drive's own secure erase command, or encrypt from day one and destroy the key",
              "Overwriting, because wear levelling moves data around",
            ],
            ["Phone", "Factory reset on a device that was encrypted from the start", "Deleting photos and apps"],
            ["Cloud storage", "Provider's deletion process, and check the backups", "Emptying the visible trash"],
          ],
          note: "Encrypting from day one turns secure deletion into destroying one small key, which is why it is the practical answer for SSDs.",
        },
      },
      {
        id: "a-cs-data-backups",
        title: "Backups are a security control",
        explain:
          "Backups are usually managed as an availability concern owned by the operations team. Since ransomware exists, they are the primary defence against an attack that no amount of prevention reliably stops, and that makes them a security control.",
        why: "The rule most organisations discover too late is that a backup an attacker can reach is not a backup. Ransomware operators specifically hunt for and encrypt backup servers first, precisely because they know that is what would have saved you.",
        example:
          "The 3-2-1 rule, and what each number is defending against:\n\n  3  copies of the data          a single failure does not lose it\n  2  different kinds of media    one medium's failure mode does not hit both\n  1  copy offline or immutable   an attacker with your admin password cannot reach it\n\nThe last one is the security part. The first two are reliability.",
        mistake:
          "Never testing a restore. A backup nobody has restored from is an untested assumption. The day you find out it does not work is by definition the worst possible day.",
      },
      {
        id: "a-cs-data-ransomware",
        title: "Why ransomware changed the calculation",
        explain:
          "Modern ransomware does two things. It encrypts your data so you cannot work, and it copies the data out first so it can threaten to publish it. That second step is deliberate, and it exists specifically because organisations got better at restoring from backup.",
        why: "It means restoring no longer ends the incident. You get your operations back and you still have a data breach, with the notification obligations that go with it. Any plan that says \"we have backups, so ransomware is handled\" is a plan for the attack as it was in 2016.",
        decision: {
          scenario:
            "Ransomware has encrypted your file server on a Friday evening. You have offline backups from that morning. The attacker is demanding payment and says they will publish the data in 72 hours.",
          question: "Which statement should go in the first update to management?",
          options: [
            {
              id: "a",
              text: "We have backups, so we will be operational by Monday and the incident is contained",
              whyWrong:
                "The first half is true and the second is not. Restoring addresses availability and does nothing about the copy the attacker took. Telling management the incident is contained sets up a far worse conversation when the data appears publicly.",
            },
            {
              id: "b",
              text: "We can restore operations from this morning's backup. We must also treat this as a data breach, because the data was copied out before encryption",
              why: "It separates the two harms and names both. Restoring solves the outage. The exfiltration is a confidentiality incident with legal notification duties, and it has to be worked in parallel starting now.",
            },
            {
              id: "c",
              text: "We should pay, because paying is faster than restoring and stops publication",
              whyWrong:
                "Payment buys a promise from a criminal. Data is frequently published anyway or sold on, decryption tools are often slow and incomplete, and in many jurisdictions payment carries its own legal exposure. It is a decision for leadership with legal advice, never a technical recommendation in a first update.",
            },
            {
              id: "d",
              text: "We should restore immediately and investigate afterwards to minimise downtime",
              whyWrong:
                "Restoring over the affected systems destroys the evidence needed to find out how they got in. Restore onto clean infrastructure and preserve the originals, or you will be attacked the same way again next month with no idea how.",
            },
          ],
          correct: "b",
          aftermath:
            "Notice the shape of the right answer: it names both broken legs of the triad and refuses to let the easy one hide the hard one. You will do this formally in Week 12.",
        },
      },
      {
        id: "a-cs-data-key-management",
        title: "Where encryption actually fails",
        explain:
          "Almost never in the algorithm. AES and SHA-256 are not the weak point in any system you will work on. Encryption fails at key management: keys committed to a code repository, keys stored beside the data they protect, keys nobody can find when the person who made them leaves.",
        why: "It reframes what \"we encrypt our data\" means as a claim. The honest follow-up questions are where the key is, who can read it, what happens when that person leaves, and how you would rotate it after a breach. Most organisations cannot answer the last two.",
        example:
          "The most common failure in the entire field:\n\n  # config.py\n  DB_PASSWORD = \"prod-db-9f2k\"\n  AWS_SECRET_KEY = \"wJalrXUt...\"\n\ncommitted to a repository in 2021, still in the history today,\nstill valid, and found by an automated scanner within minutes\nof the repository being made public.",
        mistake:
          "Storing the encryption key on the same server as the encrypted database. Anyone who gets the database gets the key with it, and you have built something that satisfies an audit checkbox and stops nobody.",
      },
    ],

    task: {
      title: "This week's lab",
      intro: "Do the cryptography rather than read about it.",
      prompts: [
        "On your lab VM, hash the same string with `sha256sum` twice and confirm the output is identical. Then change one character and compare. Paste both digests into your notes.",
        "Hash the string `password123` and check it against the digest you cracked in this lesson. They will match, and you should see that for yourself rather than take it from a web page.",
        "Use `openssl enc` to encrypt a file with a passphrase and decrypt it again. Then try decrypting with the wrong passphrase and record exactly what happens.",
        "Generate a GnuPG key pair, export the public key, encrypt a file to yourself and decrypt it. Write down which key did which job at each step.",
        "Open your bank's website, view the certificate, and write down the domain it is issued to, the authority that signed it, the expiry date and the chain up to the root.",
        "Write a one-page comparison of hashing and encryption with your own worked example of each, including the two digests from step one.",
      ],
      closing:
        "The write-up is a graded deliverable. If you cannot explain from your own example why a hash cannot be reversed but can be cracked, go back to the first lesson before moving on.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
