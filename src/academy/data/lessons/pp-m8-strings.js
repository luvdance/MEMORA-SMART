/**
 * PYTHON PROGRAMMING · MODULE 8 · STRINGS AND TEXT PROCESSING
 *
 * Curriculum 8.1 – 8.10. Indexing and slicing, the everyday string methods,
 * f-strings, prefixes and suffixes, counting, normalisation and a first
 * regular expression. Most challenges here are functions, checked by calling
 * them with several pieces of text.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s8-strings";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · 8.1 – 8.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l31-index-slice",
    moduleId: "pp-m8-strings",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2", "8.3"],
    title: "Inside a String: Indexing and Slicing",
    subtitle: "Immutability, positions, negative indexes and slices",
    estimatedMinutes: 18,
    intro:
      "Names, messages, emails, file contents: most real-world data arrives as text. To work with it you need to reach inside a string, take one character or a piece of it, and understand why a string can never be changed in place.",

    atoms: [
      {
        id: "a-pp-string-immutable",
        title: "Creating strings, and immutability",
        explain:
          "A string is created with single quotes, double quotes, or triple quotes for text over several lines. Strings are IMMUTABLE: once created, their characters cannot be changed. Every string operation that seems to change one actually creates a new string, which you must store if you want to keep it.",
        code: {
          language: PY,
          code: 'city = "lagos"\nupper = city.upper()\nprint(city, upper)\nnote = """Line one\nLine two"""\nprint(note)\ncity[0] = "L"\n',
          expectedOutput: "lagos LAGOS\nLine one\nLine two",
          raises: "TypeError: 'str' object does not support item assignment",
        },
        why: "city.upper() did not change city; it returned a new string. To \"change\" a string you build a new one and reassign the name: city = city.capitalize().",
      },
      {
        id: "a-pp-indexing",
        title: "Indexing and negative indexing",
        explain:
          "Each character has a position, its index, starting at 0. text[0] is the first character. Negative indexes count from the end: text[-1] is the last, text[-2] the one before. Asking for an index that does not exist raises IndexError. len(text) is the number of characters, so the last index is len(text) - 1.",
        table: {
          caption: "Indexes in the string \"PYTHON\".",
          headers: ["Character", "P", "Y", "T", "H", "O", "N"],
          rows: [
            ["Index", "0", "1", "2", "3", "4", "5"],
            ["Negative index", "-6", "-5", "-4", "-3", "-2", "-1"],
          ],
        },
        codeChallenge: {
          task: "Write a function initials(first, last) that returns the person's initials in capitals with dots, so initials(\"ada\", \"obi\") returns A.O. Then ask the user for their first name and surname and print their initials.",
          starter: "def initials(first, last):\n    pass\n",
          sample: "First name: chiamaka\nSurname: Okafor\nC.O.",
          tests: [
            {
              inputs: ["chiamaka", "Okafor"],
              check:
                'assert initials("ada", "obi") == "A.O.", "initials(\\"ada\\", \\"obi\\") should return A.O. Got " + repr(initials("ada", "obi"))\n' +
                'assert initials("Musa", "bello") == "M.B.", "initials(\\"Musa\\", \\"bello\\") should return M.B."\n' +
                'assert lines[-1] == "C.O.", "For chiamaka Okafor print C.O. Yours: " + lines[-1]',
            },
          ],
          solution: 'def initials(first, last):\n    return first[0].upper() + "." + last[0].upper() + "."\n\nfirst = input("First name: ")\nlast = input("Surname: ")\nprint(initials(first, last))\n',
          hint: "first[0] is the first letter. .upper() makes it a capital.",
          successMessage: "Index 0 for the first character, combined with a method and concatenation. Small string operations like this add up to real text processing.",
        },
      },
      {
        id: "a-pp-slicing",
        title: "Slicing and step values",
        explain:
          "text[start:stop] returns the piece from start up to but not including stop, like range(). Leave start out to begin at 0, leave stop out to go to the end. A third value is the step: text[::2] takes every second character and text[::-1] reverses the string. Slicing never raises IndexError; it just returns what exists.",
        code: {
          language: PY,
          code: 'code = "NG-LAG-2026"\nprint(code[0:2])\nprint(code[3:6])\nprint(code[-4:])\nprint(code[::-1])\n',
          expectedOutput: "NG\nLAG\n2026\n6202-GAL-GN",
        },
        codeChallenge: {
          task: "Palindrome checker. Write is_palindrome(word) that returns True if the word reads the same forwards and backwards, ignoring capitals (so Level and Racecar count). Use slicing to reverse it. Then ask for a word and print Palindrome or Not a palindrome.",
          starter: "def is_palindrome(word):\n    pass\n",
          sample: "Word: Level\nPalindrome",
          tests: [
            {
              inputs: ["Level"],
              check:
                'assert is_palindrome("madam") is True and is_palindrome("Racecar") is True, "madam and Racecar are palindromes."\n' +
                'assert is_palindrome("python") is False, "python is not a palindrome."\n' +
                'assert lines[-1] == "Palindrome", "For Level print Palindrome. Yours: " + lines[-1]\n' +
                'assert "[::-1]" in source, "Reverse the word with the slice [::-1]."',
            },
            { inputs: ["Lagos"], check: 'assert lines[-1] == "Not a palindrome", "Lagos is not a palindrome. Yours: " + lines[-1]' },
          ],
          solution: 'def is_palindrome(word):\n    w = word.lower()\n    return w == w[::-1]\n\nword = input("Word: ")\nif is_palindrome(word):\n    print("Palindrome")\nelse:\n    print("Not a palindrome")\n',
          hint: "Lower-case the word first, then compare it with its reverse, w[::-1].",
          successMessage: "One slice reverses any string. Notice how the function returns a bool and the main code decides what to print.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 8.4 – 8.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l32-string-methods",
    moduleId: "pp-m8-strings",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.4", "8.5"],
    title: "Everyday String Methods",
    subtitle: "strip, split, join, replace, find, case and whitespace",
    estimatedMinutes: 18,
    intro:
      "A method is a function that belongs to a value, called with a dot: name.upper(). Strings have dozens; a handful do most of the work in real programs. Each one returns a new string (or a list), because strings are immutable.",

    atoms: [
      {
        id: "a-pp-string-methods",
        title: "strip(), split(), join(), replace() and find()",
        explain:
          "strip() removes spaces (and new lines) from both ends. split() breaks a string into a list of words, or at a separator you give it: split(\",\"). \"-\".join(list) glues a list of strings together with the separator between them. replace(old, new) swaps every occurrence. find(sub) returns the index of the first match, or -1 if there is none.",
        code: {
          language: PY,
          code: 'raw = "  Ada,Obi,SS2  "\nparts = raw.strip().split(",")\nprint(parts)\nprint(" | ".join(parts))\nprint("2026-10-18".replace("-", "/"))\nprint("hello world".find("world"), "hello".find("z"))\n',
          expectedOutput: "['Ada', 'Obi', 'SS2']\nAda | Obi | SS2\n2026/10/18\n6 -1",
        },
        codeChallenge: {
          task: "Word counter. Write count_words(text) that returns how many words a piece of text contains (split() with no argument splits on any run of spaces). Then ask for a sentence and print Words: N",
          starter: "def count_words(text):\n    pass\n",
          sample: "Sentence: Python is fun to learn\nWords: 5",
          tests: [
            {
              inputs: ["Python is fun to learn"],
              check:
                'assert count_words("one two three") == 3, "count_words(\\"one two three\\") should be 3."\n' +
                'assert count_words("   spaced    out   words  ") == 3, "Extra spaces should not create extra words."\n' +
                'assert count_words("") == 0, "An empty string has 0 words."\n' +
                'assert lines[-1] == "Words: 5", "Print Words: 5 for that sentence. Yours: " + lines[-1]',
            },
          ],
          solution: 'def count_words(text):\n    return len(text.split())\n\nsentence = input("Sentence: ")\nprint("Words:", count_words(sentence))\n',
          hint: "len(text.split()) counts the words.",
          successMessage: "split() with no argument handles any amount of whitespace, which is why it beats counting spaces.",
        },
      },
      {
        id: "a-pp-case-whitespace",
        title: "Case conversion and whitespace handling",
        explain:
          "lower(), upper(), title() and capitalize() change case; they are essential for comparing text typed by people, who never type consistently. strip(), lstrip() and rstrip() remove whitespace from both ends, the left or the right. Clean input with .strip() as the first thing you do.",
        code: {
          language: PY,
          code: 'typed = "   aDA obi  "\nprint(repr(typed.strip()))\nprint(typed.strip().title())\nprint(typed.strip().lower())\nprint("Hello".upper(), "PYTHON".capitalize())\n',
          expectedOutput: "'aDA obi'\nAda Obi\nada obi\nHELLO Python",
        },
        codeChallenge: {
          task: "Username formatter. Write make_handle(full_name) that turns whatever the user typed into a handle: no spaces at the ends, all lower case, and the words joined with underscores. make_handle(\"  Ada   OBI \") returns ada_obi.",
          starter: "def make_handle(full_name):\n    pass\n",
          sample: "make_handle(\"  Ada   OBI \") → ada_obi",
          tests: [
            {
              check:
                'assert make_handle("  Ada   OBI ") == "ada_obi", "make_handle(\\"  Ada   OBI \\") should return ada_obi. Got " + repr(make_handle("  Ada   OBI "))\n' +
                'assert make_handle("Mary Jane Okon") == "mary_jane_okon", "Three words become mary_jane_okon."\n' +
                'assert make_handle("TUNDE") == "tunde", "One word stays one word."',
            },
          ],
          solution: 'def make_handle(full_name):\n    return "_".join(full_name.lower().split())\n',
          hint: "split() breaks on any spaces and ignores the extra ones; \"_\".join(...) glues the words back together.",
          successMessage: "lower, split and join in one line: a typical text clean-up chain. Real sign-up forms do almost exactly this.",
        },
      },
      {
        id: "a-pp-find-replace",
        title: "Searching and replacing in text",
        explain:
          "find() tells you where something is; in tells you whether it is there; replace() changes it everywhere; count() tells you how many times it appears. Combined with slicing, find() lets you cut text at a marker: everything before the @ in an email is the user name.",
        code: {
          language: PY,
          code: 'email = "tolu.ade@memora.ng"\nat = email.find("@")\nprint(email[:at])\nprint(email[at + 1:])\nprint(email.count("."))\n',
          expectedOutput: "tolu.ade\nmemora.ng\n2",
        },
        codeChallenge: {
          task: "Write mask_phone(phone) that hides all but the last 4 digits of a phone number with * characters, after removing any spaces. mask_phone(\"0803 123 4567\") returns *******4567.",
          starter: "def mask_phone(phone):\n    pass\n",
          sample: "mask_phone(\"0803 123 4567\") → *******4567",
          tests: [
            {
              check:
                'assert mask_phone("0803 123 4567") == "*******4567", "Got " + repr(mask_phone("0803 123 4567"))\n' +
                'assert mask_phone("08051112222") == "*******2222", "Got " + repr(mask_phone("08051112222"))\n' +
                'assert mask_phone("+234 805 111 2222") == "**********2222", "+2348051112222 has 14 characters: 10 stars and 2222. Got " + repr(mask_phone("+234 805 111 2222"))',
            },
          ],
          solution: 'def mask_phone(phone):\n    digits = phone.replace(" ", "")\n    return "*" * (len(digits) - 4) + digits[-4:]\n',
          hint: "Remove spaces with replace(\" \", \"\"). Then build \"*\" repeated len - 4 times, plus the last four characters digits[-4:].",
          successMessage: "replace, len, repetition and a negative slice together. Banking apps and receipts mask numbers exactly like this.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 8.6 – 8.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l33-fstrings-counting",
    moduleId: "pp-m8-strings",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.6", "8.7", "8.8"],
    title: "f-strings, Prefixes and Counting",
    subtitle: "Formatting text, checking how it starts and ends, and counting characters",
    estimatedMinutes: 18,
    intro:
      "Three tools for working with text as data: f-strings to produce exactly the output you want, startswith and endswith to classify text by how it begins or ends, and counting to measure what text contains.",

    atoms: [
      {
        id: "a-pp-fstrings",
        title: "String formatting with f-strings",
        explain:
          "An f-string evaluates expressions in braces. After a colon comes a format: .2f for two decimals, , for thousands separators, <10 >10 ^10 to align in 10 characters, 05d to pad a number with zeros, % to show a fraction as a percentage. Writing {value=} prints the expression and its value, which is handy for debugging.",
        table: {
          caption: "Format specifications you will use.",
          headers: ["f-string", "Result"],
          rows: [
            ["f\"{1234567.891:,.2f}\"", "1,234,567.89"],
            ["f\"{'Ada':<6}|\"", "Ada   |"],
            ["f\"{'Ada':>6}|\"", "   Ada|"],
            ["f\"{'Ada':^7}|\"", "  Ada  |"],
            ["f\"{42:05d}\"", "00042"],
            ["f\"{0.256:.1%}\"", "25.6%"],
          ],
        },
        code: {
          language: PY,
          code: 'price = 1250000\nrate = 0.075\nprint(f"Price: N{price:,}")\nprint(f"VAT: {rate:.1%}")\nprint(f"Order #{7:04d}")\nx = 3\nprint(f"{x * 2 = }")\n',
          expectedOutput: "Price: N1,250,000\nVAT: 7.5%\nOrder #0007\nx * 2 = 6",
        },
        codeChallenge: {
          task: "Write money(amount) that returns an amount formatted as naira with a thousands separator and 2 decimal places: money(1250000) returns N1,250,000.00. Then write invoice_line(item, qty, price) that returns the item left-aligned in 12 characters, the quantity right-aligned in 4, and the line total (qty × price) formatted with money() and right-aligned in 16.",
          starter: "def money(amount):\n    pass\n\ndef invoice_line(item, qty, price):\n    pass\n",
          sample: "invoice_line(\"Laptop\", 2, 450000) →\n'Laptop         2     N900,000.00'",
          tests: [
            {
              check:
                'assert money(1250000) == "N1,250,000.00", "money(1250000) should be N1,250,000.00. Got " + repr(money(1250000))\n' +
                'assert money(5.5) == "N5.50", "money(5.5) should be N5.50. Got " + repr(money(5.5))\n' +
                'expected = "Laptop" + " " * 6 + "   2" + "     N900,000.00"\n' +
                'assert invoice_line("Laptop", 2, 450000) == expected, "Got " + repr(invoice_line("Laptop", 2, 450000)) + ", expected " + repr(expected)',
            },
          ],
          solution: 'def money(amount):\n    return f"N{amount:,.2f}"\n\ndef invoice_line(item, qty, price):\n    return f"{item:<12}{qty:>4}{money(qty * price):>16}"\n',
          hint: "money: f\"N{amount:,.2f}\". invoice_line: f\"{item:<12}{qty:>4}{money(qty * price):>16}\".",
          successMessage: "Neat columns and readable money, built from small formatting functions you can reuse in every report you write.",
        },
      },
      {
        id: "a-pp-prefix-suffix",
        title: "Checking prefixes and suffixes",
        explain:
          "startswith(prefix) and endswith(suffix) return True or False. Both accept a tuple of options: name.endswith((\".jpg\", \".png\")). They are clearer and safer than slicing by hand, and are used for file types, phone-number networks, URLs and codes.",
        code: {
          language: PY,
          code: 'file = "report_2026.PDF"\nprint(file.lower().endswith(".pdf"))\nprint(file.startswith("report"))\nurl = "http://memora.ng"\nprint(url.startswith(("https://", "http://")))\n',
          expectedOutput: "True\nTrue\nTrue",
        },
        codeChallenge: {
          task: "Write file_kind(filename) that returns image for files ending in .jpg, .jpeg or .png, document for .pdf or .docx, and other for anything else. Capitals in the extension should not matter.",
          starter: "def file_kind(filename):\n    pass\n",
          sample: "file_kind(\"Holiday.JPG\") → image",
          tests: [
            {
              check:
                'tests = {"Holiday.JPG": "image", "logo.png": "image", "scan.jpeg": "image", "CV.pdf": "document", "letter.DOCX": "document", "song.mp3": "other", "pdf_notes.txt": "other"}\n' +
                'for name, kind in tests.items():\n' +
                '    assert file_kind(name) == kind, f"file_kind({name!r}) should be {kind}, got {file_kind(name)!r}"\n' +
                'assert "endswith" in source, "Use endswith()."',
            },
          ],
          solution: 'def file_kind(filename):\n    name = filename.lower()\n    if name.endswith((".jpg", ".jpeg", ".png")):\n        return "image"\n    if name.endswith((".pdf", ".docx")):\n        return "document"\n    return "other"\n',
          hint: "Lower-case the name, then name.endswith((\".jpg\", \".jpeg\", \".png\")) with a tuple of options.",
          successMessage: "pdf_notes.txt is the trap: it contains pdf but does not END with .pdf. endswith gets it right where in would not.",
        },
      },
      {
        id: "a-pp-char-frequency",
        title: "Character counting and frequency",
        explain:
          "text.count(sub) counts occurrences of one thing. To count several kinds of character, loop over the string with a counter for each kind, using tests such as ch.isdigit(), ch.isalpha(), ch.isupper() and ch in \"aeiou\". (In Module 9 a dictionary will count every character at once.)",
        code: {
          language: PY,
          code: 'text = "Room 12B, Block 3"\ndigits = letters = 0\nfor ch in text:\n    if ch.isdigit():\n        digits += 1\n    elif ch.isalpha():\n        letters += 1\nprint("Digits:", digits, "Letters:", letters)\nprint("o appears", text.count("o"), "times")\n',
          expectedOutput: "Digits: 3 Letters: 10\no appears 3 times",
        },
        codeChallenge: {
          task: "Simple text analyser. Write analyse(text) that returns three numbers: the count of vowels (a, e, i, o, u in either case), the count of consonants (other letters), and the count of digits. Then ask for some text and print Vowels: V, Consonants: C, Digits: D",
          starter: "def analyse(text):\n    pass\n",
          sample: "Text: Lagos 2026\nVowels: 2, Consonants: 3, Digits: 4",
          tests: [
            {
              inputs: ["Lagos 2026"],
              check:
                'assert tuple(analyse("Lagos 2026")) == (2, 3, 4), "analyse(\\"Lagos 2026\\") should return (2, 3, 4). Got " + repr(analyse("Lagos 2026"))\n' +
                'assert tuple(analyse("AEIOU xyz!")) == (5, 3, 0), "Capital vowels count, and ! is not a letter. Got " + repr(analyse("AEIOU xyz!"))\n' +
                'assert lines[-1] == "Vowels: 2, Consonants: 3, Digits: 4", "Yours: " + lines[-1]',
            },
          ],
          solution: 'def analyse(text):\n    vowels = consonants = digits = 0\n    for ch in text:\n        if ch.lower() in "aeiou":\n            vowels += 1\n        elif ch.isalpha():\n            consonants += 1\n        elif ch.isdigit():\n            digits += 1\n    return vowels, consonants, digits\n\nv, c, d = analyse(input("Text: "))\nprint(f"Vowels: {v}, Consonants: {c}, Digits: {d}")\n',
          hint: "Three counters at 0. For each character: vowel test first (ch.lower() in \"aeiou\"), then isalpha(), then isdigit(). Return all three.",
          successMessage: "A loop, three counters and a multiple return: you analysed text the way spell-checkers and readability tools start.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 8.9 – 8.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l34-normalise-regex",
    moduleId: "pp-m8-strings",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["8.9", "8.10"],
    title: "Normalising Text and Regular Expressions",
    subtitle: "Making messy text consistent, and describing patterns",
    estimatedMinutes: 20,
    intro:
      "People type the same thing in a dozen ways. Normalisation turns all of them into one standard form so they can be compared and stored. Regular expressions go further: they describe the SHAPE of valid text, such as \"eleven digits starting with 0\".",

    atoms: [
      {
        id: "a-pp-normalise",
        title: "Basic text normalisation",
        explain:
          "To normalise text: strip the ends, collapse internal runs of spaces to one (\" \".join(text.split())), choose one case, and remove or replace characters that do not matter (punctuation in a phone number). Normalise BEFORE comparing, searching or saving, so \"  ADA  obi\" and \"Ada Obi\" are recognised as the same name.",
        code: {
          language: PY,
          code: 'a = "  ADA   obi "\nb = "Ada Obi"\nprint(a == b)\nclean = " ".join(a.split()).title()\nprint(repr(clean), clean == b)\n',
          expectedOutput: "False\n'Ada Obi' True",
        },
        codeChallenge: {
          task: "Write normalise_phone(phone) that returns a Nigerian phone number in the standard form 0XXXXXXXXXX: remove spaces, dashes and brackets, and if it starts with +234 or 234, replace that with 0. So normalise_phone(\"+234 (803) 123-4567\") returns 08031234567.",
          starter: "def normalise_phone(phone):\n    pass\n",
          sample: "normalise_phone(\"+234 (803) 123-4567\") → 08031234567",
          tests: [
            {
              check:
                'cases = {"+234 (803) 123-4567": "08031234567", "0803-123-4567": "08031234567", "2348031234567": "08031234567", "0803 123 4567": "08031234567"}\n' +
                'for raw, want in cases.items():\n' +
                '    assert normalise_phone(raw) == want, f"normalise_phone({raw!r}) should be {want}, got {normalise_phone(raw)!r}"',
            },
          ],
          solution: 'def normalise_phone(phone):\n    for ch in " -()":\n        phone = phone.replace(ch, "")\n    if phone.startswith("+234"):\n        phone = "0" + phone[4:]\n    elif phone.startswith("234"):\n        phone = "0" + phone[3:]\n    return phone\n',
          hint: "Loop over the characters \" -()\" and replace each with \"\". Then check startswith(\"+234\") before startswith(\"234\").",
          successMessage: "Four different ways of typing one number now compare equal. Without this, a contacts database fills up with duplicates.",
        },
      },
      {
        id: "a-pp-regex",
        title: "Introduction to regular expressions",
        explain:
          "A regular expression (regex) is a pattern for text, used through the re module. \\d means a digit, [A-Z] a capital letter, + means \"one or more\", {11} exactly eleven, ^ the start and $ the end. re.search(pattern, text) finds a match anywhere; re.fullmatch requires the whole text to match; re.findall returns every match. Write patterns as raw strings, r\"...\", so backslashes are not treated as escapes.",
        table: {
          caption: "Regex building blocks.",
          headers: ["Pattern", "Matches"],
          rows: [
            ["\\d", "one digit"],
            ["[a-z]  [A-Z]", "one lower-case / upper-case letter"],
            ["[^a-zA-Z0-9]", "one character that is NOT a letter or digit"],
            ["+   *   ?", "one or more / zero or more / optional"],
            ["{11}", "exactly 11 of the previous item"],
            ["^ ... $", "the start / the end of the text"],
          ],
        },
        code: {
          language: PY,
          code: 'import re\nprint(bool(re.fullmatch(r"0\\d{10}", "08031234567")))\nprint(bool(re.fullmatch(r"0\\d{10}", "0803123456")))\nprint(re.findall(r"\\d+", "3 rooms, 12 beds, 140 guests"))\n',
          expectedOutput: "True\nFalse\n['3', '12', '140']",
        },
        codeChallenge: {
          task: "Password validator. Write password_problems(pw) that returns a list of what is wrong (an empty list if nothing is): \"too short\" if under 8 characters, \"no digit\", \"no uppercase\", \"no lowercase\" and \"no symbol\" (a symbol is any character that is not a letter or digit). Use re.search for the four character checks. Then ask for a password and print Strong password or each problem on its own line.",
          starter: "import re\n\ndef password_problems(pw):\n    problems = []\n    return problems\n",
          sample: "Password: hello\ntoo short\nno digit\nno uppercase\nno symbol",
          tests: [
            {
              inputs: ["hello"],
              check:
                'assert password_problems("Py#2026ok") == [], "Py#2026ok is strong. Got " + repr(password_problems("Py#2026ok"))\n' +
                'assert password_problems("hello") == ["too short", "no digit", "no uppercase", "no symbol"], "hello: too short, no digit, no uppercase, no symbol (in that order). Got " + repr(password_problems("hello"))\n' +
                'assert password_problems("ABCDEFGH1!") == ["no lowercase"], "ABCDEFGH1! has no lower-case letter. Got " + repr(password_problems("ABCDEFGH1!"))\n' +
                'assert lines[1:] == ["too short", "no digit", "no uppercase", "no symbol"], "Print each problem on its own line. Yours: " + repr(lines[1:])\n' +
                'assert calls("search"), "Use re.search for the character checks."',
            },
            { inputs: ["Py#2026ok"], check: 'assert lines[-1] == "Strong password", "Yours: " + lines[-1]' },
          ],
          solution: 'import re\n\ndef password_problems(pw):\n    problems = []\n    if len(pw) < 8:\n        problems.append("too short")\n    if not re.search(r"\\d", pw):\n        problems.append("no digit")\n    if not re.search(r"[A-Z]", pw):\n        problems.append("no uppercase")\n    if not re.search(r"[a-z]", pw):\n        problems.append("no lowercase")\n    if not re.search(r"[^a-zA-Z0-9]", pw):\n        problems.append("no symbol")\n    return problems\n\nproblems = password_problems(input("Password: "))\nif problems:\n    for p in problems:\n        print(p)\nelse:\n    print("Strong password")\n',
          hint: "problems.append(\"too short\") adds an item to the list. For each rule: if not re.search(r\"[A-Z]\", pw): append the message. An empty list is falsy.",
          successMessage: "Regex patterns for each rule, a list of problems, and truthiness to decide what to print. Real sign-up forms validate passwords exactly like this.",
        },
      },
    ],

    task: {
      title: "Module 8 practice: five text tools",
      intro: "Write each as functions with docstrings, plus a short main section. The milestone is to process and validate text reliably.",
      prompts: [
        "Palindrome checker that ignores spaces and punctuation, so \"Was it a car or a cat I saw?\" counts.",
        "Word counter that also reports the longest word and the average word length.",
        "Password validator with your own rules, explaining each failure to the user.",
        "Username formatter that also removes any character that is not a letter, digit or underscore.",
        "Simple text analyser: characters, words, sentences (count . ! ?), vowels and the most common letter.",
      ],
      closing: "Next: collections. Lists, tuples, sets and dictionaries let one variable hold many values.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
