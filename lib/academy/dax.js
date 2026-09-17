/**
 * DAX MEASURE EVALUATOR
 *
 * The hardest idea in DAX is that a measure has no single value. It is
 * re-evaluated once per cell, under whatever filter that cell sits in — so the
 * same measure returns 186,000 on the Lagos row and 495,000 on the total row,
 * and a learner who has not seen that happen cannot reason about CALCULATE.
 *
 * So this evaluates measures the way the engine does: once per row of the
 * visual, against the fact rows that survive that row's filter. Then a lesson
 * can put SUM and CALCULATE(SUM, ALL(...)) side by side in one table and the
 * difference is visible rather than described.
 *
 * It is deliberately NOT a DAX parser. Measures are declared as descriptors,
 * so the lesson shows real DAX text beside a value this module computed, and
 * the validator can check the two agree.
 *
 * Descriptor kinds:
 *   sum            SUM(fact[col])                        — obeys filter context
 *   count          COUNTROWS(fact)                       — obeys filter context
 *   average        AVERAGE(fact[col])                    — obeys filter context
 *   distinctcount  DISTINCTCOUNT(fact[col])              — obeys filter context
 *   sumAll         CALCULATE(SUM(fact[col]), ALL(dim))   — IGNORES the row filter
 *   sumWhere       CALCULATE(SUM(fact[col]), fact[c] op v) — narrows further
 *   ratio          DIVIDE(a, b)                          — reads two other measures
 */

const col = (t, name) => t.headers.indexOf(name);

function matchesOp(value, op, target) {
  const a = Number(value);
  const b = Number(target);
  switch (op) {
    case ">": return a > b;
    case ">=": return a >= b;
    case "<": return a < b;
    case "<=": return a <= b;
    case "=": return String(value) === String(target);
    case "<>": return String(value) !== String(target);
    default: return true;
  }
}

const numbers = (fact, rows, column) => {
  const i = col(fact, column);
  return rows.map((r) => Number(r[i])).filter((n) => !Number.isNaN(n));
};

/** Evaluate one measure descriptor against a set of fact rows. */
function evaluateOne(measure, { fact, rowsInContext, allRows, already }) {
  switch (measure.kind) {
    case "sum":
      return numbers(fact, rowsInContext, measure.column).reduce((a, b) => a + b, 0);

    case "count":
      return rowsInContext.length;

    case "average": {
      const n = numbers(fact, rowsInContext, measure.column);
      return n.length ? n.reduce((a, b) => a + b, 0) / n.length : null;
    }

    case "distinctcount": {
      const i = col(fact, measure.column);
      return new Set(rowsInContext.map((r) => String(r[i]))).size;
    }

    // ALL() removes the filter the row applied, which is how a percent-of-total
    // measure gets a denominator that does not shrink with its own row.
    case "sumAll":
      return numbers(fact, allRows, measure.column).reduce((a, b) => a + b, 0);

    case "sumWhere": {
      const i = col(fact, measure.filterColumn);
      const kept = rowsInContext.filter((r) => matchesOp(r[i], measure.op, measure.value));
      return numbers(fact, kept, measure.column).reduce((a, b) => a + b, 0);
    }

    // DIVIDE returns blank rather than an error when the denominator is zero.
    case "ratio": {
      const a = already[measure.of];
      const b = already[measure.over];
      if (!b) return null;
      return a / b;
    }

    default:
      return null;
  }
}

/**
 * Evaluate every measure once per dimension row, plus once for the total row
 * where no dimension filter applies. That final row is what makes the
 * difference between SUM and CALCULATE(..., ALL()) visible: on the total row
 * they agree, and on every other row they do not.
 */
export function evaluateMeasures({ dim, fact, dimCol, factCol, labelColumn }, measures = []) {
  const keyIdx = col(dim, dimCol);
  const labelIdx = col(dim, labelColumn);
  const fIdx = col(fact, factCol);
  const allRows = fact.rows;

  const evalRow = (rowsInContext) => {
    const already = {};
    for (const m of measures) {
      already[m.name] = evaluateOne(m, { fact, rowsInContext, allRows, already });
    }
    return already;
  };

  const rows = dim.rows.map((r) => {
    const key = String(r[keyIdx]);
    const rowsInContext = allRows.filter((f) => String(f[fIdx]) === key);
    return {
      label: String(r[labelIdx]),
      rowCount: rowsInContext.length,
      values: evalRow(rowsInContext),
    };
  });

  return {
    rows,
    total: { label: "Total", rowCount: allRows.length, values: evalRow(allRows) },
  };
}

/**
 * The classic beginner bug: a percent-of-total measure whose denominator
 * forgot ALL(). Returns the broken result so a lesson can show it beside the
 * correct one — every row reads 100%, because the denominator shrank to match
 * its own row.
 */
export function withoutAll(model, measures) {
  const broken = measures.map((m) =>
    m.kind === "sumAll" ? { ...m, kind: "sum" } : m
  );
  return evaluateMeasures(model, broken);
}
