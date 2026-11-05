/**
 * DATA ANALYSIS LESSON REGISTRY
 *
 * One entry per written module, like every other course's registry. It used
 * to live inline in index.js; it has its own file so the browser can load one
 * course's lessons without the other twelve (see lessonIndex.js).
 */

import { LESSONS as FOUNDATIONS } from "./m1-data-foundations.js";
import { LESSONS as EXCEL_SETUP } from "./m1-excel-setup.js";
import { LESSONS as EXCEL_ESSENTIALS } from "./m1-excel-essentials.js";
import { LESSONS as FORMULAS } from "./m1-formulas-functions.js";
import { LESSONS as FORMULAS_2 } from "./m1-formulas-part2.js";
import { LESSONS as CLEANING } from "./m1-clean-structure.js";
import { LESSONS as EXPLORATORY } from "./m2-exploratory.js";
import { LESSONS as PIVOTS } from "./m2-pivots.js";
import { LESSONS as DASHBOARDS } from "./m2-kpis-dashboards.js";
import { LESSONS as PROJECT } from "./m2-project-sales.js";
import { LESSONS as PBI_FOUNDATIONS } from "./m3-pbi-foundations.js";
import { LESSONS as POWER_QUERY } from "./m3-power-query.js";
import { LESSONS as MODELLING } from "./m3-modelling.js";
import { LESSONS as DAX } from "./m3-dax.js";
import { LESSONS as VISUALISATION } from "./m3-visualisation.js";
import { LESSONS as PYTHON_SETUP } from "./m4-python-setup.js";
import { LESSONS as PY_FOUNDATIONS } from "./m4-python-foundations.js";
import { LESSONS as PANDAS } from "./m4-pandas.js";
import { LESSONS as TRANSFORM } from "./m4-transform.js";
import { LESSONS as VISUAL_ANALYSIS } from "./m4-visual-analysis.js";
import { LESSONS as CAPSTONE } from "./m4-capstone.js";

export const DATA_ANALYSIS_LESSONS = {
  "m1-data-foundations": FOUNDATIONS,
  "m1-clean-structure": CLEANING,
  // Three files, one module: the setup lesson, the essentials, and the
  // formats lesson that lives with the formula content. Merged and
  // re-sorted by `order` below, with setup at order 1.
  "m1-excel-essentials": [...EXCEL_SETUP, ...EXCEL_ESSENTIALS, ...FORMULAS_2.filter(
    (l) => l.moduleId === "m1-excel-essentials"
  )],
  // Two files, one module. Merged and re-sorted by `order` below.
  "m1-formulas-functions": [...FORMULAS, ...FORMULAS_2.filter(
    (l) => l.moduleId === "m1-formulas-functions"
  )],
  "m2-exploratory": EXPLORATORY,
  "m2-pivots": PIVOTS,
  "m2-kpis-dashboards": DASHBOARDS,
  "m2-project-sales": PROJECT,
  "m3-pbi-foundations": PBI_FOUNDATIONS,
  "m3-power-query": POWER_QUERY,
  "m3-modelling": MODELLING,
  "m3-dax": DAX,
  "m3-visualisation": VISUALISATION,
  // Setup first, then the language. See m4-python-setup.js for why.
  "m4-python-foundations": [...PYTHON_SETUP, ...PY_FOUNDATIONS],
  "m4-pandas": PANDAS,
  "m4-transform": TRANSFORM,
  "m4-visual-analysis": VISUAL_ANALYSIS,
  "m4-capstone": CAPSTONE,
};

export default DATA_ANALYSIS_LESSONS;
