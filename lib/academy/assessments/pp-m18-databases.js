/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 18
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l74-db-basics": {
    lessonId: "pp-l74-db-basics",
    passMark: 70,
    questions: [
      {
        id: "ppq74-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-why-databases",
        prompt: "Which is a key advantage of a database over a single JSON file?",
        options: [
          { id: "a", text: "Many users can change data safely at the same time, and searches use indexes" },
          { id: "b", text: "Databases cannot lose data, ever" },
          { id: "c", text: "Databases need no structure" },
          { id: "d", text: "JSON files cannot be read by Python" },
        ],
        correct: "a",
        explanation: "Concurrency control, indexes and enforced rules are what databases add.",
        whyWrong: {
          b: "They are far more robust, but backups still matter.",
          c: "Relational databases are highly structured.",
          d: "Python reads JSON easily.",
        },
      },
      {
        id: "ppq74-2",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-tables-records",
        prompt: "In a students table, what is one row?",
        options: [
          { id: "a", text: "One student's record" },
          { id: "b", text: "Every student's name" },
          { id: "c", text: "The table's name" },
          { id: "d", text: "A data type" },
        ],
        correct: "a",
        explanation: "Rows are records (one student each); columns are fields (name, class, ...).",
        whyWrong: {
          b: "That is a column.",
          c: "The table name labels the whole table.",
          d: "Types belong to columns.",
        },
      },
      {
        id: "ppq74-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-keys",
        prompt: "What is a primary key?",
        options: [
          { id: "a", text: "A column whose value uniquely identifies each row" },
          { id: "b", text: "The first column, whatever it holds" },
          { id: "c", text: "A password for the database" },
          { id: "d", text: "A column that refers to another table" },
        ],
        correct: "a",
        explanation: "No two rows can share a primary key value, so each row can be found exactly.",
        whyWrong: {
          b: "Position does not make a key.",
          c: "Keys identify rows, not users.",
          d: "That is a foreign key.",
        },
      },
      {
        id: "ppq74-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-keys",
        prompt: "scores.student_id REFERENCES students(id), with foreign keys enforced. What happens when you insert a score for student_id 999, which does not exist?",
        options: [
          { id: "a", text: "SQLite refuses it with an IntegrityError" },
          { id: "b", text: "A student 999 is created automatically" },
          { id: "c", text: "The score is saved with no student" },
          { id: "d", text: "All scores are deleted" },
        ],
        correct: "a",
        explanation: "A foreign key must point at an existing row; the database enforces it.",
        whyWrong: {
          b: "Databases never invent related rows.",
          c: "That is exactly what enforcement prevents.",
          d: "A refused insert changes nothing else.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l75-sql-queries": {
    lessonId: "pp-l75-sql-queries",
    passMark: 70,
    questions: [
      {
        id: "ppq75-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-sql-crud",
        prompt: "What does UPDATE students SET class = 'SS3' do, with no WHERE clause?",
        options: [
          { id: "a", text: "Moves EVERY student into SS3" },
          { id: "b", text: "Updates only the first student" },
          { id: "c", text: "Raises an error" },
          { id: "d", text: "Nothing" },
        ],
        correct: "a",
        explanation: "Without WHERE, UPDATE and DELETE apply to all rows. Write the WHERE first.",
        whyWrong: {
          b: "There is no \"first student\" rule; all rows match.",
          c: "It is valid SQL, which is what makes it dangerous.",
          d: "It changes every row.",
        },
      },
      {
        id: "ppq75-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-sql-crud",
        prompt: "You run an INSERT with sqlite3 but the row is missing after the program ends. What was most likely forgotten?",
        options: [
          { id: "a", text: "conn.commit()" },
          { id: "b", text: "print()" },
          { id: "c", text: "import json" },
          { id: "d", text: "A SELECT statement" },
        ],
        correct: "a",
        explanation: "Changes stay in an open transaction until committed; closing without commit discards them.",
        whyWrong: {
          b: "Printing does not save anything.",
          c: "JSON is unrelated.",
          d: "Reading does not save changes.",
        },
      },
      {
        id: "ppq75-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-sql-filter-join",
        prompt: "Which query gives the average score for each subject?",
        options: [
          { id: "a", text: "SELECT subject, AVG(score) FROM scores GROUP BY subject" },
          { id: "b", text: "SELECT AVG(score) FROM scores" },
          { id: "c", text: "SELECT subject, score FROM scores ORDER BY subject" },
          { id: "d", text: "SELECT * FROM scores WHERE AVG(score)" },
        ],
        correct: "a",
        explanation: "GROUP BY subject applies AVG separately to each subject's rows.",
        whyWrong: {
          b: "That is one average over all scores.",
          c: "That lists scores without averaging.",
          d: "Aggregates cannot be used in WHERE like that.",
        },
      },
      {
        id: "ppq75-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-sql-filter-join",
        prompt: "What does a JOIN do?",
        options: [
          { id: "a", text: "Combines rows from two tables where a condition matches, such as scores.student_id = students.id" },
          { id: "b", text: "Merges two databases into one file" },
          { id: "c", text: "Adds two numbers" },
          { id: "d", text: "Deletes duplicate rows" },
        ],
        correct: "a",
        explanation: "JOIN brings related data from separate tables together in one result.",
        whyWrong: {
          b: "JOIN works within a query, not on files.",
          c: "That is +.",
          d: "That is DISTINCT, roughly.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l76-relations-safety": {
    lessonId: "pp-l76-relations-safety",
    passMark: 70,
    questions: [
      {
        id: "ppq76-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-normalisation",
        prompt: "Students take many courses and courses have many students. How is this modelled?",
        options: [
          { id: "a", text: "A linking table, such as enrolments(student_id, course_id)" },
          { id: "b", text: "A comma-separated list of courses in each student row" },
          { id: "c", text: "One giant table with a column per course" },
          { id: "d", text: "It cannot be modelled" },
        ],
        correct: "a",
        explanation: "A many-to-many relationship needs a linking table with a foreign key to each side.",
        whyWrong: {
          b: "Lists in a text column cannot be joined, validated or indexed properly.",
          c: "Adding a course would mean changing the table's structure.",
          d: "Linking tables model it cleanly.",
        },
      },
      {
        id: "ppq76-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-sqlite3",
        prompt: "What does conn.row_factory = sqlite3.Row allow?",
        options: [
          { id: "a", text: "Reading columns by name, such as row[\"email\"]" },
          { id: "b", text: "Creating rows automatically" },
          { id: "c", text: "Making the database read-only" },
          { id: "d", text: "Encrypting rows" },
        ],
        correct: "a",
        explanation: "Rows then behave like both tuples and dictionaries.",
        whyWrong: {
          b: "Rows are created by INSERT.",
          c: "It changes how rows are returned, not permissions.",
          d: "It has nothing to do with encryption.",
        },
      },
      {
        id: "ppq76-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-sql-injection",
        prompt: "Which line is safe from SQL injection?",
        options: [
          { id: "a", text: "conn.execute(\"SELECT * FROM users WHERE name = ?\", (name,))" },
          { id: "b", text: "conn.execute(f\"SELECT * FROM users WHERE name = '{name}'\")" },
          { id: "c", text: "conn.execute(\"SELECT * FROM users WHERE name = '\" + name + \"'\")" },
          { id: "d", text: "conn.execute(\"SELECT * FROM users WHERE name = '%s'\" % name)" },
        ],
        correct: "a",
        explanation: "With a ? placeholder, the value is sent separately and treated as data, never as SQL.",
        whyWrong: {
          b: "An f-string pastes the input into the SQL.",
          c: "Concatenation pastes the input into the SQL.",
          d: "% formatting also pastes the input into the SQL.",
        },
      },
      {
        id: "ppq76-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-sql-injection",
        prompt: "An unsafe login query is built with an f-string. A user types the password ' OR '1'='1. What can happen?",
        options: [
          { id: "a", text: "The condition becomes always true, so they log in without knowing the password" },
          { id: "b", text: "Nothing; quotes are ignored" },
          { id: "c", text: "Python refuses to run the query" },
          { id: "d", text: "The password is encrypted" },
        ],
        correct: "a",
        explanation: "The typed text becomes part of the SQL, adding OR '1'='1', which matches every row.",
        whyWrong: {
          b: "The quotes close the SQL string and change its meaning.",
          c: "The resulting SQL is valid, which is the danger.",
          d: "Nothing is encrypted.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l77-transactions": {
    lessonId: "pp-l77-transactions",
    passMark: 70,
    questions: [
      {
        id: "ppq77-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-transactions",
        prompt: "What does a transaction guarantee?",
        options: [
          { id: "a", text: "A group of changes either all happen or none do" },
          { id: "b", text: "Queries run twice as fast" },
          { id: "c", text: "Data is encrypted" },
          { id: "d", text: "Only one table can be changed" },
        ],
        correct: "a",
        explanation: "Commit applies them all; rollback discards them all.",
        whyWrong: {
          b: "Transactions are about correctness, not speed.",
          c: "Encryption is separate.",
          d: "A transaction can span many tables.",
        },
      },
      {
        id: "ppq77-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-transactions",
        prompt: "with conn:\n    conn.execute(\"UPDATE acc SET bal = bal - 100 WHERE name = 'A'\")\n    raise ValueError(\"stop\")\n\nWhat happens to A's balance?",
        options: [
          { id: "a", text: "It is unchanged: the error makes with conn: roll the transaction back" },
          { id: "b", text: "It is reduced by 100" },
          { id: "c", text: "It becomes 0" },
          { id: "d", text: "The table is deleted" },
        ],
        correct: "a",
        explanation: "The connection context manager commits on success and rolls back on an exception.",
        whyWrong: {
          b: "The update was rolled back.",
          c: "Nothing sets it to 0.",
          d: "Rollback only undoes the transaction's changes.",
        },
      },
      {
        id: "ppq77-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-db-errors",
        prompt: "Inserting a duplicate value into a UNIQUE column raises...",
        options: [
          { id: "a", text: "sqlite3.IntegrityError" },
          { id: "b", text: "KeyError" },
          { id: "c", text: "ZeroDivisionError" },
          { id: "d", text: "Nothing; the duplicate is saved" },
        ],
        correct: "a",
        explanation: "Breaking a constraint (UNIQUE, NOT NULL, foreign key) raises IntegrityError.",
        whyWrong: {
          b: "KeyError is for dictionaries.",
          c: "No division is involved.",
          d: "UNIQUE is enforced by the database.",
        },
      },
      {
        id: "ppq77-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pp-db-errors",
        prompt: "Does with sqlite3.connect(path) as conn: close the connection at the end of the block?",
        options: [
          { id: "a", text: "No: it commits or rolls back, but does not close; use contextlib.closing to close it" },
          { id: "b", text: "Yes, always" },
          { id: "c", text: "It deletes the database" },
          { id: "d", text: "It raises an error" },
        ],
        correct: "a",
        explanation: "The connection's context manager manages transactions only. closing() guarantees close().",
        whyWrong: {
          b: "A common misunderstanding; it only commits or rolls back.",
          c: "Nothing is deleted.",
          d: "It is valid and commonly used.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
