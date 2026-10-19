/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 17 · ARRAYS AND OBJECTS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l71-arrays", [
    q({ id: "wdq71-1", atom: "a-wd-indexing", d: 2, prompt: "In const a = [\"x\", \"y\", \"z\"], what is a[1]?", options: ["\"y\"", "\"x\"", "\"z\"", "undefined"], correct: "a",
      explanation: "Indexes start at 0, so 1 is the second element.",
      wrong: { b: "That is a[0].", c: "That is a[2].", d: "Index 1 exists." } }),
    q({ id: "wdq71-2", atom: "a-wd-array-changes", d: 2, prompt: "Which method removes and returns the FIRST element?", options: ["shift()", "pop()", "push()", "unshift()"], correct: "a",
      explanation: "shift takes from the start; pop takes from the end.",
      wrong: { b: "Removes the last.", c: "Adds to the end.", d: "Adds to the start." } }),
    q({ id: "wdq71-3", atom: "a-wd-length", d: 2, prompt: "How do you read the last element of any array arr?", options: ["arr[arr.length - 1]", "arr[arr.length]", "arr[last]", "arr[-1]"], correct: "a",
      explanation: "The last index is length - 1 (or use arr.at(-1)).",
      wrong: { b: "One past the end: undefined.", c: "last is not defined.", d: "Negative indexes do not work with brackets; at(-1) does." } }),
    q({ id: "wdq71-4", atom: "a-wd-what-arrays", d: 3, prompt: "Can you push into an array declared with const?", options: ["Yes: const stops reassignment of the variable, not changes to the array's contents", "No, never", "Only strings", "Only once"], correct: "a",
      explanation: "const protects the binding, not the array itself.",
      wrong: { b: "push works on const arrays.", c: "Any value can be pushed.", d: "As many times as you like." } }),
  ]),

  ...check("wd-l72-array-methods", [
    q({ id: "wdq72-1", atom: "a-wd-map-filter-reduce", d: 2, prompt: "Which method returns a new array containing only some of the elements?", options: ["filter", "map", "reduce", "forEach"], correct: "a",
      explanation: "filter keeps the elements for which the callback returns true.",
      wrong: { b: "map keeps every element, transformed.", c: "reduce returns one value.", d: "forEach returns undefined." } }),
    q({ id: "wdq72-2", atom: "a-wd-map-filter-reduce", d: 3, prompt: "What is [2, 4, 6].reduce((t, n) => t + n, 10)?", options: ["22", "12", "10", "[12]"], correct: "a",
      explanation: "Starting at 10: 10 + 2 + 4 + 6.",
      wrong: { b: "The start value 10 is included.", c: "The elements are added.", d: "reduce returns one value." } }),
    q({ id: "wdq72-3", atom: "a-wd-find-some-every", d: 2, prompt: "What does find return when no element matches?", options: ["undefined", "null", "An empty array", "false"], correct: "a",
      explanation: "find returns the first match or undefined.",
      wrong: { b: "Not null.", c: "That is what filter would return.", d: "That is what some would return." } }),
    q({ id: "wdq72-4", atom: "a-wd-find-some-every", d: 2, type: "scenario", prompt: "Which method answers \"has every student paid?\"", options: ["every", "some", "map", "find"], correct: "a",
      explanation: "every is true only if the callback is true for all.",
      wrong: { b: "some asks if at least one has.", c: "map transforms.", d: "find returns one element." } }),
  ]),

  ...check("wd-l73-objects", [
    q({ id: "wdq73-1", atom: "a-wd-what-objects", d: 1, prompt: "When should you use an object rather than separate variables?", options: ["When several values describe the same thing", "Never", "Only for numbers", "When you need a loop"], correct: "a",
      explanation: "An object groups related facts under names.",
      wrong: { b: "Objects are fundamental.", c: "They hold any type.", d: "Unrelated." } }),
    q({ id: "wdq73-2", atom: "a-wd-properties-methods", d: 2, prompt: "Inside a method called as cart.total(), what does this refer to?", options: ["The cart object", "The window", "The total function", "Nothing"], correct: "a",
      explanation: "this is the object the method was called on.",
      wrong: { b: "Not when called as a method of cart.", c: "this is not the function.", d: "It refers to cart." } }),
    q({ id: "wdq73-3", atom: "a-wd-dot-bracket", d: 3, prompt: "const field = \"email\"; Which reads user's email property?", options: ["user[field]", "user.field", "user[\"field\"]", "user.(field)"], correct: "a",
      explanation: "Brackets use the variable's value as the key.",
      wrong: { b: "Looks for a property literally called field.", c: "Also looks for \"field\".", d: "Not valid syntax." } }),
    q({ id: "wdq73-4", atom: "a-wd-dot-bracket", d: 2, prompt: "What is { name: \"Ada\" }.age?", options: ["undefined", "null", "0", "An error"], correct: "a",
      explanation: "A missing property reads as undefined.",
      wrong: { b: "Not null.", c: "Not 0.", d: "Reading a missing property is not an error." } }),
  ]),

  ...check("wd-l74-nested-data", [
    q({ id: "wdq74-1", atom: "a-wd-nested-objects", d: 2, prompt: "How do you read the city in { customer: { address: { city: \"Jos\" } } }, stored in order?", options: ["order.customer.address.city", "order.city", "order[city]", "order.address.city"], correct: "a",
      explanation: "Follow each level of nesting.",
      wrong: { b: "city is nested deeper.", c: "Looks for a property named by the variable city.", d: "address is inside customer." } }),
    q({ id: "wdq74-2", atom: "a-wd-nested-objects", d: 3, type: "scenario", prompt: "order.customer.address.city throws \"Cannot read properties of undefined (reading 'city')\". What does that mean?", options: ["address is undefined on this order", "city is misspelled", "order is an array", "The value is null"], correct: "a",
      explanation: "The step before city gave undefined.",
      wrong: { b: "A misspelled final property gives undefined, not an error.", c: "It would fail earlier.", d: "The message says undefined." } }),
    q({ id: "wdq74-3", atom: "a-wd-arrays-of-objects", d: 3, prompt: "What does products.sort((a, b) => a.price - b.price) do?", options: ["Sorts by price, lowest first, changing the products array", "Returns a sorted copy and leaves products alone", "Sorts by name", "Sorts highest first"], correct: "a",
      explanation: "sort works in place; copy with [...products] first if you need the original.",
      wrong: { b: "sort changes the array.", c: "The compare function uses price.", d: "a - b is ascending." } }),
    q({ id: "wdq74-4", atom: "a-wd-arrays-of-objects", d: 2, prompt: "Which chain gives the names of products under ₦5,000?", options: ["products.filter((p) => p.price < 5000).map((p) => p.name)", "products.map((p) => p.name).filter((p) => p.price < 5000)", "products.reduce((p) => p.name)", "products.find((p) => p.price < 5000)"], correct: "a",
      explanation: "Filter the objects first, then map to names.",
      wrong: { b: "After map, the items are strings with no price.", c: "Not how reduce works.", d: "find returns only one product." } }),
  ]),

  ...check("wd-l75-destructure-spread", [
    q({ id: "wdq75-1", atom: "a-wd-destructuring", d: 2, prompt: "After const { price = 0 } = { name: \"Pen\" }, what is price?", options: ["0", "undefined", "\"Pen\"", "An error"], correct: "a",
      explanation: "The default is used when the property is missing.",
      wrong: { b: "The default replaces undefined.", c: "That is name.", d: "Valid." } }),
    q({ id: "wdq75-2", atom: "a-wd-spread-rest", d: 2, prompt: "What does { ...user, city: \"Abuja\" } produce?", options: ["A new object with all of user's properties and city set to Abuja", "user changed in place", "An array", "An error"], correct: "a",
      explanation: "Spread copies; later properties override.",
      wrong: { b: "user is not changed.", c: "It is an object.", d: "Valid." } }),
    q({ id: "wdq75-3", atom: "a-wd-references", d: 3, type: "scenario", prompt: "const b = a; b.push(4); where a was [1, 2, 3]. What is a now?", options: ["[1, 2, 3, 4]", "[1, 2, 3]", "[4]", "An error"], correct: "a",
      explanation: "b and a are two names for the same array.",
      wrong: { b: "No copy was made.", c: "push adds to the existing array.", d: "Valid." } }),
    q({ id: "wdq75-4", atom: "a-wd-references", d: 3, prompt: "Why is { x: 1 } === { x: 1 } false?", options: ["=== compares references, and these are two different objects", "Objects cannot be compared", "The values differ", "=== only works on strings"], correct: "a",
      explanation: "Identical contents, different objects.",
      wrong: { b: "They can be; the result is false.", c: "The values are the same.", d: "It works on any values." } }),
  ]),
};
