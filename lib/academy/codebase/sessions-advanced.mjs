/**
 * RECORDED SESSIONS — MODULES 6 TO 10 AND THE CAPSTONE
 *
 * Same contract as ./sessions.mjs, which merges these in. The files below are
 * the ones the lessons have the learner write (an inspection script, a review
 * gate, agent instructions, CI, Docker, MCP configuration, a decision record):
 * each is run or read for real in the sessions that use it.
 */

import { AI_CHANGE } from "./ai-change.mjs";

export const INSPECT_SH = `#!/usr/bin/env bash
# inspect.sh: a read-only report on the repository it is run in.
# Usage: bash scripts/inspect.sh > maintenance-report.md
set -u

echo "# Maintenance report: $(basename "$(git rev-parse --show-toplevel)")"
echo

echo "## Git"
echo "- Branch: $(git branch --show-current)"
echo "- Last commit: $(git log -1 --format='%h %s (%an, %ad)' --date=short)"
echo "- Uncommitted files: $(git status --porcelain | wc -l | tr -d ' ')"
echo

echo "## Stack"
if [ -f package.json ]; then
  node -p "const p = require('./package.json'); '- ' + p.name + ' ' + p.version + ' (Node.js)\\n- Dependencies: ' + Object.keys(p.dependencies || {}).join(', ') + '\\n- Dev tools: ' + Object.keys(p.devDependencies || {}).join(', ')"
fi
echo

echo "## Scripts"
node -p "Object.entries(require('./package.json').scripts || {}).map(([k, v]) => '- npm run ' + k + ': ' + v).join('\\n')"
echo

echo "## Key files"
for f in README.md .env.example index.html src/main.jsx server/index.js server/router.js; do
  [ -e "$f" ] && echo "- $f"
done
echo

echo "## Size"
echo "- Tracked files: $(git ls-files | wc -l | tr -d ' ')"
echo "- Lines in src/ and server/: $(git ls-files src server | xargs cat | wc -l | tr -d ' ')"
echo

echo "## Notes left in the code"
rg -n "TODO|FIXME" src server || echo "(none)"
echo

echo "## Checks"
if npm test --silent > /dev/null 2>&1; then echo "- Tests: pass"; else echo "- Tests: FAIL"; fi
if npm run lint --silent > /dev/null 2>&1; then echo "- Lint: pass"; else echo "- Lint: FAIL"; fi
`;

export const GATE_SH = `#!/usr/bin/env bash
# review-gate.sh: run before any change (yours or an AI agent's) is merged.
# Exits non-zero if any gate fails, so CI can use it too.
fail=0

echo "Gate 1: lint"
npm run lint --silent > /dev/null 2>&1 && echo "  ok" || { echo "  FAILED: npm run lint"; fail=1; }

echo "Gate 2: tests"
npm test --silent > /dev/null 2>&1 && echo "  ok" || { echo "  FAILED: npm test"; fail=1; }

echo "Gate 3: no secrets in the change"
if git diff HEAD | rg -q "sk_(test|live)_[A-Za-z0-9]{8,}"; then echo "  FAILED: a secret key is in the diff"; fail=1; else echo "  ok"; fi

echo "Gate 4: quality settings untouched"
if git diff --name-only HEAD | rg -q "^(eslint\\.config\\.js|\\.github/)"; then
  echo "  NEEDS HUMAN REVIEW: the change edits lint or CI configuration"; fail=1
else
  echo "  ok"
fi

echo "Gate 5: size"
files=$(git diff --name-only HEAD | wc -l | tr -d ' ')
if [ "$files" -gt 8 ]; then echo "  NEEDS HUMAN REVIEW: $files files changed (limit 8); split it up"; fail=1; else echo "  ok ($files files)"; fi

exit $fail
`;

export const DEPS_REPORT = `// deps-report.mjs: what this project depends on, and what each is for.
// Usage: node scripts/deps-report.mjs
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
const installed = (name) => lock.packages[\`node_modules/\${name}\`]?.version ?? "not installed";

for (const [group, deps] of [["runtime", pkg.dependencies], ["development", pkg.devDependencies]]) {
  console.log(\`\${group}:\`);
  for (const [name, range] of Object.entries(deps || {})) {
    console.log(\`  \${name.padEnd(22)} wanted \${range.padEnd(9)} locked \${installed(name)}\`);
  }
}
const total = Object.keys(lock.packages).filter((p) => p.startsWith("node_modules/")).length;
console.log(\`\${total} packages in the lockfile in all, most of them dependencies of these.\`);
`;

export const AGENTS_MD = `# AGENTS.md: Kobo Market

Instructions for AI coding agents (and new developers) working in this repository.

## What this is
An online market: React + Vite frontend in \`src/\`, a framework-free Node API in
\`server/\`, data in a JSON file (\`data/kobo.json\`, created by \`npm run seed\`).

## Commands
- Install: \`npm ci\`
- Test: \`npm test\` (node:test; must pass before you finish)
- Lint: \`npm run lint\` (must pass; never weaken eslint.config.js to make it pass)
- Run: \`npm start\` (API, port 4000) and \`npm run dev\` (app, port 5173)

## Rules
- Money is integer kobo everywhere. Never use floats for prices.
- Prices and totals are decided on the server (\`server/services/orderService.js\`).
- Never read, print or commit \`.env\`. Never add secrets to code.
- Do not add dependencies without asking.
- Keep changes small: one concern per change, and list every file you touched.
- Before changing code you have not read, explain the current behaviour first.
`;

export const CI_YML = `name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
`;

export const DOCKERFILE = `# The Kobo Market API in a container.
FROM node:24-alpine
WORKDIR /app

# Dependencies first, so this layer is cached until the lockfile changes.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server ./server

# Configuration comes from the environment at run time, never from the image.
ENV PORT=4000 DATA_FILE=/data/kobo.json
EXPOSE 4000
VOLUME /data
CMD ["node", "server/index.js"]
`;

export const DOCKERIGNORE = `node_modules
dist
data
.env
.git
*.log
`;

export const MCP_JSON = `{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "kobo-db-readonly": {
      "command": "node",
      "args": ["tools/db-mcp-server.mjs", "--read-only"],
      "env": { "DATA_FILE": "data/kobo.json" }
    }
  }
}
`;

export const ADR_0001 = `# 1. Store data in a JSON file for now

Date: 2026-03-04
Status: Accepted

## Context
Kobo Market needs to store users, products and orders. The team is three
people, there are tens of products, and the first goal is a working demo.

## Decision
Keep all data in one JSON file (data/kobo.json), read once and held in
memory, behind the functions in server/db/index.js. Nothing outside that file
touches the data directly.

## Consequences
- No database to install or host; \`npm run seed\` creates everything.
- Every write rewrites the whole file, and two server instances would
  overwrite each other. This does not scale past one small server.
- Because all access goes through server/db/index.js, moving to a real
  database later means rewriting one file, not the whole API.
`;

const DATA_TYPO = ["data/kobo.json", "data/kobo.jsn"];
const BROKEN = {
  dependency: [
    "server/services/orderService.js",
    "// Money is held in kobo",
    'import dayjs from "dayjs";\n\nexport const quoteDate = () => dayjs().format("YYYY-MM-DD");\n\n// Money is held in kobo',
  ],
  frontend: ["src/pages/Products.jsx", ".then((data) => setProducts(data.products))", ".then((data) => setProducts(data.items))"],
  request: ["src/api/products.js", "request(`/api/products${query}`)", "request(`/api/product${query}`)"],
};

export const ADVANCED_SESSIONS = {
  /* ═══════════════ Module 6 ═══════════════ */
  "m6-verify-claims": {
    commands: [
      'rg -n "bcrypt|scrypt" server',
      "rg -il redis",
      "npm ls bcrypt",
      'rg -n "createHmac|timingSafeEqual" server',
      "rg -n TOKEN_LIFETIME_MS server",
    ],
  },
  "m6-context": {
    edits: AI_CHANGE,
    commands: ["npm test 2>&1 | tail -n 16", "git diff --stat", "git diff -U1 server/services/authService.js"],
  },
  "m6-agents-md": {
    files: { "AGENTS.md": AGENTS_MD },
    commands: ["cat AGENTS.md", "ls *.md"],
  },
  "m6-agent-branch": {
    edits: AI_CHANGE,
    setup: [
      "git switch -q -c agent/first-name-greeting",
      'git commit -qam "Greet customers by first name; add sign-in spinner" --date="2026-04-10T15:00:00+01:00"',
    ].join(" && "),
    commands: [
      "git log --oneline main..agent/first-name-greeting",
      "git diff --stat main...agent/first-name-greeting",
      "git diff main...agent/first-name-greeting -- eslint.config.js package.json",
      "git switch main",
    ],
  },
  "m6-map": {
    commands: [
      "git ls-files | sed 's|/.*||' | sort | uniq -c",
      'rg -l "fetch\\("',
      "rg -n -F \"api/\" src/api",
      "git log --format='%an' --since=2026-03-20 | sort | uniq -c",
    ],
  },

  /* ═══════════════ Module 7 ═══════════════ */
  "m7-runtime": {
    edits: [
      [
        "server/routes/products.js",
        '  if (!product) return sendJson(res, 404, { error: "Product not found" });\n  sendJson(res, 200, { product });',
        "  sendJson(res, 200, { product: { ...product, label: product.name.toUpperCase() } });",
      ],
    ],
    server: { env: {} },
    commands: [
      "curl -s localhost:4000/api/products/solar-lamp",
      "curl -si localhost:4000/api/products/nope",
      "cat server.log",
    ],
  },
  "m7-stack": {
    edits: [
      [
        "server/routes/products.js",
        '  if (!product) return sendJson(res, 404, { error: "Product not found" });\n  sendJson(res, 200, { product });',
        "  sendJson(res, 200, { product: { ...product, label: product.name.toUpperCase() } });",
      ],
      ["server/index.js", "console.error(`[error] ${req.method} ${req.url}: ${err.message}`);", "console.error(`[error] ${req.method} ${req.url}`, err);"],
    ],
    server: { env: {} },
    commands: ["curl -s localhost:4000/api/products/nope", "cat server.log"],
  },
  "m7-syntax": {
    edits: [["server/routes/orders.js", "const lines = [];", "const lines = [;"]],
    commands: ["node --check server/routes/orders.js", { cmd: "npm start", background: 3000 }, "npm run lint"],
  },
  "m7-dependency": {
    edits: [BROKEN.dependency],
    commands: [{ cmd: "npm start", background: 3000 }, "npm ls dayjs", 'rg -n "dayjs" server', "npm test 2>&1 | tail -n 12"],
  },
  "m7-config": {
    edits: [[".env", "DATA_FILE=data/kobo.json", "DATA_FILE=data/kobo.jsn"]],
    server: { env: {} },
    commands: ["curl -s localhost:4000/api/products", "cat server.log", "rg -n DATA_FILE .env .env.example", "ls data"],
  },
  "m7-network": {
    commands: [
      "curl -s localhost:4000/api/products",
      "curl -s localhost:4000/api/products; echo \" exit=$?\"",
      "curl -sS localhost:4000/api/products",
    ],
  },
  "m7-minimal": {
    files: {
      "repro.mjs":
        "// The smallest program that shows the bug: a response shaped like the API's.\nconst data = { products: [{ id: \"solar-lamp\" }] };\nconst products = data.items;\nconsole.log(products.map((p) => p.id));\n",
    },
    commands: ["cat repro.mjs", "node repro.mjs"],
  },
  "m7-tests": {
    commands: [
      "node --test tests/orderService.test.js",
      "npm test -- --test-name-pattern=delivery",
      "rg -n \"^test\\(\" tests",
    ],
  },
  "m7-test-first": {
    edits: [
      [
        "tests/formatPrice.test.js",
        'test("zero is ₦0.00", () => {',
        'test("refunds show the minus sign before the naira sign", () => {\n  assert.equal(formatPrice(-150000), "-₦1,500.00");\n});\n\ntest("zero is ₦0.00", () => {',
      ],
    ],
    commands: ["node --test tests/formatPrice.test.js"],
  },
  "m7-test-fixed": {
    edits: [
      [
        "tests/formatPrice.test.js",
        'test("zero is ₦0.00", () => {',
        'test("refunds show the minus sign before the naira sign", () => {\n  assert.equal(formatPrice(-150000), "-₦1,500.00");\n});\n\ntest("zero is ₦0.00", () => {',
      ],
      [
        "src/utils/formatPrice.js",
        '  return "₦" + (kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });',
        '  const naira = (Math.abs(kobo) / 100).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });\n  return (kobo < 0 ? "-" : "") + "₦" + naira;',
      ],
    ],
    commands: ["node --test tests/formatPrice.test.js", "npm test 2>&1 | tail -n 8", "git diff --stat"],
  },
  "m7-lint": {
    edits: [
      ["src/pages/Cart.jsx", "  const [status, setStatus] = useState(\"\");", "  const [status, setStatus] = useState(\"\");\n  const discount = 0;"],
      ["server/routes/orders.js", "  await saveOrder(order);", "  await saveOrder(ordr);"],
    ],
    commands: ["npm run lint", "npm test 2>&1 | tail -n 3"],
  },
  "m7-broken-1": {
    edits: [BROKEN.dependency, BROKEN.frontend, BROKEN.request, [".env", ...DATA_TYPO]],
    commands: [{ cmd: "npm start", background: 3000 }, "npm ls dayjs", 'rg -n "dayjs"'],
  },
  "m7-broken-2": {
    edits: [BROKEN.frontend, BROKEN.request, [".env", ...DATA_TYPO]],
    server: { env: {} },
    commands: ["curl -s localhost:4000/api/products/solar-lamp", "cat server.log", "rg -n DATA_FILE .env .env.example"],
  },
  "m7-broken-3": {
    edits: [BROKEN.frontend, BROKEN.request],
    server: { env: {} },
    commands: [
      "rg -n -F \"api/product\" src",
      "curl -si localhost:4000/api/product",
      'curl -s "localhost:4000/api/products?category=fashion"',
      'rg -n "data\\.(items|products)" src',
    ],
  },
  "m7-broken-fixed": {
    server: { env: {} },
    commands: ["npm test 2>&1 | tail -n 8", "npm run lint", 'curl -s "localhost:4000/api/products?category=fashion"', "git status --short"],
  },

  /* ═══════════════ Module 8 ═══════════════ */
  "m8-size": {
    commands: ["git ls-files src server | xargs wc -l | sort -rn | head -n 6", "rg -c useState src"],
  },
  "m8-duplication": {
    commands: ['rg -n "toLocaleString" src', 'rg -n "150000"', 'rg -n "reduce\\(\\(sum"'],
  },
  "m8-dead": {
    commands: [
      "rg -l OldCheckout",
      "git log --oneline -- src/components/OldCheckout.jsx",
      'rg -n "axios"  --glob "!package*.json"',
      "npm ls axios",
    ],
  },
  "m8-remove-dead": {
    changesPackages: true,
    commands: [
      "git rm src/components/OldCheckout.jsx",
      "npm uninstall axios --no-audit",
      "npm run build 2>&1 | tail -n 4",
      "npm test 2>&1 | tail -n 8",
      "git status --short",
    ],
  },
  "m8-refactor": {
    edits: [
      [
        "src/components/ProductCard.jsx",
        'export default function ProductCard({ product, onAdd }) {\n  // TODO: use formatPrice from utils instead of formatting here\n  const price = "₦" + (product.price / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 });\n',
        'import { formatPrice } from "../utils/formatPrice.js";\n\nexport default function ProductCard({ product, onAdd }) {\n  const price = formatPrice(product.price);\n',
      ],
    ],
    commands: ["git diff --stat", "npm test 2>&1 | tail -n 8", "npm run lint", "npm run build 2>&1 | tail -n 4"],
  },
  "m8-outdated": {
    commands: ["npm outdated", "npm ls react react-dom"],
  },
  "m8-adr": {
    files: { "docs/decisions/0001-json-file-store.md": ADR_0001 },
    commands: ["ls docs/decisions", "cat docs/decisions/0001-json-file-store.md"],
  },
  "m8-plan": {
    changesPackages: true,
    setup: [
      "sed -i 's|^export default function ProductCard|import { formatPrice } from \"../utils/formatPrice.js\";\\n\\nexport default function ProductCard|' src/components/ProductCard.jsx",
      "sed -i '/TODO: use formatPrice/d' src/components/ProductCard.jsx",
      "sed -i 's|^  const price = \"₦\" + .*$|  const price = formatPrice(product.price);|' src/components/ProductCard.jsx",
      'git commit -qam "Format product prices with formatPrice" --date="2026-04-13T10:00:00+01:00"',
      "git rm -q src/components/OldCheckout.jsx",
      'git commit -qm "Remove unused OldCheckout component" --date="2026-04-13T10:20:00+01:00"',
      "npm uninstall -s axios --no-audit",
      'git commit -qam "Remove unused axios dependency" --date="2026-04-13T10:40:00+01:00"',
    ].join(" && "),
    commands: ["git log --oneline -n 4", "npm test 2>&1 | tail -n 8", "npm run lint", "npm run build 2>&1 | tail -n 4", "git diff --stat HEAD~3"],
  },

  /* ═══════════════ Module 9 ═══════════════ */
  "m9-missing-secret": {
    setup: "rm .env",
    commands: [
      { cmd: "npm start", background: 3000 },
      { cmd: "SESSION_SECRET=set-by-the-host PORT=4100 npm start", background: 3000 },
      "node --env-file=.env.production server/index.js",
    ],
  },
  "m9-vite-env": {
    commands: [
      "VITE_API_URL=https://api.kobo.example npm run build 2>&1 | tail -n 4",
      'rg -l -F "https://api.kobo.example" dist',
      "rg -c PAYSTACK dist",
    ],
  },
  "m9-lockfile": {
    changesPackages: true,
    commands: ["npm install globals@^17 --no-audit", "git diff --stat", "git diff package.json", "git restore package.json package-lock.json", "npm ci --no-audit"],
  },
  "m9-build": {
    commands: ["npm run build", "ls -l dist dist/assets", { cmd: "npm run preview -- --port 4199", background: 5000 }],
  },
  "m9-ports": {
    server: { env: {} },
    commands: [{ cmd: "npm start", background: 3000 }, "curl -s localhost:4100/api/products; echo \" exit=$?\"", "docker ps"],
  },
  "m9-ci": {
    files: { ".github/workflows/ci.yml": CI_YML },
    commands: ["cat .github/workflows/ci.yml", "npm run lint && npm test 2>&1 | tail -n 4 && npm run build 2>&1 | tail -n 1"],
  },
  "m9-ci-fail": {
    edits: AI_CHANGE,
    commands: ["npm run lint && npm test 2>&1 | tail -n 22"],
  },
  "m9-docker": {
    files: { Dockerfile: DOCKERFILE, ".dockerignore": DOCKERIGNORE },
    commands: ["cat Dockerfile", "cat .dockerignore", "docker --version", "docker build -t kobo-api ."],
  },
  "m9-secrets": {
    files: {
      "src/api/payments.js":
        'import { request } from "./client.js";\n\n// Generated by an AI assistant: "call Paystack directly from the browser".\nconst PAYSTACK_SECRET_KEY = "sk_test_FAKE1234example";\n\nexport function verifyPayment(reference) {\n  return request(`/transaction/verify/${reference}`, { token: PAYSTACK_SECRET_KEY });\n}\n',
    },
    commands: [
      'rg -n "sk_(test|live)_[A-Za-z0-9]+"',
      'rg -n --no-ignore --hidden "sk_(test|live)_" -g "!node_modules"',
      "git status --short",
      "npm audit",
    ],
  },
  "m9-prices": {
    server: { env: {} },
    vars: {
      TOKEN:
        "curl -s -X POST localhost:4000/api/login -H 'Content-Type: application/json' -d '{\"email\":\"bola@kobo.test\",\"password\":\"market-day-2026\"}' | node -pe 'JSON.parse(require(\"fs\").readFileSync(0)).token'",
    },
    commands: [
      'curl -s -X POST localhost:4000/api/orders -H "Content-Type: application/json" -d \'{"items":[{"id":"solar-lamp","quantity":1,"price":1}]}\'',
      'curl -s -X POST localhost:4000/api/orders -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d \'{"items":[{"id":"solar-lamp","quantity":1,"price":1}]}\'',
    ],
  },
  "m9-dry-run": {
    files: { "notes.txt": "draft\n", ".env.production": "SESSION_SECRET=only-copy-of-production-secret\n" },
    commands: ["git clean -n", "git clean -nX", "git clean -nx"],
  },
  "m9-deploy": {
    setup: "rm .env",
    commands: [
      { cmd: "PORT=4100 npm start", background: 3000 },
      "npm run build 2>&1 | tail -n 3",
      'rg -o -F "api/products" dist/assets',
      "node --version",
      "npm pkg get engines",
    ],
  },

  /* ═══════════════ Module 10 ═══════════════ */
  "m10-inspect": {
    files: { "scripts/inspect.sh": INSPECT_SH },
    commands: ["cat scripts/inspect.sh", "bash scripts/inspect.sh"],
  },
  "m10-inspect-save": {
    files: { "scripts/inspect.sh": INSPECT_SH },
    edits: [["src/pages/Cart.jsx", "<h1>Your cart</h1>", "<h1>Your basket</h1>"]],
    commands: ["bash scripts/inspect.sh > maintenance-report.md", "head -n 8 maintenance-report.md", "tail -n 3 maintenance-report.md"],
  },
  "m10-deps-report": {
    files: { "scripts/deps-report.mjs": DEPS_REPORT },
    commands: ["node scripts/deps-report.mjs", "npm ls --all | wc -l"],
  },
  "m10-worktree": {
    commands: [
      "git worktree add ../kobo-hotfix -b hotfix/cart-delivery",
      "git worktree list",
      "cd ../kobo-hotfix && git status --short --branch",
      "git worktree remove ../kobo-hotfix",
    ],
  },
  "m10-parallel": {
    setup: [
      "git switch -q -c agent/cart-free-delivery",
      "sed -i 's|^  const total = subtotal + DELIVERY_FEE;|  const delivery = subtotal >= 5000000 ? 0 : DELIVERY_FEE;\\n  const total = subtotal + delivery;|' src/pages/Cart.jsx",
      'git commit -qam "Cart: free delivery from ₦50,000" --date="2026-04-14T09:00:00+01:00"',
      "git switch -q main && git switch -q -c agent/cart-quantities",
      "sed -i 's|^  const total = subtotal + DELIVERY_FEE;|  const total = subtotal + (items.length ? DELIVERY_FEE : 0);|' src/pages/Cart.jsx",
      'git commit -qam "Cart: no delivery fee on an empty cart" --date="2026-04-14T09:05:00+01:00"',
      "git switch -q main",
    ].join(" && "),
    commands: [
      "git log --oneline --graph --all -n 4",
      "git merge --no-edit agent/cart-free-delivery",
      "git merge --no-edit agent/cart-quantities",
      "git diff",
      "git merge --abort",
    ],
  },
  "m10-gate-fail": {
    files: { "scripts/review-gate.sh": GATE_SH },
    edits: AI_CHANGE,
    commands: ["bash scripts/review-gate.sh; echo \"exit=$?\""],
  },
  "m10-gate-pass": {
    files: { "scripts/review-gate.sh": GATE_SH },
    edits: [
      [
        "src/components/ProductCard.jsx",
        'export default function ProductCard({ product, onAdd }) {\n  // TODO: use formatPrice from utils instead of formatting here\n  const price = "₦" + (product.price / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 });\n',
        'import { formatPrice } from "../utils/formatPrice.js";\n\nexport default function ProductCard({ product, onAdd }) {\n  const price = formatPrice(product.price);\n',
      ],
    ],
    commands: ["cat scripts/review-gate.sh", "bash scripts/review-gate.sh; echo \"exit=$?\""],
  },
  "m10-mcp": {
    files: { ".mcp.json": MCP_JSON },
    commands: ["cat .mcp.json", 'node -e "console.log(Object.keys(require(\'./.mcp.json\').mcpServers))"'],
  },

  /* ═══════════════ Capstone ═══════════════ */
  "c-baseline": {
    files: { "scripts/inspect.sh": INSPECT_SH },
    server: { env: {} },
    commands: [
      "bash scripts/inspect.sh",
      'rg -n "DELIVERY_FEE|FREE_DELIVERY_FROM" src server',
      "git log --oneline -S FREE_DELIVERY_FROM",
    ],
  },
  "c-fix": {
    files: {
      "shared/pricing.js":
        "// The delivery rule, shared by the server and the cart page, so the two\n// can never disagree again. Money is integer kobo (₦1 = 100 kobo).\nexport const DELIVERY_FEE = 150000; // ₦1,500\nexport const FREE_DELIVERY_FROM = 5000000; // ₦50,000\n\nexport function orderTotals(lines) {\n  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);\n  const delivery = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;\n  return { subtotal, delivery, total: subtotal + delivery };\n}\n",
      "server/services/orderService.js":
        "// The rule lives in shared/pricing.js so the cart page uses the same one.\nexport { DELIVERY_FEE, FREE_DELIVERY_FROM, orderTotals } from \"../../shared/pricing.js\";\n",
    },
    edits: [
      ["src/pages/Cart.jsx", 'import { placeOrder } from "../api/orders.js";\n\nconst DELIVERY_FEE = 150000; // ₦1,500\n', 'import { placeOrder } from "../api/orders.js";\nimport { orderTotals } from "../../shared/pricing.js";\n'],
      ["src/pages/Cart.jsx", "  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);\n  const total = subtotal + DELIVERY_FEE;\n", "  const { delivery, total } = orderTotals(items);\n"],
      ["src/pages/Cart.jsx", "<p>Delivery: {formatPrice(DELIVERY_FEE)}</p>", "<p>Delivery: {formatPrice(delivery)}</p>"],
      [
        "tests/orderService.test.js",
        'test("delivery is free from ₦50,000", () => {',
        'test("delivery is still charged just below ₦50,000", () => {\n  const totals = orderTotals([{ price: 4999900, quantity: 1 }]);\n  assert.deepEqual(totals, { subtotal: 4999900, delivery: 150000, total: 5149900 });\n});\n\ntest("delivery is free from ₦50,000", () => {',
      ],
    ],
    setup: "git switch -q -c fix/cart-delivery-rule",
    commands: [
      "git status --short",
      "npm test 2>&1 | tail -n 9",
      "npm run lint",
      "npm run build 2>&1 | tail -n 4",
      'rg -n "DELIVERY_FEE|FREE_DELIVERY_FROM" src server shared',
      "git diff --stat",
    ],
  },
  "c-merge": {
    files: {
      "shared/pricing.js":
        "// The delivery rule, shared by the server and the cart page, so the two\n// can never disagree again. Money is integer kobo (₦1 = 100 kobo).\nexport const DELIVERY_FEE = 150000; // ₦1,500\nexport const FREE_DELIVERY_FROM = 5000000; // ₦50,000\n\nexport function orderTotals(lines) {\n  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);\n  const delivery = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;\n  return { subtotal, delivery, total: subtotal + delivery };\n}\n",
      "server/services/orderService.js":
        "// The rule lives in shared/pricing.js so the cart page uses the same one.\nexport { DELIVERY_FEE, FREE_DELIVERY_FROM, orderTotals } from \"../../shared/pricing.js\";\n",
    },
    edits: [
      ["src/pages/Cart.jsx", 'import { placeOrder } from "../api/orders.js";\n\nconst DELIVERY_FEE = 150000; // ₦1,500\n', 'import { placeOrder } from "../api/orders.js";\nimport { orderTotals } from "../../shared/pricing.js";\n'],
      ["src/pages/Cart.jsx", "  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);\n  const total = subtotal + DELIVERY_FEE;\n", "  const { delivery, total } = orderTotals(items);\n"],
      ["src/pages/Cart.jsx", "<p>Delivery: {formatPrice(DELIVERY_FEE)}</p>", "<p>Delivery: {formatPrice(delivery)}</p>"],
      [
        "tests/orderService.test.js",
        'test("delivery is free from ₦50,000", () => {',
        'test("delivery is still charged just below ₦50,000", () => {\n  const totals = orderTotals([{ price: 4999900, quantity: 1 }]);\n  assert.deepEqual(totals, { subtotal: 4999900, delivery: 150000, total: 5149900 });\n});\n\ntest("delivery is free from ₦50,000", () => {',
      ],
    ],
    setup: [
      "git switch -q -c fix/cart-delivery-rule",
      "git add -A",
      'git commit -qm "Share one delivery rule between the cart and the server" -m "The cart page charged ₦1,500 delivery on every order while the server\nmade orders from ₦50,000 free, so customers saw a higher total than they\nwere charged. Both now use shared/pricing.js." --date="2026-04-15T11:00:00+01:00"',
      "git switch -q main",
    ].join(" && "),
    commands: [
      "git log --oneline main..fix/cart-delivery-rule",
      'git merge --no-ff fix/cart-delivery-rule -m "Merge fix/cart-delivery-rule"',
      "git log --oneline --graph -n 4",
      "git branch -d fix/cart-delivery-rule",
    ],
  },
};
