/**
 * ASSESSMENTS · CYBERSECURITY · WEEK 3 · SECURING DATA
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l9-hashing": {
    lessonId: "cs-l9-hashing",
    passMark: 70,
    questions: [
      {
        id: "csq9-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-data-hash-vs-encrypt",
        prompt:
          "A support agent reads your password back to you over the phone. What does that prove about how it is stored?",
        options: [
          { id: "a", text: "It is hashed with a strong algorithm" },
          { id: "b", text: "It is not hashed. It is stored in the clear or encrypted with a key they hold" },
          { id: "c", text: "It is salted but not hashed" },
          { id: "d", text: "Nothing, because agents can reverse any hash" },
        ],
        correct: "b",
        explanation:
          "Hashing is one-way. If anyone can recover the original, it was never hashed. That means a breach of their system exposes real passwords, which people reuse elsewhere.",
        whyWrong: {
          a: "A hash cannot be turned back into the password by anybody, including the company that stored it. Being able to read it out rules hashing out entirely.",
          c: "A salt is an input to hashing. Saying it is salted but recoverable describes something that does not exist.",
          d: "Nobody can reverse SHA-256 or bcrypt. Attackers crack hashes by guessing and comparing, which is not reversal and is not something a support agent does on a call.",
        },
      },
      {
        id: "csq9-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-data-crack-hash",
        prompt:
          "You cracked an unsalted SHA-256 hash in four guesses. What does that tell you about SHA-256?",
        options: [
          { id: "a", text: "That SHA-256 is broken and should not be used" },
          {
            id: "b",
            text: "Nothing. The password was in a wordlist, and a fast unsalted hash was the wrong storage choice",
          },
          { id: "c", text: "That the hash was reversed" },
          { id: "d", text: "That the database was not encrypted" },
        ],
        correct: "b",
        explanation:
          "Nobody reversed anything. The attacker hashed candidate passwords and compared. SHA-256 is intact; using it fast and unsalted for passwords is the design error.",
        whyWrong: {
          a: "SHA-256 has no practical break. What failed was applying a hash designed for speed to a job that requires slowness.",
          c: "Reversal would mean computing the input from the output, which nobody can do. Guess and compare is a completely different operation.",
          d: "Encrypting the database would help against theft of the file, and would change nothing once the attacker has the hashes, which is the situation described.",
        },
      },
      {
        id: "csq9-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-data-rainbow",
        prompt: "Why is a deliberately slow hash such as bcrypt preferred for passwords?",
        options: [
          { id: "a", text: "Because slow algorithms are mathematically stronger" },
          {
            id: "b",
            text: "Because the cost is imperceptible for one login and devastating for billions of guesses",
          },
          { id: "c", text: "Because it produces a longer output" },
          { id: "d", text: "Because it does not need a salt" },
        ],
        correct: "b",
        explanation:
          "A quarter of a second is nothing when you log in once. It turns ten billion guesses a second into roughly twenty-five, which is the difference between cracking a list in a second and in days per password.",
        whyWrong: {
          a: "Slowness is a tuning parameter, not a property of the mathematics. A fast hash is not weaker at being a hash; it is just the wrong tool here.",
          c: "Output length is unrelated. bcrypt output is not notably longer, and length is not what defeats guessing.",
          d: "bcrypt salts by default. Salting and slowness solve different problems and you need both.",
        },
      },
      {
        id: "csq9-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-data-salt-it",
        prompt: "What is a salt actually for?",
        options: [
          { id: "a", text: "It is a second secret that must be protected as carefully as the password" },
          {
            id: "b",
            text: "It ensures two identical passwords do not produce the same stored hash, defeating precomputed tables",
          },
          { id: "c", text: "It encrypts the hash" },
          { id: "d", text: "It makes the hash function slower" },
        ],
        correct: "b",
        explanation:
          "A salt is stored in the clear beside the hash. Its only job is to make every stored hash unique, so one precomputed table cannot crack the whole database at once.",
        whyWrong: {
          a: "This is the most common misconception. Salts are not secret, are stored alongside the hash, and work perfectly well when the attacker can read them.",
          c: "Nothing is encrypted. The salt is concatenated with the password before hashing.",
          d: "Slowness comes from the algorithm's cost parameter. A salt adds no meaningful time.",
        },
      },
      {
        id: "csq9-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-data-what-is-hash",
        prompt:
          "Changing one character of the input changes only a small part of a SHA-256 digest.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. About half the bits change, with no visible relationship to the original. That is the avalanche effect, and it is why you cannot guess your way closer to an answer one character at a time.",
        whyWrong: {
          a: "If small input changes produced small output changes, an attacker could hill-climb towards the input. The design specifically prevents that.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l10-symmetric-asymmetric": {
    lessonId: "cs-l10-symmetric-asymmetric",
    passMark: 70,
    questions: [
      {
        id: "csq10-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-data-key-problem",
        prompt:
          "What problem does public-key cryptography solve that symmetric encryption cannot?",
        options: [
          { id: "a", text: "It encrypts large files faster" },
          {
            id: "b",
            text: "It lets two parties who have never met agree on a secret over a channel anyone can listen to",
          },
          { id: "c", text: "It produces shorter ciphertext" },
          { id: "d", text: "It removes the need for any key at all" },
        ],
        correct: "b",
        explanation:
          "Symmetric encryption needs both sides to already share a key, which is circular for a browser connecting to a bank for the first time. Public keys break that circle because they can be published.",
        whyWrong: {
          a: "The opposite. Asymmetric operations are far slower, which is exactly why real systems use them only to start the conversation.",
          c: "Asymmetric ciphertext is generally larger, not smaller. Size is not the reason it exists.",
          d: "There are still keys, two of them. What changes is that one of them can safely be public.",
        },
      },
      {
        id: "csq10-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-data-asymmetric",
        prompt:
          "You encrypt a document with your own private key. What have you achieved?",
        options: [
          { id: "a", text: "Confidentiality. Only you can read it" },
          { id: "b", text: "A signature. Anyone can read it, and only you could have produced it" },
          { id: "c", text: "Nothing. Private keys cannot encrypt" },
          { id: "d", text: "Confidentiality for anyone holding your public key" },
        ],
        correct: "b",
        explanation:
          "Your public key is public, so everyone can decrypt it. The value is not secrecy. It is that producing it required the private half, which only you hold.",
        whyWrong: {
          a: "The reverse. Everyone in the world holds your public key, so everyone can read it. Encrypting for secrecy uses the recipient's public key.",
          c: "The operation works in both directions. Using it this way is exactly how signatures are constructed.",
          d: "Everyone can obtain your public key, so this describes no confidentiality at all.",
        },
      },
      {
        id: "csq10-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-data-signatures",
        prompt:
          "An installer's digital signature verifies correctly. Which statement is accurate?",
        options: [
          { id: "a", text: "The file is safe to run" },
          {
            id: "b",
            text: "The file has not changed since signing, and the holder of that private key signed it",
          },
          { id: "c", text: "The vendor is a legally registered company" },
          { id: "d", text: "The file contains no malware" },
        ],
        correct: "b",
        explanation:
          "A signature asserts integrity and origin, nothing more. If a vendor's own build system is compromised, they sign malware and the signature verifies perfectly, which is how several supply-chain attacks worked.",
        whyWrong: {
          a: "Safety is not something a signature can assert. It rules out tampering after signing, not badness before it.",
          c: "Identity checking is done by the certificate authority, to varying standards, and is separate from the signature verifying.",
          d: "The signature has no view of the contents. It covers a hash of whatever was signed, malware included.",
        },
      },
      {
        id: "csq10-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-data-hybrid",
        prompt: "Why does HTTPS use both kinds of cryptography rather than just one?",
        options: [
          { id: "a", text: "For redundancy, in case one is broken" },
          {
            id: "b",
            text: "Asymmetric solves the introduction and is slow; symmetric is fast and cannot start a conversation",
          },
          { id: "c", text: "Because different browsers support different algorithms" },
          { id: "d", text: "To satisfy compliance requirements" },
        ],
        correct: "b",
        explanation:
          "The expensive operation happens once, to agree a fresh shared key. Everything after that is symmetric, because there is a lot of it and it has to be fast.",
        whyWrong: {
          a: "They are not layered for redundancy. Each is used for the job it is suited to, once.",
          c: "Cipher negotiation exists, and it is not the reason both kinds are present in every connection.",
          d: "No framework requires this. It is an engineering consequence of the two having opposite strengths.",
        },
      },
      {
        id: "csq10-5",
        type: "truefalse",
        difficulty: 2,
        atomId: "a-cs-data-symmetric",
        prompt: "The main weakness of symmetric encryption in practice is the strength of AES.",
        options: [
          { id: "a", text: "True" },
          { id: "b", text: "False" },
        ],
        correct: "b",
        explanation:
          "False. AES has resisted serious attack for over twenty years. Symmetric systems fail on key management: where the key is stored, who can read it, and what happens when the person who created it leaves.",
        whyWrong: {
          a: "There is no practical break in AES, and no system you work on will fall because of one. Looking there means not looking at the key sitting in a config file.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l11-tls-certificates": {
    lessonId: "cs-l11-tls-certificates",
    passMark: 70,
    questions: [
      {
        id: "csq11-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-data-what-tls-does",
        prompt: "A phishing site shows a padlock in the address bar. What does that prove?",
        options: [
          { id: "a", text: "That the site belongs to the organisation it is imitating" },
          { id: "b", text: "That the connection is encrypted and you really are talking to the domain shown" },
          { id: "c", text: "That the site has passed a security review" },
          { id: "d", text: "That the certificate was issued to a registered company" },
        ],
        correct: "b",
        explanation:
          "TLS authenticates the domain, not the organisation's honesty. You really are talking privately to gtbank-secure-verify.com, which is the problem rather than the reassurance.",
        whyWrong: {
          a: "Nothing in TLS checks that the domain belongs to the brand it resembles. Anyone can get a certificate for a domain they control.",
          c: "No review of any kind takes place. Certificates are issued automatically, in seconds, at no cost.",
          d: "Most certificates today only prove control of the domain. No company registration is checked for a domain-validated certificate.",
        },
      },
      {
        id: "csq11-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-data-certificates",
        prompt: "How does your browser decide to trust a certificate?",
        options: [
          { id: "a", text: "It contacts the website owner to confirm" },
          {
            id: "b",
            text: "It follows the signature chain up to a certificate authority in its own trust store, and checks the domain and expiry",
          },
          { id: "c", text: "It checks the certificate against a list of known good websites" },
          { id: "d", text: "It trusts any certificate served over port 443" },
        ],
        correct: "b",
        explanation:
          "Trust is transitive: you trust the browser vendor, which trusts a set of authorities, one of which signed a chain ending at this certificate. The browser also checks the name matches and it has not expired.",
        whyWrong: {
          a: "No contact with the site owner happens or would be possible. The verification is entirely cryptographic and local.",
          c: "There is no allowlist of good websites. That would not scale to the number of domains on the internet.",
          d: "Serving on 443 means nothing. A self-signed certificate on 443 produces exactly the warning this lesson is about.",
        },
      },
      {
        id: "csq11-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-data-mitm",
        prompt:
          "On hotel WiFi your browser warns that your webmail's certificate is not signed by a trusted authority. What is the correct response?",
        options: [
          { id: "a", text: "Accept it. Captive portals commonly cause this" },
          { id: "b", text: "Do not accept it, do not sign in, and use mobile data if needed" },
          { id: "c", text: "Accept it but avoid typing a password" },
          { id: "d", text: "Clear the cache and retry on the same network" },
        ],
        correct: "b",
        explanation:
          "A warning on your webmail domain means something is presenting a certificate it should not hold, which is the signature of interception. This is one of the few moments a system actively tells you an attack may be under way.",
        whyWrong: {
          a: "Captive portals do cause warnings, for the portal's own domain. A warning on your webmail is a different thing wearing the same clothes.",
          c: "Once accepted, the attacker is in the session. Existing session cookies go out on the next request, which is enough to take the account without a password.",
          d: "The warning concerns the certificate the network presents, not anything cached. Retrying gets the same certificate and mainly wears down your resolve.",
        },
      },
      {
        id: "csq11-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-data-e2ee",
        prompt: "What does end-to-end encryption give you that TLS alone does not?",
        options: [
          { id: "a", text: "Protection from someone on the same WiFi network" },
          { id: "b", text: "The service provider in the middle cannot read the content either" },
          { id: "c", text: "Faster delivery of messages" },
          { id: "d", text: "Protection against the recipient forwarding the message" },
        ],
        correct: "b",
        explanation:
          "TLS protects the link between you and the server, and the server holds the key at its end. End-to-end means the provider only ever holds ciphertext, so it cannot read the content even if compelled to.",
        whyWrong: {
          a: "TLS alone already prevents that. Somebody on the WiFi sees encrypted traffic either way.",
          c: "Encryption adds a small cost rather than removing one. Speed is not part of the claim.",
          d: "Once a recipient can read a message they can copy it. No encryption scheme prevents that, and any product claiming otherwise is overselling.",
        },
      },
      {
        id: "csq11-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-data-tls-versions",
        prompt: "Why does a scan report flag a server that still accepts TLS 1.0?",
        options: [
          { id: "a", text: "Because older versions are slower" },
          {
            id: "b",
            text: "Because an attacker in the middle can force the connection down onto it, so the advertised protection is not what you get",
          },
          { id: "c", text: "Because TLS 1.0 does not encrypt at all" },
          { id: "d", text: "Because browsers display a different padlock for it" },
        ],
        correct: "b",
        explanation:
          "This is a downgrade attack. Supporting a withdrawn version means the strongest option is only the option you get when nobody is interfering.",
        whyWrong: {
          a: "Performance is not the concern, and the difference would not be worth a finding either way.",
          c: "It does encrypt. The problem is that its ciphers and constructions have known weaknesses, not that it is plaintext.",
          d: "Most browsers now refuse it outright rather than showing a different indicator, and the finding would stand regardless of what the browser draws.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cs-l12-data-at-rest": {
    lessonId: "cs-l12-data-at-rest",
    passMark: 70,
    questions: [
      {
        id: "csq12-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-data-fde",
        prompt:
          "A company enables full-disk encryption everywhere. Which of these does it NOT protect against?",
        options: [
          { id: "a", text: "A laptop stolen from a car while powered off" },
          { id: "b", text: "Malware running as the logged-in user" },
          { id: "c", text: "A hard drive recovered from disposal" },
          { id: "d", text: "A laptop left in a taxi overnight, shut down" },
        ],
        correct: "b",
        explanation:
          "Once the machine is booted and unlocked, the disk is decrypted for everything running on it. Full-disk encryption answers theft of a powered-off device, not intrusion into a running one.",
        whyWrong: {
          a: "This is the scenario it protects against most completely, and it is the most common way organisations lose data.",
          c: "It makes disposal safe, because the data on the drive is unreadable without the key.",
          d: "A shut-down device is exactly the protected case. The key is not in memory.",
        },
      },
      {
        id: "csq12-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cs-data-deletion",
        prompt: "Why is overwriting an unreliable way to erase data from an SSD?",
        options: [
          { id: "a", text: "SSDs refuse write commands to used blocks" },
          {
            id: "b",
            text: "Wear levelling moves data between physical blocks, so an overwrite may not touch the original copy",
          },
          { id: "c", text: "SSDs encrypt everything, so overwriting has no effect" },
          { id: "d", text: "Overwriting damages the drive" },
        ],
        correct: "b",
        explanation:
          "The controller spreads writes across physical cells to even out wear, so the block you overwrite is often not the block that held the data. Use the drive's own secure erase, or encrypt from day one and destroy the key.",
        whyWrong: {
          a: "SSDs accept writes normally. The issue is where the controller decides to put them.",
          c: "Many do have hardware encryption, which is why destroying the key works. It is not why overwriting fails.",
          d: "Writes do consume a little endurance, and that is not remotely the reason the technique is unreliable.",
        },
      },
      {
        id: "csq12-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-data-ransomware",
        prompt:
          "Ransomware encrypts your file server and you have good offline backups. Why is \"we have backups, so we are contained\" wrong?",
        options: [
          { id: "a", text: "Because backups are never complete" },
          {
            id: "b",
            text: "Because modern ransomware copies the data out before encrypting, so there is also a confidentiality breach",
          },
          { id: "c", text: "Because restoring takes longer than paying" },
          { id: "d", text: "Because the backups will also be encrypted" },
        ],
        correct: "b",
        explanation:
          "Exfiltration before encryption is deliberate, and exists precisely because organisations got better at restoring. Restoring ends the outage and does nothing about the copy the attacker holds.",
        whyWrong: {
          a: "A tested backup can be complete enough. The gap here is not coverage, it is that restoring addresses only one of the two harms.",
          c: "Restoring is often slower, and speed is not why the statement is wrong. It is wrong because it declares an unresolved breach resolved.",
          d: "Offline backups are specifically the ones the attacker could not reach. If they were encrypted too, the answer would be different and worse.",
        },
      },
      {
        id: "csq12-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cs-data-backups",
        prompt: "In the 3-2-1 backup rule, which part is doing the security work?",
        options: [
          { id: "a", text: "Three copies, because more copies means more resilience" },
          { id: "b", text: "One copy offline or immutable, because an attacker with admin access cannot reach it" },
          { id: "c", text: "Two media types, because different hardware fails differently" },
          { id: "d", text: "All three equally" },
        ],
        correct: "b",
        explanation:
          "The first two numbers address reliability. The offline or immutable copy is what survives an attacker who already holds your administrator credentials, and ransomware operators hunt backup servers first for exactly that reason.",
        whyWrong: {
          a: "Three copies on systems the attacker can reach is three encrypted copies. Count alone does not defend against an intruder.",
          c: "Media diversity protects against a shared hardware failure mode. It does nothing about someone logged in as an administrator.",
          d: "They are not equal here. Two of the three address accidents and one addresses an adversary.",
        },
      },
      {
        id: "csq12-5",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cs-data-key-management",
        prompt:
          "A team says \"our database is encrypted at rest\". What is the most useful follow-up question?",
        options: [
          { id: "a", text: "Which cipher and key length?" },
          { id: "b", text: "Where is the key, who can read it, and how would you rotate it after a breach?" },
          { id: "c", text: "How long does encryption take?" },
          { id: "d", text: "Is it compliant with the framework we follow?" },
        ],
        correct: "b",
        explanation:
          "Encryption almost never fails in the algorithm. It fails at key management, and a key stored on the same server as the database means anyone who takes the database takes the key with it.",
        whyWrong: {
          a: "The answer will be AES-256 and it will be fine. The question sounds rigorous and cannot distinguish a good implementation from a useless one.",
          c: "Performance is an operations question. It tells you nothing about whether the control protects anything.",
          d: "Compliance asks whether encryption is present. It rarely asks where the key lives, which is the part that decides whether it works.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
