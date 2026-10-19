/**
 * PYTHON PROGRAMMING · MODULE 13 · OBJECT-ORIENTED PROGRAMMING
 *
 * Curriculum 13.1 – 13.12. Classes and objects, attributes and methods,
 * __init__ and self, instance versus class attributes, encapsulation and
 * properties, inheritance, polymorphism, composition, special methods,
 * dataclasses, and the judgement of when OOP is the right tool. Practice is
 * built around the curriculum's four models: bank account, payroll, library
 * and school administration.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "pp-s13-oop";

const PY = "python";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 54 · 13.1 – 13.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l54-classes-objects",
    moduleId: "pp-m13-oop",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["13.1", "13.2", "13.3", "13.4"],
    title: "Classes and Objects",
    subtitle: "Attributes, methods, __init__ and self",
    estimatedMinutes: 24,
    intro:
      "So far data and the functions that work on it have lived apart: a students dictionary here, functions that take it as a parameter there. Object-oriented programming puts them together. A class describes a kind of thing, its data and what it can do; an object is one actual thing of that kind.",

    atoms: [
      {
        id: "a-pp-class-object",
        title: "Classes and objects, attributes and methods",
        explain:
          "A class is a blueprint: class BankAccount: describes what every bank account has and does. An object (or instance) is one account made from it: acc = BankAccount(...). Data stored on an object is an ATTRIBUTE (acc.balance); a function defined inside the class is a METHOD (acc.deposit(500)). Every object has its own attributes, so two accounts hold two different balances.",
        analogy:
          "The class is the form a bank uses to open an account; each object is one filled-in form. Same fields, different values.",
        code: {
          language: PY,
          code: 'class Dog:\n    def __init__(self, name):\n        self.name = name\n        self.tricks = 0\n\n    def learn(self):\n        self.tricks += 1\n\nrex = Dog("Rex")\nbingo = Dog("Bingo")\nrex.learn()\nrex.learn()\nprint(rex.name, rex.tricks)\nprint(bingo.name, bingo.tricks)\n',
          expectedOutput: "Rex 2\nBingo 0",
        },
      },
      {
        id: "a-pp-init-self",
        title: "__init__() and the meaning of self",
        explain:
          "__init__ is the constructor: Python calls it automatically when you create an object, passing the arguments you gave the class. Its job is to set the starting attributes. self is the object the method is working on: in rex.learn(), Python passes rex as self. That is how one method, written once, updates whichever object it was called on. Every method's first parameter is self.",
        codeExercise: {
          language: PY,
          code: 'class Counter:\n    def __init__(self, start=0):\n        self.value = start\n\n    def add(self, n):\n        self.value += n\n        return self.value\n\na = Counter()\nb = Counter(10)\na.add(5)\nprint(b.add(1), a.value)\n',
          question: "Two separate Counter objects. Track each one's value. What is printed?",
          expectedOutput: "11 5",
          hint: "a starts at 0 and gains 5. b starts at 10 and gains 1; add returns the new value.",
          successMessage: "Each object has its own value, and self is how add() knows which one to change.",
        },
      },
      {
        id: "a-pp-bank-account",
        title: "Practice: a bank account model",
        explain:
          "A good class protects its own rules. A bank account's balance should only change through deposit and withdraw, which check their arguments, so the balance can never become invalid. That is the first taste of encapsulation (Lesson 55).",
        codeChallenge: {
          task: "Write class BankAccount with __init__(self, owner, balance=0), deposit(amount) and withdraw(amount), each returning the new balance. Both must raise ValueError for an amount of 0 or less, and withdraw must raise ValueError(\"insufficient funds\") if amount exceeds the balance. Keep a list attribute history recording each successful operation as a tuple such as (\"deposit\", 500).",
          starter: "class BankAccount:\n    pass\n",
          sample: "acc = BankAccount(\"Ada\", 1000)\nacc.deposit(500) → 1500\nacc.withdraw(200) → 1300\nacc.history → [('deposit', 500), ('withdraw', 200)]",
          tests: [
            {
              check:
                'acc = BankAccount("Ada", 1000)\n' +
                'assert acc.owner == "Ada" and acc.balance == 1000, "Store owner and balance as attributes."\n' +
                'assert BankAccount("Bo").balance == 0, "balance should default to 0."\n' +
                'assert acc.deposit(500) == 1500 and acc.withdraw(200) == 1300, "deposit and withdraw return the new balance."\n' +
                'assert acc.history == [("deposit", 500), ("withdraw", 200)], "history should record both operations. Got " + repr(acc.history)\n' +
                'for bad in [lambda: acc.deposit(0), lambda: acc.withdraw(-5), lambda: acc.withdraw(99999)]:\n' +
                '    try:\n' +
                '        bad()\n' +
                '        assert False, "Invalid operations must raise ValueError."\n' +
                '    except ValueError:\n' +
                '        pass\n' +
                'assert acc.balance == 1300 and len(acc.history) == 2, "Failed operations must change nothing."\n' +
                'other = BankAccount("Chi", 50)\n' +
                'assert other.history == [] and acc.history != [], "Each account needs its OWN history list (create it in __init__)."',
            },
          ],
          solution: 'class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n        self.history = []\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("amount must be positive")\n        self.balance += amount\n        self.history.append(("deposit", amount))\n        return self.balance\n\n    def withdraw(self, amount):\n        if amount <= 0:\n            raise ValueError("amount must be positive")\n        if amount > self.balance:\n            raise ValueError("insufficient funds")\n        self.balance -= amount\n        self.history.append(("withdraw", amount))\n        return self.balance\n',
          hint: "Set self.owner, self.balance and self.history = [] in __init__. In each method check first, then change self.balance and append to self.history.",
          successMessage: "Data and the rules that protect it, in one place. Compare it with Module 12's withdraw(balance, amount): the object remembers its own balance.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 55 · 13.5 – 13.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l55-attributes-properties",
    moduleId: "pp-m13-oop",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["13.5", "13.6"],
    title: "Class Attributes, Encapsulation and Properties",
    subtitle: "Data shared by all objects, and data protected from misuse",
    estimatedMinutes: 22,
    intro:
      "Some data belongs to each object (an employee's name); some belongs to the class as a whole (the company they all work for). And some data must be protected so it can never be set to nonsense, which is what properties are for.",

    atoms: [
      {
        id: "a-pp-class-attributes",
        title: "Instance attributes versus class attributes",
        explain:
          "An INSTANCE attribute is set on self, usually in __init__, and each object has its own. A CLASS attribute is written directly inside the class body and is shared by every object: a constant such as RATE, or a counter of how many objects exist. Read it as ClassName.attr. Never use a mutable class attribute (such as a list) for per-object data: every object would share the one list.",
        code: {
          language: PY,
          code: 'class Employee:\n    company = "Memora Ltd"\n    count = 0\n\n    def __init__(self, name):\n        self.name = name\n        Employee.count += 1\n\na = Employee("Ada")\nb = Employee("Bo")\nprint(a.company, b.company)\nprint(Employee.count)\n',
          expectedOutput: "Memora Ltd Memora Ltd\n2",
        },
        codeChallenge: {
          task: "Payroll. Write class Employee with a class attribute TAX_RATE = 0.1 and a class attribute headcount starting at 0, incremented for each new employee. __init__(self, name, monthly_salary). Method net_pay() returns the monthly salary minus tax at TAX_RATE, rounded to 2 decimal places. Use Employee.TAX_RATE (or self.TAX_RATE) so changing the class attribute changes everyone's pay.",
          starter: "class Employee:\n    def __init__(self, name, monthly_salary):\n        self.name = name\n        self.monthly_salary = monthly_salary\n        self.TAX_RATE = 0.1\n",
          sample: "Employee(\"Ada\", 250000).net_pay() → 225000.0",
          tests: [
            {
              check:
                'start = Employee.headcount\n' +
                'a = Employee("Ada", 250000)\n' +
                'b = Employee("Bo", 180000)\n' +
                'assert Employee.headcount == start + 2, "headcount should go up by one per employee."\n' +
                'assert a.net_pay() == 225000.0 and b.net_pay() == 162000.0, "Net pay is salary minus 10% tax."\n' +
                'assert "TAX_RATE" in Employee.__dict__, "TAX_RATE must be a CLASS attribute, written in the class body."\n' +
                'Employee.TAX_RATE = 0.2\n' +
                'assert a.net_pay() == 200000.0, "Changing Employee.TAX_RATE should change every employee\'s pay."\n' +
                'Employee.TAX_RATE = 0.1',
            },
          ],
          solution: "class Employee:\n    TAX_RATE = 0.1\n    headcount = 0\n\n    def __init__(self, name, monthly_salary):\n        self.name = name\n        self.monthly_salary = monthly_salary\n        Employee.headcount += 1\n\n    def net_pay(self):\n        return round(self.monthly_salary * (1 - Employee.TAX_RATE), 2)\n",
          hint: "Move TAX_RATE out of __init__ into the class body, add headcount = 0 there too, and increase Employee.headcount in __init__.",
          successMessage: "One shared tax rate, one shared headcount, and per-employee salaries. Knowing which data belongs to whom is most of class design.",
        },
      },
      {
        id: "a-pp-encapsulation",
        title: "Encapsulation and properties",
        explain:
          "Encapsulation means an object controls access to its own data. Python's convention: a name starting with an underscore, such as _price, is internal; do not touch it from outside. A PROPERTY looks like a plain attribute to the outside but runs a method: @property defines the getter, and @price.setter defines what happens on assignment, where you can validate. Callers keep writing p.price = 500, and bad values are refused.",
        code: {
          language: PY,
          code: 'class Product:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price          # goes through the setter\n\n    @property\n    def price(self):\n        return self._price\n\n    @price.setter\n    def price(self, value):\n        if value < 0:\n            raise ValueError("price cannot be negative")\n        self._price = value\n\np = Product("Pen", 300)\np.price = 350\nprint(p.price)\np.price = -1\n',
          expectedOutput: "350",
          raises: "ValueError: price cannot be negative",
        },
        codeChallenge: {
          task: "School administration. Write class Student with __init__(self, name, age). age must be a property whose setter raises ValueError unless it is an int from 5 to 25. Add a read-only property is_adult (True at 18 or over) with no setter.",
          starter: "class Student:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n",
          sample: "s = Student(\"Ada\", 17); s.is_adult → False; s.age = 30 raises ValueError",
          tests: [
            {
              check:
                's = Student("Ada", 17)\n' +
                'assert s.age == 17 and s.is_adult is False, "Age 17 is not an adult."\n' +
                's.age = 18\n' +
                'assert s.is_adult is True, "Age 18 is an adult."\n' +
                'for bad in [30, 4, "17"]:\n' +
                '    try:\n' +
                '        s.age = bad\n' +
                '        assert False, f"Setting age to {bad!r} should raise ValueError."\n' +
                '    except ValueError:\n' +
                '        pass\n' +
                'assert s.age == 18, "A rejected age must leave the old value."\n' +
                'try:\n' +
                '    Student("Bo", 3)\n' +
                '    assert False, "Creating a student with age 3 should raise ValueError (the constructor should use the property)."\n' +
                'except ValueError:\n' +
                '    pass\n' +
                'try:\n' +
                '    s.is_adult = False\n' +
                '    assert False, "is_adult should be read-only (a property with no setter)."\n' +
                'except AttributeError:\n' +
                '    pass',
            },
          ],
          solution: 'class Student:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    @property\n    def age(self):\n        return self._age\n\n    @age.setter\n    def age(self, value):\n        if type(value) is not int or not 5 <= value <= 25:\n            raise ValueError("age must be a whole number from 5 to 25")\n        self._age = value\n\n    @property\n    def is_adult(self):\n        return self._age >= 18\n',
          hint: "Store the real value in self._age. The @age.setter validates before assigning. is_adult is just a @property method returning a bool.",
          successMessage: "Callers still write s.age = 18, but nonsense ages can never get in, and is_adult is always consistent with age because it is calculated, not stored.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 56 · 13.7 – 13.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l56-inheritance-polymorphism",
    moduleId: "pp-m13-oop",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["13.7", "13.8", "13.9"],
    title: "Inheritance, Polymorphism and Composition",
    subtitle: "Specialising classes, treating them alike, and building from parts",
    estimatedMinutes: 26,
    intro:
      "Classes relate to each other in two ways. A manager IS an employee with extra pay: inheritance. A library HAS books: composition. Polymorphism is the payoff: code that works on any object with the right method, whatever its class.",

    atoms: [
      {
        id: "a-pp-inheritance",
        title: "Inheritance and method overriding",
        explain:
          "class Manager(Employee): makes Manager a subclass that inherits every attribute and method of Employee. It can add new ones and OVERRIDE existing ones by defining a method with the same name. super().method(...) calls the parent's version, which avoids repeating its code, most often in __init__.",
        code: {
          language: PY,
          code: 'class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n    def pay(self):\n        return self.salary\n\nclass Manager(Employee):\n    def __init__(self, name, salary, bonus):\n        super().__init__(name, salary)\n        self.bonus = bonus\n\n    def pay(self):\n        return super().pay() + self.bonus\n\nprint(Employee("Ada", 200000).pay())\nprint(Manager("Bo", 300000, 50000).pay())\nprint(isinstance(Manager("C", 1, 1), Employee))\n',
          expectedOutput: "200000\n350000\nTrue",
        },
        codeChallenge: {
          task: "Extend the payroll. Given class Staff(name, hourly_rate) with pay(hours) returning hours × rate, write class Contractor(Staff) that adds a fixed call_out_fee in its constructor (use super().__init__) and overrides pay(hours) to return the normal pay plus the fee (use super().pay(hours)). Also write class Intern(Staff) that overrides pay(hours) to pay half the normal rate.",
          starter: "class Staff:\n    def __init__(self, name, hourly_rate):\n        self.name = name\n        self.hourly_rate = hourly_rate\n\n    def pay(self, hours):\n        return hours * self.hourly_rate\n",
          sample: "Contractor(\"Ada\", 2000, 5000).pay(10) → 25000\nIntern(\"Bo\", 2000).pay(10) → 10000.0",
          tests: [
            {
              check:
                'c = Contractor("Ada", 2000, 5000)\n' +
                'assert isinstance(c, Staff), "Contractor must inherit from Staff."\n' +
                'assert c.name == "Ada" and c.call_out_fee == 5000, "Contractor stores name, rate and call_out_fee."\n' +
                'assert c.pay(10) == 25000, "10 hours at 2000 plus a 5000 fee is 25000. Got " + repr(c.pay(10))\n' +
                'i = Intern("Bo", 2000)\n' +
                'assert isinstance(i, Staff) and i.pay(10) == 10000, "An intern gets half: 10000. Got " + repr(i.pay(10))\n' +
                'assert Staff("Cy", 1000).pay(3) == 3000, "Staff itself is unchanged."\n' +
                'assert "super()" in source, "Use super() to reuse the parent\'s code."',
            },
          ],
          solution: "class Staff:\n    def __init__(self, name, hourly_rate):\n        self.name = name\n        self.hourly_rate = hourly_rate\n\n    def pay(self, hours):\n        return hours * self.hourly_rate\n\nclass Contractor(Staff):\n    def __init__(self, name, hourly_rate, call_out_fee):\n        super().__init__(name, hourly_rate)\n        self.call_out_fee = call_out_fee\n\n    def pay(self, hours):\n        return super().pay(hours) + self.call_out_fee\n\nclass Intern(Staff):\n    def pay(self, hours):\n        return super().pay(hours) / 2\n",
          hint: "Contractor needs its own __init__ calling super().__init__(name, hourly_rate). Intern only needs to override pay.",
          successMessage: "Two specialisations, no repeated code: each subclass changes only what is different about it.",
        },
      },
      {
        id: "a-pp-polymorphism",
        title: "Polymorphism",
        explain:
          "Polymorphism means \"many forms\": different classes provide a method with the same name, and code calls it without caring which class it has. A loop over shapes can call shape.area() on circles, rectangles and triangles alike. The calling code never needs if isinstance(...) chains, and a new shape class works with it automatically.",
        code: {
          language: PY,
          code: 'class Card:\n    def fee(self, amount):\n        return amount * 0.015\n\nclass Transfer:\n    def fee(self, amount):\n        return 50\n\nclass Cash:\n    def fee(self, amount):\n        return 0\n\nfor method in [Card(), Transfer(), Cash()]:\n    print(type(method).__name__, method.fee(10000))\n',
          expectedOutput: "Card 150.0\nTransfer 50\nCash 0",
        },
        codeChallenge: {
          task: "Write classes Rectangle(width, height), Circle(radius) and Triangle(base, height), each with an area() method (use 3.14159 for π). Then write total_area(shapes) that returns the sum of the areas of any list of shapes, rounded to 2 decimal places, without checking what class each shape is.",
          starter: "class Rectangle:\n    pass\n\nclass Circle:\n    pass\n\nclass Triangle:\n    pass\n\ndef total_area(shapes):\n    pass\n",
          sample: "total_area([Rectangle(2, 3), Circle(1), Triangle(4, 5)]) → 19.14",
          tests: [
            {
              check:
                'assert Rectangle(2, 3).area() == 6 and Triangle(4, 5).area() == 10, "Rectangle 2×3 is 6; triangle base 4 height 5 is 10."\n' +
                'assert abs(Circle(1).area() - 3.14159) < 1e-9, "Circle(1).area() is 3.14159."\n' +
                'assert total_area([Rectangle(2, 3), Circle(1), Triangle(4, 5)]) == 19.14, "Got " + repr(total_area([Rectangle(2, 3), Circle(1), Triangle(4, 5)]))\n' +
                'class Square:\n' +
                '    def __init__(self, s):\n' +
                '        self.s = s\n' +
                '    def area(self):\n' +
                '        return self.s * self.s\n' +
                'assert total_area([Square(3), Rectangle(1, 1)]) == 10, "total_area must work with ANY object that has area(), even a new Square class."\n' +
                'assert "isinstance" not in source and "type(" not in source, "Do not check classes: just call area()."',
            },
          ],
          solution: "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\nclass Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return 3.14159 * self.radius ** 2\n\nclass Triangle:\n    def __init__(self, base, height):\n        self.base = base\n        self.height = height\n\n    def area(self):\n        return 0.5 * self.base * self.height\n\ndef total_area(shapes):\n    return round(sum(s.area() for s in shapes), 2)\n",
          hint: "Each class: an __init__ storing its measurements and an area() method. total_area: sum(s.area() for s in shapes).",
          successMessage: "The check added a brand-new Square class and your total_area handled it without a single change. That is polymorphism.",
        },
      },
      {
        id: "a-pp-composition",
        title: "Composition versus inheritance",
        explain:
          "Inheritance models IS-A: a Manager is an Employee. Composition models HAS-A: a Library has Books, a Car has an Engine. With composition an object holds other objects as attributes and asks them to do work. Prefer composition when the relationship is not truly \"is a kind of\"; deep inheritance trees become rigid and hard to change.",
        codeChallenge: {
          task: "Library management. Write class Book(title, author) with an attribute available = True. Write class Library that HAS a dictionary of books keyed by title: add_book(book), borrow(title) returning True and marking the book unavailable (False if unknown or already borrowed), return_book(title) making it available again, and available_titles() returning a sorted list of titles that can be borrowed.",
          starter: "class Book:\n    pass\n\nclass Library:\n    pass\n",
          sample: "lib.borrow(\"Things Fall Apart\") → True\nlib.available_titles() → ['Half of a Yellow Sun']",
          tests: [
            {
              check:
                'lib = Library()\n' +
                'lib.add_book(Book("Things Fall Apart", "Achebe"))\n' +
                'lib.add_book(Book("Half of a Yellow Sun", "Adichie"))\n' +
                'assert lib.available_titles() == ["Half of a Yellow Sun", "Things Fall Apart"], "Both titles start available, sorted."\n' +
                'assert lib.borrow("Things Fall Apart") is True, "Borrowing an available book returns True."\n' +
                'assert lib.borrow("Things Fall Apart") is False, "It cannot be borrowed twice."\n' +
                'assert lib.borrow("Unknown") is False, "Unknown titles return False."\n' +
                'assert lib.available_titles() == ["Half of a Yellow Sun"], "Only the unborrowed book is available."\n' +
                'lib.return_book("Things Fall Apart")\n' +
                'assert len(lib.available_titles()) == 2, "Returned books are available again."\n' +
                'assert not issubclass(Library, Book) and not issubclass(Book, Library), "A library HAS books; use composition, not inheritance."',
            },
          ],
          solution: "class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n        self.available = True\n\nclass Library:\n    def __init__(self):\n        self.books = {}\n\n    def add_book(self, book):\n        self.books[book.title] = book\n\n    def borrow(self, title):\n        book = self.books.get(title)\n        if book is None or not book.available:\n            return False\n        book.available = False\n        return True\n\n    def return_book(self, title):\n        if title in self.books:\n            self.books[title].available = True\n\n    def available_titles(self):\n        return sorted(t for t, b in self.books.items() if b.available)\n",
          hint: "Library.__init__ creates self.books = {}. borrow looks the book up with get() and checks book.available.",
          successMessage: "A Library made of Book objects, each managing its own availability. Composition like this scales far better than forcing everything into one inheritance tree.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 57 · 13.10 – 13.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "pp-l57-special-dataclasses",
    moduleId: "pp-m13-oop",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["13.10", "13.11", "13.12"],
    title: "Special Methods, Dataclasses and When to Use OOP",
    subtitle: "__str__, @dataclass, and choosing the simplest design",
    estimatedMinutes: 22,
    intro:
      "Three finishing touches: special methods that let your objects print nicely and work with Python's operators, dataclasses that remove boilerplate from simple record classes, and the judgement to know when a class is the wrong tool.",

    atoms: [
      {
        id: "a-pp-special-methods",
        title: "Special methods such as __str__()",
        explain:
          "Methods with double underscores on both sides (\"dunder\" methods) are called by Python itself. __str__ returns the friendly text print() shows. __repr__ returns an unambiguous developer view, used in lists and the debugger. __eq__ defines ==, __lt__ defines < (which lets sorted() order your objects), and __len__ makes len() work.",
        code: {
          language: PY,
          code: 'class Money:\n    def __init__(self, kobo):\n        self.kobo = kobo\n\n    def __str__(self):\n        return f"N{self.kobo / 100:,.2f}"\n\n    def __add__(self, other):\n        return Money(self.kobo + other.kobo)\n\n    def __eq__(self, other):\n        return self.kobo == other.kobo\n\ntotal = Money(150000) + Money(2550)\nprint(total)\nprint(total == Money(152550))\n',
          expectedOutput: "N1,525.50\nTrue",
        },
        codeChallenge: {
          task: "Give class Book(title, author, year) a __str__ returning Things Fall Apart by Achebe (1958), a __repr__ returning Book('Things Fall Apart', 'Achebe', 1958), and a __lt__ that orders books by year, so sorted() puts the oldest first.",
          starter: "class Book:\n    def __init__(self, title, author, year):\n        self.title = title\n        self.author = author\n        self.year = year\n",
          sample: "print(Book(\"Things Fall Apart\", \"Achebe\", 1958)) → Things Fall Apart by Achebe (1958)",
          tests: [
            {
              check:
                'b = Book("Things Fall Apart", "Achebe", 1958)\n' +
                'assert str(b) == "Things Fall Apart by Achebe (1958)", "__str__ got " + repr(str(b))\n' +
                'assert repr(b) == "Book(\'Things Fall Apart\', \'Achebe\', 1958)", "__repr__ got " + repr(repr(b))\n' +
                'books = [Book("C", "x", 2006), b, Book("B", "y", 1975)]\n' +
                'assert [x.year for x in sorted(books)] == [1958, 1975, 2006], "sorted() should order books by year using __lt__."',
            },
          ],
          solution: 'class Book:\n    def __init__(self, title, author, year):\n        self.title = title\n        self.author = author\n        self.year = year\n\n    def __str__(self):\n        return f"{self.title} by {self.author} ({self.year})"\n\n    def __repr__(self):\n        return f"Book({self.title!r}, {self.author!r}, {self.year})"\n\n    def __lt__(self, other):\n        return self.year < other.year\n',
          hint: "In __repr__, {self.title!r} inserts the title with quotes. __lt__(self, other) returns self.year < other.year.",
          successMessage: "Your objects now print readably, show clearly in the debugger, and sort naturally, all through methods Python calls for you.",
        },
      },
      {
        id: "a-pp-dataclasses",
        title: "Dataclasses",
        explain:
          "from dataclasses import dataclass, field. Decorating a class with @dataclass and listing typed fields writes __init__, __repr__ and __eq__ for you. Defaults are allowed; a mutable default such as a list must use field(default_factory=list) so each object gets its own. Add methods as normal. Use dataclasses for classes that are mainly data.",
        code: {
          language: PY,
          code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Student:\n    name: str\n    level: str = "JSS1"\n    scores: list = field(default_factory=list)\n\n    def average(self):\n        return sum(self.scores) / len(self.scores) if self.scores else 0.0\n\ns = Student("Ada", scores=[70, 90])\nprint(s)\nprint(s.average(), s == Student("Ada", "JSS1", [70, 90]))\n',
          expectedOutput: "Student(name='Ada', level='JSS1', scores=[70, 90])\n80.0 True",
        },
        codeChallenge: {
          task: "Rewrite this class as a dataclass called Transaction with fields description (str), amount (float) and category (str, default \"general\"). Keep the is_expense() method (True when amount is negative).",
          starter: 'class Transaction:\n    def __init__(self, description, amount, category="general"):\n        self.description = description\n        self.amount = amount\n        self.category = category\n\n    def is_expense(self):\n        return self.amount < 0\n',
          sample: "Transaction(\"Bread\", -1200.0, \"food\") → Transaction(description='Bread', amount=-1200.0, category='food')",
          tests: [
            {
              check:
                'import dataclasses\n' +
                'assert dataclasses.is_dataclass(Transaction), "Decorate the class with @dataclass."\n' +
                't = Transaction("Bread", -1200.0, "food")\n' +
                'assert repr(t) == "Transaction(description=\'Bread\', amount=-1200.0, category=\'food\')", "repr got " + repr(repr(t))\n' +
                'assert Transaction("Salary", 300000.0).category == "general", "category defaults to general."\n' +
                'assert t.is_expense() is True and Transaction("Salary", 1.0).is_expense() is False, "Keep is_expense()."\n' +
                'assert t == Transaction("Bread", -1200.0, "food"), "Dataclasses compare by value."\n' +
                'assert "def __init__" not in source, "Let @dataclass write __init__ for you."',
            },
          ],
          solution: 'from dataclasses import dataclass\n\n@dataclass\nclass Transaction:\n    description: str\n    amount: float\n    category: str = "general"\n\n    def is_expense(self):\n        return self.amount < 0\n',
          hint: "Import dataclass, put @dataclass above the class, replace __init__ with three typed field lines, and keep the method.",
          successMessage: "Half the code, plus a readable repr and value comparison for free. This Transaction class is ready for the Phase 3 finance tracker.",
        },
      },
      {
        id: "a-pp-when-oop",
        title: "When to use OOP, and when simpler functions are better",
        explain:
          "Use a class when data and the behaviour that keeps it valid belong together and live for a while (an account, a cart, a game character), or when several types share an interface (shapes, payment methods). Use plain functions for calculations and transformations: something in, something out. A class with one method and no state is usually just a function wearing a costume.",
        decision: {
          scenario: "You need code that converts a temperature from Celsius to Fahrenheit.",
          question: "Which design is best?",
          options: [
            {
              id: "a",
              text: "A function: def c_to_f(c): return c * 9 / 5 + 32",
              why: "No state to protect and nothing to remember between calls: a pure calculation is exactly what a function is for.",
            },
            {
              id: "b",
              text: "A TemperatureConverter class with __init__ and a convert() method",
              whyWrong: "The object would hold nothing useful; you would create one just to call one method. Extra code, no benefit.",
            },
            {
              id: "c",
              text: "A Temperature base class with Celsius and Fahrenheit subclasses",
              whyWrong: "That is a lot of structure for a one-line formula. Inheritance is for real families of types with shared behaviour.",
            },
            {
              id: "d",
              text: "A global variable updated by a loop",
              whyWrong: "Globals make code harder to reason about and add nothing here.",
            },
          ],
          correct: "a",
          aftermath: "Pick the simplest structure that fits: functions for transformations, classes for things with state and rules.",
        },
      },
    ],

    task: {
      title: "Module 13 practice: four object models",
      intro: "Model each with classes, and justify each class and each relationship (IS-A or HAS-A) in a comment. The milestone is to design a small application using appropriate classes and object relationships.",
      prompts: [
        "Bank account: SavingsAccount (interest) and CurrentAccount (overdraft limit) inheriting from BankAccount, with transaction history.",
        "Employee payroll: Employee, Manager and Contractor with polymorphic pay(), and a Payroll class that HAS employees and prints a pay slip for each.",
        "Library management: Book, Member and Library, with borrowing limits and due dates (datetime.date).",
        "School administration: Student and Teacher as dataclasses, and a School class that enrols students into classes and reports averages per class.",
      ],
      closing: "Next: modules and packages, so your growing programs can be split into files and reuse code written by others.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
