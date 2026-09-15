/**
 * A real <table>, not ASCII art in a <pre>.
 *
 * Screen readers can announce a proper table, it reflows on a phone, and the
 * columns stay aligned whatever the font. `variant: "spreadsheet"` adds the
 * A/B/C column letters and 1/2/3 row numbers so an Excel grid looks like one.
 */
export default function AtomTable({ table }) {
  const { caption, headers = [], rows = [], variant, note } = table;
  const isSheet = variant === "spreadsheet";
  const columnLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <figure className={`ac-table ${isSheet ? "ac-table--sheet" : ""}`}>
      {caption && <figcaption>{caption}</figcaption>}

      <div className="ac-table__scroll">
        <table>
          {isSheet && (
            <thead>
              <tr>
                <th scope="col" className="ac-table__corner" aria-label="Row numbers" />
                {headers.map((_, i) => (
                  <th scope="col" key={columnLetters[i]} className="ac-table__ref">
                    {columnLetters[i]}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <thead>
            <tr>
              {isSheet && (
                <th scope="row" className="ac-table__ref">
                  1
                </th>
              )}
              {headers.map((header) => (
                <th scope="col" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {isSheet && (
                  <th scope="row" className="ac-table__ref">
                    {rowIndex + 2}
                  </th>
                )}
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {note && <p className="ac-table__note">{note}</p>}
    </figure>
  );
}
