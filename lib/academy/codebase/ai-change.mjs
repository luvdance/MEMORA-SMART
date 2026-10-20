/**
 * The AI assistant's 12-file change that breaks sign-in: the Module 5
 * practical, reused in Modules 6, 9 and 10. It was asked to "greet customers
 * by first name and add a spinner to sign-in". Most of its 13 edits are
 * reasonable; one breaks password checking, and two quietly
 * weaken the project's quality settings.
 */

export const AI_CHANGE = [
  // The fault: the stored hash is hex, the attempt is now read as UTF-8 text.
  [
    "server/services/authService.js",
    'const attempt = Buffer.from(hashPassword(password, user.salt), "hex");',
    "const attempt = Buffer.from(hashPassword(password, user.salt));",
  ],
  [
    "server/services/authService.js",
    "user: { id: user.id, name: user.name, email: user.email, role: user.role },",
    'user: { id: user.id, name: user.name, firstName: user.name.split(" ")[0], email: user.email, role: user.role },',
  ],
  [
    "server/middleware/requireAuth.js",
    "req.user = { id: user.id, name: user.name, email: user.email, role: user.role };",
    'req.user = { id: user.id, name: user.name, firstName: user.name.split(" ")[0], email: user.email, role: user.role };',
  ],
  ["server/routes/auth.js", "export async function me(req, res) {", "// Returns the signed-in user, including firstName for the greeting.\nexport async function me(req, res) {"],
  ["src/components/Navbar.jsx", "<span>Hello, {user.name}</span>", "<span>Hello, {user.firstName}</span>"],
  [
    "src/pages/Login.jsx",
    '{busy ? "Signing in…" : "Sign In"}',
    '{busy ? <span className="spinner" aria-label="Signing in" /> : "Sign In"}',
  ],
  ["src/styles.css", ".error {", ".spinner {\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  border: 2px solid currentColor;\n  border-right-color: transparent;\n  border-radius: 50%;\n  animation: spin 0.8s linear infinite;\n}\n\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n.error {"],
  ["src/hooks/useAuth.js", "  async function signIn(email, password) {\n    const result", "  async function signIn(email, password) {\n    // Normalise before sending so the server sees one form of the address.\n    email = email.trim();\n    const result"],
  ["src/App.jsx", "<Login onSignIn={auth.signIn}", "<Login key=\"login\" onSignIn={auth.signIn}"],
  ["src/api/client.js", "    body: body ? JSON.stringify(body) : undefined,\n", "    body: body ? JSON.stringify(body) : undefined,\n    signal: AbortSignal.timeout(10000),\n"],
  ["README.md", "Demo login: bola@kobo.test / market-day-2026\n", "Demo login: bola@kobo.test / market-day-2026\n\nThe navbar greets signed-in customers by first name.\n"],
  ["package.json", '"lint": "eslint ."', '"lint": "eslint .",\n    "format": "prettier --write ."'],
  ["eslint.config.js", 'rules: { "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z]" }] },', 'rules: { "no-unused-vars": "off" },'],
];

