/**
 * PYTHON PREAMBLES FOR `predict` ITEMS
 *
 * A candidate asked what a snippet prints must be able to see how the
 * DataFrame was built — column names, dtypes and row order all affect the
 * output, and guessing at them is not the skill being tested. So the preamble
 * is shown above the snippet on the paper.
 *
 * It is also the code the content validator prepends when it RUNS each snippet
 * in CPython to check the item's expected output. One source of truth: if the
 * preamble shown to the candidate ever drifted from the one used to verify the
 * answer, the item would be unanswerable and nobody would notice.
 *
 * Each preamble reproduces its case table from cases.js exactly. The values
 * are duplicated here rather than generated, because the verified outputs in
 * the bank were produced against these literal frames — a clever generator
 * that reordered a column would silently invalidate every expected output.
 */

export const PY_SETUP = {
  zuri: `import pandas as pd

appts = pd.DataFrame({
    "clinic": ["Ikeja"]*10 + ["Lekki"]*5 + ["Yaba"]*5,
    "channel": ["App","Phone","Walk-in","App","Phone","App","Phone","Walk-in","App","Phone",
                "Phone","App","Phone","Walk-in","Phone",
                "Walk-in","App","Walk-in","Phone","Walk-in"],
    "status": ["Attended","No-show","Attended","Attended","Cancelled","Attended","No-show",
               "Attended","Attended","Attended",
               "No-show","Attended","No-show","Attended","Cancelled",
               "Attended","Attended","Attended","No-show","Attended"],
    "fee": [18000]*10 + [25000]*5 + [15000]*5,
})
`,

  solar: `import pandas as pd

jobs = pd.DataFrame({
    "state": ["Lagos","Lagos","Abuja","Abuja","Lagos","Lagos","Kano","Kano","Lagos","Abuja","Abuja","Kano"],
    "package": ["Home","SME","Home","SME","Home","SME","Home","SME","Home","Home","SME","Home"],
    "price": [850000,2400000,850000,2400000,850000,2400000,850000,2400000,850000,850000,2400000,850000],
    "install": [610000,1750000,600000,1790000,615000,1760000,605000,1820000,600000,620000,1780000,610000],
    "warranty": [0,180000,0,240000,45000,0,0,310000,0,0,150000,38000],
})
jobs["gross"] = jobs["price"] - jobs["install"]
jobs["net"] = jobs["gross"] - jobs["warranty"]
`,

  logistics: `import pandas as pd

runs = pd.DataFrame({
    "route": ["Ibadan"]*4 + ["Abuja"]*4 + ["Kano"]*4 + ["PortHarc"]*4,
    "promised": [2,2,2,2, 4,4,4,4, 6,6,6,6, 3,3,3,3],
    "actual":   [2,3,2,1, 4,6,5,4, 7,6,21,6, 3,4,3,3],
})
runs["delay"] = runs["actual"] - runs["promised"]
`,
};

export default PY_SETUP;
