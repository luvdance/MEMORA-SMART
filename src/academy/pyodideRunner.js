/**
 * RUNNING REAL PYTHON IN THE BROWSER
 *
 * Pyodide is CPython compiled to WebAssembly. It runs the learner's actual
 * code — pandas included — with no server and no install.
 *
 * THE COST, STATED HONESTLY
 * The runtime is a multi-megabyte download, and pandas adds several more. For
 * a learner on metered mobile data that is real money, so NOTHING is fetched
 * until they press a button that says so. Once loaded it is cached by the
 * browser and reused for the rest of the session, so the cost is paid once.
 *
 * Everything here is lazy. Import this module freely; it downloads nothing
 * until ensurePyodide() is called.
 */

const PYODIDE_VERSION = "314.0.7";
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let loaderPromise = null;
let pyodide = null;
const loadedPackages = new Set();

/** Inject the Pyodide loader script once. */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-pyodide="1"]`);
    if (existing) {
      if (window.loadPyodide) resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const tag = document.createElement("script");
    tag.src = src;
    tag.async = true;
    tag.dataset.pyodide = "1";
    tag.onload = () => resolve();
    tag.onerror = () =>
      reject(new Error("Could not reach the Python runtime. Check your connection."));
    document.head.appendChild(tag);
  });
}

/**
 * Boot Pyodide, once. `onProgress` receives short human-readable stages so the
 * UI can say what is happening during a long first download.
 */
export function ensurePyodide(onProgress = () => {}) {
  if (pyodide) return Promise.resolve(pyodide);
  if (loaderPromise) return loaderPromise;

  loaderPromise = (async () => {
    onProgress("Downloading the Python runtime…");
    await loadScript(`${CDN}pyodide.js`);
    onProgress("Starting Python…");
    pyodide = await window.loadPyodide({ indexURL: CDN });
    onProgress("Ready");
    return pyodide;
  })().catch((err) => {
    // Let a later attempt retry rather than caching the failure forever.
    loaderPromise = null;
    throw err;
  });

  return loaderPromise;
}

/** Load packages such as pandas, skipping any already present. */
async function ensurePackages(packages, onProgress) {
  const missing = packages.filter((p) => !loadedPackages.has(p));
  if (!missing.length) return;
  onProgress(`Loading ${missing.join(", ")}… (this is the big one)`);
  await pyodide.loadPackage(missing);
  for (const p of missing) loadedPackages.add(p);
}

/**
 * Run code and return everything it printed.
 *
 * stdout is redirected inside Python rather than read from the console, so the
 * output is captured exactly as a terminal would show it — and a traceback is
 * returned as text rather than thrown, because a learner needs to READ the
 * error, which is the whole of lesson 68.
 */
export async function runPython(code, { packages = [], onProgress = () => {} } = {}) {
  await ensurePyodide(onProgress);
  await ensurePackages(packages, onProgress);
  onProgress("Running…");

  // Never interpolate learner code into a Python string — set it as a variable
  // and let Python read it, so quotes and backslashes cannot break out.
  pyodide.globals.set("__academy_source", code);

  const harness = `
import io, os, sys, base64, traceback

# Force a non-interactive backend BEFORE any user import of pyplot, so a plot
# is rendered to a buffer we can hand back rather than to a canvas we do not
# own. Without this, matplotlib in Pyodide tries to draw into the page.
os.environ.setdefault("MPLBACKEND", "AGG")

__academy_buffer = io.StringIO()
__academy_stdout = sys.stdout
sys.stdout = __academy_buffer
__academy_error = ""
try:
    exec(compile(__academy_source, "<your code>", "exec"), {"__name__": "__main__"})
except BaseException:
    __academy_error = traceback.format_exc()
finally:
    sys.stdout = __academy_stdout

# Collect any figures the code drew, as base64 PNGs. A plot is the point of a
# visualisation lesson, so returning only stdout would make half this module
# impossible to practise.
__academy_images = []
if "matplotlib" in sys.modules:
    try:
        import matplotlib.pyplot as __plt
        for __num in __plt.get_fignums():
            __fig = __plt.figure(__num)
            __buf = io.BytesIO()
            __fig.savefig(__buf, format="png", dpi=110, bbox_inches="tight")
            __academy_images.append(base64.b64encode(__buf.getvalue()).decode("ascii"))
        __plt.close("all")
    except BaseException:
        pass

(__academy_buffer.getvalue(), __academy_error, __academy_images)
`;

  const result = await pyodide.runPythonAsync(harness);
  const [out, err, imgs] = result.toJs ? result.toJs() : result;
  if (result.destroy) result.destroy();
  onProgress("");
  return {
    stdout: String(out || ""),
    error: String(err || ""),
    images: Array.from(imgs || []).map((b64) => `data:image/png;base64,${b64}`),
  };
}

/** Has the runtime already been paid for in this session? */
export const isPythonReady = () => Boolean(pyodide);
