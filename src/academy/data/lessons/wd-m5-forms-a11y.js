/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 5 · FORMS AND ACCESSIBILITY
 *
 * Curriculum 5.1 – 5.12. Forms from the first input to native validation,
 * then the accessibility every form and page must have: keyboard use,
 * accessible names, how screen readers read a page, and the mistakes that
 * lock people out. The labs submit real forms in the browser: the checks
 * prove an empty required form is blocked and a complete one goes through.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s5-forms";

const HEAD = (title) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>`;

const INPUTS_START = `${HEAD("Create an account")}
<body>
  <main>
    <h1>Create an account</h1>
    <form action="/register" method="post">
      <input name="fullname" placeholder="Full name">

      <input name="email" placeholder="Email address">

      <input name="password" placeholder="Password">

      <input name="age" placeholder="Age">

      <input name="dob" placeholder="Date of birth">

      <button type="submit">Create account</button>
    </form>
  </main>
</body>
</html>
`;

const INPUTS_DONE = `${HEAD("Create an account")}
<body>
  <main>
    <h1>Create an account</h1>
    <form action="/register" method="post">
      <label for="fullname">Full name</label>
      <input id="fullname" name="fullname" type="text" autocomplete="name">

      <label for="email">Email address</label>
      <input id="email" name="email" type="email" autocomplete="email" placeholder="you@example.com">

      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="new-password">

      <label for="age">Age</label>
      <input id="age" name="age" type="number">

      <label for="dob">Date of birth</label>
      <input id="dob" name="dob" type="date">

      <button type="submit">Create account</button>
    </form>
  </main>
</body>
</html>
`;

const CHOICES_START = `${HEAD("Book a class")}
<body>
  <main>
    <h1>Book a coding class</h1>
    <form action="/book" method="post">
      <p>Which class?</p>
      <!-- Three radio buttons: html, css, javascript. Only one can be chosen. -->

      <!-- A checkbox, named newsletter, labelled "Send me the monthly newsletter" -->

      <!-- A select menu, named campus, with options Yaba, Ikeja and Lekki -->

      <!-- A text area, named notes, labelled "Anything we should know?" -->

      <!-- A submit button and a reset button -->
    </form>
  </main>
</body>
</html>
`;

const CHOICES_DONE = `${HEAD("Book a class")}
<body>
  <main>
    <h1>Book a coding class</h1>
    <form action="/book" method="post">
      <p>Which class?</p>
      <input type="radio" id="c-html" name="class" value="html">
      <label for="c-html">HTML</label>
      <input type="radio" id="c-css" name="class" value="css">
      <label for="c-css">CSS</label>
      <input type="radio" id="c-js" name="class" value="javascript">
      <label for="c-js">JavaScript</label>

      <input type="checkbox" id="newsletter" name="newsletter" value="yes">
      <label for="newsletter">Send me the monthly newsletter</label>

      <label for="campus">Campus</label>
      <select id="campus" name="campus">
        <option value="yaba">Yaba</option>
        <option value="ikeja">Ikeja</option>
        <option value="lekki">Lekki</option>
      </select>

      <label for="notes">Anything we should know?</label>
      <textarea id="notes" name="notes" rows="4"></textarea>

      <button type="submit">Book my place</button>
      <button type="reset">Clear the form</button>
    </form>
  </main>
</body>
</html>
`;

const VALID_START = `${HEAD("Volunteer sign-up")}
<body>
  <!-- Add a skip link here -->
  <header>
    <nav aria-label="Main">
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="events.html">Events</a></li>
        <li><a href="donate.html">Donate</a></li>
      </ul>
    </nav>
  </header>

  <main id="main">
    <h1>Volunteer at the food bank</h1>
    <form action="/volunteer" method="post">
      <label for="name">Full name</label>
      <input id="name" name="name" type="text">

      <label for="email">Email</label>
      <input id="email" name="email" type="email">

      <label for="hours">Hours per month (2 to 40)</label>
      <input id="hours" name="hours" type="number">

      <p>Preferred day</p>
      <input type="radio" id="sat" name="day" value="saturday">
      <label for="sat">Saturday</label>
      <input type="radio" id="sun" name="day" value="sunday">
      <label for="sun">Sunday</label>

      <button type="submit" tabindex="5">Sign me up</button>
    </form>
  </main>
</body>
</html>
`;

const VALID_DONE = `${HEAD("Volunteer sign-up")}
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <header>
    <nav aria-label="Main">
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="events.html">Events</a></li>
        <li><a href="donate.html">Donate</a></li>
      </ul>
    </nav>
  </header>

  <main id="main">
    <h1>Volunteer at the food bank</h1>
    <form action="/volunteer" method="post">
      <label for="name">Full name</label>
      <input id="name" name="name" type="text" required>

      <label for="email">Email</label>
      <input id="email" name="email" type="email" required>

      <label for="hours">Hours per month (2 to 40)</label>
      <input id="hours" name="hours" type="number" min="2" max="40" required>

      <fieldset>
        <legend>Preferred day</legend>
        <input type="radio" id="sat" name="day" value="saturday" required>
        <label for="sat">Saturday</label>
        <input type="radio" id="sun" name="day" value="sunday">
        <label for="sun">Sunday</label>
      </fieldset>

      <button type="submit">Sign me up</button>
    </form>
  </main>
</body>
</html>
`;

const A11Y_START = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ade's Phone Repairs</title>
</head>
<body>
  <header>
    <img src="images/logo.svg" width="240" height="80">
    <button class="menu">☰</button>
  </header>
  <main>
    <h1>Cracked screen? Fixed today.</h1>
    <img src="images/product.jpg" width="400" height="400">
    <p>We repair all major brands in under two hours. For prices <a href="prices.html">click here</a>.</p>

    <form action="/quote" method="post">
      <input type="tel" name="phone" placeholder="Your phone number">
      <button type="submit">Get a quote</button>
    </form>
  </main>
</body>
</html>
`;

const A11Y_DONE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ade's Phone Repairs</title>
</head>
<body>
  <header>
    <img src="images/logo.svg" width="240" height="80" alt="Ade's Phone Repairs">
    <button class="menu" aria-label="Open menu">☰</button>
  </header>
  <main>
    <h1>Cracked screen? Fixed today.</h1>
    <img src="images/product.jpg" width="400" height="400" alt="A smartphone with a newly replaced, uncracked screen">
    <p>We repair all major brands in under two hours. <a href="prices.html">See our repair prices</a>.</p>

    <form action="/quote" method="post">
      <label for="phone">Your phone number</label>
      <input type="tel" id="phone" name="phone" autocomplete="tel">
      <button type="submit">Get a quote</button>
    </form>
  </main>
</body>
</html>
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 5.1 – 5.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l16-form-inputs",
    moduleId: "wd-m5-forms-a11y",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2", "5.3"],
    title: "Forms, Input Types and Labels",
    subtitle: "How a form sends data, the right input for each kind of answer, and labels that never disappear",
    estimatedMinutes: 19,
    intro:
      "Forms are how a website listens: sign-ups, searches, orders, payments. A badly built form loses customers at the last step. This lesson builds one properly, starting with the parts that matter most and are most often skipped.",

    atoms: [
      {
        id: "a-wd-forms-intro",
        title: "Understanding HTML forms",
        explain:
          "A <form> groups the fields a visitor fills in. When it is submitted, the browser collects every field that has a name and sends name=value pairs to the URL in action, using the method: GET adds them to the URL (right for searches you might bookmark), POST sends them in the body of the request (right for anything that changes data or is private, such as a password). A field with no name is never sent.",
        example:
          "<form action=\"/search\" method=\"get\">\n  <input name=\"q\" type=\"search\">\n  <button type=\"submit\">Search</button>\n</form>\n\nTyping \"jollof\" and submitting requests:\n  /search?q=jollof\n\nThe same form with method=\"post\" sends q=jollof in the request body instead.",
        mistake: "Forgetting the name attribute. The field looks fine and works on screen, and its value is silently left out of what is sent.",
      },
      {
        id: "a-wd-input-types",
        title: "Text, email, password, number and date inputs",
        explain:
          "The type attribute changes what an <input> is. On phones it changes the keyboard: type=\"email\" shows an @ key, type=\"tel\" a number pad. type=\"password\" hides what is typed. type=\"number\" accepts only numbers and adds arrows. type=\"date\" opens a date picker. The browser also checks the format of email and number fields for you when the form is submitted.",
        table: {
          caption: "Choosing an input type.",
          headers: ["type", "For", "Bonus"],
          rows: [
            ["text", "Names, short answers", "The default"],
            ["email", "Email addresses", "@ keyboard; format is checked"],
            ["password", "Passwords", "Characters hidden"],
            ["number", "Quantities, ages", "Number keyboard; min, max and step"],
            ["tel", "Phone numbers", "Dial pad (phone numbers are not maths, so not number)"],
            ["date", "Dates", "A date picker"],
            ["search", "Search boxes", "A clear button on some browsers"],
          ],
        },
        why: "The right type saves the visitor effort and prevents mistakes before they are made, and the right autocomplete value (name, email, tel, new-password) lets their browser fill the form in one tap.",
      },
      {
        id: "a-wd-labels",
        title: "Labels and placeholders",
        explain:
          "Every input needs a <label>. Connect them with for on the label matching id on the input. The label is the field's accessible name, read aloud by screen readers, and clicking it focuses the field, which makes small checkboxes much easier to tap. A placeholder is not a label: it disappears as soon as someone types, is often too pale to read, and is not reliably announced. Use it only for an example of the format.",
        example:
          "<label for=\"email\">Email address</label>\n<input id=\"email\" name=\"email\" type=\"email\" placeholder=\"you@example.com\">\n         ▲ id matches for ▲",
        webLab: {
          task:
            "This sign-up form uses placeholders instead of labels and gives every field the default text type. Give each input an id and a matching <label>, and the right type: text for the name, email, password, number for the age and date for the date of birth. You may keep a placeholder as an example, but every field must have a real label.",
          files: { "index.html": INPUTS_START },
          tests: [
            {
              label: "Every input has a visible label connected with for and id",
              check: "const ins = $$('form input'); return ins.length === 5 && ins.every((i) => i.labels && i.labels.length === 1 && text(i.labels[0]).length > 1);",
              fail: "Each of the five inputs needs an id, and a <label for=\"…\"> with the same value.",
            },
            {
              label: "The email field is type=\"email\"",
              check: "return $('input[name=email]')?.type === 'email';",
              fail: "Set type=\"email\" on the email input.",
            },
            {
              label: "The password field hides what is typed",
              check: "return $('input[name=password]')?.type === 'password';",
              fail: "Set type=\"password\" on the password input.",
            },
            {
              label: "Age is a number and date of birth is a date",
              check: "return $('input[name=age]')?.type === 'number' && $('input[name=dob]')?.type === 'date';",
              fail: "Use type=\"number\" for age and type=\"date\" for date of birth.",
            },
            {
              label: "Every field still has its name, so it is sent",
              check: "return ['fullname','email','password','age','dob'].every((n) => !!$(`input[name=${n}]`));",
              fail: "Keep each input's name attribute; without it the value is never sent.",
            },
          ],
          solution: { "index.html": INPUTS_DONE },
          hint: "For each field: <label for=\"email\">Email address</label> then <input id=\"email\" name=\"email\" type=\"email\">.",
          successMessage:
            "Click a label in the preview: the field gets focus. Every field now has a name that is read aloud, and phones will show the right keyboard for each one.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · 5.4 – 5.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l17-form-choices",
    moduleId: "wd-m5-forms-a11y",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.4", "5.5", "5.6"],
    title: "Choices, Menus, Text Areas and Buttons",
    subtitle: "Radio buttons, checkboxes, select menus, longer answers and the buttons that send them",
    estimatedMinutes: 18,
    intro:
      "Not every answer is typed. Choosing one option, ticking several, picking from a long list or writing a paragraph each has its own control, and each is easy to build in a way that quietly sends the wrong data.",

    atoms: [
      {
        id: "a-wd-radio-checkbox",
        title: "Radio buttons and checkboxes",
        explain:
          "Radio buttons are for choosing exactly one option from a few. They belong to the same group when they share the same name; each has its own value, which is what is sent. Checkboxes are for yes or no, or for choosing any number of options. Every radio and checkbox needs its own label. Add checked to pre-select one.",
        example:
          "<input type=\"radio\" id=\"c-html\" name=\"class\" value=\"html\">\n<label for=\"c-html\">HTML</label>\n<input type=\"radio\" id=\"c-css\" name=\"class\" value=\"css\">\n<label for=\"c-css\">CSS</label>\n\nSends:  class=css     (only the chosen one)\n\n<input type=\"checkbox\" id=\"news\" name=\"newsletter\" value=\"yes\">\n<label for=\"news\">Send me the newsletter</label>\n\nSends:  newsletter=yes   if ticked; nothing at all if not",
        mistake: "Giving each radio button a different name. They stop being a group, so a visitor can select all of them.",
      },
      {
        id: "a-wd-select-textarea",
        title: "Select menus and text areas",
        explain:
          "A <select> shows a drop-down list of <option>s, good for choosing one item from a longer list such as a state or a campus; each option's value is what is sent. A <textarea> is for multi-line answers such as comments, sized with rows. Unlike input, textarea has a closing tag, and any text between the tags becomes its starting value, so leave it empty.",
        example:
          "<label for=\"campus\">Campus</label>\n<select id=\"campus\" name=\"campus\">\n  <option value=\"yaba\">Yaba</option>\n  <option value=\"ikeja\">Ikeja</option>\n</select>\n\n<label for=\"notes\">Anything we should know?</label>\n<textarea id=\"notes\" name=\"notes\" rows=\"4\"></textarea>",
      },
      {
        id: "a-wd-buttons",
        title: "Submit and reset buttons",
        explain:
          "<button type=\"submit\"> sends the form; its text should say what happens (\"Book my place\" beats \"Submit\"). <button type=\"reset\"> clears every field back to its starting value, so use it rarely and never next to submit without a clear label, because a mis-tap wipes the visitor's work. A button inside a form with no type is a submit button, so a button meant to do something else needs type=\"button\".",
        webLab: {
          task:
            "Build the class booking form where the comments are: three radio buttons named class (values html, css and javascript) so only one can be chosen; a checkbox named newsletter; a select named campus with Yaba, Ikeja and Lekki; a text area named notes; a submit button and a reset button. Every control needs a label.",
          files: { "index.html": CHOICES_START },
          tests: [
            {
              label: "Three radio buttons share the name class, with values html, css and javascript",
              check: "const r = $$('input[type=radio][name=class]'); return r.length === 3 && ['html','css','javascript'].every((v) => r.some((x) => x.value === v));",
              fail: "Add three type=\"radio\" inputs, all with name=\"class\", and values html, css and javascript.",
            },
            {
              label: "Only one class can be selected at a time",
              check: "const r = $$('input[type=radio][name=class]'); await click(r[0]); await click(r[2]); return !r[0].checked && r[2].checked;",
              fail: "Selecting one class does not unselect another. All three radios need the same name.",
            },
            {
              label: "There is a newsletter checkbox",
              check: "return $('input[type=checkbox][name=newsletter]') !== null;",
              fail: "Add <input type=\"checkbox\" name=\"newsletter\" …>.",
            },
            {
              label: "A select named campus offers Yaba, Ikeja and Lekki",
              check: "const s = $('select[name=campus]'); const o = s ? [...s.options].map((x) => x.textContent.trim()) : []; return ['Yaba','Ikeja','Lekki'].every((n) => o.includes(n));",
              fail: "Add a <select name=\"campus\"> with three <option>s: Yaba, Ikeja and Lekki.",
            },
            {
              label: "A text area named notes, starting empty",
              check: "const t = $('textarea[name=notes]'); return !!t && t.value === '';",
              fail: "Add <textarea name=\"notes\"></textarea>, with nothing between the tags.",
            },
            {
              label: "Every radio, checkbox, select and text area has a label",
              check: "return $$('form input, form select, form textarea').every((c) => c.labels && c.labels.length > 0);",
              fail: "One of the controls has no label. Give each one an id and a <label for> to match.",
            },
            {
              label: "There is a submit button and a reset button",
              check: "return !!$('button[type=submit], input[type=submit]') && !!$('button[type=reset], input[type=reset]');",
              fail: "Add <button type=\"submit\"> and <button type=\"reset\">.",
            },
          ],
          solution: { "index.html": CHOICES_DONE },
          hint: "A radio group is several inputs with the SAME name and DIFFERENT values. Labels for radios work just like labels for text inputs.",
          successMessage:
            "Try it in the preview: one class at a time, a newsletter you can tick by clicking its label, and Reset clearing everything. Press the submit button and the preview shows what the form would send.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · 5.7 – 5.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l18-validation-keyboard",
    moduleId: "wd-m5-forms-a11y",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.7", "5.8", "5.9"],
    title: "Native Validation, Fieldsets and the Keyboard",
    subtitle: "Letting the browser check answers, grouping related fields, and forms that work without a mouse",
    estimatedMinutes: 20,
    intro:
      "HTML can check many answers before a form is sent, with no JavaScript at all. It can also group fields so their question is announced, and make a whole page usable from the keyboard, which is how many people with motor disabilities, and most power users, actually browse.",

    atoms: [
      {
        id: "a-wd-native-validation",
        title: "Required fields and native validation",
        explain:
          "Add required to any field that must be filled in, and the browser refuses to submit the form until it is, showing a message beside the first problem. type=\"email\" checks the format; min and max limit numbers; minlength and maxlength limit text; pattern checks text against a regular expression. On a radio group, required on one of the radios makes choosing one compulsory. This is the first line of checking, not the last: Module 22 explains why the server must always check again.",
        table: {
          caption: "Native validation attributes.",
          headers: ["Attribute", "Example", "Blocks submission when"],
          rows: [
            ["required", "<input required>", "The field is empty"],
            ["type=\"email\"", "<input type=\"email\">", "The text is not shaped like an email"],
            ["min / max", "<input type=\"number\" min=\"2\" max=\"40\">", "The number is outside the range"],
            ["minlength", "<input minlength=\"8\">", "The text is too short"],
            ["pattern", "<input pattern=\"[0-9]{11}\">", "The text does not match (here: exactly 11 digits)"],
          ],
        },
        why: "Native validation is free, works without JavaScript, is translated into the visitor's language and is announced by screen readers.",
      },
      {
        id: "a-wd-fieldset-legend",
        title: "Grouping fields with fieldset and legend",
        explain:
          "A <fieldset> groups related controls, and its <legend> is the group's question. This matters most for radio buttons and checkboxes: on their own a screen reader hears only \"Saturday, radio button\"; inside a fieldset it hears \"Preferred day, group. Saturday, radio button\". Fieldsets also help split long forms into sections, such as Personal details and Delivery address.",
        example:
          "<fieldset>\n  <legend>Preferred day</legend>\n  <input type=\"radio\" id=\"sat\" name=\"day\" value=\"saturday\">\n  <label for=\"sat\">Saturday</label>\n  <input type=\"radio\" id=\"sun\" name=\"day\" value=\"sunday\">\n  <label for=\"sun\">Sunday</label>\n</fieldset>",
      },
      {
        id: "a-wd-keyboard",
        title: "Keyboard navigation",
        explain:
          "Everything on a page must work with a keyboard alone. Tab moves forward through links, buttons and fields, Shift+Tab goes back, Enter follows links and presses buttons, Space ticks checkboxes and arrow keys move between radios. Native elements do all of this automatically. Two rules keep it working: tab order follows the HTML order, so never use a positive tabindex to rearrange it; and provide a skip link, the first link on the page, that jumps past the navigation to the main content.",
        example:
          "<body>\n  <a class=\"skip-link\" href=\"#main\">Skip to main content</a>\n  <header> …20 navigation links… </header>\n  <main id=\"main\"> … </main>\n\nCSS (Phase 2) hides the skip link until it receives focus.",
        webLab: {
          task:
            "Make this volunteer form check itself and work well from the keyboard. Make name, email, hours and the preferred day required; limit hours to between 2 and 40; group the day radios in a fieldset with the legend Preferred day (replacing the paragraph); remove the tabindex from the button; and add a skip link to #main as the very first element in the body.",
          files: { "index.html": VALID_START },
          tests: [
            {
              label: "Name, email, hours and the day choice are required",
              check: "return ['#name', '#email', '#hours'].every((s) => $(s)?.required) && $$('input[name=day]').some((r) => r.required);",
              fail: "Add the required attribute to the name, email and hours inputs, and to one of the day radios.",
            },
            {
              label: "Hours must be between 2 and 40",
              check: "const h = $('#hours'); return h?.min === '2' && h?.max === '40';",
              fail: "Add min=\"2\" and max=\"40\" to the hours input.",
            },
            {
              label: "An empty form cannot be submitted",
              check: "await submit('form'); return submissions().length === 0;",
              fail: "The empty form was sent. Required fields stop that.",
            },
            {
              label: "Hours of 100 are rejected",
              check: "await type('#name', 'Ngozi Eze'); await type('#email', 'ngozi@example.com'); await type('#hours', '100'); await choose('#sat'); await submit('form'); return submissions().length === 0;",
              fail: "100 hours was accepted. Set max=\"40\".",
            },
            {
              label: "A complete, valid form is submitted",
              check: "await type('#hours', '12'); await submit('form'); return submissions().length === 1 && submissions()[0].day === 'saturday';",
              fail: "A correct form was not submitted. Check each field still has its name, and that nothing else is required.",
            },
            {
              label: "The day radios are grouped in a fieldset with the legend Preferred day",
              check: "const f = $$('fieldset').find((x) => x.querySelector('input[name=day]')); return !!f && text(f.querySelector('legend')) === 'Preferred day' && f.querySelectorAll('input[name=day]').length === 2;",
              fail: "Wrap both day radios and their labels in <fieldset>, with <legend>Preferred day</legend> first.",
            },
            {
              label: "No positive tabindex rearranges the tab order",
              check: "return $$('[tabindex]').every((e) => Number(e.getAttribute('tabindex')) <= 0);",
              fail: "Remove tabindex=\"5\" from the button. Tab order should follow the HTML.",
            },
            {
              label: "The first element in the body is a skip link to #main",
              check: "const first = document.body.firstElementChild; return first?.tagName === 'A' && first.getAttribute('href') === '#main' && /skip/i.test(text(first));",
              fail: "Add <a href=\"#main\">Skip to main content</a> as the first element inside <body>.",
            },
          ],
          solution: { "index.html": VALID_DONE },
          hint: "required and min/max are attributes on the inputs. For the fieldset, the radios and their labels go between <fieldset><legend>…</legend> and </fieldset>.",
          successMessage:
            "The browser itself now refuses an empty form and an impossible number, the radios announce their question, and a keyboard user can skip the menu with one key press. Click into the preview and press Tab to try it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 5.10 – 5.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l19-accessibility",
    moduleId: "wd-m5-forms-a11y",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.10", "5.11", "5.12"],
    title: "Accessible Names, Screen Readers and Common Mistakes",
    subtitle: "What assistive technology needs from every element, and the errors that lock people out",
    estimatedMinutes: 20,
    intro:
      "About one in six people lives with a significant disability. Many browse with a screen reader, a magnifier, voice control or a keyboard alone. Accessibility is not a feature added at the end; it is mostly the HTML you have already learned, used correctly. This lesson pulls it together.",

    atoms: [
      {
        id: "a-wd-accessible-names",
        title: "Accessible names and alternative text",
        explain:
          "Every interactive element and every meaningful image needs an accessible name: the words assistive technology uses for it. A link's or button's name is its text. An input's name comes from its label. An image's name is its alt. When a button shows only an icon (☰, ✕, a magnifying glass), it has no text, so give it one with aria-label=\"Open menu\". If you can see a name on screen, prefer that visible text, so voice-control users can say what they see.",
        table: {
          caption: "Where each element's accessible name comes from.",
          headers: ["Element", "Name comes from", "Example"],
          rows: [
            ["Link, button", "Its text content", "<button>Get a quote</button>"],
            ["Icon-only button", "aria-label", "<button aria-label=\"Close\">✕</button>"],
            ["Input, select, textarea", "Its <label>", "<label for=\"phone\">Phone</label>"],
            ["Image", "alt", "<img alt=\"Cracked phone screen\">"],
            ["Image inside a link", "The image's alt", "<a href=\"/\"><img alt=\"Home\"></a>"],
          ],
        },
      },
      {
        id: "a-wd-screen-readers",
        title: "Introduction to screen readers",
        explain:
          "A screen reader turns the page into speech or braille. It reads the HTML, not the pixels: element types, names, states and structure. Users rarely listen top to bottom; they jump by headings, landmarks, links or form fields. Every phone and computer has one free: VoiceOver on iPhone and Mac, TalkBack on Android, Narrator on Windows, and the free NVDA for Windows. Try one on your own page once a week; five minutes teaches more than any checklist.",
        example:
          "<button aria-label=\"Open menu\">☰</button>   →  \"Open menu, button\"\n<button>☰</button>                         →  \"button\"  (useless)\n<a href=\"prices.html\">click here</a>       →  \"click here, link\"\n<h2>Our prices</h2>                         →  \"Our prices, heading level 2\"\n<input type=\"checkbox\" checked> + label     →  \"Send me the newsletter, checkbox, checked\"",
        decision: {
          scenario:
            "A screen-reader user opens your product page and asks for the list of headings. They hear: \"Welcome\", \"Click here\", \"Products\". They want the delivery information.",
          question: "What is the most useful fix?",
          options: [
            {
              id: "a",
              text: "Give the delivery section a real heading, such as <h2>Delivery and returns</h2>, so it appears in the list",
              why: "Screen-reader users navigate by headings. A section without one is invisible in that list, so they have to listen to the whole page to find it.",
            },
            {
              id: "b",
              text: "Make the delivery text larger and bold",
              whyWrong: "Size and weight are visual. The screen reader still has no heading to jump to.",
            },
            {
              id: "c",
              text: "Move the delivery text to the top of the page",
              whyWrong: "It might help this page by accident, but the structure is still wrong and the next page will have the same problem.",
            },
            {
              id: "d",
              text: "Add an image of the delivery information",
              whyWrong: "That makes it harder to reach, not easier.",
            },
          ],
          correct: "a",
          aftermath: "Good structure for screen readers is the same thing as good structure for everyone who scans a page, which is almost everyone.",
        },
      },
      {
        id: "a-wd-a11y-mistakes",
        title: "Common HTML accessibility mistakes",
        explain:
          "The same few mistakes cause most accessibility failures, and the WebAIM survey of the top million homepages finds them on nearly every site every year. All of them are fixed in HTML.",
        table: {
          caption: "The usual failures and their fixes.",
          headers: ["Mistake", "Fix"],
          rows: [
            ["Images with no alt", "Add descriptive alt, or alt=\"\" if decorative"],
            ["Inputs with only a placeholder", "Add a <label>"],
            ["Icon-only buttons with no name", "Add aria-label"],
            ["Vague link text: \"click here\", \"read more\"", "Describe the destination"],
            ["No lang on <html>", "<html lang=\"en\">"],
            ["Low-contrast text", "Darker text or lighter background (Module 12)"],
            ["Divs used as buttons", "Use <button>"],
          ],
        },
        webLab: {
          task:
            "This repair shop's page fails five of the checks a screen-reader user depends on. Fix them all: set the page's language; give both images alt text (the logo's alt is the shop's name); give the icon-only menu button an accessible name with aria-label; replace \"click here\" with link text that describes the destination; and give the phone input a real label.",
          files: { "index.html": A11Y_START },
          tests: [
            {
              label: "The page declares its language",
              check: "return document.documentElement.lang === 'en';",
              fail: "Add lang=\"en\" to the <html> tag.",
            },
            {
              label: "Every image has alt text, and the logo's alt names the shop",
              check: "const imgs = $$('img'); return imgs.length === 2 && imgs.every((i) => i.hasAttribute('alt') && i.alt.trim().length > 2) && /ade/i.test($('header img').alt);",
              fail: "Give both images alt text. The logo's alt should be the shop's name, Ade's Phone Repairs.",
            },
            {
              label: "The menu button has an accessible name",
              check: "return nameOf('button.menu').length > 2 && nameOf('button.menu') !== '☰';",
              fail: "The ☰ button is announced as just \"button\". Add aria-label=\"Open menu\".",
            },
            {
              label: "No link says \"click here\"; the prices link describes where it goes",
              check: "const a = $('a[href=\"prices.html\"]'); return !!a && !/click here|^here$/i.test(text(a)) && /price/i.test(text(a));",
              fail: "Rewrite the link so its own words say where it goes, for example \"See our repair prices\".",
            },
            {
              label: "The phone number input has a label",
              check: "const i = $('input[name=phone]'); return !!i && i.labels.length === 1 && text(i.labels[0]).length > 3;",
              fail: "Add an id to the input and a <label for> with the same value.",
            },
          ],
          solution: { "index.html": A11Y_DONE },
          hint: "Five separate fixes, each one attribute or one element: lang, alt (twice), aria-label, the link's words, and a label.",
          successMessage:
            "Five fixes, none of them visible to a sighted mouse user, and the page went from unusable to usable for a blind visitor. That is why accessibility is part of building, not an extra.",
        },
      },
    ],

    task: {
      title: "Module project: an accessible event booking form",
      intro: "Build booking.html for an event of your choice: a workshop, a wedding, a church programme.",
      prompts: [
        "Name, email, phone (tel) and number of guests (number, 1 to 10), all labelled, all required except phone.",
        "A fieldset of radio buttons for the session (morning or afternoon) and a fieldset of checkboxes for dietary needs.",
        "A select for the ticket type and a text area for questions, with a clearly worded submit button.",
        "A skip link, a lang attribute and no positive tabindex values.",
        "Complete the whole form using only the keyboard, then with your phone's screen reader (VoiceOver or TalkBack) on. Fix anything that is announced badly.",
      ],
      closing: "Keep the form: it becomes the student registration form in the Phase 1 projects.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
