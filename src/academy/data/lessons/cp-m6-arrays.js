/**
 * C++ PROGRAMMING · MODULE 6 · ARRAYS, VECTORS AND MULTIDIMENSIONAL DATA
 *
 * Curriculum 6.1 – 6.13. Manage collections of related information. Every
 * program is compiled and run by `npm run validate:content`. Reading past
 * the end of an array is undefined behaviour, so it is never RUN here: it is
 * described in an `example`, because a program whose output is not
 * guaranteed cannot honestly be verified.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s6-arrays";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24 · 6.1 – 6.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l24-arrays",
    moduleId: "cp-m6-arrays",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1", "6.2", "6.3", "6.4"],
    title: "Arrays",
    subtitle: "Why collections exist, declaring arrays, indexing and loops",
    estimatedMinutes: 22,
    intro:
      "A class has 40 students. Forty separate variables, score1 to score40, would make even an average painful to write. An array stores many values of the same type under one name, numbered so a loop can reach each one. This is where loops really start to pay off.",

    atoms: [
      {
        id: "a-cp-why-collections",
        title: "Why collections of data are useful",
        explain:
          "Programs constantly deal with many values of the same kind: every score in a class, every price in a shop, every reading from a sensor. A collection keeps them together under one name, so one loop can process all of them, the program works the same for 5 values or 5,000, and functions can receive the whole set at once.",
        decision: {
          scenario: "You must calculate the average of 40 students' scores, and next term the class may have 45.",
          question: "Which design is best?",
          options: [
            {
              id: "a",
              text: "Store the scores in one collection and use a loop to add them up",
              why: "One loop works for any number of scores. When the class grows, the code does not change; only the data does.",
            },
            {
              id: "b",
              text: "Forty variables, score1 to score40, added in one long expression",
              whyWrong: "It works for exactly 40 students and breaks the moment there are 45. It is also very easy to miss or repeat one.",
            },
            {
              id: "c",
              text: "Ask the user to add the scores up themselves and type in the total",
              whyWrong: "That moves the work to the user and loses the individual scores, which you need for the highest, lowest and ranking.",
            },
            {
              id: "d",
              text: "One int that is overwritten with each score in turn",
              whyWrong: "Each new score destroys the previous one. You can total them that way, but you cannot find the highest or rank them.",
            },
          ],
          correct: "a",
          aftermath: "Collections plus loops: the combination that lets programs handle real amounts of data.",
        },
      },
      {
        id: "a-cp-declare-array",
        title: "Declaring and initialising arrays",
        explain:
          "An array is a fixed-size row of elements of the same type, stored next to each other in memory. int scores[5]; makes room for five ints. Initialise it with values in braces: int scores[5] = {72, 58, 91, 64, 80};. If you give the values, you can leave the size out and C++ counts them: int scores[] = {72, 58, 91};. int counts[10] = {}; sets all ten to 0. The size must be a constant known at compile time.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int scores[5] = {72, 58, 91, 64, 80};
    double prices[] = {350.0, 1200.5, 99.99};
    int counts[4] = {};
    std::cout << scores[0] << " " << scores[4] << "\n";
    std::cout << prices[1] << "\n";
    std::cout << counts[2] << "\n";
    return 0;
}
`,
          expectedOutput: "72 80\n1200.5\n0",
        },
        mistake:
          "int size = 5; int scores[size]; Some compilers accept this as an extension, but it is not standard C++: the size must be a compile-time constant (constexpr int SIZE = 5;). When the size is only known while the program runs, use a vector, later in this module.",
        codeFill: {
          task: "Declare an array called rainfall holding the four values 12, 0, 7 and 25, so the program prints the third one.",
          code: C`#include <iostream>

int main() {
    {{1}}
    std::cout << "Day 3: " << rainfall[2] << " mm\n";
    return 0;
}
`,
          blanks: [
            {
              answers: [
                "int rainfall[4] = {12, 0, 7, 25};",
                "int rainfall[] = {12, 0, 7, 25};",
                "int rainfall[4]{12, 0, 7, 25};",
                "int rainfall[]{12, 0, 7, 25};",
              ],
              width: 32,
            },
          ],
          expectedOutput: "Day 3: 7 mm",
          hint: "Type, name, [size] (or empty []), then = and the values in braces, separated by commas.",
          successMessage: "Four values under one name. rainfall[2] is the third, because counting starts at 0.",
        },
      },
      {
        id: "a-cp-indexing-bounds",
        title: "Indexing and bounds",
        explain:
          "Each element has an index, its position, starting from 0: the first element of scores is scores[0] and the last of five is scores[4]. You read and change elements with the index in square brackets. C++ does NOT check that an index is valid: scores[5] or scores[-1] reads or writes memory that belongs to something else. That is undefined behaviour: the program may print garbage, crash, or seem fine and corrupt other data.",
        example:
          "int scores[5] = {72, 58, 91, 64, 80};\n\n  index:   0    1    2    3    4\n  value:  72   58   91   64   80\n\n  scores[0]   72      the first element\n  scores[4]   80      the last element: size - 1\n  scores[5]   ???     past the end: undefined behaviour\n\nThe compiler will usually NOT stop you. Guarding every index is\nyour job, and std::vector's .at(), later in this module, can help.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int stock[4] = {10, 0, 25, 8};
    stock[1] = 12;
    stock[3] += stock[0];
    int i = 2;
    std::cout << stock[i] << " " << stock[i + 1] << " " << stock[1] << "\n";
    return 0;
}
`,
          question: "Indexes start at 0. Track each change. What does this print?",
          expectedOutput: "25 18 12",
          hint: "stock[1] becomes 12. stock[3] becomes 8 + 10. Then i is 2, so stock[i] is the third element.",
          successMessage: "25 18 12. An index can be any expression, such as i + 1, as long as its value stays between 0 and size - 1.",
        },
      },
      {
        id: "a-cp-traverse",
        title: "Traversing an array with a loop",
        explain:
          "To visit every element, loop over the indexes from 0 up to, but not including, the size: for (int i = 0; i < SIZE; i++). Use < not <=, which would step one past the end. Keep the size in one constexpr constant, or ask the array for it with std::size(scores) from <iterator>, so the loop and the array can never disagree.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <iterator>

int main() {
    int scores[] = {72, 58, 91, 64, 80};
    for (std::size_t i = 0; i < std::size(scores); i++) {
        std::cout << "Student " << i + 1 << ": " << scores[i] << "\n";
    }
    return 0;
}
`,
          expectedOutput: "Student 1: 72\nStudent 2: 58\nStudent 3: 91\nStudent 4: 64\nStudent 5: 80",
        },
        why: "std::size returns a std::size_t, an unsigned whole-number type used for sizes, so the loop counter is a size_t too. Comparing a signed int with it makes -Wall -Wextra warn about mixing signed and unsigned values.",
        codeFill: {
          task: "Fill the loop header so it visits every element of temps, using the constant DAYS.",
          code: C`#include <iostream>

int main() {
    constexpr int DAYS = 5;
    double temps[DAYS] = {31.5, 33.0, 29.8, 30.2, 34.1};
    for ({{1}}) {
        std::cout << temps[i] << " ";
    }
    std::cout << "\n";
    return 0;
}
`,
          blanks: [
            {
              answers: ["int i = 0; i < DAYS; i++", "int i = 0; i < DAYS; ++i", "int i = 0; i <= DAYS - 1; i++"],
              width: 26,
            },
          ],
          expectedOutput: "31.5 33 29.8 30.2 34.1",
          hint: "Start at index 0, continue while i is less than DAYS, and add one each time.",
          successMessage: "0 up to, but not including, DAYS. Five elements, indexes 0 to 4.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 6.5 – 6.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l25-array-algorithms",
    moduleId: "cp-m6-arrays",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.5", "6.6", "6.7"],
    title: "Working with Array Data",
    subtitle: "Totals and extremes, searching, and sorting",
    estimatedMinutes: 24,
    intro:
      "Three jobs come up with almost every collection: summarise it (total, average, highest, lowest), find something in it, and put it in order. Each has a standard pattern. Learn the patterns here with arrays, and you will recognise them everywhere.",

    atoms: [
      {
        id: "a-cp-sum-avg-min-max",
        title: "Sum, average, minimum and maximum",
        explain:
          "To total an array, use an accumulator and add each element. The average is the total divided by the count, with a cast so the decimals survive. For the highest value, start with the FIRST element as the best so far, then compare every other element with it and replace it whenever you find a bigger one. The lowest works the same way with <. Starting from the first element, rather than from 0, means it works even when every value is negative.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    constexpr int N = 6;
    int scores[N] = {72, 58, 91, 64, 80, 45};
    int total = 0;
    int highest = scores[0];
    int lowest = scores[0];
    for (int i = 0; i < N; i++) {
        total += scores[i];
        if (scores[i] > highest) highest = scores[i];
        if (scores[i] < lowest) lowest = scores[i];
    }
    std::cout << "Total: " << total << "\n";
    std::cout << "Average: " << static_cast<double>(total) / N << "\n";
    std::cout << "Highest: " << highest << ", lowest: " << lowest << "\n";
    return 0;
}
`,
          expectedOutput: "Total: 410\nAverage: 68.3333\nHighest: 91, lowest: 45",
        },
        codeFill: {
          task: "Fill the condition that makes cheapest track the lowest price.",
          code: C`#include <iostream>

int main() {
    int prices[] = {4500, 3200, 5100, 2900, 3800};
    int cheapest = prices[0];
    for (int i = 1; i < 5; i++) {
        if ({{1}}) {
            cheapest = prices[i];
        }
    }
    std::cout << "Cheapest: " << cheapest << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["prices[i] < cheapest", "cheapest > prices[i]"] }],
          expectedOutput: "Cheapest: 2900",
          hint: "Replace the cheapest-so-far whenever the current price is smaller than it.",
          successMessage: "prices[i] < cheapest. The loop starts at 1 because prices[0] is already the starting candidate.",
        },
      },
      {
        id: "a-cp-search-array",
        title: "Searching an array",
        explain:
          "A linear search checks the elements one by one from the start until it finds the value or reaches the end. Record WHERE it was found, and use a value that cannot be a real index, such as -1, to mean \"not found\". Stop as soon as you find it with break. Week 13 shows a much faster search for sorted data.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int ids[] = {1042, 2210, 1777, 3001, 1777};
    int target = 1777;
    int position = -1;
    for (int i = 0; i < 5; i++) {
        if (ids[i] == target) {
            position = i;
            break;
        }
    }
    std::cout << position << "\n";
    target = 4000;
    position = -1;
    for (int i = 0; i < 5; i++) {
        if (ids[i] == target) {
            position = i;
            break;
        }
    }
    std::cout << position << "\n";
    return 0;
}
`,
          question: "1777 appears twice; 4000 not at all. What does the program print?",
          expectedOutput: "2\n-1",
          hint: "The break stops at the FIRST match. When nothing matches, position keeps its starting value.",
          successMessage: "2 and -1. The first match wins because of break, and -1 is the agreed signal for \"not there\".",
        },
      },
      {
        id: "a-cp-sort-array",
        title: "Basic sorting: bubble sort",
        explain:
          "Bubble sort puts an array in order by repeatedly walking through it and swapping any neighbouring pair that is in the wrong order. After the first pass the largest value has \"bubbled\" to the end; after the second, the second largest is in place, and so on. It is simple to understand but slow for large arrays; Week 12 introduces std::sort, which is what you will use in real programs.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    constexpr int N = 5;
    int a[N] = {64, 25, 12, 90, 33};
    for (int pass = 0; pass < N - 1; pass++) {
        for (int j = 0; j < N - 1 - pass; j++) {
            if (a[j] > a[j + 1]) {
                int temp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = temp;
            }
        }
    }
    for (int i = 0; i < N; i++) {
        std::cout << a[i] << " ";
    }
    std::cout << "\n";
    return 0;
}
`,
          expectedOutput: "12 25 33 64 90",
          trace: {
            headers: ["After pass", "Array", "Now in place"],
            rows: [
              ["start", "64 25 12 90 33", ""],
              ["1", "25 12 64 33 90", "90"],
              ["2", "12 25 33 64 90", "64"],
              ["3", "12 25 33 64 90", "33"],
              ["4", "12 25 33 64 90", "25 (and so 12)"],
            ],
            note: "The inner loop's limit, N - 1 - pass, skips the values already in place at the end.",
          },
        },
        codeFill: {
          task: "Change the comparison so this bubble sort orders the scores from HIGHEST to lowest.",
          code: C`#include <iostream>

int main() {
    int a[5] = {64, 25, 12, 90, 33};
    for (int pass = 0; pass < 4; pass++) {
        for (int j = 0; j < 4 - pass; j++) {
            if ({{1}}) {
                int temp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = temp;
            }
        }
    }
    for (int i = 0; i < 5; i++) std::cout << a[i] << " ";
    std::cout << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["a[j] < a[j + 1]", "a[j + 1] > a[j]"] }],
          expectedOutput: "90 64 33 25 12",
          hint: "Swap when a pair is in the wrong order for DESCENDING: when the left one is smaller than the right one.",
          successMessage: "Flip one comparison and the whole sort reverses. The algorithm stays the same; only the meaning of \"wrong order\" changed.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 6.8 – 6.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l26-2d-arrays",
    moduleId: "cp-m6-arrays",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.8", "6.9"],
    title: "Two-Dimensional Arrays",
    subtitle: "Rows and columns, and matrix operations",
    estimatedMinutes: 22,
    intro:
      "Some data is a table: students down the side, subjects across the top; a cinema's rows and seats; a game board. A two-dimensional array stores exactly that shape, and nested loops, which you met in Week 4, are how you work through it.",

    atoms: [
      {
        id: "a-cp-2d-arrays",
        title: "Rows and columns",
        explain:
          "int marks[3][4]; is an array of 3 rows, each holding 4 ints: 12 values in a grid. marks[r][c] is the element in row r and column c, both counted from 0. Initialise it row by row with nested braces. To visit every element, use nested loops: the outer loop over rows, the inner loop over columns.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int marks[3][4] = {
        {72, 65, 80, 58},
        {90, 88, 76, 94},
        {45, 61, 52, 70},
    };
    for (int r = 0; r < 3; r++) {
        std::cout << "Student " << r + 1 << ":";
        for (int c = 0; c < 4; c++) {
            std::cout << " " << marks[r][c];
        }
        std::cout << "\n";
    }
    return 0;
}
`,
          expectedOutput: "Student 1: 72 65 80 58\nStudent 2: 90 88 76 94\nStudent 3: 45 61 52 70",
        },
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int grid[2][3] = {
        {1, 2, 3},
        {4, 5, 6},
    };
    grid[1][0] = grid[0][2] * 10;
    std::cout << grid[1][0] << " " << grid[1][2] << " " << grid[0][1] + grid[1][1] << "\n";
    return 0;
}
`,
          question: "The first index is the row, the second the column, both from 0. What does this print?",
          expectedOutput: "30 6 7",
          hint: "grid[0][2] is row 0, column 2: the 3. grid[1][2] is the last value of the second row.",
          successMessage: "30 6 7. Row first, then column: the same order as the nested braces.",
        },
      },
      {
        id: "a-cp-row-col-totals",
        title: "Row and column totals",
        explain:
          "Tables usually need totals both ways. A row total (one student's total over all subjects) loops across the columns of one row. A column total (one subject's total over all students) loops down the rows of one column. Which loop is outside decides which kind of total you get.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int sales[2][3] = {
        {120, 95, 140},
        {80, 110, 60},
    };
    for (int r = 0; r < 2; r++) {
        int rowTotal = 0;
        for (int c = 0; c < 3; c++) rowTotal += sales[r][c];
        std::cout << "Shop " << r + 1 << " total: " << rowTotal << "\n";
    }
    for (int c = 0; c < 3; c++) {
        int colTotal = 0;
        for (int r = 0; r < 2; r++) colTotal += sales[r][c];
        std::cout << "Month " << c + 1 << " total: " << colTotal << "\n";
    }
    return 0;
}
`,
          expectedOutput: "Shop 1 total: 355\nShop 2 total: 250\nMonth 1 total: 200\nMonth 2 total: 205\nMonth 3 total: 200",
        },
        decision: {
          scenario: "A 2D array scores[30][6] holds 30 students' marks in 6 subjects. You need the class average for each subject.",
          question: "How should the loops be arranged?",
          options: [
            {
              id: "a",
              text: "Outer loop over the 6 subjects (columns), inner loop over the 30 students (rows), summing one column at a time",
              why: "A subject's total runs down a column, so the column is fixed in the outer loop while the inner loop walks the rows.",
            },
            {
              id: "b",
              text: "Outer loop over students, inner loop over subjects, resetting the total for each student",
              whyWrong: "That gives each STUDENT's total across subjects: row totals, not subject averages.",
            },
            {
              id: "c",
              text: "One loop over 30 × 6 = 180 values, adding them all",
              whyWrong: "That gives a single grand total, mixing every subject together.",
            },
            {
              id: "d",
              text: "No loops: read scores[30][6]",
              whyWrong: "That index is past the end of both dimensions; the last element is scores[29][5].",
            },
          ],
          correct: "a",
          aftermath: "Fix what you are totalling in the outer loop; walk across what you are adding up in the inner loop.",
        },
      },
      {
        id: "a-cp-matrix-ops",
        title: "Matrix operations",
        explain:
          "In mathematics a grid of numbers is a matrix. Two matrices of the same size are added element by element: c[i][j] = a[i][j] + b[i][j]. Transposing swaps rows and columns: t[j][i] = m[i][j], so a 2 × 3 matrix becomes 3 × 2. Matrices are used in graphics, games, engineering and machine learning, and C++ is one of the main languages used to compute them fast.",
        code: {
          language: CPP,
          code: C`#include <iostream>

int main() {
    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int t[3][2];
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            t[j][i] = m[i][j];
        }
    }
    for (int i = 0; i < 3; i++) {
        std::cout << t[i][0] << " " << t[i][1] << "\n";
    }
    return 0;
}
`,
          expectedOutput: "1 4\n2 5\n3 6",
        },
        codeFill: {
          task: "Fill the gap so c becomes the sum of matrices a and b.",
          code: C`#include <iostream>

int main() {
    int a[2][2] = {{1, 2}, {3, 4}};
    int b[2][2] = {{10, 20}, {30, 40}};
    int c[2][2];
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++) {
            {{1}}
        }
    }
    std::cout << c[0][0] << " " << c[0][1] << "\n";
    std::cout << c[1][0] << " " << c[1][1] << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["c[i][j] = a[i][j] + b[i][j];", "c[i][j] = b[i][j] + a[i][j];"], width: 28 }],
          expectedOutput: "11 22\n33 44",
          hint: "Each element of c is the matching elements of a and b added together, at the same [i][j].",
          successMessage: "Element by element, at the same position in each matrix.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 6.10 – 6.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l27-vectors",
    moduleId: "cp-m6-arrays",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["6.10", "6.11", "6.12", "6.13"],
    title: "Vectors",
    subtitle: "std::vector, adding and removing, arrays versus vectors, and functions",
    estimatedMinutes: 25,
    intro:
      "Arrays have one big limitation: their size is fixed when you compile. A vector is a collection that grows and shrinks while the program runs, knows its own size, and can be copied and passed around safely. In modern C++ it is the default collection, and you will use it in nearly every program from now on.",

    atoms: [
      {
        id: "a-cp-vector-intro",
        title: "Introduction to std::vector",
        explain:
          "std::vector, from #include <vector>, is a resizable array. std::vector<int> scores = {72, 58, 91}; creates a vector of ints; the type in the angle brackets is what it holds. scores.size() tells you how many elements it has right now. Elements are stored next to each other in memory, just like an array, so indexing with scores[i] is just as fast.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {72, 58, 91};
    std::cout << "Count: " << scores.size() << "\n";
    scores.push_back(64);
    scores.push_back(80);
    std::cout << "Count: " << scores.size() << "\n";
    for (std::size_t i = 0; i < scores.size(); i++) {
        std::cout << scores[i] << " ";
    }
    std::cout << "\n";
    return 0;
}
`,
          expectedOutput: "Count: 3\nCount: 5\n72 58 91 64 80",
        },
      },
      {
        id: "a-cp-vector-ops",
        title: "Adding, removing and accessing elements",
        explain:
          "push_back(x) adds x to the end and pop_back() removes the last element. front() and back() give the first and last elements. v[i] reads an element with no checking, exactly like an array, while v.at(i) checks the index and throws an error (an exception, Week 11) if it is out of range instead of reading garbage. erase removes an element from the middle and insert adds one, shifting the rest along; clear() empties the vector.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <vector>

int main() {
    std::vector<int> queue = {101, 102, 103, 104};
    queue.push_back(105);
    queue.pop_back();
    queue.erase(queue.begin() + 1);
    queue.insert(queue.begin(), 100);
    std::cout << "First: " << queue.front() << ", last: " << queue.back() << "\n";
    std::cout << "Third: " << queue.at(2) << ", size: " << queue.size() << "\n";
    return 0;
}
`,
          expectedOutput: "First: 100, last: 104\nThird: 103, size: 4",
        },
        why: "queue.begin() + 1 means \"the position of element 1\". begin() returns an iterator, a position in the vector, which Week 12 explains fully. For now, read begin() + i as \"position i\".",
        codeFill: {
          task: "Read numbers until the user types 0, adding each one to the end of the vector. Fill the gap.",
          code: C`#include <iostream>
#include <vector>

int main() {
    std::vector<int> readings;
    int value = 0;
    std::cin >> value;
    while (value != 0) {
        {{1}}
        std::cin >> value;
    }
    std::cout << readings.size() << " readings, last: " << readings.back() << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["readings.push_back(value);", "readings.emplace_back(value);"], width: 26 }],
          inputs: ["14 9 21 0"],
          expectedOutput: "14 9 21 0\n3 readings, last: 21",
          hint: "The vector function that adds a value to the end, called on readings with value as its argument.",
          successMessage: "push_back. The vector grows to fit however many readings arrive, which an array cannot do.",
        },
      },
      {
        id: "a-cp-arrays-vs-vectors",
        title: "Arrays versus vectors",
        explain:
          "Use a vector by default. Its size can change, it always knows its size, it can be copied with = and returned from functions, and .at() can check indexes. A built-in array's size is fixed at compile time and it does not know its own length when passed to a function. Arrays still appear in older code, in fixed small tables, and in code where every byte matters, so you need to read both.",
        table: {
          caption: "The two side by side.",
          headers: ["", "Built-in array", "std::vector"],
          rows: [
            ["Size", "Fixed when compiled", "Grows and shrinks while running"],
            ["Knows its size?", "Only where it was declared", "Always: .size()"],
            ["Copy with =", "No", "Yes"],
            ["Return from a function", "No", "Yes"],
            ["Bounds-checked access", "No", ".at(i)"],
            ["Speed of [ ]", "Fast", "Just as fast"],
          ],
        },
        decision: {
          scenario: "A program reads students' scores from the keyboard until the teacher types -1. The class size is different every term.",
          question: "What should hold the scores?",
          options: [
            {
              id: "a",
              text: "A std::vector<int>, adding each score with push_back",
              why: "The number of scores is only known as the program runs, which is exactly what a vector handles.",
            },
            {
              id: "b",
              text: "int scores[30];",
              whyWrong: "A class of 31 overflows it, and a class of 20 leaves 10 meaningless slots that the program must track separately.",
            },
            {
              id: "c",
              text: "int scores[1000];, just to be safe",
              whyWrong: "It wastes memory, still has a limit, and you must count the real scores yourself.",
            },
            {
              id: "d",
              text: "A single int, overwritten each time",
              whyWrong: "Only the last score survives.",
            },
          ],
          correct: "a",
          aftermath: "When the amount of data is decided at run time, reach for a vector.",
        },
      },
      {
        id: "a-cp-passing-collections",
        title: "Passing arrays and vectors to functions",
        explain:
          "Pass a vector the same way as any large object. To read it, use const std::vector<int>& v: no copy, no changes allowed. To change the caller's vector, drop the const. Passing by value copies every element, which is slow for large vectors and means changes are lost. A built-in array passed to a function loses its size, so you must pass the size as a separate parameter; this is one more reason vectors are preferred.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <vector>

double average(const std::vector<int>& v) {
    int total = 0;
    for (std::size_t i = 0; i < v.size(); i++) total += v[i];
    return static_cast<double>(total) / v.size();
}

void addBonus(std::vector<int>& v, int bonus) {
    for (std::size_t i = 0; i < v.size(); i++) v[i] += bonus;
}

void printArray(const int arr[], int size) {
    for (int i = 0; i < size; i++) std::cout << arr[i] << " ";
    std::cout << "\n";
}

int main() {
    std::vector<int> scores = {60, 75, 82};
    std::cout << average(scores) << "\n";
    addBonus(scores, 5);
    std::cout << average(scores) << "\n";
    int fixed[] = {3, 1, 4};
    printArray(fixed, 3);
    return 0;
}
`,
          expectedOutput: "72.3333\n77.3333\n3 1 4",
        },
        codeFill: {
          task: "Fill the parameter type so countPasses can READ the vector without copying it and without being able to change it.",
          code: C`#include <iostream>
#include <vector>

int countPasses({{1}} scores) {
    int passes = 0;
    for (std::size_t i = 0; i < scores.size(); i++) {
        if (scores[i] >= 50) passes++;
    }
    return passes;
}

int main() {
    std::vector<int> scores = {72, 45, 58, 39, 91};
    std::cout << countPasses(scores) << " passed\n";
    return 0;
}
`,
          blanks: [{ answers: ["const std::vector<int>&", "const std::vector<int> &", "std::vector<int> const&"], width: 24 }],
          expectedOutput: "3 passed",
          hint: "Three parts: const (no changes), the vector's full type, and & (no copy).",
          successMessage: "const std::vector<int>&: the standard way to hand a function a collection to read.",
        },
      },
    ],

    task: {
      title: "Mini-project: student performance analyser",
      intro:
        "Write analyser.cpp: it stores a class's scores in a vector and reports on them. Every report is its own function taking the vector by const reference.",
      prompts: [
        "Read scores until the user types -1, rejecting anything outside 0–100, and store them in a std::vector<int>.",
        "Write functions for the total, the class average (to two decimal places), the highest and the lowest score.",
        "Write a function that returns how many students scored at or above the class average.",
        "Write a function that searches for a score typed by the user and prints every position (1-based) where it appears, or a clear message if it does not appear.",
        "Rank the results: copy the vector, sort the copy from highest to lowest with your own bubble sort, and print the positions 1st, 2nd, 3rd ...",
        "Extend it to a 2D table: for 3 students and 4 subjects, print each student's total and each subject's average.",
        "Test it with an empty class (type -1 straight away) and make sure it says so instead of dividing by zero.",
      ],
      closing:
        "Keep analyser.cpp. In Week 11 it will save the scores to a file, and in Week 12 the sorting becomes one line.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
