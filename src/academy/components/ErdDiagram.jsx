/**
 * AN ENTITY-RELATIONSHIP DIAGRAM, drawn from the real database.
 *
 * Nothing here is drawn by hand. The schema comes from PostgreSQL's own
 * catalog after the SQL ran (engine.js describeSchema), so the diagram can
 * only show the keys and relationships the database actually enforces. A
 * learner who forgets a REFERENCES clause sees the line disappear.
 *
 * Layout: a table that references nothing sits in the first column; a table
 * whose foreign keys point at tables in column n sits in column n + 1, so
 * relationships read left to right, parent to child.
 *
 * Notation: crow's foot, the one most tools use.
 *   parent end  ||   exactly one (the foreign key is NOT NULL)
 *               o|   zero or one (the foreign key may be NULL)
 *   child end   o<   zero or many (any number of rows may point at a parent)
 *               o|   zero or one (the foreign key is also UNIQUE: one-to-one)
 */

const BOX_W = 210;
const GAP_X = 90;
const GAP_Y = 26;
const HEAD_H = 28;
const ROW_H = 21;
const PAD = 12;

function layout(schema) {
  const tables = schema.tables.filter((t) => !t.view);
  const byName = new Map(tables.map((t) => [t.name, t]));
  const parents = new Map(tables.map((t) => [t.name, []]));
  for (const link of schema.links) {
    if (link.from !== link.to && byName.has(link.to)) parents.get(link.from)?.push(link.to);
  }
  const depth = new Map();
  const visit = (name, trail = new Set()) => {
    if (depth.has(name)) return depth.get(name);
    if (trail.has(name)) return 0;
    trail.add(name);
    const d = Math.max(-1, ...(parents.get(name) || []).map((p) => visit(p, trail))) + 1;
    depth.set(name, d);
    return d;
  };
  tables.forEach((t) => visit(t.name));
  const columns = [];
  for (const t of tables) (columns[depth.get(t.name)] ||= []).push(t);
  const boxes = new Map();
  let height = 0;
  columns.forEach((col, ci) => {
    let y = PAD;
    for (const t of col || []) {
      const h = HEAD_H + t.columns.length * ROW_H + 6;
      boxes.set(t.name, { x: PAD + ci * (BOX_W + GAP_X), y, h, table: t });
      y += h + GAP_Y;
    }
    height = Math.max(height, y);
  });
  const width = PAD * 2 + columns.length * BOX_W + Math.max(0, columns.length - 1) * GAP_X;
  return { boxes, width, height: height + PAD - GAP_Y };
}

const rowY = (box, column) => {
  const i = Math.max(0, box.table.columns.findIndex((c) => c.name === column));
  return box.y + HEAD_H + i * ROW_H + ROW_H / 2;
};

/** A crow's-foot end mark at (x, y), pointing away from the box (dir = ±1). */
function End({ x, y, dir, many, optional, label }) {
  const a = x + dir * 8;
  const b = x + dir * 16;
  return (
    <g className="ac-erd__mark" aria-label={label}>
      {many ? (
        <>
          <line x1={x} y1={y - 7} x2={a} y2={y} />
          <line x1={x} y1={y + 7} x2={a} y2={y} />
          <line x1={x} y1={y} x2={a} y2={y} />
        </>
      ) : (
        <line x1={a - dir * 2} y1={y - 7} x2={a - dir * 2} y2={y + 7} />
      )}
      {optional ? (
        <circle cx={b + dir * 3} cy={y} r={4} className="ac-erd__ring" />
      ) : (
        <line x1={b} y1={y - 7} x2={b} y2={y + 7} />
      )}
    </g>
  );
}

export default function ErdDiagram({ schema, title = "Entity-relationship diagram" }) {
  if (!schema) return null;
  const tables = schema.tables.filter((t) => !t.view);
  if (!tables.length) {
    return (
      <div className="ac-erd ac-erd--empty">
        <span className="ac-note__label">{title}</span>
        <p>No tables yet. Create some and run your SQL: the diagram is drawn from the database.</p>
      </div>
    );
  }
  const { boxes, width, height } = layout(schema);
  const lines = [];
  for (const link of schema.links) {
    const child = boxes.get(link.from);
    const parent = boxes.get(link.to);
    if (!child || !parent) continue;
    const cy = rowY(child, link.fromCols[0]);
    const py = rowY(parent, link.toCols[0]);
    const describe = `${link.to} to ${link.from}: ${link.oneToOne ? "one to zero-or-one" : "one to many"}${link.required ? "" : ", optional"}`;
    if (child === parent) {
      // A self-reference (an employee's manager is an employee) loops on the right.
      const x = child.x + BOX_W;
      lines.push(
        <g key={link.name}>
          <title>{describe}</title>
          <path className="ac-erd__line" d={`M ${x} ${py} h 34 V ${cy} h -34`} fill="none" />
          <End x={x} y={py} dir={1} many={false} optional={!link.required} label="parent end" />
          <End x={x} y={cy} dir={1} many={!link.oneToOne} optional label="child end" />
        </g>
      );
      continue;
    }
    const leftToRight = parent.x < child.x;
    const px = leftToRight ? parent.x + BOX_W : parent.x;
    const cx = leftToRight ? child.x : child.x + BOX_W;
    const bend = (cx - px) / 2;
    lines.push(
      <g key={link.name}>
        <title>{describe}</title>
        <path className="ac-erd__line" d={`M ${px} ${py} C ${px + bend} ${py}, ${cx - bend} ${cy}, ${cx} ${cy}`} fill="none" />
        <End x={px} y={py} dir={leftToRight ? 1 : -1} many={false} optional={!link.required} label="parent end" />
        <End x={cx} y={cy} dir={leftToRight ? -1 : 1} many={!link.oneToOne} optional label="child end" />
      </g>
    );
  }
  return (
    <figure className="ac-erd">
      <figcaption className="ac-note__label">{title}</figcaption>
      <div className="ac-erd__scroll">
        <div className="ac-erd__canvas" style={{ width, height }}>
          <svg className="ac-erd__svg" width={width} height={height} aria-hidden="true">
            {lines}
          </svg>
          {[...boxes.values()].map(({ x, y, table }) => (
            <div key={table.name} className="ac-erd__table" style={{ left: x, top: y, width: BOX_W }}>
              <div className="ac-erd__name">{table.name}</div>
              <ul>
                {table.columns.map((c) => (
                  <li key={c.name} className={c.pk ? "is-pk" : ""}>
                    <span className="ac-erd__key">{[c.pk && "PK", c.fk && "FK"].filter(Boolean).join(" ")}</span>
                    <span className="ac-erd__col">{c.name}</span>
                    <span className="ac-erd__type">
                      {c.type}
                      {c.notNull && !c.pk ? " *" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="ac-erd__legend">
        PK primary key · FK foreign key · * NOT NULL · lines run from the parent (left) to the child
        table: <strong>||</strong> exactly one, <strong>o|</strong> zero or one, <strong>o&lt;</strong> zero or many.
      </p>
    </figure>
  );
}
