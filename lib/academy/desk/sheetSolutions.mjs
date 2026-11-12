/**
 * VIRTUAL ASSISTANT — MODEL ANSWERS FOR THE SPREADSHEET EXERCISES
 *
 * SERVER ONLY. Like EXERCISE_SOLUTIONS in lib/academy/validateContent.mjs
 * (which merges this map), each model formula is evaluated with the grid's
 * own engine and must produce the exercise's `expected` value.
 */
export const VA_EXERCISE_SOLUTIONS = {
  // Module 5 · office applications
  "a-va-sum": "=SUM(D2:D8)",
  "a-va-average": "=ROUND(AVERAGE(D2:D8),0)",
  "a-va-if": '=IF(D3>50000,"Needs approval","OK")',
  "a-va-sumif": '=SUMIF(C2:C8,"Travel",D2:D8)',
  "a-va-m5-expense": "=SUMIF(C2:C8,F2,D2:D8)",

  // Module 6 · research and data
  "a-va-countif": '=COUNTIF(D2:D11,"Yes")',
  "a-va-percent": '=COUNTIF(C2:C11,">=4")/COUNT(C2:C11)',

  // Module 7 · customer service
  "a-va-nps-sheet": '=(COUNTIF(B2:B11,">=9")-COUNTIF(B2:B11,"<=6"))/COUNT(B2:B11)*100',

  // Module 9 · social media
  "a-va-engagement-sheet": "=ROUND(C3/B3*100,1)",

  // Module 10 · AI and automation
  "a-va-ai-sheets": "=SUMIF(B2:B8,E2,C2:C8)",

  // Module 11 · freelancing
  "a-va-fee-sheet": "=B2*B3*(1-B4)",
  "a-va-invoice-sheet": "=SUMPRODUCT(B2:B4,C2:C4)",
};

export default VA_EXERCISE_SOLUTIONS;
