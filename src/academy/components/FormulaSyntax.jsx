/**
 * FORMULA SYNTAX CARD
 *
 * Every function atom states its signature before it states anything else.
 * A learner who has seen RANK.EQ used once can copy that one use; a learner
 * who has seen RANK.EQ(number, ref, [order]) can work out the next one
 * unaided, and can read Excel's own tooltip when it appears.
 *
 * The convention is declared on the card itself rather than assumed, because
 * square brackets meaning "optional" is knowledge, not intuition.
 *
 * Shape:
 *   syntax: {
 *     pattern: "=RANK.EQ(number, ref, [order])",
 *     args: [
 *       ["number", "The value being ranked.", "required"],
 *       ["[order]", "0 or omitted ranks largest first.", "optional"],
 *     ],
 *     returns: "A whole number position.",
 *     note: "Lock the range with $ before filling down.",
 *   }
 *
 * `args` entries are [name, description, requirement?]. A bare string
 * `syntax` is accepted too, for the rare operator that has no arguments.
 */
export default function FormulaSyntax({ syntax }) {
  if (!syntax) return null;

  const isString = typeof syntax === "string";
  const pattern = isString ? syntax : syntax.pattern;
  const args = isString ? [] : syntax.args || [];
  const hasOptional = args.some(
    ([name, , req]) => req === "optional" || /^\[.*\]$/.test(String(name))
  );

  return (
    <div className="ac-syntax">
      <div className="ac-syntax__head">
        <span className="ac-syntax__label">Syntax</span>
        {hasOptional && (
          <span className="ac-syntax__legend">
            <code>[ ]</code> marks an optional argument
          </span>
        )}
      </div>

      <code className="ac-syntax__pattern">{pattern}</code>

      {args.length > 0 && (
        <dl className="ac-syntax__args">
          {args.map(([name, description, requirement]) => {
            const optional =
              requirement === "optional" || /^\[.*\]$/.test(String(name));
            return (
              <div className="ac-syntax__arg" key={name}>
                <dt>
                  <code>{name}</code>
                  <span
                    className={`ac-syntax__req ${
                      optional ? "is-optional" : "is-required"
                    }`}
                  >
                    {optional ? "optional" : "required"}
                  </span>
                </dt>
                <dd>{description}</dd>
              </div>
            );
          })}
        </dl>
      )}

      {!isString && syntax.returns && (
        <p className="ac-syntax__returns">
          <strong>Returns:</strong> {syntax.returns}
        </p>
      )}

      {!isString && syntax.note && (
        <p className="ac-syntax__note">{syntax.note}</p>
      )}
    </div>
  );
}
