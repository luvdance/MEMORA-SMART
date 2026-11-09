/**
 * DESIGN AND ANALYSIS OF ALGORITHMS · MODULE 18 · FINAL CAPSTONE PROJECT
 *
 * Curriculum 18.1 – 18.7. Choosing a project; problem statement and
 * analysis; proposed algorithm, pseudocode and flowchart; source code;
 * complexity analysis; test cases; performance comparison, optimisation and
 * the final report. The lessons build one worked capstone (the Student
 * Result Processing System) piece by piece, so every documentation item in
 * the curriculum has a concrete example; the task then sets the learner's
 * own project.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "al-s18-capstone";

const PY = "python";
const py = String.raw;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 75 · 18.1 – 18.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l75-capstone-plan",
    moduleId: "al-m18-capstone",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["18.1", "18.2"],
    title: "Choosing the Project and Stating the Problem",
    subtitle: "Project options, problem statement and problem analysis",
    estimatedMinutes: 34,
    intro:
      "The capstone shows that you can take a real problem from a vague request to a documented, analysed, tested solution. These three lessons build one complete example, the Student Result Processing System, step by step, so you can see every deliverable before you produce your own.",

    atoms: [
      {
        id: "a-al-capstone-options",
        title: "Choosing a capstone project",
        explain:
          "Choose ONE of the five projects. Each draws on different modules, and each is big enough to show design, analysis and testing. Pick the one whose data you can obtain or generate easily, and whose algorithms you understand best: the assessment rewards a well-analysed, well-tested solution, not the most ambitious one.",
        table: {
          caption: "The five capstone projects.",
          headers: ["Project", "Core algorithms and structures", "Modules"],
          rows: [
            ["1. Intelligent Route Finder", "Weighted graph (adjacency list), Dijkstra, path reconstruction, A* as an extension", "8, 15, 17"],
            ["2. Product Search and Recommendation System", "Hash tables, sorting by keys, binary-search autocomplete, co-occurrence recommendations", "8, 9, 10, 17"],
            ["3. Student Result Processing System", "Validation, grading, sorting with ties, ranking, statistics, top-k with a heap", "2, 9, 10"],
            ["4. Resource Allocation Optimiser", "Greedy (activity selection, fractional knapsack) and DP (0/1 knapsack), compared", "13, 14"],
            ["5. Social Network Connection Analyser", "Graph, BFS degrees of separation, components, friend suggestions, cycle detection", "8, 15"],
          ],
        },
        decision: {
          scenario: "A student is choosing between the Route Finder, which they find exciting but have never implemented, and the Result Processor, which they understand well.",
          question: "What should guide the choice?",
          options: [
            {
              id: "a",
              text: "Whichever they can complete with a full analysis and thorough tests in the time available; ambition only helps if the documentation is complete",
              why: "The capstone is assessed on all eleven deliverables. A complete, correct and well-analysed project beats an impressive unfinished one.",
            },
            { id: "b", text: "Always the hardest project", whyWrong: "Difficulty earns nothing if the analysis and testing are incomplete." },
            { id: "c", text: "Whichever has the least code", whyWrong: "The amount of code is not the criterion." },
            { id: "d", text: "Choose two projects to be safe", whyWrong: "One project, done fully, is the requirement." },
          ],
          correct: "a",
          aftermath: "The worked example below is Project 3; adapt its structure to whichever project you choose.",
        },
      },
      {
        id: "a-al-problem-statement",
        title: "The problem statement",
        explain:
          "A PROBLEM STATEMENT says precisely what the system must do, before any mention of how. It states the INPUTS (format and source), the OUTPUTS, the RULES, the CONSTRAINTS (sizes, time limits) and what happens with INVALID data. For the Result Processor: \"Input: a CSV of lines matric,name,score with up to 100,000 students; scores are whole numbers from 0 to 100; invalid lines are skipped and counted. Output: each student's grade on the A–F scale, a ranking by score with ties sharing a rank, the class statistics (mean, median, highest, lowest, pass rate) and the top k students. Every report must be produced in under one second.\" Input handling comes first in the code too.",
        codeChallenge: {
          task: "Implement the input stage. parse_results(lines) receives the lines of a results file, each \"matric,name,score\". A line is valid if it has exactly 3 comma-separated fields, the matric and name are non-empty after stripping spaces, and the score is a whole number from 0 to 100. Return (records, invalid) where records is the list of valid (matric, name, score) tuples with score as an int, in file order, and invalid is the number of rejected lines.",
          starter: "def parse_results(lines):\n    pass\n",
          sample: "parse_results([\"CSC/01,Ada,74\", \"CSC/02,Bo,abc\"]) → ([(\"CSC/01\", \"Ada\", 74)], 1)",
          tests: [
            {
              check: py`lines = ["CSC/01,Ada Obi,74", "CSC/02, Bola ,58", "CSC/03,Chi,101", "CSC/04,,60", "CSC/05,Dayo", "CSC/06,Efe,-3", "CSC/07,Femi,7.5", " CSC/08 ,Gina,0", "CSC/09,Hassan,100"]
records, invalid = parse_results(lines)
assert records == [("CSC/01", "Ada Obi", 74), ("CSC/02", "Bola", 58), ("CSC/08", "Gina", 0), ("CSC/09", "Hassan", 100)], "The four valid rows, stripped, in order. Got " + repr(records)
assert invalid == 5, "Rejected: score 101, empty name, missing field, score -3, score 7.5. Counted " + repr(invalid)
assert parse_results([]) == ([], 0), "An empty file."`,
            },
          ],
          solution: "def parse_results(lines):\n    records = []\n    invalid = 0\n    for line in lines:\n        parts = [p.strip() for p in line.split(\",\")]\n        if len(parts) != 3 or not parts[0] or not parts[1] or not parts[2].isdigit():\n            invalid += 1\n            continue\n        score = int(parts[2])\n        if score > 100:\n            invalid += 1\n            continue\n        records.append((parts[0], parts[1], score))\n    return records, invalid\n",
          hint: "Split on commas and strip each part. Reject unless there are 3 parts, the first two are non-empty, and the third is all digits (str.isdigit rejects -3 and 7.5) with value <= 100.",
          successMessage: "Garbage in is counted, not crashed on. Every later stage can now assume clean data, which keeps the core algorithms simple.",
        },
      },
      {
        id: "a-al-problem-analysis",
        title: "Problem analysis",
        explain:
          "PROBLEM ANALYSIS turns the statement into algorithmic requirements: which OPERATIONS are needed, how OFTEN, on how much DATA, and therefore which data structures and complexity classes are acceptable. For the Result Processor with n ≤ 100,000: validation and grading are one pass each, O(n); ranking needs a sort, O(n log n) (about 1.7 million comparisons: instant); the median needs sorted scores (reuse the sort); lookups of one student by matric number should be O(1), so build a dict; top k should be O(n log k) with a heap. Any O(n²) step (10¹⁰ operations at n = 100,000) would break the one-second limit, so none is allowed.",
        decision: {
          scenario: "The analysis of the Result Processor finds that staff will look up individual students by matric number thousands of times per session.",
          question: "What should the analysis conclude?",
          options: [
            { id: "a", text: "Build a dict from matric number to record once, O(n), so each lookup is O(1) on average", why: "Repeated exact-key lookups call for a hash table, built once." },
            { id: "b", text: "Scan the list for each lookup", whyWrong: "O(n) per lookup, thousands of times, wastes O(n) work every time." },
            { id: "c", text: "Sort the records before every lookup", whyWrong: "O(n log n) per lookup is worse still." },
            { id: "d", text: "Lookups do not affect the design", whyWrong: "Their frequency is exactly what decides the data structure." },
          ],
          correct: "a",
          aftermath: "Operations × frequency × data size → data structures and complexity targets. That reasoning is the problem analysis section of your report.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 76 · 18.3 – 18.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l76-capstone-design",
    moduleId: "al-m18-capstone",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["18.3", "18.4"],
    title: "Designing and Implementing the Solution",
    subtitle: "Proposed algorithm, pseudocode, flowchart and source code",
    estimatedMinutes: 38,
    intro:
      "With the problem analysed, design the algorithm, express it in pseudocode and as a flowchart (both are required deliverables), then implement it in tested pieces.",

    atoms: [
      {
        id: "a-al-proposed-algorithm",
        title: "The proposed algorithm, pseudocode and flowchart",
        explain:
          "The proposed algorithm for ranking with ties (standard competition ranking, 1, 2, 2, 4): sort the records by score descending, then by matric number for a stable, repeatable order; walk the sorted list keeping a position counter; a record's rank is its position, unless its score equals the previous record's, in which case it shares the previous rank. The report presents it in pseudocode and as a flowchart, as below, and states why it is correct (the sort puts equal scores together, so ties are always adjacent) and its cost (the sort dominates: O(n log n)).",
        example:
          "PSEUDOCODE\n  SORT records BY score DESCENDING, THEN matric\n  FOR position FROM 1 TO n DO\n      IF position > 1 AND score(position) = score(position − 1) THEN\n          rank(position) ← rank(position − 1)\n      ELSE\n          rank(position) ← position\n      END IF\n  END FOR\n\nFLOWCHART\n        ( START )\n            |\n  [ sort by score desc, matric ]\n            |\n     [ position ← 1 ]\n            |\n  +-> < position <= n ? >--NO--> / OUTPUT ranks / --> ( STOP )\n  |         | YES\n  |  < same score as previous? >--YES--> [ rank ← previous rank ]--+\n  |         | NO                                                   |\n  |  [ rank ← position ]------------------------------------------+\n  |                                                                |\n  +------------------------[ position ← position + 1 ]<-----------+",
        codeExercise: {
          language: "pseudocode",
          code: "SET scores TO [91, 85, 85, 85, 70, 70, 52]\nSET ranks TO []\nFOR position FROM 1 TO 7 DO\n    IF position > 1 AND scores[position] = scores[position - 1] THEN\n        APPEND ranks[position - 1] TO ranks\n    ELSE\n        APPEND position TO ranks\n    END IF\nEND FOR\nOUTPUT ranks\n",
          equivalentPython: "scores = [91, 85, 85, 85, 70, 70, 52]\nranks = []\nfor position in range(1, 8):\n    if position > 1 and scores[position - 1] == scores[position - 2]:\n        ranks.append(ranks[-1])\n    else:\n        ranks.append(position)\nprint(ranks)\n",
          question: "Dry-run the ranking pseudocode on scores already sorted in descending order (positions are counted from 1). What ranks does it output?",
          expectedOutput: "[1, 2, 2, 2, 5, 5, 7]",
          hint: "Three students share rank 2, so the next distinct score is in position 5.",
          successMessage: "Competition ranking: tied students share a rank and the following ranks are skipped. The dry run is the evidence that the pseudocode matches the specification.",
        },
      },
      {
        id: "a-al-capstone-ranking",
        title: "Source code: ranking with ties",
        explain:
          "Now implement the design exactly. Keep each stage a separate, testable function: parse, grade, rank, summarise, report. Sort with a key tuple: key=lambda r: (-r[2], r[0]) sorts by score descending and then matric ascending in one O(n log n) call. The ranking pass is then O(n).",
        codeChallenge: {
          task: "Write rank_results(records) where records is a list of (matric, name, score). Return a list of (rank, matric, score) tuples ordered by score descending and then matric ascending, with standard competition ranking: equal scores share the rank of the first of them, and the next rank skips accordingly.",
          starter: "def rank_results(records):\n    pass\n",
          sample: "rank_results([(\"C3\", \"Chi\", 85), (\"A1\", \"Ada\", 91), (\"B2\", \"Bo\", 85)]) → [(1, \"A1\", 91), (2, \"B2\", 85), (2, \"C3\", 85)]",
          tests: [
            {
              check: py`recs = [("CSC/05", "Efe", 70), ("CSC/01", "Ada", 91), ("CSC/04", "Dayo", 85), ("CSC/02", "Bo", 85), ("CSC/07", "Gina", 52), ("CSC/03", "Chi", 85), ("CSC/06", "Femi", 70)]
want = [(1, "CSC/01", 91), (2, "CSC/02", 85), (2, "CSC/03", 85), (2, "CSC/04", 85), (5, "CSC/05", 70), (5, "CSC/06", 70), (7, "CSC/07", 52)]
assert rank_results(recs) == want, "Got " + repr(rank_results(recs))
assert rank_results([]) == [], "No students."
assert rank_results([("X", "x", 50), ("Y", "y", 50)]) == [(1, "X", 50), (1, "Y", 50)], "Everyone tied: everyone is first."
import random
random.seed(12)
big = [("M" + str(i).zfill(6), "s", random.randint(0, 100)) for i in range(20000)]
ranked = rank_results(big)
assert ranked[0][0] == 1 and len(ranked) == 20000, "20,000 students ranked."
assert all(ranked[i][2] >= ranked[i + 1][2] for i in range(19999)), "Scores must be in descending order."`,
            },
          ],
          solution: "def rank_results(records):\n    ordered = sorted(records, key=lambda r: (-r[2], r[0]))\n    result = []\n    for position, (matric, name, score) in enumerate(ordered, start=1):\n        if result and score == result[-1][2]:\n            rank = result[-1][0]\n        else:\n            rank = position\n        result.append((rank, matric, score))\n    return result\n",
          hint: "Sort with key=lambda r: (-r[2], r[0]). Walk with enumerate(..., start=1): reuse the previous rank if the score equals the previous score, otherwise use the position.",
          successMessage: "O(n log n) for the sort plus O(n) for the pass. 20,000 students in a fraction of a second, with ties handled exactly as specified.",
        },
      },
      {
        id: "a-al-capstone-statistics",
        title: "Source code: class statistics",
        explain:
          "The statistics stage computes the mean (one pass, O(n)), the highest and lowest (one pass), the pass rate (one pass), and the MEDIAN, which needs the middle of the sorted scores: the middle value for an odd count, the average of the two middle values for an even count. Sorting is O(n log n); a selection algorithm (quickselect) could find the median in O(n) on average, which is a valid optimisation to discuss in the report. Report percentages and means rounded consistently.",
        codeChallenge: {
          task: "Write summary(scores, pass_mark=50) for a non-empty list of scores. Return a dict with keys \"mean\" (rounded to 2 decimal places), \"median\" (the middle value, or the average of the two middle values for an even count), \"highest\", \"lowest\", and \"pass_rate\" (the percentage of scores >= pass_mark, rounded to 1 decimal place).",
          starter: "def summary(scores, pass_mark=50):\n    pass\n",
          sample: "summary([74, 58, 0, 100]) → {\"mean\": 58.0, \"median\": 66.0, \"highest\": 100, \"lowest\": 0, \"pass_rate\": 75.0}",
          tests: [
            {
              check: py`s = summary([74, 58, 0, 100])
assert s == {"mean": 58.0, "median": 66.0, "highest": 100, "lowest": 0, "pass_rate": 75.0}, "Got " + repr(s)
t = summary([91, 85, 85, 85, 70, 70, 52])
assert t["median"] == 85 and t["mean"] == 76.86, "Odd count: the median is the middle value, 85; the mean is 76.86."
assert t["pass_rate"] == 100.0 and summary([49, 50, 51])["pass_rate"] == 66.7, "50 passes; 2 of 3 is 66.7%."
assert summary([42]) == {"mean": 42.0, "median": 42, "highest": 42, "lowest": 42, "pass_rate": 0.0}, "A single score."`,
            },
          ],
          solution: "def summary(scores, pass_mark=50):\n    ordered = sorted(scores)\n    n = len(ordered)\n    mid = n // 2\n    if n % 2 == 1:\n        median = ordered[mid]\n    else:\n        median = (ordered[mid - 1] + ordered[mid]) / 2\n    passed = 0\n    for s in ordered:\n        if s >= pass_mark:\n            passed += 1\n    return {\n        \"mean\": round(sum(ordered) / n, 2),\n        \"median\": median,\n        \"highest\": ordered[-1],\n        \"lowest\": ordered[0],\n        \"pass_rate\": round(100 * passed / n, 1),\n    }\n",
          hint: "Sort once. The median is ordered[n // 2] for odd n, else the mean of ordered[n // 2 - 1] and ordered[n // 2]. The highest and lowest are the ends of the sorted list.",
          successMessage: "One sort serves the median, the highest and the lowest. Reusing work across features is an optimisation worth naming in the report.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 77 · 18.5 – 18.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "al-l77-capstone-report",
    moduleId: "al-m18-capstone",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["18.5", "18.6", "18.7"],
    title: "Analysis, Testing, Optimisation and the Final Report",
    subtitle: "Proving the system works, and documenting it",
    estimatedMinutes: 40,
    intro:
      "A system is finished when you can show it is correct, say exactly how fast and how large it is, and explain your design to someone else. This lesson completes the worked example and gives you the structure of the final report.",

    atoms: [
      {
        id: "a-al-capstone-complexity",
        title: "Time and space complexity analysis",
        explain:
          "Analyse each stage, then the whole. The total time is the SUM of the stages (they run one after another), so the most expensive stage dominates. State the auxiliary space too, and say which structure uses it. For the Result Processor, sorting dominates: the system is O(n log n) time and O(n) space, which at n = 100,000 means a few million basic operations: well within the one-second requirement.",
        table: {
          caption: "Complexity analysis of the Student Result Processing System (n students, k for top-k).",
          headers: ["Stage", "Algorithm", "Time", "Auxiliary space"],
          rows: [
            ["Parse and validate", "One pass over the lines", "O(n)", "O(n) for the records"],
            ["Grade", "Constant-time rule per student", "O(n)", "O(n) for the grades"],
            ["Lookup by matric", "Dict built once", "O(n) build, O(1) per lookup", "O(n)"],
            ["Rank with ties", "Sort by (−score, matric), then one pass", "O(n log n)", "O(n)"],
            ["Statistics", "One sort (reused) plus one pass", "O(n log n)", "O(n)"],
            ["Top k", "Heap selection (heapq.nsmallest with a key)", "O(n log k)", "O(k)"],
            ["Whole system", "Stages in sequence", "O(n log n)", "O(n)"],
          ],
        },
      },
      {
        id: "a-al-capstone-testing",
        title: "Test cases and results",
        explain:
          "Test cases are part of the deliverable, with their RESULTS. Design them systematically: NORMAL cases (typical data), BOUNDARY cases (every edge of every rule: scores 0, 39, 40, 44, 45, 49, 50, 59, 60, 69, 70, 100), INVALID cases (101, −1, text, missing fields), EDGE cases (no students, one student, all tied), and LARGE cases (100,000 generated records, to test the time requirement). Present them as a table: input, expected output, actual output, pass or fail. A table-driven test harness makes this mechanical, and it finds the kind of bug below, which looks right on normal data.",
        codeExercise: {
          language: PY,
          code: py`def grade(score):
    if score >= 70: return "A"
    if score >= 60: return "B"
    if score > 50: return "C"
    if score >= 45: return "D"
    if score >= 40: return "E"
    return "F"

cases = [(100, "A"), (70, "A"), (69, "B"), (60, "B"), (59, "C"), (50, "C"),
         (49, "D"), (45, "D"), (44, "E"), (40, "E"), (39, "F"), (0, "F")]
failed = [(s, want, grade(s)) for s, want in cases if grade(s) != want]
print(len(cases) - len(failed), "passed")
for s, want, got in failed:
    print("FAIL", s, "expected", want, "got", got)
`,
          question: "This table-driven harness runs 12 boundary tests against a grade function with one bug. What does it print?",
          expectedOutput: "11 passed\nFAIL 50 expected C got D",
          hint: "Look at the C condition: > 50 instead of >= 50. Only one test sits exactly on that boundary.",
          successMessage: "Only the boundary test caught it: 51 or 55 would have passed. That is why the boundary rows are the most important part of the test table.",
        },
      },
      {
        id: "a-al-capstone-optimisation-report",
        title: "Performance comparison, optimisation and the final report",
        explain:
          "PERFORMANCE COMPARISON: implement at least two approaches to a key stage and measure them at increasing n (for example, top k by sorting everything, O(n log n), against a heap, O(n log k)); present a table or chart of times and explain the results with your complexity analysis. OPTIMISATION: report what you changed and the measured gain. The FINAL REPORT then assembles the eleven mandatory items: 1 problem statement, 2 problem analysis, 3 proposed algorithm, 4 pseudocode, 5 flowchart, 6 source code, 7 time complexity analysis, 8 space complexity analysis, 9 test cases and results, 10 performance comparison and optimisation, 11 conclusion (what works, limitations, future improvements).",
        codeChallenge: {
          task: "Optimise the top-k report. top_k(records, k) receives (matric, name, score) records and returns the k best as (matric, score) pairs ordered by score descending, then matric ascending, using heapq.nsmallest(k, records, key=...) so that it runs in O(n log k) instead of sorting all n records.",
          starter: "import heapq\n\ndef top_k(records, k):\n    pass\n",
          sample: "top_k([(\"A1\", \"Ada\", 91), (\"B2\", \"Bo\", 85), (\"C3\", \"Chi\", 85)], 2) → [(\"A1\", 91), (\"B2\", 85)]",
          tests: [
            {
              check: py`recs = [("CSC/05", "Efe", 70), ("CSC/01", "Ada", 91), ("CSC/04", "Dayo", 85), ("CSC/02", "Bo", 85), ("CSC/03", "Chi", 85)]
assert top_k(recs, 3) == [("CSC/01", 91), ("CSC/02", 85), ("CSC/03", 85)], "Best three, ties by matric. Got " + repr(top_k(recs, 3))
assert top_k(recs, 10) == [("CSC/01", 91), ("CSC/02", 85), ("CSC/03", 85), ("CSC/04", 85), ("CSC/05", 70)], "k larger than n returns everyone, ordered."
assert top_k([], 3) == [] and top_k(recs, 0) == [], "No records, or k = 0."
import random
random.seed(77)
big = [("M" + str(i).zfill(6), "s", random.randint(0, 10**6)) for i in range(20000)]
want = [(r[0], r[2]) for r in sorted(big, key=lambda r: (-r[2], r[0]))[:10]]
assert top_k(big, 10) == want, "The top 10 of 20,000 must match a full sort."
assert calls("nsmallest") or calls("nlargest") or calls("heappush") or calls("heapify"), "Use a heap: heapq.nsmallest with a key."`,
            },
          ],
          solution: "import heapq\n\ndef top_k(records, k):\n    best = heapq.nsmallest(k, records, key=lambda r: (-r[2], r[0]))\n    return [(r[0], r[2]) for r in best]\n",
          hint: "heapq.nsmallest(k, records, key=lambda r: (-r[2], r[0])) returns the k records with the highest score (ties by matric). Then keep only (matric, score).",
          successMessage: "O(n log k): for the top 10 of 100,000, about 330,000 steps against 1.7 million for a full sort. Measure both and put the table in your report.",
        },
      },
    ],

    task: {
      title: "Final capstone project",
      intro:
        "Choose ONE project: (1) Intelligent Route Finder: graph representation and Dijkstra's algorithm for the shortest route between locations; (2) Product Search and Recommendation System: searching, sorting and basic recommendation algorithms; (3) Student Result Processing System: process examination results, rank students and analyse performance efficiently; (4) Resource Allocation Optimiser: greedy and dynamic programming techniques to allocate limited resources; (5) Social Network Connection Analyser: graph algorithms to analyse relationships, connections and network paths. Design, implement and analyse it, and submit all of the mandatory documentation below.",
      prompts: [
        "1. Problem statement: inputs, outputs, rules, constraints and invalid-data behaviour.",
        "2. Problem analysis: the operations, their frequency and the data sizes, and the data structures and complexity targets they imply.",
        "3. Proposed algorithm, with a short argument that it is correct.",
        "4. Pseudocode for the main algorithms.",
        "5. A flowchart of the main processing flow.",
        "6. Source code: clean, commented, in separate testable functions.",
        "7. Time complexity analysis, stage by stage and for the whole system.",
        "8. Space complexity analysis, naming the structures that use memory.",
        "9. Test cases and results: normal, boundary, invalid, edge and large cases, in a table with expected and actual outputs.",
        "10. Performance comparison and optimisation: two approaches to one stage, measured at increasing n, with the speed-up explained by your analysis.",
        "11. Final project report: all of the above assembled, with a conclusion on limitations and future improvements.",
      ],
      closing:
        "When your report is complete, sit the certification exam. It covers every phase of the course, from algorithm design and asymptotic analysis to dynamic programming, graphs and complexity theory.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
