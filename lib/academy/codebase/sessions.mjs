/**
 * THE RECORDED TERMINAL SESSIONS — CODEBASE ENGINEERING
 *
 * One entry per terminal the lessons show. scripts/ceRecord.mjs resets the
 * Kobo Market clone, applies `files` (written whole), `edits` ([path, from,
 * to] replacements) and `setup` (Bash, not shown), optionally starts the API
 * (`server`), sets `vars` (each the output of a Bash command, available to
 * the commands as environment variables), then runs `commands` in order.
 *
 * A command written with /c/Users/ada runs against the real build folder.
 * `{ cmd, background: ms }` runs a long-lived command (a server) for that
 * many milliseconds, records what it printed, then stops it.
 */

import { AI_CHANGE } from "./ai-change.mjs";
import { ADVANCED_SESSIONS } from "./sessions-advanced.mjs";

export { AI_CHANGE };

const SERVER = { env: {} };

export const SESSIONS = {
  /* ═══════════════ Module 1 ═══════════════ */
  "m1-first-look": {
    commands: [
      "ls",
      "cat README.md",
      "cat package.json",
      "git log --oneline | wc -l",
      "git shortlog -sn HEAD",
    ],
  },
  "m1-artifacts": {
    setup: "npm run build >/dev/null 2>&1",
    commands: [
      "ls",
      "cat .gitignore",
      "ls dist dist/assets",
      "ls node_modules | wc -l",
      "git ls-files | wc -l",
      "find . -type f | wc -l",
    ],
  },
  "m1-lifecycle": {
    commands: ["npm run", "cat vite.config.js"],
  },
  "m1-debt": {
    commands: [
      'rg -n "TODO|FIXME"',
      "rg -l OldCheckout",
      'rg -n "DELIVERY_FEE ="',
    ],
  },
  "m1-baseline": {
    commands: [
      "git status",
      "node --version",
      "npm test",
      "npm run lint",
      "git log -1 --format=\"%h %an %ad %s\" --date=short",
    ],
  },

  /* ═══════════════ Module 2 ═══════════════ */
  "m2-basics": {
    commands: ["pwd", "ls", "ls server", "ls -l server/routes", "ls -F server"],
  },
  "m2-paths": {
    commands: [
      "pwd",
      "ls server/routes",
      "ls ./server/routes",
      "ls /c/Users/ada/kobo-market/server/routes",
      "ls routes",
      "cd .. && pwd",
      "cd server/routes && pwd",
    ],
  },
  "m2-inspect": {
    commands: [
      "cat .env.example",
      "head -n 8 server/index.js",
      "tail -n 4 server/index.js",
      "wc -l server/router.js",
      "wc -l server/routes/*.js",
      "head -n 5 package-lock.json",
    ],
  },
  "m2-hidden": {
    commands: ["ls", "ls -a", "ls -la", "ls -l .env"],
  },
  "m2-find": {
    commands: [
      'find . -name "*.test.js" -not -path "./node_modules/*"',
      "find server -type f",
      'find . -type f -not -path "./node_modules/*" -not -path "./.git/*" | wc -l',
      "find node_modules -type f | wc -l",
      'find . -name "*.jsx" -not -path "./node_modules/*"',
    ],
  },
  "m2-grep": {
    commands: [
      'grep -rn "SESSION_SECRET" --exclude-dir=node_modules .',
      "rg SESSION_SECRET",
      "rg -l requireAuth",
      'rg -n "fetch\\(" src server',
      "rg -w login src",
      "rg --files | wc -l",
      'rg -n "/api/login"',
      'MSYS_NO_PATHCONV=1 rg -n "/api/login"',
      'rg -n "api/login"',
    ],
  },
  "m2-pipes": {
    commands: [
      "ls nowhere",
      "ls nowhere; echo $?",
      "ls server; echo $?",
      "grep -q PAYSTACK .env.example; echo $?",
      "grep -q STRIPE .env.example; echo $?",
      "ls nowhere 2>/dev/null; echo $?",
      "rg -l import src | wc -l",
      "git log --format=%an | sort | uniq -c | sort -rn",
    ],
  },
  "m2-redirect": {
    files: { "old-notes.txt": "scratch notes from last week\n" },
    commands: [
      'rg -n "TODO|FIXME" > todo.txt',
      "cat todo.txt",
      "npm test > test.log 2>&1 && echo \"tests passed\"",
      "tail -n 3 test.log",
      "npm run lint && npm test > /dev/null && echo \"lint and tests passed\"",
      "git clean -n",
    ],
  },
  "m2-env": {
    commands: [
      "echo $HOME",
      "which node",
      "printenv NODE_ENV",
      "node -e \"console.log(process.env.PORT)\"",
      "PORT=4100 node -e \"console.log(process.env.PORT)\"",
      "cat .env",
      { cmd: "npm start", background: 3000 },
      { cmd: "PORT=4100 npm start", background: 3000 },
    ],
  },
  "m2-powershell": {
    shell: "powershell",
    commands: [
      "Get-Location",
      "Get-ChildItem server",
      "Get-ChildItem -Force -Name",
      "Get-Content .env.example -TotalCount 3",
      "Get-ChildItem tests -Name",
      "Select-String -Path server\\*.js -Pattern assertConfig",
      "Get-ChildItem -Recurse -Path server -Filter *.js | Select-String SESSION_SECRET",
      "$env:PORT = '4100'; $env:PORT",
    ],
  },
  "m2-investigate": {
    commands: [
      "git ls-files | wc -l",
      'rg -l "createServer|createRoot"',
      "npm pkg get scripts.start scripts.dev",
      "rg -n \"\\[\\\"(GET|POST)\\\"\" server/router.js",
      "rg -n \"process\\.env\" server src",
      "rg -l \"authService|requireAuth\"",
      'rg -n "readFile|writeFile" server',
    ],
  },

  /* ═══════════════ Module 3 ═══════════════ */
  "m3-layout": {
    commands: [
      "git rev-parse --show-toplevel",
      "ls",
      "tree",
      'find . -maxdepth 2 -type d -not -path "./node_modules*" -not -path "./.git*" | sort',
    ],
  },
  "m3-manifest": {
    commands: ["npm pkg get scripts", "npm pkg get dependencies", "npm pkg get devDependencies", "npm pkg get engines"],
  },
  "m3-entry": {
    commands: ["cat index.html", "cat src/main.jsx", "npm pkg get scripts.start", 'rg -n "listen\\(" server'],
  },
  "m3-imports": {
    commands: [
      'rg -n "^import" src/App.jsx',
      'rg -n "^import" server/routes/orders.js',
      'rg -l -F "./client.js" src',
      'rg -l "db/index.js" server',
      'rg -n "^export" server/services',
    ],
  },
  "m3-generated": {
    setup: "npm run build >/dev/null 2>&1",
    commands: [
      "ls dist/assets",
      "git check-ignore -v dist/index.html",
      "git check-ignore -v node_modules/react/package.json",
      "du -sh node_modules",
      "npm ls --depth=0",
      "head -c 160 dist/assets/*.js",
    ],
  },
  "m3-config": {
    commands: ["cat .gitignore", "cat vite.config.js", "cat eslint.config.js", "ls tsconfig.json", 'git ls-files | rg "config|\\.env|ignore"'],
  },
  "m3-inventory": {
    commands: [
      "git ls-files | wc -l",
      "git ls-files server src tests | xargs wc -l | sort -n | tail -n 6",
      'rg -c "^import" src server | sort',
      "git ls-files -- '*.js' '*.jsx' | sed 's|/[^/]*$||' | sort | uniq -c",
    ],
  },
  "m3-feature": {
    commands: [
      "rg -il cart src server tests",
      "rg -n orderTotals",
      "git log --oneline -- src/pages/Cart.jsx server/routes/orders.js server/services/orderService.js",
    ],
  },

  /* ═══════════════ Module 4 ═══════════════ */
  "m4-trace-login": {
    commands: [
      'rg -n "Sign In" src',
      "rg -n handleSubmit src",
      "rg -n onSignIn src",
      'rg -n "signIn" src/hooks/useAuth.js',
      'rg -n "export function login" src',
      'rg -n "api/login"',
      'rg -n "authenticate" server',
      'rg -n "findUserByEmail" server',
      'rg -n "dataFile" server',
    ],
  },
  "m4-state": {
    commands: ["rg -n useState src", "rg -n \"setCart|setPage\" src", "rg -n onAdd src", "cat src/hooks/useAuth.js"],
  },
  "m4-api": {
    server: SERVER,
    commands: [
      "curl -s localhost:4000/api/products/solar-lamp",
      "curl -si localhost:4000/api/products/solar-lamp",
      'curl -s "localhost:4000/api/products?category=home"',
      "curl -s localhost:4000/api/products/nope",
      "curl -s localhost:4000/api/product",
      "curl -s -X DELETE localhost:4000/api/products",
    ],
  },
  "m4-auth": {
    server: SERVER,
    vars: {
      TOKEN:
        "curl -s -X POST localhost:4000/api/login -H 'Content-Type: application/json' -d '{\"email\":\"bola@kobo.test\",\"password\":\"market-day-2026\"}' | node -pe 'JSON.parse(require(\"fs\").readFileSync(0)).token'",
    },
    commands: [
      'curl -s -X POST localhost:4000/api/login -H "Content-Type: application/json" -d \'{"email":"bola@kobo.test"}\'',
      'curl -s -X POST localhost:4000/api/login -H "Content-Type: application/json" -d \'{"email":"bola@kobo.test","password":"wrong"}\'',
      'curl -s -X POST localhost:4000/api/login -H "Content-Type: application/json" -d \'{"email":"bola@kobo.test","password":"market-day-2026"}\'',
      "curl -s localhost:4000/api/me",
      'curl -s localhost:4000/api/me -H "Authorization: Bearer $TOKEN"',
      'curl -s localhost:4000/api/me -H "Authorization: Bearer ${TOKEN/u_1001/u_1002}"',
    ],
  },
  "m4-data": {
    commands: [
      'node -e "const d = require(\'./data/kobo.json\'); console.log(Object.keys(d), d.users.length, d.products.length)"',
      'node -e "console.log(require(\'./data/kobo.json\').users[0])"',
      'rg -n "fetch\\(" server',
      'rg -n "export async function" server/db/index.js',
    ],
  },
  "m4-deps": {
    commands: [
      "npm ls react",
      "npm ls scheduler",
      "npm ls axios",
      "rg -l axios src server",
      'rg -n -A 3 "\\"node_modules/react\\": \\{" package-lock.json',
    ],
  },
  "m4-nav": {
    commands: ["rg -n orderTotals", "rg -nw requireAuth", "git grep -n requireAuth", 'rg -n "function requireAuth"'],
  },
  "m4-rootcause": {
    commands: [
      'rg -n "DELIVERY_FEE|FREE_DELIVERY_FROM"',
      "git log --oneline -S FREE_DELIVERY_FROM",
      "git show --stat --format=\"%h %an %ad%n%s\" --date=short 68cb4b8",
    ],
  },

  /* ═══════════════ Module 5 ═══════════════ */
  "m5-basics": {
    commands: [
      "git status",
      "git branch",
      "git branch -a",
      "git remote -v",
      "git log --oneline -n 5",
      "git log --oneline --graph --all -n 4",
      "git worktree list",
    ],
  },
  "m5-status-diff": {
    edits: [
      [
        "src/components/ProductCard.jsx",
        'export default function ProductCard({ product, onAdd }) {\n  // TODO: use formatPrice from utils instead of formatting here\n  const price = "₦" + (product.price / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 });\n',
        'import { formatPrice } from "../utils/formatPrice.js";\n\nexport default function ProductCard({ product, onAdd }) {\n  const price = formatPrice(product.price);\n',
      ],
    ],
    setup: "printf 'scratch\\n' > notes.txt",
    commands: ["git status", "git status --short", "git diff", "git diff --stat", "git log -n 2"],
  },
  "m5-blame": {
    commands: [
      "git blame -L 1,9 server/services/orderService.js",
      "git blame -L 5,5 src/pages/Cart.jsx",
      "git log --oneline -- server/services/orderService.js",
      "git log --oneline -S FREE_DELIVERY_FROM",
    ],
  },
  "m5-show": {
    commands: ["git show 68cb4b8", "git show --stat 66c82ac", "git show 66c82ac -- server/router.js", "git show --no-patch v1.0.0"],
  },
  "m5-branch": {
    commands: ["git switch -c fix/cart-free-delivery", "git branch", "git switch main", "git branch --show-current"],
  },
  "m5-commit": {
    setup: "git switch -q -c fix/cart-free-delivery",
    edits: [
      [
        "src/pages/Cart.jsx",
        'const DELIVERY_FEE = 150000; // ₦1,500\n',
        'const DELIVERY_FEE = 150000; // ₦1,500, as server/services/orderService.js\nconst FREE_DELIVERY_FROM = 5000000; // ₦50,000\n',
      ],
      ["src/pages/Cart.jsx", "  const total = subtotal + DELIVERY_FEE;", "  const delivery = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;\n  const total = subtotal + delivery;"],
      ["src/pages/Cart.jsx", "<p>Delivery: {formatPrice(DELIVERY_FEE)}</p>", "<p>Delivery: {formatPrice(delivery)}</p>"],
    ],
    commands: [
      "git status --short",
      "git add src/pages/Cart.jsx",
      'git commit -m "Show free delivery in the cart from ₦50,000"',
      "git log --oneline -n 3",
    ],
  },
  "m5-ai-review": {
    edits: [
      ["src/api/client.js", '  if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);\n', "  if (!response.ok) {\n    console.log(\"API error\", path, token, data);\n    throw new Error(data.error || `Request failed with status ${response.status}`);\n  }\n"],
      ["src/pages/Products.jsx", "      .catch((err) => setError(err.message));", "      .catch(() => {});"],
    ],
    commands: ["git diff --stat", "git diff"],
  },
  "m5-staging": {
    edits: [
      ["src/pages/Cart.jsx", "<h1>Your cart</h1>", "<h1>Your basket</h1>"],
      ["README.md", "## Stack", "## Tech stack"],
    ],
    commands: ["git status --short", "git add .", "git diff --staged --stat", "git restore --staged README.md", "git status"],
  },
  "m5-undo": {
    edits: [["src/components/Navbar.jsx", "<strong>Kobo Market</strong>", "<strong>Kobo Markett</strong>"]],
    setup: 'git commit -qam "Update navbar title" --date="2026-04-08T09:00:00+01:00"',
    commands: [
      "git log --oneline -n 2",
      "git revert --no-edit HEAD",
      "git log --oneline -n 3",
      "git reset --hard HEAD~2",
      "git log --oneline -n 1",
    ],
  },
  "m5-force": {
    edits: [["src/components/Navbar.jsx", "<strong>Kobo Market</strong>", "<strong>Kobo Markett</strong>"]],
    setup: 'git commit -qam "Update navbar title" && git push -q && git reset -q --hard HEAD~1',
    commands: ["git status", "git push", "git log --oneline -n 2 origin/main"],
  },
  "m5-restore": {
    edits: [
      ["src/App.jsx", 'const [page, setPage] = useState("products");', 'const [page, setPage] = useState("cart");'],
      ["README.md", "## Stack", "## Tech stack"],
    ],
    commands: ["git status --short", "git restore src/App.jsx", "git diff --stat", "git stash", "git status", "git stash list", "git stash pop"],
  },
  "m5-conflict": {
    setup: [
      "git switch -q -c fix/delivery-fee",
      "sed -i 's/^const DELIVERY_FEE = 150000; \\/\\/ ₦1,500$/const DELIVERY_FEE = 200000; \\/\\/ ₦2,000/' src/pages/Cart.jsx",
      'git commit -qam "Raise delivery fee to ₦2,000" --date="2026-04-09T10:00:00+01:00"',
      "git switch -q main",
      "sed -i 's/^const DELIVERY_FEE = 150000; \\/\\/ ₦1,500$/const DELIVERY_FEE = 150000; \\/\\/ ₦1,500, must match orderService.js/' src/pages/Cart.jsx",
      'git commit -qam "Note where the delivery fee must match" --date="2026-04-09T11:00:00+01:00"',
    ].join(" && "),
    commands: ["git merge fix/delivery-fee", "git status", "git diff", "git merge --abort", "git status --short"],
  },
  "m5-tags": {
    commands: ["git tag -n", "git log --oneline v1.0.0..v1.1.0", "git diff --stat v1.0.0 v1.1.0", "git switch --detach v1.0.0", "git switch main"],
  },
  "m5-ignore": {
    commands: [
      "cat .gitignore",
      "git check-ignore -v .env",
      "git check-ignore -v data/kobo.json",
      "git status --short --ignored",
      "git ls-files .env .env.example",
    ],
  },
  "m5-ai-broke": {
    edits: AI_CHANGE,
    commands: ["git status --short", "git diff --stat", "npm test", "git diff server/services/authService.js", "git diff eslint.config.js package.json"],
  },
  "m5-ai-fixed": {
    edits: [
      ...AI_CHANGE.filter(([path, from]) => !(path === "server/services/authService.js" && from.startsWith("const attempt"))),
      ["eslint.config.js", 'rules: { "no-unused-vars": "off" },', 'rules: { "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z]" }] },'],
      ["package.json", '"lint": "eslint .",\n    "format": "prettier --write ."', '"lint": "eslint ."'],
    ],
    commands: ["npm test", "npm run lint", "git diff --stat", "git diff server/services/authService.js"],
  },
  ...ADVANCED_SESSIONS,
};
