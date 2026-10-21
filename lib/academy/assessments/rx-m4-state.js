/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 4 · STATE AND THE REACT RENDERING MODEL
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l24-use-state", [
    q({ id: "rxq24-1", atom: "a-rx-what-state", d: 2, prompt: "Which value should NOT be state?", options: ["A cart total that can be calculated from the items", "The text typed in a search box", "Whether a menu is open", "The selected tab"], correct: "a",
      explanation: "Derived values are calculated during render.",
      wrong: { b: "It changes with user input: state.", c: "It changes with clicks: state.", d: "It changes with clicks: state." } }),
    q({ id: "rxq24-2", atom: "a-rx-usestate-hook", d: 2, prompt: "When is the argument to useState(initial) used?", options: ["Only on the component's first render", "On every render", "Whenever the setter is called", "Never"], correct: "a",
      explanation: "After that, React returns the stored value.",
      wrong: { b: "Later renders ignore it.", c: "The setter's argument is used then.", d: "It is used once." } }),
    q({ id: "rxq24-3", atom: "a-rx-usestate-hook", d: 3, prompt: "Why must useState not be called inside an if?", options: ["React identifies each Hook by its call order, which must be the same on every render", "if statements are not allowed in components", "It makes the state global", "It is fine"], correct: "a",
      explanation: "Hooks at the top level, always in the same order.",
      wrong: { b: "ifs are allowed, just not around Hooks.", c: "Unrelated.", d: "It breaks state." } }),
    q({ id: "rxq24-4", atom: "a-rx-update-correctly", d: 3, prompt: "A component calls setOpen(false) in its body, outside any handler. What happens?", options: ["\"Too many re-renders\": every render triggers another", "The menu closes once", "Nothing", "The page reloads"], correct: "a",
      explanation: "Setters belong in events and effects.",
      wrong: { b: "It loops.", c: "It loops.", d: "No reload." } }),
  ]),

  ...check("rx-l25-render-snapshot", [
    q({ id: "rxq25-1", atom: "a-rx-why-render", d: 2, prompt: "What are the three steps of a React update, in order?", options: ["Trigger, render, commit", "Render, trigger, commit", "Commit, render, trigger", "Fetch, paint, reload"], correct: "a",
      explanation: "A setter triggers; React calls the component; then updates the DOM.",
      wrong: { b: "The trigger comes first.", c: "Commit is last.", d: "Not React's model." } }),
    q({ id: "rxq25-2", atom: "a-rx-snapshot", d: 3, prompt: "count is 0. A click runs setCount(count + 1) three times. What is count after the re-render?", options: ["1", "3", "0", "An error"], correct: "a",
      explanation: "All three read the same snapshot, 0.",
      wrong: { b: "That needs the functional form.", c: "It changes to 1.", d: "Valid." } }),
    q({ id: "rxq25-3", atom: "a-rx-snapshot", d: 2, prompt: "Right after setName(\"Tunde\") in a handler, console.log(name) prints…", options: ["The old name: this render's snapshot", "Tunde", "undefined", "Both"], correct: "a",
      explanation: "The new value arrives in the next render.",
      wrong: { b: "Not yet.", c: "It has a value.", d: "One value." } }),
    q({ id: "rxq25-4", atom: "a-rx-functional-updates", d: 2, prompt: "Which update adds 1 to the latest pending value, even if called several times?", options: ["setCount((c) => c + 1)", "setCount(count + 1)", "count++", "setCount(count) + 1"], correct: "a",
      explanation: "The functional form receives the latest queued value.",
      wrong: { b: "Reads the snapshot.", c: "Mutates a local copy.", d: "Meaningless." } }),
  ]),

  ...check("rx-l26-immutable", [
    q({ id: "rxq26-1", atom: "a-rx-immutable-updates", d: 2, prompt: "Which removes the item with id 3 from items, immutably?", options: ["setItems(items.filter((i) => i.id !== 3))", "items.splice(idx, 1); setItems(items)", "delete items[2]", "items.pop()"], correct: "a",
      explanation: "filter returns a new array.",
      wrong: { b: "splice mutates.", c: "Mutates and leaves a hole.", d: "Mutates, and removes the last item." } }),
    q({ id: "rxq26-2", atom: "a-rx-immutable-updates", d: 3, prompt: "Which updates profile.address.city immutably?", options: ["setProfile({ ...profile, address: { ...profile.address, city: \"Abuja\" } })", "profile.address.city = \"Abuja\"; setProfile(profile)", "setProfile({ ...profile, city: \"Abuja\" })", "setProfile(profile.address.city = \"Abuja\")"], correct: "a",
      explanation: "Copy each level down to the change.",
      wrong: { b: "Mutation; same object, no render.", c: "Adds city at the wrong level.", d: "Mutates and passes a string." } }),
    q({ id: "rxq26-3", atom: "a-rx-no-mutation", d: 3, prompt: "items.push(x); setItems(items). Why does the screen not update?", options: ["It is the same array, so React sees no change and skips the render", "push is not allowed in React", "setItems only accepts strings", "It does update"], correct: "a",
      explanation: "Object.is(old, new) is true.",
      wrong: { b: "It runs; it is just a mutation.", c: "It accepts anything.", d: "It does not." } }),
    q({ id: "rxq26-4", atom: "a-rx-no-mutation", d: 2, prompt: "How do you sort state without mutating it?", options: ["setItems([...items].sort(compare))", "setItems(items.sort(compare))", "items.sort(compare)", "items.reverse()"], correct: "a",
      explanation: "Sort a copy (or use toSorted).",
      wrong: { b: "sort mutates the original.", c: "Mutation with no setter.", d: "Mutation." } }),
  ]),

  ...check("rx-l27-lifting", [
    q({ id: "rxq27-1", atom: "a-rx-lifting-state", d: 2, prompt: "Two sibling components must share a selected id. Where should the state live?", options: ["In their closest common parent, passed down as props", "In each sibling, kept in sync", "In a global variable", "In the URL only"], correct: "a",
      explanation: "Lift it to the common parent.",
      wrong: { b: "Two copies will disagree.", c: "Globals do not re-render.", d: "Possible later (Module 8), but lifting is the basic answer." } }),
    q({ id: "rxq27-2", atom: "a-rx-lifting-state", d: 2, prompt: "How does a child tell its parent something happened?", options: ["By calling a function the parent passed as a prop, such as onToggle", "By changing its props", "By setting the parent's state variable directly", "It cannot"], correct: "a",
      explanation: "Data down, events up.",
      wrong: { b: "Props are read-only.", c: "It has no access to it.", d: "Callbacks do it." } }),
    q({ id: "rxq27-3", atom: "a-rx-controlled-derived", d: 2, prompt: "What makes an input controlled?", options: ["Its value comes from state and onChange updates that state", "It has an id", "It is inside a form", "It has a placeholder"], correct: "a",
      explanation: "State is the single source of truth.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "rxq27-4", atom: "a-rx-controlled-derived", d: 3, prompt: "count holds \"5\" from a number input. What is count * 2 + count?", options: ["\"105\"", "15", "10", "NaN"], correct: "a",
      explanation: "count * 2 is 10, then 10 + \"5\" joins to \"105\". Convert with Number().",
      wrong: { b: "Needs Number(count).", c: "The + joins.", d: "* converts, so not NaN." } }),
  ]),

  ...check("rx-l28-identity", [
    q({ id: "rxq28-1", atom: "a-rx-identity-reset", d: 3, prompt: "How do you reset a component's state when the user switches to another record?", options: ["Give it key={record.id}", "Call useState again", "Reload the page", "Use a different variable name"], correct: "a",
      explanation: "A new key is a new instance with fresh state.",
      wrong: { b: "Hooks cannot be re-called.", c: "Loses everything.", d: "Names do not affect identity." } }),
    q({ id: "rxq28-2", atom: "a-rx-identity-reset", d: 2, prompt: "When does React keep a component's state between renders?", options: ["When the same component type renders at the same position in the tree", "Always, forever", "Only if it has a key", "Never"], correct: "a",
      explanation: "Position and type (and key) define identity.",
      wrong: { b: "Removed components lose state.", c: "Keys are optional.", d: "That is the whole point of state." } }),
    q({ id: "rxq28-3", atom: "a-rx-redundant-state", d: 2, prompt: "Why store selectedId instead of a copy of the selected object?", options: ["There is one copy of the data, so edits to the item also update the selection", "Ids are faster to type", "Objects cannot be state", "React requires numbers"], correct: "a",
      explanation: "Duplicates go stale.",
      wrong: { b: "Not the reason.", c: "They can.", d: "Not required." } }),
    q({ id: "rxq28-4", atom: "a-rx-render-cycles", d: 2, prompt: "State changes in a component. Which components re-render by default?", options: ["That component and all its descendants", "Only that component", "The whole app", "Only components whose props changed"], correct: "a",
      explanation: "Re-renders flow down from where state lives.",
      wrong: { b: "Its children render too.", c: "Parents and siblings do not.", d: "By default, children render regardless (memo changes that, Module 14)." } }),
  ]),

  ...check("rx-l29-m4-project", [
    q({ id: "rxq29-1", atom: "a-rx-m4-project", d: 2, prompt: "In the task manager, how is \"marking a task done\" written?", options: ["setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))", "tasks[i].done = true", "setTasks(tasks)", "tasks.push(done)"], correct: "a",
      explanation: "A new array with a new object for the changed task.",
      wrong: { b: "Mutation.", c: "Same array.", d: "Meaningless." } }),
    q({ id: "rxq29-2", atom: "a-rx-m4-project", d: 2, prompt: "Why is \"N tasks left\" not state?", options: ["It is derived from the tasks array on every render", "Numbers cannot be state", "It never changes", "It is a prop"], correct: "a",
      explanation: "Derive, do not store.",
      wrong: { b: "They can.", c: "It changes, but follows the tasks.", d: "It is calculated." } }),
    q({ id: "rxq29-3", atom: "a-rx-m4-project", d: 3, prompt: "You delete a task, but the list keeps showing it until you click a filter. What is the most likely bug?", options: ["The delete mutated the array instead of creating a new one", "The key is wrong", "The filter is wrong", "React is slow"], correct: "a",
      explanation: "Mutation: React skipped the render; the next unrelated render showed the change.",
      wrong: { b: "Keys do not stop renders.", c: "The filter did not run because nothing re-rendered.", d: "Not slowness." } }),
    q({ id: "rxq29-4", atom: "a-rx-m4-project", d: 2, prompt: "Which state does the task manager need?", options: ["The tasks array and the current filter (plus the text being edited)", "The tasks, the filter, the visible tasks and the count", "Only the count", "One state variable per task"], correct: "a",
      explanation: "The visible list and the count are derived.",
      wrong: { b: "Visible tasks and count are calculated.", c: "Not enough.", d: "Use one array." } }),
  ]),
};
