/**
 * CLARITY SETUP — DOWNLOAD LANGUAGETOOL ONCE
 *
 * Downloads the official LanguageTool standalone build (open source, about
 * 250 MB) from languagetool.org into ~/.cache/mst-languagetool. It lives
 * outside the repository. Needs Java 17+ to run (`java -version`).
 *
 * Run: npm run clarity:setup
 */
import AdmZip from "adm-zip";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { LT_HOME } from "./grammar.mjs";

const URL_ZIP = "https://languagetool.org/download/LanguageTool-stable.zip";

try {
  console.log("  " + execSync("java -version 2>&1", { encoding: "utf8" }).split("\n")[0]);
} catch {
  console.error("  Java was not found. Install Java 17 or newer, then run this again.");
  process.exit(1);
}

mkdirSync(LT_HOME, { recursive: true });
const have = readdirSync(LT_HOME).filter((d) => d.startsWith("LanguageTool-"));
if (have.length && !process.argv.includes("--force")) {
  console.log(`  LanguageTool already installed: ${join(LT_HOME, have.sort().pop())}  (--force to update)`);
  process.exit(0);
}

console.log(`  Downloading ${URL_ZIP} …`);
const res = await fetch(URL_ZIP);
if (!res.ok) {
  console.error(`  Download failed: ${res.status}`);
  process.exit(1);
}
const zipPath = join(LT_HOME, "lt.zip");
writeFileSync(zipPath, Buffer.from(await res.arrayBuffer()));
console.log("  Unpacking …");
new AdmZip(zipPath).extractAllTo(LT_HOME, true);
rmSync(zipPath);
const dir = readdirSync(LT_HOME).filter((d) => d.startsWith("LanguageTool-")).sort().pop();
console.log(existsSync(join(LT_HOME, dir, "languagetool-server.jar")) ? `  ✓ Installed ${join(LT_HOME, dir)}` : "  ✗ languagetool-server.jar not found after unpacking");
