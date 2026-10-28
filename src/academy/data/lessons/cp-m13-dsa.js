/**
 * C++ PROGRAMMING · MODULE 13 · DATA STRUCTURES, SEARCHING AND SORTING
 *
 * Curriculum 13.1 – 13.13. How to organise data, and how to judge what an
 * algorithm costs. Every program is compiled and run by `npm run
 * validate:content`, including the ones that COUNT the steps an algorithm
 * takes, so the Big O claims in this module are demonstrated, not asserted.
 *
 * Scope, as the curriculum sets it: the purpose and basic operations of
 * linked lists, trees and graphs. Balanced trees and advanced graph
 * algorithms are left for an extension course.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cp-s13-dsa";

const CPP = "cpp";
const C = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 54 · 13.1 – 13.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l54-big-o-search",
    moduleId: "cp-m13-dsa",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["13.1", "13.2", "13.3", "13.4"],
    title: "Data Structures, Big O and Searching",
    subtitle: "What a data structure is, measuring cost, linear and binary search",
    estimatedMinutes: 26,
    intro:
      "Two programs can both be correct while one answers in a millisecond and the other in an hour. The difference is almost always how the data is organised and which algorithm works on it. This lesson gives you the vocabulary for that difference, Big O, and the two fundamental ways of searching.",

    atoms: [
      {
        id: "a-cp-what-is-ds",
        title: "What is a data structure?",
        explain:
          "A data structure is a way of organising data in memory so that certain operations are efficient. An array keeps elements side by side, so reaching element i is instant, but inserting at the front means shifting everything. A linked list chains elements together, so inserting is cheap, but reaching element i means walking from the start. No structure is best at everything; choosing one means choosing which operations you want to be fast.",
        table: {
          caption: "The same operations on different structures.",
          headers: ["Operation", "Array / vector", "Linked list", "Hash table", "Balanced tree (map)"],
          rows: [
            ["Reach element i", "Instant", "Walk i steps", "Not applicable", "Not applicable"],
            ["Find a value", "Check each (or binary search if sorted)", "Check each", "Instant on average", "Fast (halving)"],
            ["Insert at the front", "Shift everything", "Instant", "Not applicable", "Not applicable"],
            ["Keep items sorted", "Re-sort or shift", "Walk to the place", "No order", "Always sorted"],
          ],
        },
        why: "You already chose structures in Week 12 by intuition. This module explains WHY those choices are right.",
      },
      {
        id: "a-cp-big-o",
        title: "Time complexity and Big O notation",
        explain:
          "Big O describes how an algorithm's work grows as the input size n grows, ignoring constant details. O(1): the same work whatever n is (reading v[i]). O(log n): the work grows very slowly, as when halving the problem each step. O(n): work proportional to n (checking every element once). O(n log n): good sorting. O(n²): a loop inside a loop over the same data; fine for 100 items, painful for 100,000. Big O tells you what happens when the data gets big, which is when it matters.",
        table: {
          caption: "Steps needed as n grows (rounded).",
          headers: ["n", "O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"],
          rows: [
            ["10", "1", "3", "10", "33", "100"],
            ["1,000", "1", "10", "1,000", "10,000", "1,000,000"],
            ["1,000,000", "1", "20", "1,000,000", "20,000,000", "1,000,000,000,000"],
          ],
        },
        decision: {
          scenario: "A program compares every customer with every other customer to find duplicates. It takes 1 second for 10,000 customers. The business grows to 100,000 customers.",
          question: "Roughly how long will it take now?",
          options: [
            {
              id: "a",
              text: "About 100 seconds: comparing every pair is O(n²), so 10 times the data means 100 times the work",
              why: "n grew by 10, and n² grew by 100. That is why O(n²) algorithms that seem fine in testing collapse in production.",
            },
            {
              id: "b",
              text: "About 10 seconds",
              whyWrong: "That would be true of an O(n) algorithm. Every-pair comparison grows with the square.",
            },
            {
              id: "c",
              text: "About 1 second",
              whyWrong: "That would be O(1): work independent of the number of customers.",
            },
            {
              id: "d",
              text: "It cannot be estimated",
              whyWrong: "Estimating exactly this is what Big O is for.",
            },
          ],
          correct: "a",
          aftermath: "A hash set of seen customers would make it O(n): about 10 seconds' worth of work becomes a fraction of a second.",
        },
      },
      {
        id: "a-cp-linear-search",
        title: "Linear search",
        explain:
          "Linear search checks each element from the start until it finds the target or reaches the end. It works on any data, sorted or not, and it is O(n): in the worst case, when the target is last or missing, it checks every element. For small or unsorted collections it is perfectly good. find is a linear search.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <vector>
using namespace std;

int linearSearch(const vector<int>& v, int target, int& checks) {
    checks = 0;
    for (size_t i = 0; i < v.size(); i++) {
        checks++;
        if (v[i] == target) return static_cast<int>(i);
    }
    return -1;
}

int main() {
    vector<int> v;
    for (int i = 1; i <= 1000; i++) v.push_back(i * 3);
    int checks = 0;
    cout << "Found at " << linearSearch(v, 30, checks) << " after " << checks << " checks\n";
    cout << "Found at " << linearSearch(v, 7, checks) << " after " << checks << " checks\n";
    return 0;
}
`,
          expectedOutput: "Found at 9 after 10 checks\nFound at -1 after 1000 checks",
        },
      },
      {
        id: "a-cp-binary-search",
        title: "Binary search and its requirements",
        explain:
          "Binary search only works on SORTED data, and it is dramatically faster. Look at the middle element: if it is the target, done; if the target is smaller, it can only be in the left half; if larger, only in the right half. Each step halves what is left, so 1,000 elements need at most 10 checks and a million need 20: O(log n). The price is the requirement: the data must be sorted, and kept sorted.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& v, int target, int& checks) {
    int low = 0, high = static_cast<int>(v.size()) - 1;
    checks = 0;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        checks++;
        if (v[mid] == target) return mid;
        if (v[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> v;
    for (int i = 1; i <= 1000; i++) v.push_back(i * 3);
    int checks = 0;
    cout << "Found at " << binarySearch(v, 2997, checks) << " after " << checks << " checks\n";
    cout << "Found at " << binarySearch(v, 7, checks) << " after " << checks << " checks\n";
    return 0;
}
`,
          expectedOutput: "Found at 998 after 9 checks\nFound at -1 after 10 checks",
        },
        why: "mid = low + (high - low) / 2 instead of (low + high) / 2 avoids overflowing an int when low and high are both very large: a real bug that sat in widely used libraries for years. The standard library offers binary_search and lower_bound for sorted ranges.",
        codeFill: {
          task: "Fill the two gaps: when the middle value is smaller than the target, search the right half; otherwise the left half.",
          code: C`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {4, 9, 15, 22, 31, 48, 56, 70};
    int target = 48;
    int low = 0, high = 7, found = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (v[mid] == target) { found = mid; break; }
        if (v[mid] < target) {{1}}
        else {{2}}
    }
    cout << "Index: " << found << "\n";
    return 0;
}
`,
          blanks: [
            { answers: ["low = mid + 1;"] },
            { answers: ["high = mid - 1;"] },
          ],
          expectedOutput: "Index: 5",
          hint: "The middle has already been checked, so the new range starts one PAST it, or ends one BEFORE it.",
          successMessage: "low = mid + 1 and high = mid - 1. Using mid itself instead can loop forever when two elements are left.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 55 · 13.5 – 13.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l55-sorting",
    moduleId: "cp-m13-dsa",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["13.5", "13.6"],
    title: "Sorting Algorithms",
    subtitle: "Bubble, selection and insertion sort, and how they compare",
    estimatedMinutes: 26,
    intro:
      "You met bubble sort in Week 6 and sort in Week 12. Here are the three classic simple sorts side by side, with the comparisons each one makes counted by the program itself, so you can see their cost instead of taking it on trust.",

    atoms: [
      {
        id: "a-cp-three-sorts",
        title: "Bubble, selection and insertion sort",
        explain:
          "Bubble sort swaps neighbouring pairs that are out of order, pass after pass. Selection sort finds the smallest remaining element and swaps it into the next position, so it makes few swaps. Insertion sort takes each element in turn and slides it left into its place among the already-sorted ones, like sorting cards in your hand; it is very fast on data that is already nearly sorted. All three are O(n²) on average.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <utility>
#include <vector>
using namespace std;

void selectionSort(vector<int>& a) {
    for (size_t i = 0; i + 1 < a.size(); i++) {
        size_t smallest = i;
        for (size_t j = i + 1; j < a.size(); j++) {
            if (a[j] < a[smallest]) smallest = j;
        }
        swap(a[i], a[smallest]);
    }
}

void insertionSort(vector<int>& a) {
    for (size_t i = 1; i < a.size(); i++) {
        int key = a[i];
        size_t j = i;
        while (j > 0 && a[j - 1] > key) {
            a[j] = a[j - 1];
            j--;
        }
        a[j] = key;
    }
}

int main() {
    vector<int> x = {29, 10, 14, 37, 13};
    vector<int> y = x;
    selectionSort(x);
    insertionSort(y);
    for (int v : x) cout << v << " ";
    cout << "\n";
    for (int v : y) cout << v << " ";
    cout << "\n";
    return 0;
}
`,
          expectedOutput: "10 13 14 29 37\n10 13 14 29 37",
        },
        codeFill: {
          task: "Complete insertion sort's inner loop condition: keep shifting while there is an element to the left AND it is bigger than key.",
          code: C`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> a = {5, 2, 9, 1, 6};
    for (size_t i = 1; i < a.size(); i++) {
        int key = a[i];
        size_t j = i;
        while ({{1}}) {
            a[j] = a[j - 1];
            j--;
        }
        a[j] = key;
    }
    for (int v : a) cout << v << " ";
    cout << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["j > 0 && a[j - 1] > key", "j >= 1 && a[j - 1] > key"], width: 24 }],
          expectedOutput: "1 2 5 6 9",
          hint: "Check j > 0 FIRST, so a[j - 1] is never read when j is 0.",
          successMessage: "j > 0 && a[j - 1] > key. Short-circuit evaluation (Week 3) keeps a[j - 1] from being read at j = 0.",
        },
      },
      {
        id: "a-cp-compare-sorts",
        title: "Comparing sorting algorithms",
        explain:
          "Count the comparisons and the cost becomes visible. On random data all three simple sorts do roughly n²/2 to n²/4 comparisons. On already-sorted data insertion sort does only n - 1, because each element is already in place, which is why it is used inside faster sorts for small pieces. sort is O(n log n): for a million items, roughly twenty million comparisons instead of hundreds of billions.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <vector>
using namespace std;

long insertionComparisons(vector<int> a) {
    long comparisons = 0;
    for (size_t i = 1; i < a.size(); i++) {
        int key = a[i];
        size_t j = i;
        while (j > 0) {
            comparisons++;
            if (a[j - 1] <= key) break;
            a[j] = a[j - 1];
            j--;
        }
        a[j] = key;
    }
    return comparisons;
}

int main() {
    vector<int> sorted, reversed;
    for (int i = 0; i < 1000; i++) {
        sorted.push_back(i);
        reversed.push_back(1000 - i);
    }
    cout << "Already sorted: " << insertionComparisons(sorted) << "\n";
    cout << "Reversed:       " << insertionComparisons(reversed) << "\n";
    return 0;
}
`,
          expectedOutput: "Already sorted: 999\nReversed:       499500",
        },
        table: {
          caption: "The sorts at a glance.",
          headers: ["Algorithm", "Average", "Best case", "Notes"],
          rows: [
            ["Bubble sort", "O(n²)", "O(n) with an early-exit check", "Simple; slowest in practice"],
            ["Selection sort", "O(n²)", "O(n²)", "At most n - 1 swaps"],
            ["Insertion sort", "O(n²)", "O(n) on sorted data", "Excellent for small or nearly-sorted data"],
            ["sort", "O(n log n)", "O(n log n)", "What you should use in real code"],
          ],
        },
        decision: {
          scenario: "A list of 50,000 exam results is already sorted by score. Each day about five new results are added at the end, and the list must be re-sorted.",
          question: "Which simple sort suits this daily job best, and why?",
          options: [
            {
              id: "a",
              text: "Insertion sort: on nearly-sorted data it does about n comparisons, sliding only the few new results into place",
              why: "Insertion sort's cost depends on how far elements are from their places. Five out-of-place items in 50,000 make it almost O(n).",
            },
            {
              id: "b",
              text: "Selection sort",
              whyWrong: "Selection sort always scans the whole remaining list for every position: O(n²) even on sorted data.",
            },
            {
              id: "c",
              text: "Bubble sort without an early exit",
              whyWrong: "Without the early exit it does every pass regardless: O(n²).",
            },
            {
              id: "d",
              text: "It makes no difference",
              whyWrong: "On nearly-sorted data the difference is around 50,000 comparisons versus over a billion.",
            },
          ],
          correct: "a",
          aftermath: "The same algorithm can be slow or fast depending on the shape of the data. Know your data.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 56 · 13.7 – 13.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l56-linked-structures",
    moduleId: "cp-m13-dsa",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["13.7", "13.8", "13.9", "13.10"],
    title: "Linked Lists, Stacks, Queues, Trees and Graphs",
    subtitle: "Structures built from nodes and connections",
    estimatedMinutes: 30,
    intro:
      "Vectors keep data in one block. Many important structures are instead built from separate nodes linked by pointers: lists, trees and graphs. You will build small versions of each, using the pointers from Week 8 and the smart pointers that keep them safe.",

    atoms: [
      {
        id: "a-cp-linked-list",
        title: "Introduction to linked lists",
        explain:
          "A linked list is a chain of nodes, where each node holds a value and a pointer to the next node; the last node points to nothing. The list itself only remembers the first node, the head. Adding at the front is O(1): make a new node point to the old head. Reaching the i-th element is O(n): follow i links. Using unique_ptr for the links means each node owns the next one, so the whole chain is freed automatically.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <memory>
#include <string>
using namespace std;

struct Node {
    string value;
    unique_ptr<Node> next;
};

int main() {
    unique_ptr<Node> head;
    for (string name : {"Chi", "Bayo", "Ada"}) {
        auto node = make_unique<Node>();
        node->value = name;
        node->next = move(head);
        head = move(node);
    }
    for (Node* p = head.get(); p != nullptr; p = p->next.get()) {
        cout << p->value << " -> ";
    }
    cout << "end\n";
    return 0;
}
`,
          expectedOutput: "Ada -> Bayo -> Chi -> end",
        },
        why: "Each name was added at the FRONT, so the last one added is first. move hands ownership from one unique_ptr to another (Week 14 explains it). head.get() gives a plain, non-owning pointer for walking the list.",
        codeFill: {
          task: "Fill the update part of the for loop so p moves to the next node each time.",
          code: C`#include <iostream>
#include <memory>
using namespace std;

struct Node {
    int value;
    unique_ptr<Node> next;
};

int main() {
    auto head = make_unique<Node>();
    head->value = 1;
    head->next = make_unique<Node>();
    head->next->value = 2;
    head->next->next = make_unique<Node>();
    head->next->next->value = 3;

    int total = 0;
    for (Node* p = head.get(); p != nullptr; {{1}}) {
        total += p->value;
    }
    cout << "Total: " << total << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["p = p->next.get()"], width: 18 }],
          expectedOutput: "Total: 6",
          hint: "Set p to the raw pointer held by the current node's next.",
          successMessage: "p = p->next.get(). When the last node's next is empty, get() returns nullptr and the loop ends.",
        },
      },
      {
        id: "a-cp-stack-queue-practice",
        title: "Stacks and queues in practice",
        explain:
          "Stacks and queues are the structures behind many classic problems. A stack checks that brackets match: push every opening bracket, and every closing bracket must match the one on top. A queue processes things in arrival order and drives breadth-first search, which you will see in the graph atom below. Both can be built on a vector, a deque or a linked list; stack and queue are ready-made.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <stack>
#include <string>
using namespace std;

bool balanced(const string& text) {
    stack<char> open;
    for (char c : text) {
        if (c == '(' || c == '[' || c == '{') {
            open.push(c);
        } else if (c == ')' || c == ']' || c == '}') {
            if (open.empty()) return false;
            char top = open.top();
            open.pop();
            if ((c == ')' && top != '(') || (c == ']' && top != '[') || (c == '}' && top != '{')) {
                return false;
            }
        }
    }
    return open.empty();
}

int main() {
    cout << boolalpha;
    cout << balanced("v[i] = (a + b) * {c}") << "\n";
    cout << balanced("f(x[1)]") << "\n";
    cout << balanced("((x)") << "\n";
    return 0;
}
`,
          expectedOutput: "true\nfalse\nfalse",
        },
        why: "Your compiler does exactly this when it reports a missing } or ). The last opened bracket must be the first one closed: last in, first out.",
      },
      {
        id: "a-cp-trees-bst",
        title: "Trees and binary search trees",
        explain:
          "A tree is a structure of nodes where each node has children, starting from one root: folders on a disk, a family tree, an organisation chart. In a binary tree each node has at most two children, left and right. A binary search tree (BST) keeps a rule: everything in the left subtree is smaller than the node, everything in the right is larger. Searching then works like binary search, going left or right at each node: O(log n) when the tree is balanced. Visiting left, node, right (an in-order traversal) prints the values sorted. set and map are balanced search trees.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <memory>
using namespace std;

struct TreeNode {
    int value;
    unique_ptr<TreeNode> left, right;
    explicit TreeNode(int v) : value(v) {}
};

void insert(unique_ptr<TreeNode>& node, int v) {
    if (!node) {
        node = make_unique<TreeNode>(v);
    } else if (v < node->value) {
        insert(node->left, v);
    } else {
        insert(node->right, v);
    }
}

bool contains(const TreeNode* node, int v) {
    while (node) {
        if (v == node->value) return true;
        node = v < node->value ? node->left.get() : node->right.get();
    }
    return false;
}

void inOrder(const TreeNode* node) {
    if (!node) return;
    inOrder(node->left.get());
    cout << node->value << " ";
    inOrder(node->right.get());
}

int main() {
    unique_ptr<TreeNode> root;
    for (int v : {50, 30, 70, 20, 40, 60, 80}) insert(root, v);
    inOrder(root.get());
    cout << "\n" << boolalpha << contains(root.get(), 60) << " " << contains(root.get(), 65) << "\n";
    return 0;
}
`,
          expectedOutput: "20 30 40 50 60 70 80 \ntrue false",
        },
        why: "Inserting 50 first made it the root; every later value went left or right by comparison. If values arrive already sorted, a plain BST degrades into a long chain and loses its speed, which is why real libraries use self-balancing trees (an extension topic).",
      },
      {
        id: "a-cp-graphs",
        title: "Introduction to graphs",
        explain:
          "A graph is a set of nodes (vertices) connected by edges: cities and roads, people and friendships, web pages and links. Unlike a tree, a graph can have cycles and no single root. A common way to store one is an adjacency list: for each node, a list of its neighbours. Breadth-first search (BFS) explores a graph level by level using a queue, and finds the fewest edges between two nodes.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <map>
#include <queue>
#include <string>
#include <vector>
using namespace std;

int main() {
    map<string, vector<string>> roads = {
        {"Lagos", {"Ibadan", "Abeokuta"}},
        {"Ibadan", {"Lagos", "Ilorin", "Osogbo"}},
        {"Abeokuta", {"Lagos"}},
        {"Osogbo", {"Ibadan", "Ilorin"}},
        {"Ilorin", {"Ibadan", "Osogbo", "Abuja"}},
        {"Abuja", {"Ilorin"}},
    };
    map<string, int> hops;
    queue<string> frontier;
    hops["Lagos"] = 0;
    frontier.push("Lagos");
    while (!frontier.empty()) {
        string city = frontier.front();
        frontier.pop();
        for (const string& next : roads[city]) {
            if (hops.count(next) == 0) {
                hops[next] = hops[city] + 1;
                frontier.push(next);
            }
        }
    }
    cout << "Lagos to Abuja: " << hops["Abuja"] << " roads\n";
    cout << "Lagos to Osogbo: " << hops["Osogbo"] << " roads\n";
    return 0;
}
`,
          expectedOutput: "Lagos to Abuja: 3 roads\nLagos to Osogbo: 2 roads",
        },
        decision: {
          scenario: "You need to model which students are friends with which, where friendships go both ways and groups of friends form circles.",
          question: "Which structure fits?",
          options: [
            {
              id: "a",
              text: "A graph, stored as an adjacency list from each student to their friends",
              why: "Friendships are connections with no hierarchy and with cycles: exactly a graph.",
            },
            {
              id: "b",
              text: "A binary search tree",
              whyWrong: "A tree has one root and no cycles, and each node at most two children; friendships fit none of that.",
            },
            {
              id: "c",
              text: "A stack",
              whyWrong: "A stack only orders items by arrival; it cannot record who is connected to whom.",
            },
            {
              id: "d",
              text: "A single sorted vector of names",
              whyWrong: "That stores the students but none of the connections.",
            },
          ],
          correct: "a",
          aftermath: "Hierarchy: tree. Arbitrary connections: graph.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 57 · 13.11 – 13.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cp-l57-recursion-hashing",
    moduleId: "cp-m13-dsa",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["13.11", "13.12", "13.13"],
    title: "Recursion, Hashing and Choosing Structures",
    subtitle: "Recursive problem-solving, hash tables, and the right tool",
    estimatedMinutes: 26,
    intro:
      "Three ideas finish the module. Recursion, which you met in Week 5, becomes a problem-solving method for trees and divide-and-conquer. Hashing explains how unordered_map finds things in one step. And you will put everything together to choose a structure for a real problem.",

    atoms: [
      {
        id: "a-cp-recursive-solving",
        title: "Recursion and recursive problem-solving",
        explain:
          "Recursion fits any problem that contains smaller copies of itself: a tree is a node plus two smaller trees; searching a sorted range is searching half of it; counting files in a folder is counting the files in each sub-folder. The method: define the smallest case and answer it directly (the base case), then express the whole answer in terms of answers to smaller cases. Trust the recursive call to do its part; do not trace every level in your head.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <vector>
using namespace std;

int recursiveSearch(const vector<int>& v, int target, int low, int high) {
    if (low > high) return -1;
    int mid = low + (high - low) / 2;
    if (v[mid] == target) return mid;
    if (v[mid] < target) return recursiveSearch(v, target, mid + 1, high);
    return recursiveSearch(v, target, low, mid - 1);
}

int hanoiMoves(int discs) {
    if (discs == 0) return 0;
    return 2 * hanoiMoves(discs - 1) + 1;
}

int main() {
    vector<int> v = {3, 8, 12, 19, 25, 31, 40};
    cout << recursiveSearch(v, 31, 0, 6) << "\n";
    cout << hanoiMoves(3) << " " << hanoiMoves(10) << "\n";
    return 0;
}
`,
          expectedOutput: "5\n7 1023",
        },
        why: "Towers of Hanoi: to move n discs, move n - 1 out of the way, move the largest, then move the n - 1 back on top. That sentence IS the recursion, and it shows the answer grows as 2ⁿ - 1.",
        codeFill: {
          task: "Count the digits of a positive number recursively. Fill the recursive case: one digit, plus the digits of the number without its last digit.",
          code: C`#include <iostream>
using namespace std;

int digits(int n) {
    if (n < 10) return 1;
    return {{1}};
}

int main() {
    cout << digits(7) << " " << digits(2026) << " " << digits(1000000) << "\n";
    return 0;
}
`,
          blanks: [{ answers: ["1 + digits(n / 10)", "digits(n / 10) + 1"] }],
          expectedOutput: "1 4 7",
          hint: "n / 10 drops the last digit. Count that one digit, plus however many the smaller number has.",
          successMessage: "1 + digits(n / 10). Each call removes one digit until the base case: a single digit.",
        },
      },
      {
        id: "a-cp-hashing",
        title: "Introduction to hash-based data structures",
        explain:
          "A hash table stores items in an array of buckets. A hash function turns each key into a number, which picks the bucket. To find a key, hash it and look only in that one bucket: on average O(1), however many items there are. Two keys can land in the same bucket (a collision), so each bucket holds a small list. Good hash functions spread keys evenly; the table grows when it gets too full. unordered_map and unordered_set are hash tables.",
        code: {
          language: CPP,
          code: C`#include <iostream>
#include <list>
#include <string>
#include <vector>
using namespace std;

int simpleHash(const string& key, int buckets) {
    int sum = 0;
    for (char c : key) sum += c;
    return sum % buckets;
}

int main() {
    const int BUCKETS = 5;
    vector<list<string>> table(BUCKETS);
    for (string name : {"Ada", "Bayo", "Chi", "Dayo", "Eze"}) {
        table[simpleHash(name, BUCKETS)].push_back(name);
    }
    for (int b = 0; b < BUCKETS; b++) {
        cout << b << ":";
        for (const string& n : table[b]) cout << " " << n;
        cout << "\n";
    }
    return 0;
}
`,
          expectedOutput: "0: Bayo\n1: Chi\n2: Ada Dayo Eze\n3:\n4:",
        },
        why: "To find Chi you hash it (bucket 1) and check one name, not five. But Ada, Dayo and Eze all collided in bucket 2 while buckets 3 and 4 sit empty: adding character codes is a weak hash. Real hash functions mix the bits much more thoroughly so keys spread evenly.",
      },
      {
        id: "a-cp-choosing-structure",
        title: "Choosing an appropriate data structure",
        explain:
          "Choose by the operations that matter most and how often they happen. List them (insert, find, delete, iterate in order, access by position), estimate the data size, and pick the structure whose fast operations match your frequent ones. Then measure: if it is fast enough with real data, stop. Premature cleverness is a bug factory; a vector and sort solve a surprising number of problems.",
        table: {
          caption: "Common requirements and good choices.",
          headers: ["Most frequent operation", "Good choice", "Why"],
          rows: [
            ["Look up by name, order irrelevant", "unordered_map", "O(1) average look-up"],
            ["Look up by name, list alphabetically", "map", "O(log n) look-up, always sorted"],
            ["Access by position, add at the end", "vector", "O(1) access, cache-friendly"],
            ["Search a large list that rarely changes", "sorted vector + binary search", "O(log n), compact"],
            ["Undo the most recent action", "stack", "Last in, first out"],
            ["Shortest number of connections", "graph + BFS with a queue", "Explores level by level"],
          ],
        },
        decision: {
          scenario: "A contact directory of 200,000 people needs: instant look-up by phone number, and an alphabetical listing by name shown occasionally.",
          question: "Which design fits best?",
          options: [
            {
              id: "a",
              text: "An unordered_map from phone number to contact for look-ups, and sort a copy by name with sort when the list is requested",
              why: "The frequent operation, look-up by number, gets O(1). The occasional listing pays O(n log n) only when asked for.",
            },
            {
              id: "b",
              text: "A vector of contacts searched by a loop for every look-up",
              whyWrong: "Every look-up would check up to 200,000 contacts: O(n) for the most frequent operation.",
            },
            {
              id: "c",
              text: "A stack of contacts",
              whyWrong: "A stack can only see its top element.",
            },
            {
              id: "d",
              text: "A linked list kept sorted by name",
              whyWrong: "Inserting needs a walk to the right place, and look-up by number is O(n).",
            },
          ],
          correct: "a",
          aftermath: "Optimise the frequent operation; accept a cost on the rare one.",
        },
      },
    ],

    task: {
      title: "Mini-project: contact directory",
      intro:
        "Write contacts.cpp: a directory that stays fast as it grows. Before coding, write down which operations your program does most often and which structure you will use for each, and why.",
      prompts: [
        "A Contact has a name, phone number and email. Validate that the phone number is all digits and 11 characters long.",
        "Keep contacts in a unordered_map keyed by phone number for O(1) look-up, insertion and deletion.",
        "List all contacts sorted by name: copy them into a vector and sort with a lambda.",
        "Search by name prefix (for example, all names starting with \"Ad\"): sort by name and use binary search (lower_bound) to find the first match.",
        "Implement your own insertion sort and compare its number of comparisons with sort's on the same data, printing both.",
        "Keep a stack of recent actions so the user can undo the last add or delete.",
        "Save to and load from a CSV file, and generate 10,000 test contacts to check that look-ups stay instant.",
      ],
      closing:
        "Phase 4 is complete. Next: modern C++, which makes everything you have built safer and simpler.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
