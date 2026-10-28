/**
 * C++ PROGRAMMING · MODULE 7 · STRINGS AND TEXT PROCESSING
 *
 * Curriculum 7.1 – 7.12. Work with names, sentences, passwords and other
 * text. Every program is compiled and run by `npm run validate:content`.
 * The input-buffer lesson RUNS the classic cin-then-getline bug with real
 * keyboard input, and the transcript shown is the one a learner's terminal
 * really shows: the name prompt is skipped before they can type.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s7-strings";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 7.1 – 7.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l28-strings-intro",
    moduleId: "cp-m7-strings",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2", "7.3", "7.4"],
    title: "Text in C++",
    subtitle: "Characters versus strings, string, words and whole lines",
    estimatedMinutes: 22,
    intro:
      "Names, addresses, messages, passwords, product codes: a large share of real data is text. You have used string briefly; this week you learn it properly, starting with how it differs from a single char and how to read a full sentence from the keyboard.",

    atoms: [
      {
        id: "a-cp-char-vs-string",
        title: "Characters versus strings",
        explain:
          "A char is exactly one character, in single quotes: 'A'. A string is a sequence of characters, in double quotes: \"A\" or \"Ada Lovelace\". Even \"A\" is a string of length one, not a char. In C, text was stored as an array of chars ending with a hidden '\\0' (the null character) to mark the end; that is why sizeof(\"A\") is 2. Modern C++ uses string instead, which manages its own length and memory.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    char letter = 'A';
    string word = "A";
    cout << sizeof(letter) << "\n";
    cout << sizeof("A") << "\n";
    cout << word.size() << "\n";
    return 0;
}
`,
          expectedOutput: "1\n2\n1",
        },
        why: "The C-style \"A\" takes 2 bytes because of its hidden terminator. string reports the length you would expect, 1. You will still meet C-style strings in older code and in some library functions, which is why the difference is worth knowing.",
      },
      {
        id: "a-cp-std-string",
        title: "Introduction to string",
        explain:
          "string, from #include <string>, holds text of any length and grows as needed. You can create one empty, from text, or by repeating a character: string line(20, '-'); is twenty dashes. Assign with =, join with +, and ask for the length with .size() or .length() (the same thing). Strings can be passed to and returned from functions like any value.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    string first = "Chiamaka";
    string last = "Okafor";
    string full = first + " " + last;
    string line(full.size(), '=');
    cout << full << "\n" << line << "\n";
    cout << "Length: " << full.length() << "\n";
    return 0;
}
`,
          expectedOutput: "Chiamaka Okafor\n===============\nLength: 15",
        },
        codeFill: {
          task: "Fill the gap so greeting is built from the text \"Welcome, \", the name, and an exclamation mark.",
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    string name = "Tunde";
    string greeting = {{1}};
    cout << greeting << "\n";
    return 0;
}
`,
          blanks: [{ answers: ['"Welcome, " + name + "!"'], width: 24 }],
          expectedOutput: "Welcome, Tunde!",
          hint: "Join three pieces with +: the text in quotes, the variable, and \"!\".",
          successMessage: "\"Welcome, \" + name + \"!\". The space after the comma lives inside the first piece of text.",
        },
      },
      {
        id: "a-cp-read-word",
        title: "Reading a single word",
        explain:
          "cin >> word; reads ONE word: it skips any spaces and line breaks before the word, then stops at the next space or line break, which is left unread. That makes it ideal for single-word answers, and for processing text word by word: while (cin >> word) keeps reading words until the input runs out.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    string word;
    int count = 0;
    string longest;
    while (cin >> word) {
        count++;
        if (word.size() > longest.size()) longest = word;
    }
    cout << count << " words, longest: " << longest << "\n";
    return 0;
}
`,
          inputs: ["the quick brown fox", "jumps over"],
          expectedOutput: "the quick brown fox\njumps over\n6 words, longest: quick",
        },
        why: "while (cin >> word) is true each time a word is read, and false when there is nothing left (at the end of a file, or when the user presses Ctrl+Z then Enter on Windows, or Ctrl+D on macOS and Linux).",
      },
      {
        id: "a-cp-getline",
        title: "Reading complete sentences with getline",
        explain:
          "getline(cin, line); reads everything the user types up to the Enter key, spaces included, and stores it in line without the line break. Use it whenever an answer may contain spaces: full names, addresses, sentences. Note the different shape: getline is a function you call with the stream and the string, not an operator.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    string fullName;
    cout << "Full name: ";
    getline(cin, fullName);
    cout << "Hello, " << fullName << " (" << fullName.size() << " characters)\n";
    return 0;
}
`,
          inputs: ["Ada Lovelace"],
          expectedOutput: "Full name: Ada Lovelace\nHello, Ada Lovelace (12 characters)",
        },
        codeFill: {
          task: "Fill the gap so the whole address, spaces included, is read into address.",
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    string address;
    cout << "Address: ";
    {{1}}
    cout << "Deliver to: " << address << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["getline(cin, address);", "std::getline(std::cin, address);", "getline(std::cin, address);"], width: 32 }],
          inputs: ["12 Allen Avenue, Ikeja"],
          expectedOutput: "Address: 12 Allen Avenue, Ikeja\nDeliver to: 12 Allen Avenue, Ikeja",
          hint: "Call getline with two arguments: the stream to read from, then the string to fill.",
          successMessage: "getline(cin, address); With cin >> it would have stopped at 12.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 7.5 – 7.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l29-string-ops",
    moduleId: "cp-m7-strings",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.5", "7.6", "7.7", "7.8"],
    title: "Working with Strings",
    subtitle: "Length and indexing, joining and comparing, searching, substrings",
    estimatedMinutes: 24,
    intro:
      "A string is a sequence of chars, so everything you learned about indexing arrays applies, plus a set of member functions built for text. This lesson covers the operations you will reach for most: measuring, joining, comparing, finding and cutting out pieces.",

    atoms: [
      {
        id: "a-cp-length-index",
        title: "Length and indexing",
        explain:
          "s.size() (or s.length()) gives the number of characters. Each character has an index from 0 to size - 1, and s[i] reads or changes it, unchecked; s.at(i) checks the index. s.front() and s.back() are the first and last characters. A for loop over the indexes visits every character, which is the basis of almost all text processing.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    string code = "NG-LAG-042";
    cout << code.size() << "\n";
    cout << code[0] << code[3] << code.back() << "\n";
    code[2] = '/';
    code[6] = '/';
    cout << code << "\n";
    return 0;
}
`,
          question: "Count positions from 0. What does this print?",
          expectedOutput: "10\nNL2\nNG/LAG/042",
          hint: "N G - L A G - 0 4 2: positions 0 to 9. The dashes are at 2 and 6.",
          successMessage: "10, NL2, and NG/LAG/042. Individual characters can be read and replaced just like array elements.",
        },
      },
      {
        id: "a-cp-concat-compare",
        title: "Joining and comparing strings",
        explain:
          "+ joins strings into a new string and += appends to an existing one. At least one side of + must be a string: \"Hello\" + \" world\" does not compile, because both are C-style text. Comparison operators work on strings: == and != test for identical text, and <, > compare alphabetically, character by character, using character codes, so every capital letter comes before every lower-case letter.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    string log = "Login";
    log += " at 09:15";
    cout << log << "\n";
    string a = "apple", b = "banana", c = "Banana";
    cout << boolalpha;
    cout << (a < b) << " " << (b < c) << " " << (a == "apple") << "\n";
    return 0;
}
`,
          expectedOutput: "Login at 09:15\ntrue false true",
        },
        why: "b < c is false because 'b' (98) is greater than 'B' (66). To compare without caring about capitals, convert both to the same case first, which is the next lesson.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    string x = "cat", y = "car", z = "category";
    cout << boolalpha;
    cout << (y < x) << "\n";
    cout << (x < z) << "\n";
    cout << (x + "s" == "cats") << "\n";
    return 0;
}
`,
          question: "Strings compare character by character; when one runs out first, the shorter one comes first. What does this print?",
          expectedOutput: "true\ntrue\ntrue",
          hint: "car vs cat: the first difference is r vs t. cat vs category: cat runs out first.",
          successMessage: "All three true. That is dictionary order, with the rule that a prefix sorts before the longer word.",
        },
      },
      {
        id: "a-cp-find",
        title: "Searching within strings",
        explain:
          "s.find(x) searches s for x (a character or a string) and returns the index where it first starts. If x is not there it returns a special value, string::npos, so always compare with npos before using the result. s.find(x, start) begins the search at a given index, and s.rfind(x) searches from the end.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    string email = "ada@memora.ng";
    size_t at = email.find('@');
    cout << "@ is at " << at << "\n";
    if (email.find("gmail") == string::npos) {
        cout << "Not a gmail address\n";
    }
    cout << "Last dot at " << email.rfind('.') << "\n";
    return 0;
}
`,
          expectedOutput: "@ is at 3\nNot a gmail address\nLast dot at 10",
        },
        codeFill: {
          task: "Fill the condition so the program reports a sentence that contains the word \"urgent\".",
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    string subject = "Please treat this as urgent today";
    if ({{1}}) {
        cout << "Flagged as urgent\n";
    } else {
        cout << "Normal\n";
    }
    return 0;
}
`,
          blanks: [
            {
              answers: [
                'subject.find("urgent") != string::npos',
                'subject.find("urgent") != std::string::npos',
                'string::npos != subject.find("urgent")',
                'std::string::npos != subject.find("urgent")'
              ],
              width: 42,
            },
          ],
          expectedOutput: "Flagged as urgent",
          hint: "find returns npos when the text is missing, so \"found\" means the result is NOT npos.",
          successMessage: "find(...) != string::npos is the standard way to ask \"does it contain?\".",
        },
      },
      {
        id: "a-cp-substr",
        title: "Extracting substrings",
        explain:
          "s.substr(start, length) returns a new string: length characters beginning at index start. Leave the length out to take everything to the end. Combined with find, it splits text: the part before a separator is substr(0, pos), and the part after is substr(pos + 1).",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    string fullName = "Ada Lovelace";
    size_t space = fullName.find(' ');
    string first = fullName.substr(0, space);
    string last = fullName.substr(space + 1);
    cout << last << ", " << first << "\n";
    cout << fullName.substr(4, 4) << "\n";
    return 0;
}
`,
          expectedOutput: "Lovelace, Ada\nLove",
        },
        codeFill: {
          task: "date holds a date as DD/MM/YYYY. Fill the gap to extract the four-character year.",
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    string date = "17/10/2026";
    string year = {{1}};
    cout << "Year: " << year << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["date.substr(6, 4)", "date.substr(6)", "date.substr(date.size() - 4)", "date.substr(date.length() - 4)"], width: 20 }],
          expectedOutput: "Year: 2026",
          hint: "D D / M M / Y Y Y Y: the year starts at index 6 and is 4 characters long.",
          successMessage: "substr(6, 4). Index 6 is the first digit of the year.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 7.9 – 7.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l30-text-processing",
    moduleId: "cp-m7-strings",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.9", "7.10", "7.11"],
    title: "Processing Text",
    subtitle: "Changing case, counting, palindromes and validation",
    estimatedMinutes: 25,
    intro:
      "Now the string operations come together into real text processing: normalising case so comparisons are fair, counting what a piece of text contains, testing palindromes, and checking that a password or username follows the rules.",

    atoms: [
      {
        id: "a-cp-case",
        title: "Changing character case",
        explain:
          "<cctype> provides functions that work on one character: toupper and tolower convert case, and isalpha, isdigit, isspace, isupper and islower test what kind of character it is. They expect the character as an unsigned char, so the safe pattern is to wrap them once in a small helper, as below, and loop over the string to convert all of it.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
#include <cctype>
using namespace std;

char toUpperChar(char c) {
    return static_cast<char>(toupper(static_cast<unsigned char>(c)));
}

string toUpper(string s) {
    for (size_t i = 0; i < s.size(); i++) {
        s[i] = toUpperChar(s[i]);
    }
    return s;
}

int main() {
    string city = "Port Harcourt";
    cout << toUpper(city) << "\n";
    cout << city << "\n";
    cout << boolalpha << (toUpper("lagos") == toUpper("LAGOS")) << "\n";
    return 0;
}
`,
          expectedOutput: "PORT HARCOURT\nPort Harcourt\ntrue",
        },
        why: "toUpper takes its string BY VALUE, so it converts a copy and returns it, leaving city unchanged. Converting both sides to one case before comparing is how to compare text while ignoring capitals.",
        codeFill: {
          task: "Fill the gap so the loop converts every character of code to lower case, using the helper provided.",
          code: C`#include <iostream>
#include <string>
#include <cctype>
using namespace std;

char toLowerChar(char c) {
    return static_cast<char>(tolower(static_cast<unsigned char>(c)));
}

int main() {
    string code = "MeMoRa-2026";
    for (size_t i = 0; i < code.size(); i++) {
        {{1}}
    }
    cout << code << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["code[i] = toLowerChar(code[i]);", "code.at(i) = toLowerChar(code.at(i));"], width: 32 }],
          expectedOutput: "memora-2026",
          hint: "Replace character i with the lower-case version of character i.",
          successMessage: "code[i] = toLowerChar(code[i]); Digits and the dash are not letters, so tolower leaves them alone.",
        },
      },
      {
        id: "a-cp-counting",
        title: "Counting letters, words and spaces",
        explain:
          "Counting is a loop over the characters with a counter for each category, using the <cctype> tests. Counting WORDS is slightly different: count the places where a word starts, that is, a non-space character that is either first or follows a space. That way several spaces in a row do not create extra words.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string text = "Hello  World 2026!";
    int letters = 0, digits = 0, spaces = 0, words = 0;
    for (size_t i = 0; i < text.size(); i++) {
        unsigned char c = static_cast<unsigned char>(text[i]);
        if (isalpha(c)) letters++;
        else if (isdigit(c)) digits++;
        else if (isspace(c)) spaces++;
        bool startsWord = !isspace(c) &&
            (i == 0 || isspace(static_cast<unsigned char>(text[i - 1])));
        if (startsWord) words++;
    }
    cout << letters << " letters, " << digits << " digits, "
              << spaces << " spaces, " << words << " words\n";
    return 0;
}
`,
          expectedOutput: "10 letters, 4 digits, 3 spaces, 3 words",
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "Programming";
    int vowels = 0;
    for (size_t i = 0; i < s.size(); i++) {
        char c = s[i];
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            vowels++;
        }
    }
    cout << vowels << " of " << s.size() << "\n";
    return 0;
}
`,
          question: "Only lower-case vowels are counted. What does this print?",
          expectedOutput: "3 of 11",
          hint: "P-r-o-g-r-a-m-m-i-n-g: look for o, a and i.",
          successMessage: "3 of 11. A capital vowel would not have been counted; converting to lower case first fixes that.",
        },
      },
      {
        id: "a-cp-palindrome",
        title: "Palindromes",
        explain:
          "A palindrome reads the same forwards and backwards: \"level\", \"racecar\", \"Never odd or even\". To test one, first normalise it (keep only letters, all in lower case), then compare character i with the character the same distance from the end, s[n - 1 - i], for the first half. One mismatch means it is not a palindrome.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
#include <cctype>
using namespace std;

bool isPalindrome(const string& text) {
    string s;
    for (size_t i = 0; i < text.size(); i++) {
        unsigned char c = static_cast<unsigned char>(text[i]);
        if (isalpha(c)) s += static_cast<char>(tolower(c));
    }
    size_t n = s.size();
    for (size_t i = 0; i < n / 2; i++) {
        if (s[i] != s[n - 1 - i]) return false;
    }
    return true;
}

int main() {
    cout << boolalpha;
    cout << isPalindrome("Never odd or even") << "\n";
    cout << isPalindrome("Lagos") << "\n";
    return 0;
}
`,
          expectedOutput: "true\nfalse",
        },
        codeFill: {
          task: "Fill the comparison inside the loop: it should find a mismatch between character i and its mirror image from the end.",
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "racecar";
    bool same = true;
    size_t n = s.size();
    for (size_t i = 0; i < n / 2; i++) {
        if ({{1}}) {
            same = false;
        }
    }
    cout << s << (same ? " is" : " is not") << " a palindrome\n";
    return 0;
}
`,
          blanks: [{ answers: ["s[i] != s[n - 1 - i]", "s[n - 1 - i] != s[i]", "s.at(i) != s.at(n - 1 - i)"], width: 22 }],
          expectedOutput: "racecar is a palindrome",
          hint: "The mirror of position i is n - 1 - i. A mismatch is when they are NOT equal.",
          successMessage: "s[i] != s[n - 1 - i]. For i = 0 the mirror is the last character, n - 1, not n.",
        },
      },
      {
        id: "a-cp-validation",
        title: "Basic text validation",
        explain:
          "Validation checks that text follows the rules before the program uses it: a password has at least 8 characters, a digit and a capital letter; a username has no spaces; a phone number is all digits. Write each rule as its own check, so you can tell the user exactly which rule failed instead of just saying \"invalid\".",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
#include <cctype>
using namespace std;

void checkPassword(const string& p) {
    bool hasDigit = false, hasUpper = false;
    for (size_t i = 0; i < p.size(); i++) {
        unsigned char c = static_cast<unsigned char>(p[i]);
        if (isdigit(c)) hasDigit = true;
        if (isupper(c)) hasUpper = true;
    }
    cout << p << ": ";
    if (p.size() < 8) cout << "too short\n";
    else if (!hasDigit) cout << "needs a digit\n";
    else if (!hasUpper) cout << "needs a capital letter\n";
    else cout << "OK\n";
}

int main() {
    checkPassword("abc1");
    checkPassword("secret12");
    checkPassword("Secret12");
    return 0;
}
`,
          expectedOutput: "abc1: too short\nsecret12: needs a capital letter\nSecret12: OK",
        },
        decision: {
          scenario: "A sign-up form rejects a password with the message \"Invalid password\" and nothing else.",
          question: "What is the best improvement?",
          options: [
            {
              id: "a",
              text: "Check each rule separately and report the one that failed, such as \"needs a digit\"",
              why: "Users can only fix what they are told about. Separate checks also make each rule easy to test and change.",
            },
            {
              id: "b",
              text: "Remove the rules so every password is accepted",
              whyWrong: "The rules exist to protect the account. The problem is the message, not the rules.",
            },
            {
              id: "c",
              text: "Show the rules only after three failed attempts",
              whyWrong: "That wastes the user's first attempts on guesswork.",
            },
            {
              id: "d",
              text: "Make the message longer by repeating \"Invalid\"",
              whyWrong: "A longer message with no information is no better.",
            },
          ],
          correct: "a",
          aftermath: "Good validation is specific: one rule, one check, one clear message.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · 7.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l31-input-buffer",
    moduleId: "cp-m7-strings",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["7.12"],
    title: "The Input Buffer",
    subtitle: "Why getline skips, and how to read input reliably",
    estimatedMinutes: 20,
    intro:
      "Almost every C++ beginner hits this bug in their first month: a program asks for an age, then a full name, and skips straight past the name. Once you understand the input buffer, the fix is one line, and you will also be able to stop a stray letter from breaking a program that expects a number.",

    atoms: [
      {
        id: "a-cp-buffer-problem",
        title: "Why getline seems to skip",
        explain:
          "When you type and press Enter, everything you typed, including the Enter (a newline character), goes into the input buffer: a waiting area that cin reads from. cin >> age takes the number and LEAVES the newline in the buffer. A getline straight after it finds that newline immediately, reads an empty line, and returns without waiting for the user. Run below with real typing: the user typed 20 and was never given the chance to type a name.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    int age = 0;
    string name;
    cout << "Age: ";
    cin >> age;
    cout << "Full name: ";
    getline(cin, name);
    cout << "Hello, [" << name << "] aged " << age << "\n";
    return 0;
}
`,
          inputs: ["20", "Ada Lovelace"],
          expectedOutput: "Age: 20\nFull name: Hello, [] aged 20",
        },
        why: "The brackets around name show it is empty. Ada Lovelace was typed into the keyboard script, but the program finished before it ever read it: getline had already been satisfied by the leftover newline.",
      },
      {
        id: "a-cp-buffer-fix",
        title: "The fix: clear the leftover line",
        explain:
          "After a cin >> that is followed by a getline, throw away the rest of the current line: cin.ignore(numeric_limits<streamsize>::max(), '\\n'); discards characters up to and including the next newline (it needs #include <limits>). A shorter alternative is getline(cin >> ws, name);, where ws skips any whitespace, including that newline, before getline starts.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <limits>
#include <string>
using namespace std;

int main() {
    int age = 0;
    string name;
    cout << "Age: ";
    cin >> age;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cout << "Full name: ";
    getline(cin, name);
    cout << "Hello, [" << name << "] aged " << age << "\n";
    return 0;
}
`,
          inputs: ["20", "Ada Lovelace"],
          expectedOutput: "Age: 20\nFull name: Ada Lovelace\nHello, [Ada Lovelace] aged 20",
        },
        codeFill: {
          task: "Fill the gap with the getline call that first skips leftover whitespace, so the city is read correctly after the number.",
          code: C`#include <iostream>
#include <string>
using namespace std;

int main() {
    int year = 0;
    string city;
    cout << "Year: ";
    cin >> year;
    cout << "City: ";
    {{1}}
    cout << city << ", " << year << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["getline(cin >> ws, city);", "std::getline(std::cin >> std::ws, city);"], width: 40 }],
          inputs: ["2026", "Port Harcourt"],
          expectedOutput: "Year: 2026\nCity: Port Harcourt\nPort Harcourt, 2026",
          hint: "Use getline as usual, but instead of plain cin pass cin >> ws.",
          successMessage: "getline(cin >> ws, city); The leftover newline is skipped, then the whole line is read.",
        },
      },
      {
        id: "a-cp-bad-input",
        title: "When the user types the wrong thing",
        explain:
          "If cin >> age meets letters instead of a number, the read FAILS: age is set to 0, cin goes into a failed state, and every later read is ignored until you deal with it. Check the read itself, if (cin >> age), which is true only on success. On failure, call cin.clear() to reset the stream and ignore the bad line, then ask again. This is the first step towards the full input validation in Week 11.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <limits>
using namespace std;

int main() {
    int age = 0;
    cout << "Age: ";
    while (!(cin >> age)) {
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Please type a whole number.\nAge: ";
    }
    cout << "Age accepted: " << age << "\n";
    return 0;
}
`,
          inputs: ["twenty", "20"],
          expectedOutput: "Age: twenty\nPlease type a whole number.\nAge: 20\nAge accepted: 20",
        },
        decision: {
          scenario: "In a loop that reads scores, the user types \"abc\" by mistake. The loop then runs forever, printing the same prompt without waiting.",
          question: "Why does it loop forever?",
          options: [
            {
              id: "a",
              text: "The failed read left cin in a failed state with \"abc\" still in the buffer, so every later read fails immediately; clear() and ignore() are needed",
              why: "A failed stream ignores every read until clear() is called, and the bad text must be discarded with ignore() or it will fail again.",
            },
            {
              id: "b",
              text: "The loop condition is wrong",
              whyWrong: "The loop is fine for numbers; it is the stream's failed state that never changes.",
            },
            {
              id: "c",
              text: "cin cannot read numbers inside loops",
              whyWrong: "It can; the earlier reads worked until a bad one arrived.",
            },
            {
              id: "d",
              text: "The computer is too slow to wait for input",
              whyWrong: "cin never waits because it has already failed, not because of speed.",
            },
          ],
          correct: "a",
          aftermath: "Check every read, and when one fails: clear, ignore, ask again.",
        },
      },
    ],

    task: {
      title: "Mini-project: text analyser",
      intro:
        "Write textstats.cpp: it reads a line of text and reports on it. Every analysis is a function taking const string&.",
      prompts: [
        "Read a whole line of text with getline.",
        "Report the number of characters, letters, digits, spaces and words (count word starts, so double spaces do not add words).",
        "Count the vowels, upper case and lower case alike, using a lower-case copy of the text.",
        "Report the longest word, by scanning the text for words separated by spaces.",
        "Say whether the line is a palindrome, ignoring spaces, punctuation and capitals.",
        "Ask for a word to search for and report every position where it appears, using find with a start position in a loop.",
        "Before the line of text, ask for the user's age with cin >>, and make sure the getline that follows still works, and that typing letters for the age is handled.",
      ],
      closing:
        "Keep textstats.cpp. In Week 11 it will read whole files instead of one line, and in Week 12 the counting becomes a map from each word to how often it appears.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
