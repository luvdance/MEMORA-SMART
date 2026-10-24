/**
 * The type definitions a lab project is type-checked against: TypeScript's
 * own lib files and the .d.ts files of Node.js and the lab's npm packages,
 * read from the pinned workspace scripts/node-lab — exactly what
 * `npm install` puts in a project's node_modules.
 *
 *   collectTypeFiles() → { typeFiles: { "express/package.json": …, … }, libFiles: { "lib.es2024.d.ts": … } }
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const MODULES = fileURLToPath(new URL("../../../scripts/node-lab/node_modules/", import.meta.url));

/** Packages with types, and the type-only packages they depend on. */
export const TYPE_PACKAGES = [
  "@types/node", "undici-types",
  "@types/express", "@types/body-parser", "@types/connect", "@types/express-serve-static-core", "@types/serve-static",
  "@types/qs", "@types/range-parser", "@types/send", "@types/http-errors",
  "@types/pg", "pg-protocol", "pg-types",
  "@types/jsonwebtoken", "@types/ms",
  "@types/supertest", "@types/superagent", "@types/cookiejar", "@types/methods", "form-data",
  "@types/multer", "@types/cors", "@types/cookie-parser", "@types/ws",
  "zod", "bcryptjs", "helmet", "express-rate-limit", "dotenv", "yaml", "node-cron",
];

/** Vitest's real types pull in Vite and more; the lab's test runner has Vitest's API, typed here. */
export const VITEST_TYPES = `// Types for the lab's Vitest-compatible test runner (describe, it, expect, vi).
type Awaitable<T> = T | PromiseLike<T>;
type TestFunction = () => Awaitable<unknown>;
interface TestAPI {
  (name: string, fn?: TestFunction, timeout?: number): void;
  skip(name: string, fn?: TestFunction): void;
  only(name: string, fn?: TestFunction, timeout?: number): void;
  todo(name: string): void;
  each<T>(cases: readonly T[]): (name: string, fn: (...args: T extends readonly unknown[] ? T : [T]) => Awaitable<unknown>, timeout?: number) => void;
  skipIf(condition: unknown): TestAPI;
  runIf(condition: unknown): TestAPI;
}
interface SuiteAPI {
  (name: string, fn: () => void): void;
  skip(name: string, fn: () => void): void;
  only(name: string, fn: () => void): void;
  each<T>(cases: readonly T[]): (name: string, fn: (...args: T extends readonly unknown[] ? T : [T]) => void) => void;
}
export declare const describe: SuiteAPI;
export declare const suite: SuiteAPI;
export declare const it: TestAPI;
export declare const test: TestAPI;
export declare function beforeAll(fn: () => Awaitable<unknown>): void;
export declare function afterAll(fn: () => Awaitable<unknown>): void;
export declare function beforeEach(fn: () => Awaitable<unknown>): void;
export declare function afterEach(fn: () => Awaitable<unknown>): void;

export interface Mock<T extends (...args: any[]) => any = (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>;
  mock: { calls: Parameters<T>[]; results: { type: "return" | "throw"; value: unknown }[]; lastCall: Parameters<T> | undefined };
  mockImplementation(fn: T): this;
  mockImplementationOnce(fn: T): this;
  mockReturnValue(value: ReturnType<T>): this;
  mockReturnValueOnce(value: ReturnType<T>): this;
  mockResolvedValue(value: Awaited<ReturnType<T>>): this;
  mockResolvedValueOnce(value: Awaited<ReturnType<T>>): this;
  mockRejectedValue(error: unknown): this;
  mockRejectedValueOnce(error: unknown): this;
  mockClear(): this;
  mockReset(): this;
  mockRestore(): void;
  mockName(name: string): this;
  getMockName(): string;
}
interface Assertion<T> {
  not: Assertion<T>;
  resolves: Assertion<Awaited<T>>;
  rejects: Assertion<unknown>;
  toBe(expected: unknown): void;
  toEqual(expected: unknown): void;
  toStrictEqual(expected: unknown): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toBeNull(): void;
  toBeUndefined(): void;
  toBeDefined(): void;
  toBeNaN(): void;
  toBeTypeOf(type: "string" | "number" | "boolean" | "object" | "function" | "undefined" | "bigint" | "symbol"): void;
  toBeGreaterThan(n: number | bigint): void;
  toBeGreaterThanOrEqual(n: number | bigint): void;
  toBeLessThan(n: number | bigint): void;
  toBeLessThanOrEqual(n: number | bigint): void;
  toBeCloseTo(n: number, digits?: number): void;
  toContain(item: unknown): void;
  toContainEqual(item: unknown): void;
  toHaveLength(n: number): void;
  toHaveProperty(path: string | string[], value?: unknown): void;
  toMatch(expected: string | RegExp): void;
  toMatchObject(expected: object): void;
  toBeInstanceOf(c: abstract new (...args: any[]) => unknown): void;
  toSatisfy(predicate: (value: T) => boolean): void;
  toThrow(expected?: string | RegExp | (abstract new (...args: any[]) => unknown) | object): void;
  toThrowError(expected?: string | RegExp | (abstract new (...args: any[]) => unknown) | object): void;
  toHaveBeenCalled(): void;
  toHaveBeenCalledOnce(): void;
  toHaveBeenCalledTimes(n: number): void;
  toHaveBeenCalledWith(...args: unknown[]): void;
  toHaveBeenLastCalledWith(...args: unknown[]): void;
  toHaveBeenNthCalledWith(n: number, ...args: unknown[]): void;
  toHaveReturned(): void;
  toHaveReturnedWith(value: unknown): void;
}
interface ExpectStatic {
  <T>(actual: T, message?: string): Assertion<T>;
  any(constructor: unknown): any;
  anything(): any;
  objectContaining(expected: object): any;
  arrayContaining(expected: readonly unknown[]): any;
  stringContaining(expected: string): any;
  stringMatching(expected: string | RegExp): any;
  assertions(n: number): void;
  hasAssertions(): void;
}
export declare const expect: ExpectStatic;
export declare const vi: {
  fn<T extends (...args: any[]) => any = (...args: any[]) => any>(impl?: T): Mock<T>;
  spyOn<O extends object, K extends keyof O>(object: O, method: K): Mock<O[K] extends (...args: any[]) => any ? O[K] : never>;
  isMockFunction(fn: unknown): boolean;
  mocked<T>(item: T): T extends (...args: any[]) => any ? Mock<T> : T;
  clearAllMocks(): void;
  resetAllMocks(): void;
  restoreAllMocks(): void;
  mock(path: string, factory?: () => unknown): void;
  doMock(path: string, factory?: () => unknown): void;
  unmock(path: string): void;
  hoisted<T>(factory: () => T): T;
  stubEnv(name: string, value: string): void;
  unstubAllEnvs(): void;
  useFakeTimers(): typeof vi;
  useRealTimers(): typeof vi;
  setSystemTime(time: number | string | Date): typeof vi;
  advanceTimersByTime(ms: number): typeof vi;
  advanceTimersByTimeAsync(ms: number): Promise<typeof vi>;
  runAllTimers(): typeof vi;
  runAllTimersAsync(): Promise<typeof vi>;
  waitFor<T>(callback: () => Awaitable<T>, options?: number | { timeout?: number; interval?: number }): Promise<T>;
};
`;

function walk(dir, base, out) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules") continue;
    const full = join(dir, name);
    const rel = `${base}/${name}`;
    if (statSync(full).isDirectory()) walk(full, rel, out);
    else if (/\.d\.(m|c)?ts$/.test(name) || name === "package.json") out[rel] = readFileSync(full, "utf8");
  }
}

export function collectTypeFiles() {
  const typeFiles = {};
  for (const pkg of TYPE_PACKAGES) {
    const dir = join(MODULES, pkg);
    if (!existsSync(dir)) throw new Error(`Type package ${pkg} is not installed in scripts/node-lab`);
    walk(dir, pkg, typeFiles);
  }
  typeFiles["vitest/package.json"] = JSON.stringify({ name: "vitest", version: "5.0.5", types: "./index.d.ts", exports: { ".": { types: "./index.d.ts" }, "./config": { types: "./config.d.ts" } } });
  typeFiles["vitest/index.d.ts"] = VITEST_TYPES;
  typeFiles["vitest/config.d.ts"] = "export declare function defineConfig<T>(config: T): T;\n";
  const libFiles = {};
  const libDir = join(MODULES, "typescript", "lib");
  for (const name of readdirSync(libDir)) {
    if (/^lib\.(es\d+|esnext|es5|decorators|scripthost|webworker\.importscripts)[\w.]*\.d\.ts$/.test(name) || name === "lib.d.ts") libFiles[name] = readFileSync(join(libDir, name), "utf8");
  }
  return { typeFiles, libFiles };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { typeFiles, libFiles } = collectTypeFiles();
  const size = (o) => Object.values(o).reduce((n, t) => n + t.length, 0);
  console.log(`${Object.keys(typeFiles).length} type files (${Math.round(size(typeFiles) / 1024)} KB), ${Object.keys(libFiles).length} lib files (${Math.round(size(libFiles) / 1024)} KB)`);
}
