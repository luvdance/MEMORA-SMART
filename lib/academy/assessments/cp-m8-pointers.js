/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 8 · POINTERS, REFERENCES AND MEMORY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l32-addresses": {
    lessonId: "cp-l32-addresses",
    passMark: 70,
    questions: [
      {
        id: "cpq32-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-memory-addresses",
        prompt: "What is a memory address?",
        options: [
          { id: "a", text: "The number that identifies where a byte is in memory" },
          { id: "b", text: "The name of a variable" },
          { id: "c", text: "The value stored in a variable" },
          { id: "d", text: "The file a program is saved in" },
        ],
        correct: "a",
        explanation: "Memory is a long row of numbered bytes; a variable's address is the number of its first byte.",
        whyWrong: {
          b: "The name is for the programmer; the computer finds the value by its address.",
          c: "The value is what is stored AT the address.",
          d: "Files are on storage; addresses refer to RAM while the program runs.",
        },
      },
      {
        id: "cpq32-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-why-addresses",
        prompt: "Which is a genuine reason a program might work with an address instead of a value?",
        options: [
          { id: "a", text: "To let a function change or share a large object without copying it" },
          { id: "b", text: "To make the program's output prettier" },
          { id: "c", text: "Because values cannot be printed" },
          { id: "d", text: "To make variables use less memory" },
        ],
        correct: "a",
        explanation: "Sharing without copying and changing the caller's data are two of the main reasons addresses are used.",
        whyWrong: {
          b: "Addresses have nothing to do with how output looks.",
          c: "Values print perfectly well.",
          d: "The variable is the same size either way; only what is passed changes.",
        },
      },
      {
        id: "cpq32-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-address-of",
        prompt: "What does &score give you, when score is an int variable?",
        options: [
          { id: "a", text: "The address where score is stored" },
          { id: "b", text: "A reference type" },
          { id: "c", text: "The value of score doubled" },
          { id: "d", text: "The size of score" },
        ],
        correct: "a",
        explanation: "& in front of a variable is the address-of operator.",
        whyWrong: {
          b: "& after a TYPE, as in int&, declares a reference. In front of a variable it takes the address.",
          c: "& is not arithmetic here.",
          d: "sizeof(score) gives its size.",
        },
      },
      {
        id: "cpq32-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-address-of",
        prompt: "Why do lessons never check the exact address a program prints?",
        options: [
          { id: "a", text: "The operating system places a program's memory differently on each run, so the number changes" },
          { id: "b", text: "Addresses are always 0" },
          { id: "c", text: "Printing an address is a compilation error" },
          { id: "d", text: "Addresses are secret" },
        ],
        correct: "a",
        explanation: "Where variables end up is decided at run time, so the printed number differs between runs and computers.",
        whyWrong: {
          b: "Valid variables never live at address 0.",
          c: "cout prints addresses in hexadecimal without complaint.",
          d: "They are visible; they are just not stable.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l33-pointers": {
    lessonId: "cp-l33-pointers",
    passMark: 70,
    questions: [
      {
        id: "cpq33-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-pointer-declare",
        prompt: "Which line makes p point to the double variable rate?",
        options: [
          { id: "a", text: "double* p = &rate;" },
          { id: "b", text: "double* p = rate;" },
          { id: "c", text: "int* p = &rate;" },
          { id: "d", text: "double p = *rate;" },
        ],
        correct: "a",
        explanation: "A pointer to double holds the address of a double, which &rate provides.",
        whyWrong: {
          b: "rate is a value, not an address.",
          c: "The pointer's type must match: an int* cannot point to a double.",
          d: "rate is not a pointer, so *rate is invalid, and p would not be a pointer.",
        },
      },
      {
        id: "cpq33-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-dereference",
        prompt: "int n = 4;\nint* p = &n;\n*p = *p * 3;\nn = n + 1;\nstd::cout << *p;\n\nWhat is printed?",
        options: [
          { id: "a", text: "13" },
          { id: "b", text: "12" },
          { id: "c", text: "5" },
          { id: "d", text: "An address" },
        ],
        correct: "a",
        explanation: "*p * 3 sets n to 12; n + 1 makes it 13; *p reads n, so 13.",
        whyWrong: {
          b: "n is changed again after the multiplication, and p still points at n.",
          c: "The multiplication through p already changed n to 12.",
          d: "*p is the value at the address, not the address.",
        },
      },
      {
        id: "cpq33-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-nullptr",
        prompt: "What is the safe way to create a pointer that does not point at anything yet?",
        options: [
          { id: "a", text: "int* p = nullptr;" },
          { id: "b", text: "int* p;" },
          { id: "c", text: "int* p = 1;" },
          { id: "d", text: "int p = nullptr;" },
        ],
        correct: "a",
        explanation: "nullptr is the explicit \"points at nothing\" value, and it can be checked before use.",
        whyWrong: {
          b: "An uninitialised pointer holds a garbage address.",
          c: "An integer is not an address; this does not compile.",
          d: "p is not a pointer here.",
        },
      },
      {
        id: "cpq33-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-dereference",
        prompt: "In int* p = &x; and then *p = 7;, what do the two stars mean?",
        options: [
          { id: "a", text: "The first declares p as a pointer; the second goes to the address in p" },
          { id: "b", text: "Both mean multiplication" },
          { id: "c", text: "Both declare pointers" },
          { id: "d", text: "Both take the address" },
        ],
        correct: "a",
        explanation: "In a declaration * is part of the type; in an expression it dereferences.",
        whyWrong: {
          b: "There is nothing being multiplied in either line.",
          c: "*p = 7; is an assignment through the pointer, not a declaration.",
          d: "Taking an address uses &.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l34-pointers-references": {
    lessonId: "cp-l34-pointers-references",
    passMark: 70,
    questions: [
      {
        id: "cpq34-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-ptr-vs-ref",
        prompt: "Which is true of a reference but NOT of a pointer?",
        options: [
          { id: "a", text: "It must be bound when created and can never be re-bound to another variable" },
          { id: "b", text: "It can be nullptr" },
          { id: "c", text: "It needs * to reach the value" },
          { id: "d", text: "It can be re-aimed at a different variable" },
        ],
        correct: "a",
        explanation: "A reference is a permanent alias; a pointer is a variable that can change and can be null.",
        whyWrong: {
          b: "Only pointers can be null.",
          c: "References are used like the variable itself.",
          d: "That is what pointers can do and references cannot.",
        },
      },
      {
        id: "cpq34-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-ptr-vs-ref",
        prompt: "int a = 5, b = 9;\nint& r = a;\nr = b;\nb = 0;\nstd::cout << a;\n\nWhat is printed?",
        options: [
          { id: "a", text: "9" },
          { id: "b", text: "0" },
          { id: "c", text: "5" },
          { id: "d", text: "It does not compile" },
        ],
        correct: "a",
        explanation: "r = b copies b's value (9) into a. r stays bound to a, so changing b later has no effect on a.",
        whyWrong: {
          b: "r is not re-bound to b; it is still a.",
          c: "r = b assigned 9 to a.",
          d: "Assigning through a reference is valid.",
        },
      },
      {
        id: "cpq34-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-passing-pointers",
        prompt: "void triple(int* n) { *n *= 3; }\nHow do you call it so that the variable k is tripled?",
        options: [
          { id: "a", text: "triple(&k);" },
          { id: "b", text: "triple(k);" },
          { id: "c", text: "triple(*k);" },
          { id: "d", text: "triple(int* k);" },
        ],
        correct: "a",
        explanation: "The parameter is a pointer, so pass k's address.",
        whyWrong: {
          b: "k is an int, not an address; this does not compile.",
          c: "k is not a pointer, so *k is invalid.",
          d: "Types are not written in a call.",
        },
      },
      {
        id: "cpq34-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-ptr-ref-choice",
        prompt: "A function's parameter must always refer to an existing object it will modify. What is the usual modern choice?",
        options: [
          { id: "a", text: "A reference (T&)" },
          { id: "b", text: "A pointer (T*)" },
          { id: "c", text: "A global variable" },
          { id: "d", text: "Pass by value" },
        ],
        correct: "a",
        explanation: "When something is always there, a reference expresses it directly and cannot be null.",
        whyWrong: {
          b: "Pointers are for when \"nothing\" is a possibility or the target changes.",
          c: "Globals hide what a function depends on.",
          d: "By value, the function would only modify a copy.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l35-arrays-memory": {
    lessonId: "cp-l35-arrays-memory",
    passMark: 70,
    questions: [
      {
        id: "cpq35-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-pointer-arithmetic",
        prompt: "int a[] = {4, 8, 15, 16, 23};\nint* p = a + 1;\nstd::cout << *(p + 2);\n\nWhat is printed?",
        options: [
          { id: "a", text: "16" },
          { id: "b", text: "15" },
          { id: "c", text: "10" },
          { id: "d", text: "8" },
        ],
        correct: "a",
        explanation: "p points at index 1; p + 2 is index 3, which holds 16.",
        whyWrong: {
          b: "That is index 2; p already starts at index 1.",
          c: "*(p + 2) is an element, not 8 + 2.",
          d: "That is *p.",
        },
      },
      {
        id: "cpq35-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-arrays-pointers",
        prompt: "What does a[i] mean in terms of pointers?",
        options: [
          { id: "a", text: "*(a + i)" },
          { id: "b", text: "&a + i" },
          { id: "c", text: "*a + i" },
          { id: "d", text: "a * i" },
        ],
        correct: "a",
        explanation: "Move i elements from the start, then dereference.",
        whyWrong: {
          b: "That is an address, not the element.",
          c: "That adds i to the FIRST element's value.",
          d: "That is not meaningful for an array.",
        },
      },
      {
        id: "cpq35-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-arrays-pointers",
        prompt: "Inside void f(int arr[]), why does sizeof(arr) not give the size of the caller's array?",
        options: [
          { id: "a", text: "The array decayed to a pointer, so sizeof gives the size of an int*" },
          { id: "b", text: "sizeof does not work inside functions" },
          { id: "c", text: "The function received a copy with one element" },
          { id: "d", text: "It does give the array's size" },
        ],
        correct: "a",
        explanation: "An array parameter is really a pointer to the first element; the length is lost.",
        whyWrong: {
          b: "sizeof works anywhere; it measures the pointer here.",
          c: "No copy of the elements is made at all.",
          d: "g++ even warns that it will return the size of int*.",
        },
      },
      {
        id: "cpq35-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-stack-heap",
        prompt: "Where do a function's ordinary local variables live?",
        options: [
          { id: "a", text: "On the stack, destroyed automatically when the function returns" },
          { id: "b", text: "On the heap, until deleted" },
          { id: "c", text: "On the hard drive" },
          { id: "d", text: "In the CPU forever" },
        ],
        correct: "a",
        explanation: "Locals are stack memory with automatic lifetime.",
        whyWrong: {
          b: "Heap memory is what you request at run time, for example with new or a vector.",
          c: "Variables live in RAM while the program runs.",
          d: "Locals end with their function.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l36-dynamic-memory": {
    lessonId: "cp-l36-dynamic-memory",
    passMark: 70,
    questions: [
      {
        id: "cpq36-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-new-delete",
        prompt: "Memory was allocated with int* v = new int[50];. How should it be released?",
        options: [
          { id: "a", text: "delete[] v;" },
          { id: "b", text: "delete v;" },
          { id: "c", text: "v = nullptr;" },
          { id: "d", text: "Nothing: it is released automatically" },
        ],
        correct: "a",
        explanation: "new[] pairs with delete[].",
        whyWrong: {
          b: "Plain delete on an array from new[] is undefined behaviour.",
          c: "That loses the address without releasing the memory: a leak.",
          d: "Raw new memory is only released by delete; smart pointers and vectors are what release automatically.",
        },
      },
      {
        id: "cpq36-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-memory-bugs",
        prompt: "int* makeValue() {\n    int local = 7;\n    return &local;\n}\n\nWhat is wrong?",
        options: [
          { id: "a", text: "It returns a dangling pointer: local is destroyed when the function returns" },
          { id: "b", text: "Nothing; the caller gets 7" },
          { id: "c", text: "It leaks memory" },
          { id: "d", text: "Functions cannot return pointers" },
        ],
        correct: "a",
        explanation: "local lives on the stack and dies at the return; the address then points at memory that is no longer valid.",
        whyWrong: {
          b: "Using the returned pointer is undefined behaviour; it may appear to work by luck.",
          c: "No heap memory was allocated, so nothing leaks.",
          d: "Returning pointers is fine when they point at something that is still alive.",
        },
      },
      {
        id: "cpq36-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-memory-bugs",
        prompt: "What is a memory leak?",
        options: [
          { id: "a", text: "Heap memory that was allocated and never released" },
          { id: "b", text: "Reading a variable before it is initialised" },
          { id: "c", text: "A pointer that is nullptr" },
          { id: "d", text: "Printing a password to the screen" },
        ],
        correct: "a",
        explanation: "Lost allocations accumulate and the program uses more and more memory.",
        whyWrong: {
          b: "That is reading an uninitialised variable, a different bug.",
          c: "A null pointer is a safe, explicit value.",
          d: "That is an information leak, not a memory leak.",
        },
      },
      {
        id: "cpq36-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-smart-pointers-intro",
        prompt: "What does std::unique_ptr do for you?",
        options: [
          { id: "a", text: "Deletes the object it owns automatically when the unique_ptr goes out of scope" },
          { id: "b", text: "Makes the object shared by every function" },
          { id: "c", text: "Copies the object each time it is used" },
          { id: "d", text: "Turns the object into a global variable" },
        ],
        correct: "a",
        explanation: "unique_ptr is the single owner and releases the memory itself, so you cannot forget or double-delete.",
        whyWrong: {
          b: "Shared ownership is std::shared_ptr; unique_ptr cannot even be copied.",
          c: "It holds one object; it does not copy it.",
          d: "Its lifetime is tied to its scope, the opposite of a global.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
