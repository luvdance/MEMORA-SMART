/**
 * C++ PROGRAMMING · MODULE 8 · POINTERS, REFERENCES AND MEMORY
 *
 * Curriculum 8.1 – 8.13. The module beginners find hardest, so it is given
 * five lessons instead of four and follows the curriculum's teaching rule:
 * no pointer syntax until the learner knows what a memory address is and
 * why a program might need one. Lesson 32 introduces addresses with no
 * pointer variables at all.
 *
 * Every program is compiled and run by `npm run validate:content`. Two
 * things are deliberately never RUN: printing a raw address (it changes on
 * every run, so no output could be verified) and the memory bugs of 8.12
 * (undefined behaviour has no guaranteed output). Those appear as clearly
 * labelled `example` text instead.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s8-pointers";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 8.1 – 8.2  ·  ADDRESSES FIRST, NO POINTER SYNTAX YET
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l32-addresses",
    moduleId: "cp-m8-pointers",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2"],
    title: "Memory Addresses",
    subtitle: "Where variables live, and why a program needs to know",
    estimatedMinutes: 20,
    intro:
      "This week has a reputation, and it is mostly undeserved. Pointers are hard only when they are taught as syntax first. So this lesson has no pointers in it at all: just the idea underneath them, the memory address, and the reasons real programs need one.",

    atoms: [
      {
        id: "a-cp-memory-addresses",
        title: "Every variable lives at an address",
        explain:
          "Memory (RAM) is a very long row of bytes, and every byte has a number: its address. When you declare int score = 85;, C++ reserves four bytes somewhere in that row and remembers where. The variable's name is for you; the address is how the computer actually finds the value. Every variable you have ever created has had an address.",
        analogy:
          "A street of identical houses, numbered 1000, 1001, 1002 and onwards. A variable is a house with a name on the gate: \"score\". The name is convenient, but the postman delivers by house number. An int is a house that takes up four plots of land, so the next house along starts four numbers later.",
        table: {
          caption: "Three variables in memory, as an illustration. Real addresses are much larger numbers and change every time the program runs.",
          headers: ["Name", "Type", "Size", "Address (illustrative)", "Value"],
          rows: [
            ["score", "int", "4 bytes", "1000 – 1003", "85"],
            ["average", "double", "8 bytes", "1008 – 1015", "72.5"],
            ["grade", "char", "1 byte", "1016", "'B'"],
          ],
        },
        why: "In Week 2 you saw sizeof(int) is 4 and sizeof(double) is 8. Those bytes have to be somewhere, and \"somewhere\" is an address. Everything in this module builds on that one fact.",
      },
      {
        id: "a-cp-why-addresses",
        title: "Why would a program need an address?",
        explain:
          "Usually the name is enough. But four common jobs need the address itself. Sharing without copying: handing a function a large object's address instead of copying millions of bytes. Changing the caller's data: a function given an address can change what is stored there. Data created while the program runs: memory you ask for at run time has no name, only an address. Linking data together: a list where each item records the address of the next one. You have already used the second job without seeing it: int& parameters in Week 5.",
        decision: {
          scenario: "A photo-editing program holds a 50-megabyte image in memory and must pass it to a function that brightens it.",
          question: "Why is passing the image's address better than passing the image by value?",
          options: [
            {
              id: "a",
              text: "Passing the address hands over a few bytes and lets the function brighten the real image; passing by value copies 50 MB and brightens only the copy",
              why: "An address is tiny compared with the data it locates, and through it the function works on the original. That is exactly the \"share without copying\" and \"change the caller's data\" jobs.",
            },
            {
              id: "b",
              text: "Addresses make the image smaller",
              whyWrong: "The image stays exactly the same size; only what is passed changes.",
            },
            {
              id: "c",
              text: "Functions cannot receive images by value",
              whyWrong: "They can, at the cost of a full copy, and the changes would be lost.",
            },
            {
              id: "d",
              text: "There is no difference",
              whyWrong: "One copies 50 megabytes and edits the copy; the other copies a few bytes and edits the original.",
            },
          ],
          correct: "a",
          aftermath: "Addresses exist so programs can share and change data without copying it. Hold on to that purpose; the syntax is just how you write it down.",
        },
      },
      {
        id: "a-cp-address-of",
        title: "The address-of operator &",
        explain:
          "Put & in front of a variable's name and you get its address: &score. (The same symbol after a TYPE, as in int&, means reference; position decides the meaning.) cout prints an address as a hexadecimal number, which looks like 0x7ffe3c1a. Its exact value differs from run to run and computer to computer, so never rely on it. What does not change is that an address is itself just a number, and on a 64-bit computer it takes 8 bytes: that is what \"64-bit\" means.",
        example:
          "#include <iostream>\n\nint main() {\n    int score = 85;\n    double average = 72.5;\n    std::cout << \"score lives at   \" << &score << \"\\n\";\n    std::cout << \"average lives at \" << &average << \"\\n\";\n}\n\nOne run on a 64-bit Windows computer printed:\n\n  score lives at   0x5ffe9c\n  average lives at 0x5ffe90\n\nRun it again, or on another computer, and the numbers change.\nThe operating system chooses where a program's memory goes.",
        codeFill: {
          task: "An address is a number too. Fill the gap with the address of score, so the program prints how many bytes an address takes.",
          code: C`#include <iostream>

int main() {
    int score = 85;
    std::cout << "score's value takes " << sizeof(score) << " bytes\n";
    std::cout << "score's address takes " << sizeof({{1}}) << " bytes\n";
    return 0;
}
`,
          blanks: [{ answers: ["&score"] }],
          expectedOutput: "score's value takes 4 bytes\nscore's address takes 8 bytes",
          hint: "The address-of operator goes directly in front of the variable's name.",
          successMessage:
            "&score. The value is 4 bytes; the address that locates it is 8, on a 64-bit computer. Next lesson: a variable whose job is to hold an address.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 8.3 – 8.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l33-pointers",
    moduleId: "cp-m8-pointers",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.3", "8.4", "8.5"],
    title: "Pointers",
    subtitle: "Declaring, dereferencing, and pointing at nothing",
    estimatedMinutes: 22,
    intro:
      "A pointer is simply a variable that stores an address. That is the whole idea: everything else follows from it. You will declare pointers, use them to read and change the value they point at, and learn the safe way to say that a pointer points at nothing.",

    atoms: [
      {
        id: "a-cp-pointer-declare",
        title: "Declaring and initialising a pointer",
        explain:
          "int* p; declares p as a pointer to int: a variable that holds the address of an int. Initialise it with an address: int* p = &score;. Now p \"points to\" score. The pointer's type must match what it points at: a double* holds the address of a double. The * can be written next to the type (int* p) or the name (int *p); this course writes int* p, read as \"p is an int-pointer\".",
        analogy:
          "A slip of paper with a house number written on it. The paper is the pointer; the number on it is an address; the house is the variable it points to. Copying the slip does not copy the house.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int score = 85;
    int* p = &score;
    std::cout << "Points to score: " << std::boolalpha << (p == &score) << "\n";
    std::cout << "Value there: " << *p << "\n";
    return 0;
}
`,
          expectedOutput: "Points to score: true\nValue there: 85",
        },
        codeFill: {
          task: "Declare a pointer called pPrice that points to price.",
          code: C`#include <iostream>

int main() {
    double price = 1250.5;
    {{1}}
    std::cout << "Price through the pointer: " << *pPrice << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["double* pPrice = &price;", "double *pPrice = &price;", "double* pPrice{&price};"], width: 24 }],
          expectedOutput: "Price through the pointer: 1250.5",
          hint: "The type is \"pointer to double\" (double*), and the value is price's address (&price).",
          successMessage: "double* pPrice = &price; A pointer's type always matches the type of what it points to.",
        },
      },
      {
        id: "a-cp-dereference",
        title: "Dereferencing with *",
        explain:
          "Put * in front of a pointer and you reach the value at the address it holds: this is called dereferencing. *p reads the value, and *p = 90; changes it, which changes the original variable, because there is only one value, at one address. So * means two things depending on position: in a declaration (int* p) it says \"p is a pointer\"; in an expression (*p) it says \"go to the address in p\".",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int score = 85;
    int* p = &score;
    *p = 90;
    std::cout << score << "\n";
    *p += 5;
    std::cout << score << " " << *p << "\n";
    return 0;
}
`,
          expectedOutput: "90\n95 95",
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int a = 10, b = 20;
    int* p = &a;
    *p = *p + 5;
    p = &b;
    *p = *p * 2;
    std::cout << a << " " << b << " " << *p << "\n";
    return 0;
}
`,
          question: "p points at a, then is changed to point at b. Track a, b and where p points. What does this print?",
          expectedOutput: "15 40 40",
          hint: "*p = *p + 5 changes a to 15. Then p = &b changes the POINTER, not a value. *p * 2 then doubles b.",
          successMessage: "15 40 40. p = &b re-aims the pointer; *p = ... changes whatever it is currently aimed at.",
        },
      },
      {
        id: "a-cp-nullptr",
        title: "Null pointers and nullptr",
        explain:
          "Sometimes a pointer has nothing to point at yet. The safe value for that is nullptr: int* p = nullptr;. Never leave a pointer uninitialised: it would hold a garbage address, and following it reads or writes random memory. Dereferencing nullptr is also undefined behaviour (usually an instant crash), so check first: if (p != nullptr). Older code uses NULL or 0; modern C++ uses nullptr.",
        code: {
          language: CPP,
          code: C`#include <iostream>

void printIfPresent(const int* p) {
    if (p != nullptr) {
        std::cout << "Value: " << *p << "\n";
    } else {
        std::cout << "No value\n";
    }
}

int main() {
    int stock = 12;
    printIfPresent(&stock);
    printIfPresent(nullptr);
    return 0;
}
`,
          expectedOutput: "Value: 12\nNo value",
        },
        why: "const int* p means a pointer through which the int cannot be changed: the function promises only to read. It is the pointer version of const int&.",
        codeFill: {
          task: "Fill the condition so the program only dereferences best when it actually points at something.",
          code: C`#include <iostream>

int main() {
    int scores[] = {58, 91, 74};
    int* best = nullptr;
    for (int i = 0; i < 3; i++) {
        if (scores[i] > 90) best = &scores[i];
    }
    if ({{1}}) {
        std::cout << "Top score: " << *best << "\n";
    } else {
        std::cout << "Nobody scored above 90\n";
    }
    return 0;
}
`,
          blanks: [{ answers: ["best != nullptr", "nullptr != best", "best"] }],
          expectedOutput: "Top score: 91",
          hint: "Compare the pointer with the special value that means \"points at nothing\".",
          successMessage: "best != nullptr. If no score had been above 90, best would still be nullptr and the else branch would run safely.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 8.6 – 8.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l34-pointers-references",
    moduleId: "cp-m8-pointers",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.6", "8.7"],
    title: "Pointers and References",
    subtitle: "How they differ, and passing pointers to functions",
    estimatedMinutes: 20,
    intro:
      "You have now met two ways to refer to a variable indirectly: references (Week 5) and pointers (this week). They solve overlapping problems in different ways. This lesson sets them side by side, so you can read both and choose well.",

    atoms: [
      {
        id: "a-cp-ptr-vs-ref",
        title: "Pointers versus references",
        explain:
          "A reference is another name for an existing variable. It must be bound when it is created, it can never be re-bound to a different variable, it cannot be null, and you use it exactly like the variable itself. A pointer is a separate variable holding an address: it can be null, it can be re-aimed at something else, and you must write * to reach the value. Under the hood, compilers usually implement references with addresses too.",
        table: {
          caption: "References and pointers compared.",
          headers: ["", "Reference (int& r = x;)", "Pointer (int* p = &x;)"],
          rows: [
            ["Must be initialised?", "Yes", "No (but always should be)"],
            ["Can refer to nothing?", "No", "Yes: nullptr"],
            ["Can be changed to refer elsewhere?", "No", "Yes: p = &y;"],
            ["How you reach the value", "r", "*p"],
            ["Typical use", "Function parameters; aliases", "Optional values, dynamic memory, data structures"],
          ],
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int x = 1, y = 2;
    int& r = x;
    int* p = &x;
    r = y;
    p = &y;
    *p = 7;
    std::cout << x << " " << y << " " << r << "\n";
    return 0;
}
`,
          question: "r = y; does NOT re-bind r: it assigns y's value to x. Trace x and y. What does this print?",
          expectedOutput: "2 7 2",
          hint: "r is x, so r = y sets x to 2. p = &y re-aims the pointer; *p = 7 sets y.",
          successMessage: "2 7 2. A reference stays bound to x forever; assigning to it assigns to x. A pointer can be re-aimed.",
        },
      },
      {
        id: "a-cp-passing-pointers",
        title: "Passing pointers to functions",
        explain:
          "A function can take a pointer parameter, such as void addBonus(int* score), and the caller passes an address: addBonus(&myScore);. Inside, the function dereferences the pointer to read or change the caller's variable. This is how C programs did what C++ references now do, and you will meet it in older code and in C libraries. The extra power of a pointer parameter is that the caller can pass nullptr to mean \"no value\".",
        code: {
          language: CPP,
          code: C`#include <iostream>

void swapByPointer(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int first = 3, second = 8;
    swapByPointer(&first, &second);
    std::cout << first << " " << second << "\n";
    return 0;
}
`,
          expectedOutput: "8 3",
        },
        codeFill: {
          task: "Call the function so it applies a 10% discount to the real price variable.",
          code: C`#include <iostream>

void applyDiscount(double* price, double percent) {
    if (price != nullptr) {
        *price -= *price * percent / 100;
    }
}

int main() {
    double price = 8000;
    {{1}}
    std::cout << "Now: " << price << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["applyDiscount(&price, 10);", "applyDiscount(&price, 10.0);"], width: 26 }],
          expectedOutput: "Now: 7200",
          hint: "The function wants an ADDRESS for its first argument: use the address-of operator.",
          successMessage: "applyDiscount(&price, 10); With a reference parameter you would write applyDiscount(price, 10); the & would move into the function's signature.",
        },
      },
      {
        id: "a-cp-ptr-ref-choice",
        title: "Choosing between them",
        explain:
          "Modern C++ guidance is simple. Use a reference when there is always something to refer to: most function parameters that change or share an argument. Use a pointer when \"nothing\" must be possible, or when the target must change, or when working with dynamic memory and C-style interfaces. Use neither when a plain value or a const reference will do.",
        decision: {
          scenario: "A function findStudent searches a list and should give the caller access to the matching student, or indicate that nobody matched.",
          question: "What should it return?",
          options: [
            {
              id: "a",
              text: "A pointer to the student, or nullptr when nobody matched",
              why: "\"Possibly nothing\" is exactly what a pointer can express and a reference cannot. The caller checks for nullptr before using it. (Week 14 shows std::optional, another way to say \"maybe nothing\".)",
            },
            {
              id: "b",
              text: "A reference to the student",
              whyWrong: "A reference must always refer to something. There is no way to return a reference to \"nobody\".",
            },
            {
              id: "c",
              text: "A copy of the student, with an empty name meaning not found",
              whyWrong: "That copies the data, does not give access to the original, and relies on a magic value that a real student could have.",
            },
            {
              id: "d",
              text: "A global variable set to the student",
              whyWrong: "Hidden global state makes the function hard to use correctly and impossible to call twice safely.",
            },
          ],
          correct: "a",
          aftermath: "Reference when something is always there; pointer when \"nothing\" is a real possibility.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35 · 8.8 – 8.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l35-arrays-memory",
    moduleId: "cp-m8-pointers",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["8.8", "8.9", "8.10"],
    title: "Pointers, Arrays and the Shape of Memory",
    subtitle: "Pointer arithmetic, arrays as pointers, the stack and the heap",
    estimatedMinutes: 24,
    intro:
      "Arrays and pointers are closely connected in C++: an array's name turns into a pointer to its first element at the slightest excuse. Understanding that connection explains why arrays forget their size in functions. Then the bigger picture: the two regions of memory every C++ program uses.",

    atoms: [
      {
        id: "a-cp-pointer-arithmetic",
        title: "Pointer arithmetic and its limits",
        explain:
          "Adding 1 to a pointer moves it to the NEXT ELEMENT, not the next byte: for an int* it moves 4 bytes, for a double* 8. So if p points at an array's first element, p + 2 points at the third and *(p + 2) is its value. Subtracting two pointers into the same array gives the number of elements between them. The limits are strict: arithmetic is only valid inside one array (and to the position just past its end); anything else is undefined behaviour.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int a[5] = {10, 20, 30, 40, 50};
    int* p = &a[0];
    std::cout << *p << " " << *(p + 2) << "\n";
    p += 3;
    std::cout << *p << "\n";
    int* last = &a[4];
    std::cout << last - &a[1] << " elements apart\n";
    return 0;
}
`,
          expectedOutput: "10 30\n40\n3 elements apart",
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    double v[4] = {1.5, 2.5, 3.5, 4.5};
    double* p = v + 1;
    *(p + 1) = 9.0;
    p++;
    std::cout << *p << " " << *(p - 2) << " " << p - v << "\n";
    return 0;
}
`,
          question: "p starts at element 1 (v + 1). Track where p points after each step. What does this print?",
          expectedOutput: "9 1.5 2",
          hint: "*(p + 1) is element 2, set to 9. p++ moves p to element 2. Then p - 2 is element 0, and p - v is p's index.",
          successMessage: "9 1.5 2. Pointer arithmetic counts in elements, which is why p - v is an index, 2.",
        },
      },
      {
        id: "a-cp-arrays-pointers",
        title: "How arrays and pointers are related",
        explain:
          "In most expressions an array's name decays into a pointer to its first element: int* p = a; needs no &. Indexing is defined through pointer arithmetic: a[i] means exactly *(a + i). That is why a function parameter written int arr[] is really int* arr: the function receives only the address of the first element, and sizeof(arr) inside it gives the size of a pointer, not of the array. The size has to be passed separately, or a vector used instead.",
        code: {
          language: CPP,
          code: C`#include <iostream>

void showSize(int arr[]) {
    std::cout << "Inside the function: " << sizeof(arr) << " bytes\n";
}

int main() {
    int a[10] = {};
    std::cout << "In main: " << sizeof(a) << " bytes\n";
    showSize(a);
    std::cout << std::boolalpha << (a[3] == *(a + 3)) << "\n";
    return 0;
}
`,
          compileWarning: "will return size of 'int*'",
          expectedOutput: "In main: 40 bytes\nInside the function: 8 bytes\ntrue",
        },
        why: "In main the array is 10 ints, 40 bytes. Inside the function the same array has become a pointer, 8 bytes, and g++ even warns that sizeof will return the size of an int*. This is the real reason std::vector, which keeps its size, is preferred.",
        codeFill: {
          task: "Fill the gap so the loop prints the elements using pointer arithmetic instead of square brackets.",
          code: C`#include <iostream>

int main() {
    int primes[] = {2, 3, 5, 7, 11};
    for (int i = 0; i < 5; i++) {
        std::cout << {{1}} << " ";
    }
    std::cout << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["*(primes + i)"] }],
          expectedOutput: "2 3 5 7 11",
          hint: "primes[i] means \"move i elements on from the start, then dereference\". Write that with + and *.",
          successMessage: "*(primes + i) is exactly what primes[i] means. In practice, write primes[i]: it is clearer.",
        },
      },
      {
        id: "a-cp-stack-heap",
        title: "The stack and the heap",
        explain:
          "A running C++ program uses two main regions of memory. The stack holds local variables: they are created when a function is called and destroyed automatically when it returns. It is very fast but fairly small (often about 1 to 8 MB). The heap (also called the free store) is a large pool the program can request memory from at run time, of any size decided while running; that memory lasts until the program releases it, regardless of which function created it.",
        table: {
          caption: "The two regions compared.",
          headers: ["", "Stack", "Heap"],
          rows: [
            ["Holds", "Local variables and function parameters", "Memory requested at run time"],
            ["Lifetime", "Until the function or block ends", "Until it is released"],
            ["Managed by", "The compiler, automatically", "You, or a smart pointer or container"],
            ["Size", "Small (typically 1–8 MB)", "Large (most of the computer's RAM)"],
            ["Speed", "Very fast", "Slower to allocate"],
            ["Example", "int count = 0; inside main", "The elements of a std::vector"],
          ],
        },
        decision: {
          scenario: "A program must load a list of records whose number is only known after reading a file, possibly millions of them, and keep them after the loading function returns.",
          question: "Where should the records live?",
          options: [
            {
              id: "a",
              text: "On the heap, for example in a std::vector, whose elements are stored on the heap",
              why: "The size is only known at run time, it may be large, and the data must outlive the function that created it: all three point to the heap. A vector manages that heap memory for you.",
            },
            {
              id: "b",
              text: "In a large local array on the stack",
              whyWrong: "The stack is small, the size must be fixed at compile time, and the array disappears when the function returns.",
            },
            {
              id: "c",
              text: "In global variables, one per record",
              whyWrong: "The number of records is unknown, so you cannot name a variable for each.",
            },
            {
              id: "d",
              text: "It makes no difference",
              whyWrong: "Lifetime, size limits and run-time sizing all differ between the stack and the heap.",
            },
          ],
          correct: "a",
          aftermath: "Stack for small, short-lived, fixed-size data; heap for large, long-lived or run-time-sized data.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 36 · 8.11 – 8.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l36-dynamic-memory",
    moduleId: "cp-m8-pointers",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["8.11", "8.12", "8.13"],
    title: "Dynamic Memory and Smart Pointers",
    subtitle: "new and delete, the bugs they invite, and the modern answer",
    estimatedMinutes: 26,
    intro:
      "To use the heap directly you ask for memory with new and give it back with delete. It is powerful and it is where most of C++'s famous bugs come from. You will learn it, learn the bugs by name, and then learn the modern tool that removes most of them: the smart pointer.",

    atoms: [
      {
        id: "a-cp-new-delete",
        title: "Dynamic allocation with new and delete",
        explain:
          "new int(42) allocates one int on the heap, initialises it to 42 and returns its address, which you keep in a pointer. delete p; gives the memory back. For an array whose size is only known at run time, new int[n] allocates n ints, and delete[] p; (with brackets) releases it. Every new needs exactly one matching delete, and every new[] exactly one delete[].",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int* single = new int(42);
    std::cout << *single << "\n";
    delete single;

    int n = 0;
    std::cout << "How many scores? ";
    std::cin >> n;
    int* scores = new int[n];
    for (int i = 0; i < n; i++) scores[i] = (i + 1) * 10;
    std::cout << "Last: " << scores[n - 1] << "\n";
    delete[] scores;
    return 0;
}
`,
          inputs: ["4"],
          expectedOutput: "42\nHow many scores? 4\nLast: 40",
        },
        codeFill: {
          task: "The program allocates a run-time-sized array. Fill the gap with the statement that releases it correctly.",
          code: C`#include <iostream>

int main() {
    int n = 3;
    double* prices = new double[n];
    prices[0] = 500;
    prices[1] = 750;
    prices[2] = 1200;
    std::cout << "Total: " << prices[0] + prices[1] + prices[2] << "\n";
    {{1}}
    return 0;
}
`,
          blanks: [{ answers: ["delete[] prices;", "delete [] prices;"] }],
          expectedOutput: "Total: 2450",
          hint: "Memory from new[] is released with the array form of delete, which has square brackets.",
          successMessage: "delete[] prices; Plain delete on memory from new[] is undefined behaviour, even if it seems to work.",
        },
      },
      {
        id: "a-cp-memory-bugs",
        title: "Dangling pointers, leaks and invalid access",
        explain:
          "Four bugs, each with a name. A memory leak: memory allocated with new and never deleted; the program slowly uses more and more. A dangling pointer: a pointer to memory that has already been deleted, or to a local variable whose function has returned; using it is undefined behaviour. A double delete: deleting the same memory twice, which corrupts the heap. Invalid access: reading or writing outside the memory you own, as with an index past the end. None of these is reliably caught by the compiler, and they may not crash immediately, which is what makes them dangerous.",
        example:
          "Do NOT copy these. Each is undefined behaviour or a leak.\n\n  // 1. Memory leak: the address is lost, the int can never be freed\n  void leak() {\n      int* p = new int(5);\n  }                                  // p is gone; the int is not\n\n  // 2. Dangling pointer: use after delete\n  int* p = new int(5);\n  delete p;\n  std::cout << *p;                   // reads memory no longer yours\n\n  // 3. Dangling pointer: address of a dead local\n  int* makeNumber() {\n      int local = 7;\n      return &local;                 // local dies when we return\n  }\n\n  // 4. Double delete\n  delete p;\n  delete p;                          // corrupts the heap\n\nA partial defence: set a pointer to nullptr right after delete,\nso a later mistake fails loudly instead of silently.\nThe real defence is the next atom: let a smart pointer do it.",
        decision: {
          scenario: "A long-running server program allocates a new buffer with new for every request and never deletes it. It works perfectly in testing, but after three days in production it slows down and crashes.",
          question: "What is the most likely cause?",
          options: [
            {
              id: "a",
              text: "A memory leak: each request takes memory that is never returned, until the computer runs out",
              why: "Leaks are invisible in short tests and fatal over days. Every new without a matching delete is a little more memory lost on every request.",
            },
            {
              id: "b",
              text: "A compilation error",
              whyWrong: "The program compiled and ran for three days.",
            },
            {
              id: "c",
              text: "The server's clock is wrong",
              whyWrong: "Time has nothing to do with memory that is never released.",
            },
            {
              id: "d",
              text: "Too many comments in the code",
              whyWrong: "Comments are removed by the compiler and use no memory at run time.",
            },
          ],
          correct: "a",
          aftermath: "In modern C++, raw new and delete are rare. Containers and smart pointers release memory automatically.",
        },
      },
      {
        id: "a-cp-smart-pointers-intro",
        title: "Introduction to smart pointers",
        explain:
          "A smart pointer is an object that holds a pointer and deletes the memory automatically when the smart pointer itself goes away. std::unique_ptr<T>, from #include <memory>, is the sole owner of its object: it cannot be copied, and when it goes out of scope the object is deleted. Create one with std::make_unique<int>(42). std::shared_ptr<T> allows several owners and deletes the object when the last one goes away. Week 14 covers both in depth; the rule to start using now is: no raw new and delete in your own code.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <memory>

int main() {
    std::unique_ptr<int> balance = std::make_unique<int>(5000);
    *balance -= 1200;
    std::cout << "Balance: " << *balance << "\n";

    std::unique_ptr<int[]> readings = std::make_unique<int[]>(3);
    readings[0] = 14;
    readings[2] = 21;
    std::cout << readings[0] + readings[1] + readings[2] << "\n";
    return 0;
}
`,
          expectedOutput: "Balance: 3800\n35",
        },
        why: "There is no delete anywhere, and no leak: both objects are released when main ends. make_unique<int[]>(3) also sets the three ints to 0, which is why readings[1] adds nothing.",
        codeFill: {
          task: "Fill the gap so stock is a unique_ptr owning a new int with the value 12.",
          code: C`#include <iostream>
#include <memory>

int main() {
    std::unique_ptr<int> stock = {{1}};
    *stock += 8;
    std::cout << "Stock: " << *stock << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["std::make_unique<int>(12)"], width: 26 }],
          expectedOutput: "Stock: 20",
          hint: "std::make_unique, with the type in angle brackets and the starting value in round brackets.",
          successMessage: "std::make_unique<int>(12). The int is deleted automatically; you cannot forget, and you cannot do it twice.",
        },
      },
      {
        id: "a-cp-swap-and-modify",
        title: "Putting it together: references and pointers at work",
        explain:
          "This is the shape of this week's mini-project: the same job, swapping two values, done once with references and once with pointers, followed by a pointer walking through an array and changing it in place. Read it and predict the output before you look.",
        code: {
          language: CPP,
          code: C`#include <iostream>

void swapRef(int& a, int& b) { int t = a; a = b; b = t; }
void swapPtr(int* a, int* b) { int t = *a; *a = *b; *b = t; }

void doubleAll(int* arr, int size) {
    for (int* p = arr; p != arr + size; p++) {
        *p *= 2;
    }
}

int main() {
    int x = 1, y = 2;
    swapRef(x, y);
    std::cout << x << " " << y << "\n";
    swapPtr(&x, &y);
    std::cout << x << " " << y << "\n";

    int marks[] = {30, 35, 40};
    doubleAll(marks, 3);
    std::cout << marks[0] << " " << marks[1] << " " << marks[2] << "\n";
    return 0;
}
`,
          expectedOutput: "2 1\n1 2\n60 70 80",
        },
        why: "doubleAll walks a pointer from the first element to arr + size, one past the last, which is the valid stopping point. That loop shape, begin to end, is exactly how STL iterators work in Week 12.",
      },
    ],

    task: {
      title: "Mini-project: swapping and changing values through references and pointers",
      intro:
        "Write memory.cpp: a guided demonstration of everything this week taught. Print a clear heading before each part, and explain in a comment above each part what it proves.",
      prompts: [
        "Read two numbers and swap them with a function that takes references. Print them before and after.",
        "Swap them back with a second function that takes pointers, called with the addresses of the two variables.",
        "Declare a pointer to one of the numbers, change the number THROUGH the pointer, and print the variable to show it changed.",
        "Re-aim the same pointer at the other number, change it, and show which variable changed.",
        "Write a function that takes a pointer that may be nullptr and prints \"No value\" safely in that case; call it both ways.",
        "Ask how many readings to store, allocate them with std::make_unique<int[]>, fill them, and print their total and average.",
        "Write one function that walks a pointer through an array to find the largest value, returning a pointer to it (or nullptr for an empty array).",
      ],
      closing:
        "You have now seen how C++ really accesses memory. From next week, objects take over: classes manage their own data, and later their own memory.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
