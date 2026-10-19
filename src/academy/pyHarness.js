/**
 * THE PYTHON PRACTICE HARNESS
 *
 * One piece of Python source, used in two places:
 *
 *   · in the browser, by pyodideRunner.js, when a learner presses Run or
 *     Check my code on a `codeChallenge`;
 *   · at build time, by lib/academy/validateContent.mjs, which runs every
 *     challenge's model solution (it must pass) and its starter code (it must
 *     NOT pass) in CPython.
 *
 * Because both sides execute the same text, a challenge that validates on the
 * build machine behaves the same way in a learner's tab.
 *
 * WHAT IT DOES
 *   · Runs the learner's code in a fresh namespace, with stdout captured.
 *   · Answers input() from a scripted list, and ECHOES each answer after its
 *     prompt, so the captured output reads exactly like a terminal session:
 *         What is your name? Ada
 *         Hello, Ada
 *     Running out of scripted answers raises EOFError, which also stops a
 *     learner's `while True: input()` loop instead of hanging the tab.
 *   · Counts executed lines and stops the program after LINE_BUDGET, so an
 *     infinite loop ends with an explanation rather than a frozen page.
 *   · Then runs each test's `check`: plain Python asserts, evaluated in the
 *     learner's own namespace (so a check can call the function they wrote)
 *     plus a few helpers:
 *
 *         output        everything the program printed, prompts included
 *         lines         output split into lines, trailing blank lines dropped
 *         source        the learner's code, as text
 *         inputs        the scripted answers this run was given
 *         calls("print")     True if the code calls print anywhere
 *         uses("For")        True if the code contains an ast.For node
 *         norm(text)         lower-cased, whitespace collapsed
 *
 *     A test may also carry `files`: { "name.csv": "text" }, written to the
 *     working directory before the run, for lessons that read files.
 *
 *     The assert MESSAGE is what the learner sees when a check fails, so
 *     every assert in a lesson carries one written for a beginner.
 *
 * Never interpolate learner code into this source. The browser passes it in
 * as a variable and the validator passes it in a JSON file.
 */

export const PY_HARNESS = String.raw`
import ast as __ast
import builtins as __builtins
import importlib as __importlib
import io as __io
import json as __json
import linecache as __linecache
import os as __os
import tempfile as __tempfile
import sys as __sys
import traceback as __traceback
import types as __types

__ACADEMY_LINE_BUDGET = 400000
__ACADEMY_MAX_OUTPUT = 20000


class __AcademyStop(BaseException):
    pass


def __academy_format_error(exc):
    # Keep only the learner's own frames: the harness is not their code, and
    # a traceback that points into it would send a beginner looking for a
    # file they have never seen.
    frames = [
        f for f in __traceback.extract_tb(exc.__traceback__)
        if f.filename == "<your code>"
    ]
    head = ""
    if frames:
        head = "Traceback (most recent call last):\n" + "".join(__traceback.format_list(frames))
    return (head + "".join(__traceback.format_exception_only(type(exc), exc))).rstrip()


def __academy_helpers(src, output, inputs):
    try:
        tree = __ast.parse(src)
    except SyntaxError:
        tree = __ast.parse("")

    def calls(name):
        for node in __ast.walk(tree):
            if isinstance(node, __ast.Call):
                f = node.func
                if isinstance(f, __ast.Name) and f.id == name:
                    return True
                if isinstance(f, __ast.Attribute) and f.attr == name:
                    return True
        return False

    def uses(kind):
        cls = getattr(__ast, kind, None)
        return cls is not None and any(isinstance(n, cls) for n in __ast.walk(tree))

    def norm(text):
        return " ".join(str(text).lower().split())

    lines = output.rstrip("\n").split("\n") if output.strip() else []
    return {
        "output": output,
        "lines": lines,
        "source": src,
        "inputs": list(inputs),
        "calls": calls,
        "uses": uses,
        "norm": norm,
    }


def __academy_run_one(src, inputs, check, files=None):
    # Fixture files the task reads, written fresh before every run so one
    # attempt cannot leave behind something the next attempt depends on.
    for __name, __text in (files or {}).items():
        __folder = __os.path.dirname(__name)
        if __folder:
            __os.makedirs(__folder, exist_ok=True)
        with open(__name, "w", encoding="utf-8", newline="") as __fh:
            __fh.write(__text)

    # Fixture modules must be importable, and freshly: forget any copy an
    # earlier run imported, so "import geometry" reads the file written above.
    if files:
        if __os.getcwd() not in __sys.path:
            __sys.path.insert(0, __os.getcwd())
        for __name in files:
            __top = __name.replace("\\", "/").split("/")[0]
            __mod = __top[:-3] if __top.endswith(".py") else __top
            for __key in [k for k in __sys.modules if k == __mod or k.startswith(__mod + ".")]:
                del __sys.modules[__key]
        __importlib.invalidate_caches()

    feed = [str(v) for v in (inputs or [])]
    buf = __io.StringIO()
    counter = [0]

    def fake_input(prompt=""):
        buf.write(str(prompt))
        if not feed:
            raise EOFError("EOF when reading a line")
        value = feed.pop(0)
        buf.write(value + "\n")
        return value

    def tracer(frame, event, arg):
        if event == "line":
            counter[0] += 1
            if counter[0] > __ACADEMY_LINE_BUDGET:
                raise __AcademyStop(
                    "Your program was stopped because it ran for too long. "
                    "The usual cause is a loop whose condition never becomes False."
                )
            if buf.tell() > __ACADEMY_MAX_OUTPUT:
                raise __AcademyStop(
                    "Your program was stopped because it printed far too much. "
                    "Check for a print() inside a loop that never ends."
                )
        return tracer

    # Register the source so a traceback can quote the offending line.
    __linecache.cache["<your code>"] = (len(src), None, src.splitlines(True), "<your code>")

    # The learner's code runs as a real module registered as __main__, for the
    # length of this run, so unittest.mock.patch("__main__.name") reaches it.
    module = __types.ModuleType("__main__")
    ns = module.__dict__
    real_main = __sys.modules.get("__main__")
    __sys.modules["__main__"] = module
    error = ""
    message = ""
    real_out, real_input = __sys.stdout, __builtins.input
    __sys.stdout = buf
    __builtins.input = fake_input
    __sys.settrace(tracer)
    try:
        exec(compile(src, "<your code>", "exec"), ns)
    except __AcademyStop as exc:
        error = str(exc)
    except SystemExit:
        pass
    except BaseException as exc:
        error = __academy_format_error(exc)
    finally:
        __sys.settrace(None)
        __sys.stdout = real_out
        __builtins.input = real_input

    output = buf.getvalue()
    ok = not error

    if check and ok:
        env = dict(ns)
        env.update(__academy_helpers(src, output, inputs or []))
        check_out = __io.StringIO()
        __sys.stdout = check_out
        __builtins.input = fake_input
        __sys.settrace(tracer)
        try:
            exec(compile(check, "<check>", "exec"), env)
        except AssertionError as exc:
            ok = False
            message = str(exc) or "Your program does not do what the task asks yet."
        except __AcademyStop as exc:
            ok = False
            message = str(exc)
        except NameError as exc:
            ok = False
            message = (
                "The check looked for something your code does not define: "
                + str(exc) + ". Check the spelling of your names against the task."
            )
        except BaseException as exc:
            ok = False
            message = "Running your code for the check raised " + type(exc).__name__ + ": " + str(exc)
        finally:
            __sys.settrace(None)
            __sys.stdout = real_out
            __builtins.input = real_input
    elif error:
        message = "Your code stopped with an error. Read the last line of the message: it names the problem."

    if real_main is not None:
        __sys.modules["__main__"] = real_main
    return {"ok": ok, "output": output, "error": error, "message": message}


def __academy_run_challenge(src, tests):
    """Run every test in order and stop at the first that fails."""
    results = []
    for test in tests or [{}]:
        result = __academy_run_one(
            src, test.get("inputs") or [], test.get("check") or "", test.get("files") or {}
        )
        result["label"] = test.get("label") or ""
        results.append(result)
        if not result["ok"]:
            break
    passed = len(results) == len(tests or [{}]) and all(r["ok"] for r in results)
    return {"passed": passed, "results": results}
`;

/**
 * The CPython entry point the validator appends: read a JSON list of jobs from
 * the file named on the command line and print one JSON result per job.
 */
export const PY_HARNESS_BATCH_MAIN = String.raw`
if __name__ == "__main__":
    with open(__sys.argv[1], encoding="utf-8") as fh:
        __jobs = __json.load(fh)
    __out = []
    for __job in __jobs:
        # A fresh, empty folder per job, so no run sees files another left.
        __os.chdir(__tempfile.mkdtemp())
        __out.append({"id": __job["id"], "result": __academy_run_challenge(__job["code"], __job["tests"])})
    __sys.stdout.write(__json.dumps(__out))
`;
