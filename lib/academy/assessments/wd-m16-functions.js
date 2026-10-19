/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 16 · FUNCTIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l67-functions", [
    q({ id: "wdq67-1", atom: "a-wd-declarations", d: 1, prompt: "What does defining function greet() { console.log(\"Hi\"); } print?", options: ["Nothing until greet() is called", "Hi", "greet", "An error"], correct: "a",
      explanation: "A definition only creates the function.",
      wrong: { b: "Only a call runs the body.", c: "The name is not printed.", d: "It is valid." } }),
    q({ id: "wdq67-2", atom: "a-wd-params-args", d: 2, prompt: "In area(4, 5), what are 4 and 5?", options: ["Arguments", "Parameters", "Return values", "Variables declared with const"], correct: "a",
      explanation: "Arguments are the values passed in a call; parameters are the names in the definition.",
      wrong: { b: "Parameters are the names, such as width and height.", c: "Returns come back out.", d: "They are literal values." } }),
    q({ id: "wdq67-3", atom: "a-wd-return", d: 3, type: "scenario", prompt: "const t = total(prices); gives undefined, though total prints the right number. Why?", options: ["total uses console.log instead of return", "prices is empty", "const cannot hold numbers", "The function name is wrong"], correct: "a",
      explanation: "Printing is not returning; a function without return gives undefined.",
      wrong: { b: "Then the printed number would be wrong too.", c: "It can.", d: "It ran, since it printed." } }),
    q({ id: "wdq67-4", atom: "a-wd-what-functions", d: 2, prompt: "Which is the best function name?", options: ["calculateDeliveryFee", "doStuff", "f1", "data"], correct: "a",
      explanation: "A verb and a clear object: it says what it does.",
      wrong: { b: "Says nothing.", c: "Meaningless.", d: "A noun, and vague." } }),
  ]),

  ...check("wd-l68-scope-arrows", [
    q({ id: "wdq68-1", atom: "a-wd-scope", d: 2, prompt: "A const declared inside a function is used outside it. What happens?", options: ["ReferenceError: it is not defined there", "It works", "It is undefined", "It becomes global"], correct: "a",
      explanation: "Local variables exist only inside their function.",
      wrong: { b: "Its scope is the function.", c: "It is not declared at all outside.", d: "Nothing makes it global." } }),
    q({ id: "wdq68-2", atom: "a-wd-scope", d: 2, prompt: "Why keep global variables to a minimum?", options: ["Any code anywhere can change them, so bugs are hard to trace", "They are slower", "Browsers limit them to ten", "They cannot hold strings"], correct: "a",
      explanation: "Local data is easier to reason about.",
      wrong: { b: "Speed is not the issue.", c: "No such limit.", d: "They hold anything." } }),
    q({ id: "wdq68-3", atom: "a-wd-function-expressions", d: 3, prompt: "What does const add = function (a, b) { return a + b; }; demonstrate?", options: ["A function is a value that can be stored in a variable", "A syntax error", "A loop", "A class"], correct: "a",
      explanation: "That is a function expression.",
      wrong: { b: "Valid code.", c: "No loop.", d: "No class." } }),
    q({ id: "wdq68-4", atom: "a-wd-arrow-functions", d: 2, prompt: "What does const half = (n) => n / 2; return for half(9)?", options: ["4.5", "undefined", "4", "An error"], correct: "a",
      explanation: "A single-expression arrow returns its value automatically.",
      wrong: { b: "Without braces the value is returned.", c: "Division does not round.", d: "Valid." } }),
  ]),

  ...check("wd-l69-callbacks-pure", [
    q({ id: "wdq69-1", atom: "a-wd-callbacks", d: 2, prompt: "In button.addEventListener(\"click\", showMenu), what is showMenu?", options: ["A callback the browser calls on each click", "A string", "The result of calling showMenu", "A CSS class"], correct: "a",
      explanation: "The function itself is passed, to be called later.",
      wrong: { b: "It is a function.", c: "No brackets, so it is not called now.", d: "Not CSS." } }),
    q({ id: "wdq69-2", atom: "a-wd-callbacks", d: 3, type: "scenario", prompt: "Someone writes addEventListener(\"click\", showMenu()). What goes wrong?", options: ["showMenu runs immediately and its return value, not the function, is passed", "Nothing", "It runs on every key press", "It is a syntax error"], correct: "a",
      explanation: "The brackets call it now. Pass the function without brackets.",
      wrong: { b: "The listener gets undefined.", c: "Unrelated.", d: "Valid syntax, wrong meaning." } }),
    q({ id: "wdq69-3", atom: "a-wd-default-params", d: 2, prompt: "With function vat(price, rate = 7.5), what is rate in vat(2000)?", options: ["7.5", "undefined", "0", "2000"], correct: "a",
      explanation: "No argument, so the default is used.",
      wrong: { b: "The default replaces undefined.", c: "Not 0.", d: "That is price." } }),
    q({ id: "wdq69-4", atom: "a-wd-pure-functions", d: 3, prompt: "Which function is pure?", options: ["(a, b) => a + b", "(item) => { cart.push(item); }", "() => Math.random()", "(msg) => console.log(msg)"], correct: "a",
      explanation: "Same inputs, same output, nothing outside changed.",
      wrong: { b: "Changes a global array: a side effect.", c: "Different output each time.", d: "Printing is a side effect." } }),
  ]),

  ...check("wd-l70-decompose-debug", [
    q({ id: "wdq70-1", atom: "a-wd-decomposition", d: 2, prompt: "Why split a receipt calculation into subtotal, discount, addVat and format?", options: ["Each part can be understood, tested and fixed on its own", "It runs faster", "JavaScript requires small functions", "It uses less memory"], correct: "a",
      explanation: "Decomposition makes problems manageable.",
      wrong: { b: "Speed is about the same.", c: "No such rule.", d: "Not the reason." } }),
    q({ id: "wdq70-2", atom: "a-wd-debug-functions", d: 3, type: "scenario", prompt: "A pipeline of four functions gives the wrong total. What is the fastest way to find the bug?", options: ["Test each function alone with an input whose answer you know", "Rewrite all four", "Read the whole program top to bottom many times", "Add !important"], correct: "a",
      explanation: "The first function that disagrees with your hand calculation holds the bug.",
      wrong: { b: "Rewriting may reintroduce bugs.", c: "Slow and error-prone.", d: "That is CSS." } }),
    q({ id: "wdq70-3", atom: "a-wd-debug-functions", d: 2, prompt: "amount + amount * 7.5 is meant to add 7.5% VAT. What is wrong?", options: ["7.5 percent is amount * 7.5 / 100, not amount * 7.5", "Nothing", "+ should be -", "VAT cannot be calculated"], correct: "a",
      explanation: "A percentage must be divided by 100.",
      wrong: { b: "It adds 750%.", c: "VAT is added.", d: "It can." } }),
    q({ id: "wdq70-4", atom: "a-wd-decomposition", d: 2, prompt: "In receipt = (items) => format(addVat(discount(subtotal(items)))), which runs first?", options: ["subtotal", "format", "addVat", "discount"], correct: "a",
      explanation: "The innermost call runs first; its result feeds the next.",
      wrong: { b: "format runs last.", c: "addVat needs the discounted amount.", d: "discount needs the subtotal." } }),
  ]),
};
