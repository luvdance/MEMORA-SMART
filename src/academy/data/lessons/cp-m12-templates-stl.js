/**
 * C++ PROGRAMMING · MODULE 12 · TEMPLATES AND THE STANDARD TEMPLATE LIBRARY
 *
 * Curriculum 12.1 – 12.14. Reuse code and the tools C++ already provides.
 * Every program is compiled and run by `npm run validate:content`. The
 * unordered containers deliberately never print their contents in a loop:
 * their iteration order is not specified by the standard, so such output
 * could not be honestly verified, and the lesson says why.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s12-templates-stl";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49 · 12.1 – 12.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l49-templates",
    moduleId: "cp-m12-templates-stl",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["12.1", "12.2", "12.3"],
    title: "Templates",
    subtitle: "Why generic code matters, function templates and class templates",
    estimatedMinutes: 24,
    intro:
      "You have used std::vector<int>, std::vector<double> and std::vector<Student>: one vector, any element type. That is a template. This lesson shows how to write your own, which is also the key to understanding the whole Standard Template Library.",

    atoms: [
      {
        id: "a-cp-why-generic",
        title: "Why reusable generic code matters",
        explain:
          "Without templates, a function that finds the larger of two values must be written once for int, again for double, again for std::string: identical logic, copied. Overloading helps you call them by one name but you still write every copy. A template is written once with a placeholder type, and the compiler generates the version for each type you actually use, checked and as fast as a hand-written one.",
        decision: {
          scenario: "Your project has largestInt, largestDouble and largestString, each with the same loop. A bug is found in the loop.",
          question: "What does a template change?",
          options: [
            {
              id: "a",
              text: "There is only one copy of the loop, so the bug is fixed once, for every type",
              why: "Generic code removes duplication across types the way functions remove duplication across call sites.",
            },
            {
              id: "b",
              text: "Templates make the bug impossible",
              whyWrong: "A wrong algorithm is wrong for every type. Templates remove duplication, not logic errors.",
            },
            {
              id: "c",
              text: "Templates run the loop faster",
              whyWrong: "The generated code is as fast as the hand-written copies, not faster.",
            },
            {
              id: "d",
              text: "Nothing: you still need three functions",
              whyWrong: "The compiler generates the three versions from one template.",
            },
          ],
          correct: "a",
          aftermath: "Write the logic once; let the compiler produce each type's version.",
        },
      },
      {
        id: "a-cp-function-templates",
        title: "Function templates",
        explain:
          "template <typename T> before a function makes T a placeholder type. Inside, T is used like any type. When you call largest(3, 9), the compiler deduces that T is int and generates that version; largest(2.5, 1.5) generates a double version. The type must support every operation the template uses: largest needs >, so it works for numbers and strings but not for a type that cannot be compared.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>

template <typename T>
T largest(T a, T b) {
    return a > b ? a : b;
}

int main() {
    std::cout << largest(3, 9) << "\n";
    std::cout << largest(2.5, 1.5) << "\n";
    std::cout << largest(std::string("mango"), std::string("apple")) << "\n";
    std::cout << largest<double>(4, 4.5) << "\n";
    return 0;
}
`,
          expectedOutput: "9\n2.5\nmango\n4.5",
        },
        why: "The last call names the type explicitly, largest<double>, because 4 and 4.5 are different types and the compiler would not know which T to choose.",
        codeFill: {
          task: "Fill the template line so swapAny works for any type T.",
          code: C`#include <iostream>
#include <string>

{{1}}
void swapAny(T& a, T& b) {
    T temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 1, y = 2;
    std::string p = "left", q = "right";
    swapAny(x, y);
    swapAny(p, q);
    std::cout << x << y << " " << p << " " << q << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["template <typename T>", "template <class T>"], width: 22 }],
          expectedOutput: "21 right left",
          hint: "The keyword template, then the placeholder declared in angle brackets with typename.",
          successMessage: "template <typename T>. One function, two types, and the compiler generated both versions.",
        },
      },
      {
        id: "a-cp-class-templates",
        title: "Class templates",
        explain:
          "A whole class can be a template: template <typename T> class Box { T value; ... };. You choose the type when you create an object, Box<int> or Box<std::string>, and the compiler generates that class. This is exactly how std::vector<T>, std::map<K, V> and every other STL container is built. A template can have several parameters, such as template <typename K, typename V>.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>

template <typename T>
class Pair {
    T first, second;
public:
    Pair(T a, T b) : first(a), second(b) {}
    T bigger() const { return first > second ? first : second; }
};

int main() {
    Pair<int> scores(72, 88);
    Pair<std::string> names("Bayo", "Ada");
    std::cout << scores.bigger() << " " << names.bigger() << "\n";
    return 0;
}
`,
          expectedOutput: "88 Bayo",
        },
        codeFill: {
          task: "Create a Pair holding two doubles, 3.5 and 7.25.",
          code: C`#include <iostream>

template <typename T>
class Pair {
    T first, second;
public:
    Pair(T a, T b) : first(a), second(b) {}
    T sum() const { return first + second; }
};

int main() {
    {{1}}
    std::cout << prices.sum() << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["Pair<double> prices(3.5, 7.25);", "Pair<double> prices{3.5, 7.25};"], width: 32 }],
          expectedOutput: "10.75",
          hint: "The class name with the type in angle brackets, then the object's name and its constructor arguments.",
          successMessage: "Pair<double> prices(3.5, 7.25); Exactly like std::vector<double>.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 50 · 12.4 – 12.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l50-stl-sequences",
    moduleId: "cp-m12-templates-stl",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["12.4", "12.5", "12.6"],
    title: "The STL and Sequence Containers",
    subtitle: "What the STL is, vector revisited, array, list and deque",
    estimatedMinutes: 24,
    intro:
      "The Standard Template Library is the toolkit that ships with every C++ compiler: tested, fast containers and algorithms that professional C++ is built on. Knowing it well is the difference between writing a sort in thirty lines and writing it in one.",

    atoms: [
      {
        id: "a-cp-stl-intro",
        title: "Introduction to the STL",
        explain:
          "The STL has three parts that fit together. Containers hold data: vector, list, map, set and more. Iterators are positions inside a container, a generalised pointer. Algorithms are functions such as sort, find and count that work on any container through its iterators. Because algorithms only talk to iterators, one std::sort works on vectors, arrays and deques alike.",
        table: {
          caption: "The main containers.",
          headers: ["Container", "Header", "Holds", "Strong at"],
          rows: [
            ["vector", "<vector>", "A resizable sequence", "Fast index access; adding at the end"],
            ["array", "<array>", "A fixed-size sequence", "A fixed size known at compile time"],
            ["deque", "<deque>", "A sequence open at both ends", "Adding and removing at the front and back"],
            ["list", "<list>", "A doubly linked sequence", "Inserting and removing in the middle"],
            ["stack / queue", "<stack> / <queue>", "Restricted sequences", "Last-in-first-out / first-in-first-out"],
            ["set / map", "<set> / <map>", "Sorted unique keys / key-value pairs", "Lookup by key, kept in order"],
            ["unordered_set / unordered_map", "<unordered_set> / <unordered_map>", "Hashed keys / key-value pairs", "The fastest average lookup"],
          ],
        },
        why: "Reaching for the STL is not cheating. It is what professionals do: the library's code is more thoroughly tested than anything you would write in an afternoon.",
      },
      {
        id: "a-cp-vector-revisited",
        title: "vector revisited",
        explain:
          "A few more vector tools. reserve(n) sets aside room for n elements in advance, so a vector you know will grow large does not reallocate repeatedly. emplace_back builds an element directly inside the vector from constructor arguments. resize changes the size, adding default values or dropping elements. And vectors compare with ==, element by element.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
#include <vector>

struct Product {
    std::string name;
    int price;
    Product(std::string n, int p) : name(n), price(p) {}
};

int main() {
    std::vector<Product> shelf;
    shelf.reserve(100);
    shelf.emplace_back("Milk", 1200);
    shelf.emplace_back("Bread", 1500);
    std::cout << shelf.size() << " products, first: " << shelf[0].name << "\n";

    std::vector<int> a = {1, 2, 3};
    a.resize(5);
    std::vector<int> b = {1, 2, 3, 0, 0};
    std::cout << std::boolalpha << (a == b) << "\n";
    return 0;
}
`,
          expectedOutput: "2 products, first: Milk\ntrue",
        },
        codeFill: {
          task: "Add a Student directly inside the vector from its constructor arguments (\"Femi\", 77), without creating a separate Student first.",
          code: C`#include <iostream>
#include <string>
#include <vector>

struct Student {
    std::string name;
    int score;
    Student(std::string n, int s) : name(n), score(s) {}
};

int main() {
    std::vector<Student> list;
    {{1}}
    std::cout << list.back().name << " " << list.back().score << "\n";
    return 0;
}
`,
          blanks: [{ answers: ['list.emplace_back("Femi", 77);'], width: 30 }],
          expectedOutput: "Femi 77",
          hint: "The vector member function that constructs in place, given the constructor's arguments.",
          successMessage: "emplace_back passes its arguments straight to Student's constructor.",
        },
      },
      {
        id: "a-cp-array-list-deque",
        title: "array, list and deque",
        explain:
          "std::array<int, 5> is a fixed-size array that, unlike a built-in array, knows its size, can be copied, and has .at(). std::deque (double-ended queue) supports push_front and pop_front as well as push_back, and still allows indexing. std::list is a doubly linked list: inserting or removing in the middle is fast once you are there, but there is no [] indexing, and it uses more memory. In practice: vector by default, array for fixed sizes, deque when both ends matter, list rarely.",
        codeExercise: {
          language: CPP,
          code: C`#include <array>
#include <deque>
#include <iostream>
#include <list>

int main() {
    std::array<int, 3> days = {31, 28, 31};
    std::cout << days.size() << " " << days.back() << "\n";

    std::deque<int> line = {2, 3};
    line.push_front(1);
    line.push_back(4);
    line.pop_front();
    std::cout << line.front() << " " << line[1] << " " << line.size() << "\n";

    std::list<int> chain = {10, 30};
    chain.insert(++chain.begin(), 20);
    for (int x : chain) std::cout << x << " ";
    std::cout << "\n";
    return 0;
}
`,
          question: "Track each container. (++chain.begin() is the position of the second element.) What does this print?",
          expectedOutput: "3 31\n2 3 3\n10 20 30",
          hint: "The deque goes {1,2,3} → {1,2,3,4} → {2,3,4}. The list inserts 20 before 30.",
          successMessage: "3 31, 2 3 3, and 10 20 30. Three containers, each strong at different operations.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 51 · 12.7 – 12.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l51-adaptors-associative",
    moduleId: "cp-m12-templates-stl",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["12.7", "12.8", "12.9"],
    title: "Stacks, Queues, Sets and Maps",
    subtitle: "Restricted sequences, sorted lookups and hashed lookups",
    estimatedMinutes: 26,
    intro:
      "Some problems need data in a particular discipline: last in first out, first come first served, no duplicates, or look-up by name instead of by position. The STL has a container for each, and choosing the right one often makes the algorithm almost disappear.",

    atoms: [
      {
        id: "a-cp-stack-queue",
        title: "stack and queue",
        explain:
          "std::stack is last-in-first-out (LIFO): push adds to the top, top() reads it, pop() removes it, like a pile of plates. It powers undo features and bracket matching. std::queue is first-in-first-out (FIFO): push adds at the back, front() reads the oldest, pop() removes it, like a bank queue. It powers task processing and print queues. Both deliberately offer nothing else: no indexing, no looping, which makes misuse impossible.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <queue>
#include <stack>
#include <string>

int main() {
    std::stack<std::string> undo;
    undo.push("type Hello");
    undo.push("bold");
    undo.push("delete word");
    std::cout << "Undo: " << undo.top() << "\n";
    undo.pop();
    std::cout << "Then: " << undo.top() << "\n";

    std::queue<std::string> customers;
    customers.push("Ada");
    customers.push("Bayo");
    customers.push("Chi");
    customers.pop();
    std::cout << "Now serving: " << customers.front() << ", waiting: " << customers.size() << "\n";
    return 0;
}
`,
          expectedOutput: "Undo: delete word\nThen: bold\nNow serving: Bayo, waiting: 2",
        },
        codeFill: {
          task: "Fill the condition so the loop processes jobs until the queue is empty.",
          code: C`#include <iostream>
#include <queue>

int main() {
    std::queue<int> jobs;
    jobs.push(101);
    jobs.push(102);
    jobs.push(103);
    while ({{1}}) {
        std::cout << "Printing job " << jobs.front() << "\n";
        jobs.pop();
    }
    return 0;
}
`,
          blanks: [{ answers: ["!jobs.empty()", "jobs.size() > 0", "jobs.size() != 0"] }],
          expectedOutput: "Printing job 101\nPrinting job 102\nPrinting job 103",
          hint: "Containers have a member function that reports whether they are empty; loop while it is NOT.",
          successMessage: "!jobs.empty(). First in, first out: the jobs print in the order they arrived.",
        },
      },
      {
        id: "a-cp-set-map",
        title: "set and map",
        explain:
          "std::set holds unique values in sorted order: inserting a duplicate does nothing, and looping visits values smallest first. std::map holds key-value pairs sorted by key, each key unique: prices[\"rice\"] = 8500; adds or updates. Reading a missing key with [] silently INSERTS it with a default value, so use .count(key) or .find(key) to check first. Lookup is fast even for millions of entries.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <map>
#include <set>
#include <string>

int main() {
    std::set<int> visited = {5, 3, 9, 3, 5};
    visited.insert(1);
    for (int v : visited) std::cout << v << " ";
    std::cout << "(" << visited.size() << " unique)\n";

    std::map<std::string, int> stock;
    stock["rice"] = 12;
    stock["beans"] = 30;
    stock["rice"] += 8;
    for (const auto& [item, qty] : stock) {
        std::cout << item << ": " << qty << "\n";
    }
    std::cout << "Have yam? " << stock.count("yam") << "\n";
    return 0;
}
`,
          expectedOutput: "1 3 5 9 (4 unique)\nbeans: 30\nrice: 20\nHave yam? 0",
        },
        why: "for (const auto& [item, qty] : stock) unpacks each key-value pair into two names; it is called a structured binding and Week 14 covers it. Notice beans prints before rice: a map is always in key order.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> votes;
    std::string ballots[] = {"Obi", "Ada", "Obi", "Kemi", "Ada", "Obi"};
    for (const std::string& b : ballots) {
        votes[b]++;
    }
    for (const auto& [name, count] : votes) {
        std::cout << name << " " << count << "\n";
    }
    std::cout << votes.size() << "\n";
    return 0;
}
`,
          question: "votes[b]++ creates a key at 0 the first time it is seen, then counts. A map is sorted by key. What does this print?",
          expectedOutput: "Ada 2\nKemi 1\nObi 3\n3",
          hint: "Count each name, then list the names in alphabetical order.",
          successMessage: "A map of counts in two lines of code: the standard way to tally anything.",
        },
      },
      {
        id: "a-cp-unordered",
        title: "unordered_set and unordered_map",
        explain:
          "std::unordered_map and std::unordered_set work like map and set but store their keys in a hash table instead of in sorted order. Lookups are usually faster (constant time on average, Week 13 explains why), but the order you get when looping is unspecified: it depends on the library and can change as elements are added. Use them when you only look things up and never need sorted order.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <string>
#include <unordered_map>
#include <unordered_set>

int main() {
    std::unordered_map<std::string, std::string> capitals = {
        {"Lagos", "Ikeja"}, {"Rivers", "Port Harcourt"}, {"Kano", "Kano"},
    };
    std::cout << capitals["Rivers"] << "\n";
    std::cout << capitals.count("Ogun") << "\n";

    std::unordered_set<std::string> seen;
    std::string emails[] = {"a@x.ng", "b@x.ng", "a@x.ng"};
    for (const std::string& e : emails) {
        if (!seen.insert(e).second) {
            std::cout << "Duplicate: " << e << "\n";
        }
    }
    return 0;
}
`,
          expectedOutput: "Port Harcourt\n0\nDuplicate: a@x.ng",
        },
        why: "This lesson never prints an unordered container with a loop, because that order is not guaranteed, so no output could be promised. insert(e).second is true when the element was new and false when it was already there.",
        decision: {
          scenario: "You must print a class list sorted alphabetically, and also look up any student's score by name.",
          question: "Which container fits best?",
          options: [
            {
              id: "a",
              text: "std::map<std::string, int>: lookups by name, and looping gives alphabetical order for free",
              why: "map gives both requirements at once. An unordered_map would need a separate sort step every time you print.",
            },
            {
              id: "b",
              text: "std::unordered_map<std::string, int>",
              whyWrong: "Lookups are fine, but its iteration order is unspecified, so the list would not come out sorted.",
            },
            {
              id: "c",
              text: "std::stack<std::string>",
              whyWrong: "A stack only exposes its top element: no lookup and no sorted listing.",
            },
            {
              id: "d",
              text: "Two separate vectors, names and scores",
              whyWrong: "Parallel vectors make lookups a slow search and must be kept in step by hand.",
            },
          ],
          correct: "a",
          aftermath: "Need order: map or set. Only need speed of lookup: unordered_map or unordered_set.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 52 · 12.10 – 12.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l52-iterators-algorithms",
    moduleId: "cp-m12-templates-stl",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["12.10", "12.11", "12.12"],
    title: "Iterators and Algorithms",
    subtitle: "Positions in a container, range-based for, sort, find and count",
    estimatedMinutes: 26,
    intro:
      "Iterators are the glue of the STL: a uniform way to step through any container. Once you have them, the <algorithm> header gives you dozens of tested operations, sort, find, count, reverse and more, that each replace a loop you would otherwise write by hand.",

    atoms: [
      {
        id: "a-cp-iterators",
        title: "Iterators",
        explain:
          "An iterator is an object that marks a position in a container and behaves like a pointer: *it reads the element, ++it moves to the next one. Every container has begin(), the first element, and end(), the position JUST PAST the last element. A loop runs while it != v.end(). The half-open range [begin, end) means an empty container simply has begin() == end(). In Week 8, your pointer loop from arr to arr + size was exactly this pattern.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {4, 8, 15, 16};
    for (std::vector<int>::iterator it = v.begin(); it != v.end(); ++it) {
        *it *= 10;
    }
    for (auto it = v.begin(); it != v.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << "\n";
    std::cout << *(v.end() - 1) << " " << v.end() - v.begin() << "\n";
    return 0;
}
`,
          expectedOutput: "40 80 150 160\n160 4",
        },
        why: "The full iterator type, std::vector<int>::iterator, is long, which is why the second loop lets the compiler work it out with auto (Week 14). end() - 1 is the last element; end() itself must never be dereferenced.",
      },
      {
        id: "a-cp-range-for",
        title: "Range-based for loops",
        explain:
          "for (int score : scores) visits every element of a container, no indexes or iterators needed; under the hood it uses begin() and end(). The loop variable is a COPY of each element, so to change elements use a reference, for (int& score : scores), and to avoid copying large elements without changing them use const reference, for (const Student& s : students). Use an index loop only when you need the index itself.",
        codeExercise: {
          language: CPP,
          code: C`#include <iostream>
#include <vector>

int main() {
    std::vector<int> marks = {50, 60, 70};
    for (int m : marks) {
        m += 5;
    }
    for (int& m : marks) {
        m += 1;
    }
    int total = 0;
    for (const int& m : marks) total += m;
    std::cout << marks[0] << " " << total << "\n";
    return 0;
}
`,
          question: "The first loop works on copies; the second on references. What does this print?",
          compileWarning: "set but not used",
          expectedOutput: "51 183",
          hint: "Only the second loop changes the vector: each mark gains 1.",
          successMessage:
            "51 183. The +5 vanished with the copies; the +1 through references stuck. g++ -Wall even warns about the first loop: \"variable 'm' set but not used\", a hint that the change goes nowhere.",
        },
      },
      {
        id: "a-cp-algorithms",
        title: "Algorithms: sort, find and count",
        explain:
          "#include <algorithm> gives you ready-made operations that take a range of iterators. std::sort(v.begin(), v.end()) sorts in ascending order, fast even for millions of items. std::find returns an iterator to the first match, or end() if there is none. std::count returns how many elements equal a value. There are many more: std::reverse, std::max_element, std::min_element, and std::accumulate from <numeric> for totals.",
        code: {
          language: CPP,
          code: C`#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>

int main() {
    std::vector<int> scores = {72, 58, 91, 64, 58, 80};
    std::sort(scores.begin(), scores.end());
    for (int s : scores) std::cout << s << " ";
    std::cout << "\n";

    auto it = std::find(scores.begin(), scores.end(), 91);
    if (it != scores.end()) {
        std::cout << "91 found at index " << it - scores.begin() << "\n";
    }
    std::cout << "58 appears " << std::count(scores.begin(), scores.end(), 58) << " times\n";
    std::cout << "Highest: " << *std::max_element(scores.begin(), scores.end()) << "\n";
    std::cout << "Total: " << std::accumulate(scores.begin(), scores.end(), 0) << "\n";
    return 0;
}
`,
          expectedOutput: "58 58 64 72 80 91\n91 found at index 5\n58 appears 2 times\nHighest: 91\nTotal: 423",
        },
        why: "Week 6's bubble sort took fifteen lines; std::sort is one, and much faster on large data. Use the algorithms; write your own only to learn how they work.",
        codeFill: {
          task: "Fill the gap so the program counts how many scores are exactly 100.",
          code: C`#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {100, 87, 100, 64, 100, 92};
    long perfect = {{1}};
    std::cout << perfect << " perfect scores\n";
    return 0;
}
`,
          blanks: [{ answers: ["std::count(scores.begin(), scores.end(), 100)"], width: 46 }],
          expectedOutput: "3 perfect scores",
          hint: "std::count takes the start of the range, the end of the range, and the value to count.",
          successMessage: "std::count(scores.begin(), scores.end(), 100). One line instead of a loop and a counter.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 53 · 12.13 – 12.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l53-lambdas-choosing",
    moduleId: "cp-m12-templates-stl",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["12.13", "12.14"],
    title: "Lambdas and Choosing Containers",
    subtitle: "Small inline functions, and picking the right tool for the data",
    estimatedMinutes: 25,
    intro:
      "Algorithms become far more powerful when you can tell them HOW: sort by price instead of by name, count only the passes, find the first student from Lagos. Lambdas let you write that \"how\" right where it is needed. Then the module ends with the most practical skill of all: choosing the right container.",

    atoms: [
      {
        id: "a-cp-lambdas",
        title: "Lambda expressions",
        explain:
          "A lambda is a small unnamed function written inline: [](int x) { return x >= 50; }. The square brackets are the capture list, the round brackets the parameters, and the braces the body. Pass lambdas to algorithms such as std::count_if, std::find_if and std::sort to customise them. [&] captures surrounding variables by reference and [=] by value, so a lambda can use a pass mark defined outside it.",
        code: {
          language: CPP,
          code: C`#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

struct Product {
    std::string name;
    int price;
};

int main() {
    std::vector<Product> items = {{"Milk", 1200}, {"Bread", 1500}, {"Eggs", 3200}, {"Sugar", 900}};
    std::sort(items.begin(), items.end(), [](const Product& a, const Product& b) {
        return a.price < b.price;
    });
    for (const Product& p : items) std::cout << p.name << " ";
    std::cout << "\n";

    int budget = 1300;
    auto affordable = std::count_if(items.begin(), items.end(), [&](const Product& p) {
        return p.price <= budget;
    });
    std::cout << affordable << " items within " << budget << "\n";
    return 0;
}
`,
          expectedOutput: "Sugar Milk Bread Eggs\n2 items within 1300",
        },
        codeFill: {
          task: "Fill the lambda's body so count_if counts the scores that are 50 or more.",
          code: C`#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {72, 45, 58, 39, 91, 50};
    auto passes = std::count_if(scores.begin(), scores.end(), [](int s) { {{1}} });
    std::cout << passes << " passed\n";
    return 0;
}
`,
          blanks: [{ answers: ["return s >= 50;", "return 50 <= s;", "return s > 49;"], width: 16 }],
          expectedOutput: "4 passed",
          hint: "The lambda receives one score and must return true when it is a pass.",
          successMessage: "return s >= 50; count_if calls the lambda once per score and counts the trues.",
        },
      },
      {
        id: "a-cp-choosing-container",
        title: "Choosing the right container",
        explain:
          "Ask three questions. How will I look things up: by position, by key, or only at the ends? Do I need sorted order? Where will I add and remove: at the end, at both ends, or in the middle? The answers almost always point to one container, and the right choice keeps the code short and fast. When unsure, start with vector: it is the fastest for most real workloads because its elements sit together in memory.",
        table: {
          caption: "A decision guide.",
          headers: ["You need", "Choose"],
          rows: [
            ["A list of items, accessed by position or looped over", "std::vector"],
            ["A fixed number of items known when compiling", "std::array"],
            ["To add and remove at both ends", "std::deque"],
            ["Last in, first out (undo, backtracking)", "std::stack"],
            ["First in, first out (waiting lines, tasks)", "std::queue"],
            ["Unique values, kept sorted", "std::set"],
            ["Look-up by key, with keys in order", "std::map"],
            ["The fastest look-up by key, order not needed", "std::unordered_map"],
          ],
        },
        decision: {
          scenario: "An inventory system must find any product by its code instantly, among 200,000 products, and never needs them in any particular order.",
          question: "Which container?",
          options: [
            {
              id: "a",
              text: "std::unordered_map<std::string, Product>, keyed by product code",
              why: "Look-up by key is the main operation, order is irrelevant, and a hash table gives the fastest average look-up.",
            },
            {
              id: "b",
              text: "std::vector<Product>, searched with a loop",
              whyWrong: "A linear search checks up to 200,000 products for every look-up.",
            },
            {
              id: "c",
              text: "std::stack<Product>",
              whyWrong: "A stack only gives access to its top element.",
            },
            {
              id: "d",
              text: "std::list<Product>",
              whyWrong: "A list has no fast look-up by key at all.",
            },
          ],
          correct: "a",
          aftermath: "Choose by the operation you do most often. Here that is \"find by code\".",
        },
      },
      {
        id: "a-cp-inventory-demo",
        title: "Putting it together: an inventory in a few lines",
        explain:
          "This is the shape of the week's mini-project: a map from product name to quantity and price, updated, searched, and reported with algorithms and lambdas. Notice how little code each operation needs once the right container is chosen.",
        code: {
          language: CPP,
          code: C`#include <algorithm>
#include <iomanip>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Stock {
    int quantity;
    double unitPrice;
};

int main() {
    std::map<std::string, Stock> inventory = {
        {"rice", {12, 8500}}, {"beans", {30, 1800}}, {"oil", {4, 2600}},
    };
    inventory["beans"].quantity -= 5;
    inventory["salt"] = {20, 300};

    double value = 0;
    for (const auto& [name, s] : inventory) value += s.quantity * s.unitPrice;

    std::vector<std::string> low;
    for (const auto& [name, s] : inventory) {
        if (s.quantity < 10) low.push_back(name);
    }
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "Products: " << inventory.size() << "\n";
    std::cout << "Stock value: " << value << "\n";
    std::cout << "Low stock: " << low.size() << " (" << low[0] << ")\n";
    return 0;
}
`,
          expectedOutput: "Products: 4\nStock value: 163400.00\nLow stock: 1 (oil)",
        },
      },
    ],

    task: {
      title: "Mini-project: inventory management system",
      intro:
        "Write inventory.cpp using STL containers and algorithms throughout. Avoid writing any loop that an algorithm could replace.",
      prompts: [
        "Store products in a std::map<std::string, Product> keyed by product code, where Product holds a name, quantity and unit price.",
        "Menu: add a product, update a quantity (sales reduce it, deliveries increase it, and it may never go negative), remove a product, search by code.",
        "Report the total stock value with a loop over the map, then again with std::accumulate and a lambda, and check they agree.",
        "List all products sorted by value (quantity × price), highest first: copy them into a vector and use std::sort with a lambda.",
        "List low-stock products (quantity below a threshold the user chooses) using std::copy_if or a range-based for with a captured threshold.",
        "Use a std::set<std::string> to record every category, and print the categories in alphabetical order.",
        "Write a function template printAll that prints any vector's elements, and use it for at least two different types.",
        "Save the inventory to a CSV file on exit and load it on start-up, reusing Week 11's code.",
      ],
      closing:
        "This is the core of capstone Project C. Next week you will learn why some of these containers are fast and others slow.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
