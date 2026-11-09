/**
 * ASSESSMENTS · MACHINE LEARNING AND AI · MODULE 24
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */
import { q, check } from "./ml-helpers.js";

export const ASSESSMENTS = {
  ...check("ml-l105-capstone-problem-data", [
    q("mlq105-1", "a-ml-choosing-capstone", 2, "What makes a capstone idea feasible?",
      ["A specific decision, accessible data, and a scope that can be completed end to end", "Narrow and thorough beats broad and shallow."],
      [["Using the largest possible model", "Size does not create feasibility."],
       ["A goal such as \"improve agriculture with AI\"", "Too vague to evaluate."],
       ["Avoiding any baseline", "A baseline is essential."]]),
    q("mlq105-2", "a-ml-problem-statement", 2, "Why must a problem statement fix the prediction moment?",
      ["It decides which features are legitimately available, which prevents leakage", "Week 4 data cannot include the final exam."],
      [["To schedule the presentation", "Unrelated."],
       ["To choose the programming language", "Unrelated."],
       ["It is optional", "It is essential for leakage-free features."]]),
    q("mlq105-3", "a-ml-problem-statement", 3, "A fraud baseline scores 97% accuracy because 97% of transactions are legitimate. The team targets 96% accuracy. What is wrong?",
      ["The target does not beat the baseline, and accuracy is the wrong metric for imbalanced data", "Use recall, precision or precision@k."],
      [["Nothing", "Both problems are serious."],
       ["96% is too ambitious", "It is below doing nothing."],
       ["Fraud cannot be predicted", "It can, with the right metric."]]),
    q("mlq105-4", "a-ml-dataset-description", 2, "Which belongs in a dataset description?",
      ["Source, licence, collection method, row meaning, column types, missing values and target balance", "Enough to judge fitness for purpose."],
      [["The final model's accuracy", "That belongs in the results."],
       ["The presentation slides", "Unrelated."],
       ["Only the column names", "Far too little."]]),
  ]),

  ...check("ml-l106-capstone-modelling", [
    q("mlq106-1", "a-ml-preprocessing-documentation", 2, "Why record row counts before and after each cleaning step?",
      ["So reviewers can see exactly how much data each decision removed and judge whether it biased the sample", "Silent row loss is a common bug."],
      [["To make the report longer", "Not the purpose."],
       ["Because pandas requires it", "It does not."],
       ["To speed up training", "Unrelated."]]),
    q("mlq106-2", "a-ml-algorithm-justification", 3, "Which justification is strongest?",
      ["\"Logistic regression was within 0.01 F1 of gradient boosting in 5-fold CV, is explainable to teachers and trains in a second\"", "Evidence plus stated constraints."],
      [["\"I used XGBoost because it usually wins\"", "No evidence for this problem."],
       ["\"Neural networks are the future\"", "Not a justification."],
       ["\"It was the first model I tried\"", "No comparison."]]),
    q("mlq106-3", "a-ml-capstone-training-evaluation", 2, "How many times should the final test set be used?",
      ["Once, after all choices are made", "Repeated use turns it into a validation set."],
      [["After every experiment", "That leaks test information into choices."],
       ["Never", "It is needed for the final estimate."],
       ["As often as needed to reach the target", "That is overfitting to the test set."]]),
    q("mlq106-4", "a-ml-capstone-training-evaluation", 3, "The final test result is worse than hoped. What should the capstone report do?",
      ["Report it honestly with analysis of errors and next steps", "A documented negative result is valuable."],
      [["Retune on the test set until it improves", "That invalidates the result."],
       ["Report only the validation score", "Misleading."],
       ["Remove the hard test examples", "Dishonest."]]),
  ]),

  ...check("ml-l107-capstone-delivery", [
    q("mlq107-1", "a-ml-performance-metrics", 2, "What does a bootstrap confidence interval for a test metric show?",
      ["How much the metric could vary given the limited test sample", "Wider for smaller test sets."],
      [["The training loss", "Unrelated."],
       ["The best possible score", "It shows uncertainty, not a maximum."],
       ["The number of features", "Unrelated."]]),
    q("mlq107-2", "a-ml-capstone-application", 2, "What is the minimum working application for the capstone?",
      ["A validated API with health and prediction endpoints that loads the saved pipeline once", "A frontend is a strong addition."],
      [["A notebook with plots", "Not an application."],
       ["A slide deck", "Not usable software."],
       ["The training script alone", "Does not serve predictions."]]),
    q("mlq107-3", "a-ml-repository-documentation", 2, "Which should never be committed to the capstone repository?",
      ["A .env file containing API keys", "Secrets stay out of Git."],
      [["requirements.txt", "Should be committed."],
       ["Tests", "Should be committed."],
       ["The README", "Should be committed."]]),
    q("mlq107-4", "a-ml-project-presentation", 2, "What should take most of a ten-minute capstone presentation?",
      ["The problem, results against a baseline with uncertainty, a demo and limitations", "The story and the evidence."],
      [["Walking through the code line by line", "Code belongs in the repository."],
       ["The history of machine learning", "Off topic."],
       ["Installation instructions", "Those belong in the README."]]),
  ]),
};
