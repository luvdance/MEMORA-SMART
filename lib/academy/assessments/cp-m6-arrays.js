/**
 * ASSESSMENTS · C++ PROGRAMMING · MODULE 6 · ARRAYS, VECTORS AND MULTIDIMENSIONAL DATA
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l24-arrays": {
    lessonId: "cp-l24-arrays",
    passMark: 70,
    questions: [
      {
        id: "cpq24-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-indexing-bounds",
        prompt: "An array is declared as int temps[7];. What is the index of its last element?",
        options: [
          { id: "a", text: "6" },
          { id: "b", text: "7" },
          { id: "c", text: "1" },
          { id: "d", text: "0" },
        ],
        correct: "a",
        explanation: "Indexes start at 0, so seven elements have indexes 0 to 6.",
        whyWrong: {
          b: "temps[7] is one past the end: undefined behaviour.",
          c: "1 is the second element.",
          d: "0 is the first element.",
        },
      },
      {
        id: "cpq24-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-indexing-bounds",
        prompt: "int a[3] = {5, 6, 7};\nstd::cout << a[3];\n\nWhat happens?",
        options: [
          { id: "a", text: "Undefined behaviour: it reads memory past the end; it may print garbage, crash, or appear to work" },
          { id: "b", text: "It prints 7" },
          { id: "c", text: "It always prints 0" },
          { id: "d", text: "The compiler always refuses to build it" },
        ],
        correct: "a",
        explanation: "C++ does not check array indexes. a[3] is outside the array, and the language makes no promise about the result.",
        whyWrong: {
          b: "7 is a[2], the last valid element.",
          c: "Nothing guarantees 0; the memory belongs to something else.",
          d: "Compilers usually build it without complaint, which is what makes it dangerous.",
        },
      },
      {
        id: "cpq24-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-declare-array",
        prompt: "What does int counts[5] = {}; do?",
        options: [
          { id: "a", text: "Creates five ints, all set to 0" },
          { id: "b", text: "Creates an empty array with no elements" },
          { id: "c", text: "Creates five ints with garbage values" },
          { id: "d", text: "It does not compile" },
        ],
        correct: "a",
        explanation: "Empty braces value-initialise every element, which for ints is 0.",
        whyWrong: {
          b: "The [5] fixes the size at five elements.",
          c: "Garbage values come from int counts[5]; with no braces at all.",
          d: "Empty braces are valid initialisation.",
        },
      },
      {
        id: "cpq24-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-traverse",
        prompt: "constexpr int N = 4;\nint v[N] = {2, 4, 6, 8};\nWhich loop header visits every element exactly once?",
        options: [
          { id: "a", text: "for (int i = 0; i < N; i++)" },
          { id: "b", text: "for (int i = 0; i <= N; i++)" },
          { id: "c", text: "for (int i = 1; i <= N; i++)" },
          { id: "d", text: "for (int i = 1; i < N; i++)" },
        ],
        correct: "a",
        explanation: "Indexes 0, 1, 2 and 3: start at 0 and stop before N.",
        whyWrong: {
          b: "<= N reaches v[4], past the end.",
          c: "Starts at v[1], skipping the first element, and reaches past the end.",
          d: "Skips v[0].",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l25-array-algorithms": {
    lessonId: "cp-l25-array-algorithms",
    passMark: 70,
    questions: [
      {
        id: "cpq25-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-sum-avg-min-max",
        prompt: "int t[] = {-4, -9, -2, -7};\nint highest = 0;\nfor (int i = 0; i < 4; i++) if (t[i] > highest) highest = t[i];\n\nWhat is highest afterwards, and why is it wrong?",
        options: [
          { id: "a", text: "0, because no element is above the starting value 0; start with highest = t[0] instead" },
          { id: "b", text: "-2, correctly" },
          { id: "c", text: "-9" },
          { id: "d", text: "It does not compile" },
        ],
        correct: "a",
        explanation: "Starting from 0 assumes the answer is at least 0. With all-negative data, 0 is never beaten and is wrongly reported.",
        whyWrong: {
          b: "-2 is the right answer, but this code never finds it: -2 is not greater than 0.",
          c: "-9 is the lowest, and it is never assigned here.",
          d: "It compiles; the bug is in the logic.",
        },
      },
      {
        id: "cpq25-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-search-array",
        prompt: "In a linear search, why is position set to -1 before the loop?",
        options: [
          { id: "a", text: "-1 can never be a real index, so it clearly means \"not found\" if no match changes it" },
          { id: "b", text: "Arrays start at index -1" },
          { id: "c", text: "To make the loop run backwards" },
          { id: "d", text: "It is required by the compiler" },
        ],
        correct: "a",
        explanation: "Valid indexes are 0 or more. A value that cannot be an index is a safe signal for \"no match\".",
        whyWrong: {
          b: "Arrays start at index 0.",
          c: "The starting value of position has nothing to do with the loop's direction.",
          d: "The compiler does not care; it is a convention that makes the result meaningful.",
        },
      },
      {
        id: "cpq25-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-sort-array",
        prompt: "After the first complete pass of bubble sort (ascending), what is guaranteed?",
        options: [
          { id: "a", text: "The largest value is in the last position" },
          { id: "b", text: "The whole array is sorted" },
          { id: "c", text: "The smallest value is in the first position" },
          { id: "d", text: "Nothing at all" },
        ],
        correct: "a",
        explanation: "Each comparison carries the larger value forward, so the maximum ends up at the end after one pass.",
        whyWrong: {
          b: "Usually more passes are needed.",
          c: "The smallest moves left only one position per pass.",
          d: "The largest value's position is guaranteed, which is why each later pass can stop one place earlier.",
        },
      },
      {
        id: "cpq25-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-sum-avg-min-max",
        prompt: "int s[] = {70, 81, 64};\nint total = 0;\nfor (int i = 0; i < 3; i++) total += s[i];\nstd::cout << total / 3;\n\nWhat is printed?",
        options: [
          { id: "a", text: "71" },
          { id: "b", text: "71.6667" },
          { id: "c", text: "72" },
          { id: "d", text: "215" },
        ],
        correct: "a",
        explanation: "The total is 215, and 215 / 3 between two ints is integer division: 71.",
        whyWrong: {
          b: "That needs static_cast<double>(total) / 3.",
          c: "Integer division truncates; it does not round.",
          d: "215 is the total, before the division.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l26-2d-arrays": {
    lessonId: "cp-l26-2d-arrays",
    passMark: 70,
    questions: [
      {
        id: "cpq26-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-cp-2d-arrays",
        prompt: "How many ints does int seats[5][8]; hold?",
        options: [
          { id: "a", text: "40" },
          { id: "b", text: "13" },
          { id: "c", text: "8" },
          { id: "d", text: "5" },
        ],
        correct: "a",
        explanation: "5 rows of 8 columns: 5 × 8 = 40 elements.",
        whyWrong: {
          b: "The dimensions multiply, they do not add.",
          c: "8 is the length of one row.",
          d: "5 is the number of rows.",
        },
      },
      {
        id: "cpq26-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-2d-arrays",
        prompt: "int g[2][3] = {{1, 2, 3}, {4, 5, 6}};\nWhat is g[1][2]?",
        options: [
          { id: "a", text: "6" },
          { id: "b", text: "2" },
          { id: "c", text: "5" },
          { id: "d", text: "3" },
        ],
        correct: "a",
        explanation: "Row 1 is {4, 5, 6}; column 2 of that row is 6.",
        whyWrong: {
          b: "That is g[0][1]: the row and column are both off.",
          c: "That is g[1][1].",
          d: "That is g[0][2], in the first row.",
        },
      },
      {
        id: "cpq26-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-cp-row-col-totals",
        prompt: "To total each COLUMN of int m[4][3], which loop should be on the outside?",
        options: [
          { id: "a", text: "The loop over the 3 columns" },
          { id: "b", text: "The loop over the 4 rows" },
          { id: "c", text: "Either; the totals are the same" },
          { id: "d", text: "No loops are needed" },
        ],
        correct: "a",
        explanation: "Hold one column fixed in the outer loop and add down the rows in the inner loop.",
        whyWrong: {
          b: "With rows outside, each pass of the outer loop totals a row.",
          c: "The arrangement decides whether you get row totals or column totals.",
          d: "Twelve values need loops to add up.",
        },
      },
      {
        id: "cpq26-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-matrix-ops",
        prompt: "Transposing a 2 × 5 matrix gives a matrix of what shape?",
        options: [
          { id: "a", text: "5 × 2" },
          { id: "b", text: "2 × 5" },
          { id: "c", text: "10 × 1" },
          { id: "d", text: "5 × 5" },
        ],
        correct: "a",
        explanation: "Transposing swaps rows and columns: t[j][i] = m[i][j].",
        whyWrong: {
          b: "That is the original shape.",
          c: "The elements keep a grid shape; only rows and columns swap.",
          d: "The number of elements stays 10.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "cp-l27-vectors": {
    lessonId: "cp-l27-vectors",
    passMark: 70,
    questions: [
      {
        id: "cpq27-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-cp-vector-ops",
        prompt: "std::vector<int> v = {4, 8};\nv.push_back(15);\nv.pop_back();\nv.push_back(16);\nstd::cout << v.size() << \" \" << v.back();\n\nWhat is printed?",
        options: [
          { id: "a", text: "3 16" },
          { id: "b", text: "4 16" },
          { id: "c", text: "3 15" },
          { id: "d", text: "2 8" },
        ],
        correct: "a",
        explanation: "{4, 8} → {4, 8, 15} → {4, 8} → {4, 8, 16}: three elements, the last being 16.",
        whyWrong: {
          b: "pop_back removed 15, so there are three elements, not four.",
          c: "15 was removed by pop_back before 16 was added.",
          d: "Two values were added and one removed.",
        },
      },
      {
        id: "cpq27-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-vector-ops",
        prompt: "What is the difference between v[10] and v.at(10) on a vector with 5 elements?",
        options: [
          { id: "a", text: "v[10] is undefined behaviour; v.at(10) checks the index and reports an error (throws an exception)" },
          { id: "b", text: "They are identical" },
          { id: "c", text: "v.at(10) adds elements until index 10 exists" },
          { id: "d", text: "v[10] returns 0" },
        ],
        correct: "a",
        explanation: "[] does no checking, like an array. .at() checks and throws std::out_of_range.",
        whyWrong: {
          b: "Only .at() checks the index.",
          c: "Neither grows the vector; push_back or resize do that.",
          d: "Nothing guarantees 0; reading past the end is undefined.",
        },
      },
      {
        id: "cpq27-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-cp-arrays-vs-vectors",
        prompt: "Which is an advantage of std::vector over a built-in array?",
        options: [
          { id: "a", text: "It can change size while the program runs and always knows its size" },
          { id: "b", text: "Its [] operator is much faster" },
          { id: "c", text: "It can hold values of different types at once" },
          { id: "d", text: "It never uses memory" },
        ],
        correct: "a",
        explanation: "Vectors grow and shrink at run time and report their size with .size().",
        whyWrong: {
          b: "Indexing is equally fast for both.",
          c: "Like arrays, a vector holds one type, given in the angle brackets.",
          d: "Every collection uses memory for its elements.",
        },
      },
      {
        id: "cpq27-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-cp-passing-collections",
        prompt: "void clearAll(std::vector<int> v) { v.clear(); }\nint main() { std::vector<int> s = {1, 2, 3}; clearAll(s); std::cout << s.size(); }\n\nWhat is printed?",
        options: [
          { id: "a", text: "3, because the function cleared a copy" },
          { id: "b", text: "0" },
          { id: "c", text: "It does not compile" },
          { id: "d", text: "1" },
        ],
        correct: "a",
        explanation: "The vector is passed by value, so clearAll empties its own copy. To change s, the parameter must be std::vector<int>& v.",
        whyWrong: {
          b: "That needs pass-by-reference.",
          c: "Passing a vector by value is valid; it just copies it.",
          d: "Nothing removed any element of s.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
