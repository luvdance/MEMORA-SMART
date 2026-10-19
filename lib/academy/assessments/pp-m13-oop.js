/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 13
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l54-classes-objects": {
    lessonId: "pp-l54-classes-objects",
    passMark: 70,
    questions: [
      {
        id: "ppq54-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-class-object",
        prompt: "What is the relationship between a class and an object?",
        options: [
          { id: "a", text: "A class is a blueprint; an object is one instance made from it" },
          { id: "b", text: "They are two names for the same thing" },
          { id: "c", text: "An object is a blueprint for classes" },
          { id: "d", text: "A class is a kind of variable" },
        ],
        correct: "a",
        explanation: "The class describes what every instance has and does; each object holds its own values.",
        whyWrong: {
          b: "One class can produce many different objects.",
          c: "It is the other way round.",
          d: "A class defines a type; variables refer to objects.",
        },
      },
      {
        id: "ppq54-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-init-self",
        prompt: "When is __init__ called?",
        options: [
          { id: "a", text: "Automatically, when a new object is created" },
          { id: "b", text: "Only when you call obj.__init__() yourself" },
          { id: "c", text: "When the program ends" },
          { id: "d", text: "Every time any method runs" },
        ],
        correct: "a",
        explanation: "Writing BankAccount(\"Ada\") creates the object and calls __init__ with the arguments.",
        whyWrong: {
          b: "You never need to call it directly.",
          c: "It runs at creation, not at the end.",
          d: "It runs once per object.",
        },
      },
      {
        id: "ppq54-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-init-self",
        prompt: "class Box:\n    def __init__(self, size):\n        self.size = size\n\n    def grow(self):\n        self.size *= 2\n\na = Box(3)\nb = Box(3)\na.grow()\nprint(a.size, b.size)\n\nWhat is printed?",
        options: [
          { id: "a", text: "6 3" },
          { id: "b", text: "6 6" },
          { id: "c", text: "3 3" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "Each object has its own size. grow() changes only the object it is called on, a.",
        whyWrong: {
          b: "b is a separate object with its own size.",
          c: "a.grow() doubled a's size.",
          d: "The code is valid.",
        },
      },
      {
        id: "ppq54-4",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-bank-account",
        prompt: "class A:\n    def hello():\n        print(\"hi\")\n\nA().hello()\n\nWhat happens?",
        options: [
          { id: "a", text: "TypeError, because the method has no self parameter but Python passes the object" },
          { id: "b", text: "hi is printed" },
          { id: "c", text: "Nothing" },
          { id: "d", text: "NameError" },
        ],
        correct: "a",
        explanation: "Calling a method passes the object as the first argument. Without self, there is no parameter to receive it.",
        whyWrong: {
          b: "The call fails before the print.",
          c: "It raises an error.",
          d: "All names exist; the problem is the number of arguments.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l55-attributes-properties": {
    lessonId: "pp-l55-attributes-properties",
    passMark: 70,
    questions: [
      {
        id: "ppq55-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-class-attributes",
        prompt: "class Car:\n    wheels = 4\n\na = Car()\nb = Car()\nCar.wheels = 6\nprint(a.wheels, b.wheels)\n\nWhat is printed?",
        options: [
          { id: "a", text: "6 6" },
          { id: "b", text: "4 4" },
          { id: "c", text: "6 4" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "wheels is a class attribute shared by all instances, so changing it on the class changes what both see.",
        whyWrong: {
          b: "The class attribute was changed to 6.",
          c: "Both objects read the same class attribute.",
          d: "This is valid.",
        },
      },
      {
        id: "ppq55-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-class-attributes",
        prompt: "Which data should be a CLASS attribute rather than an instance attribute?",
        options: [
          { id: "a", text: "A tax rate that applies to every employee" },
          { id: "b", text: "Each employee's name" },
          { id: "c", text: "Each employee's salary" },
          { id: "d", text: "Each account's transaction history list" },
        ],
        correct: "a",
        explanation: "Shared values belong to the class; per-object values belong on self.",
        whyWrong: {
          b: "Names differ per employee.",
          c: "Salaries differ per employee.",
          d: "A shared list would mix every account's history together.",
        },
      },
      {
        id: "ppq55-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-encapsulation",
        prompt: "What does a leading underscore in self._balance signal?",
        options: [
          { id: "a", text: "It is internal; code outside the class should not use it directly" },
          { id: "b", text: "Python makes it impossible to access" },
          { id: "c", text: "It is a class attribute" },
          { id: "d", text: "It is a constant" },
        ],
        correct: "a",
        explanation: "It is a convention, not a lock: \"this is an implementation detail\".",
        whyWrong: {
          b: "It can still be accessed; the underscore is a message to programmers.",
          c: "It is set on self, so it is an instance attribute.",
          d: "Constants are written in UPPER_CASE.",
        },
      },
      {
        id: "ppq55-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pp-encapsulation",
        prompt: "Why use a property with a setter instead of a plain attribute for age?",
        options: [
          { id: "a", text: "Assignments like s.age = 30 run validation code, while callers keep the simple attribute syntax" },
          { id: "b", text: "Properties are faster" },
          { id: "c", text: "Plain attributes cannot hold numbers" },
          { id: "d", text: "Properties make the value constant" },
        ],
        correct: "a",
        explanation: "The setter can refuse invalid values, protecting the object's state without changing how it is used.",
        whyWrong: {
          b: "Speed is not the point.",
          c: "Plain attributes hold anything.",
          d: "A property with a setter can be changed, but only to valid values.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l56-inheritance-polymorphism": {
    lessonId: "pp-l56-inheritance-polymorphism",
    passMark: 70,
    questions: [
      {
        id: "ppq56-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-pp-inheritance",
        prompt: "class Animal:\n    def sound(self):\n        return \"...\"\n\nclass Cat(Animal):\n    def sound(self):\n        return \"Meow\"\n\nclass Fish(Animal):\n    pass\n\nprint(Cat().sound(), Fish().sound())\n\nWhat is printed?",
        options: [
          { id: "a", text: "Meow ..." },
          { id: "b", text: "... ..." },
          { id: "c", text: "Meow Meow" },
          { id: "d", text: "An error, because Fish has no sound method" },
        ],
        correct: "a",
        explanation: "Cat overrides sound(); Fish inherits Animal's version.",
        whyWrong: {
          b: "Cat's own method overrides the parent's.",
          c: "Fish does not inherit from Cat.",
          d: "Fish inherits sound() from Animal.",
        },
      },
      {
        id: "ppq56-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-inheritance",
        prompt: "What does super().__init__(name) do inside a subclass's __init__?",
        options: [
          { id: "a", text: "Runs the parent class's __init__ so its attributes are set up" },
          { id: "b", text: "Creates a second object" },
          { id: "c", text: "Deletes the parent class" },
          { id: "d", text: "Makes the class a superclass" },
        ],
        correct: "a",
        explanation: "It reuses the parent's setup code instead of repeating it.",
        whyWrong: {
          b: "It initialises the same object.",
          c: "Nothing is deleted.",
          d: "It calls a method; it does not change the class hierarchy.",
        },
      },
      {
        id: "ppq56-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-polymorphism",
        prompt: "What is polymorphism?",
        options: [
          { id: "a", text: "Different classes providing the same method name, so code can call it without knowing the class" },
          { id: "b", text: "A class having many attributes" },
          { id: "c", text: "Changing an object's class at run time" },
          { id: "d", text: "Writing the same code many times" },
        ],
        correct: "a",
        explanation: "for shape in shapes: shape.area() works for every class that defines area().",
        whyWrong: {
          b: "Attribute count is unrelated.",
          c: "That is not what the term means.",
          d: "Polymorphism reduces repetition.",
        },
      },
      {
        id: "ppq56-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-composition",
        prompt: "Which relationship should use composition rather than inheritance?",
        options: [
          { id: "a", text: "A Car and its Engine" },
          { id: "b", text: "A Manager and an Employee" },
          { id: "c", text: "A Circle and a Shape" },
          { id: "d", text: "A SavingsAccount and an Account" },
        ],
        correct: "a",
        explanation: "A car HAS an engine; it is not a kind of engine. The others are IS-A relationships.",
        whyWrong: {
          b: "A manager IS an employee: inheritance fits.",
          c: "A circle IS a shape.",
          d: "A savings account IS an account.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l57-special-dataclasses": {
    lessonId: "pp-l57-special-dataclasses",
    passMark: 70,
    questions: [
      {
        id: "ppq57-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-special-methods",
        prompt: "Which method controls what print(obj) shows?",
        options: [
          { id: "a", text: "__str__" },
          { id: "b", text: "__init__" },
          { id: "c", text: "__print__" },
          { id: "d", text: "__len__" },
        ],
        correct: "a",
        explanation: "print() calls str(obj), which calls __str__.",
        whyWrong: {
          b: "__init__ sets up a new object.",
          c: "There is no __print__ special method.",
          d: "__len__ supports len().",
        },
      },
      {
        id: "ppq57-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-special-methods",
        prompt: "Which special method lets sorted() order your objects?",
        options: [
          { id: "a", text: "__lt__" },
          { id: "b", text: "__str__" },
          { id: "c", text: "__add__" },
          { id: "d", text: "__repr__" },
        ],
        correct: "a",
        explanation: "sorted() compares items with <, which calls __lt__.",
        whyWrong: {
          b: "__str__ is for display.",
          c: "__add__ supports +.",
          d: "__repr__ is the developer view.",
        },
      },
      {
        id: "ppq57-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-dataclasses",
        prompt: "In a dataclass, why must a list default be field(default_factory=list) and not = []?",
        options: [
          { id: "a", text: "So each object gets its own new list instead of all sharing one" },
          { id: "b", text: "Lists are not allowed in dataclasses" },
          { id: "c", text: "It makes the class faster" },
          { id: "d", text: "There is no reason" },
        ],
        correct: "a",
        explanation: "A mutable default would be shared; default_factory builds a fresh list for every object.",
        whyWrong: {
          b: "Lists are fine as fields.",
          c: "It is about correctness.",
          d: "Sharing one list across objects is a real bug, and dataclasses refuse = [].",
        },
      },
      {
        id: "ppq57-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-when-oop",
        prompt: "Which is the best candidate for a class rather than a function?",
        options: [
          { id: "a", text: "A shopping cart that holds items and enforces rules as items are added and removed" },
          { id: "b", text: "Converting kilometres to miles" },
          { id: "c", text: "Calculating the average of a list" },
          { id: "d", text: "Formatting a number as currency" },
        ],
        correct: "a",
        explanation: "The cart has state that lives over time and rules that protect it: exactly what classes are for.",
        whyWrong: {
          b: "A pure calculation: a function.",
          c: "Input in, result out: a function.",
          d: "A transformation: a function.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
