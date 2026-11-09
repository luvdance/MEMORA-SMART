/**
 * ASSESSMENTS · MACHINE LEARNING AND AI · MODULE 17
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */
import { q, check } from "./ml-helpers.js";

export const ASSESSMENTS = {
  ...check("ml-l76-sequences-time-series", [
    q("mlq76-1", "a-ml-sequential-data", 2, "Classifying the sentiment of a whole review from its words is which kind of sequence task?",
      ["Many-to-one", "A sequence in, one label out."],
      [["One-to-many", "That is one input producing a sequence, such as captioning."],
       ["Many-to-many", "That produces an output per step or a new sequence."],
       ["Not a sequence task", "Word order matters to sentiment."]]),
    q("mlq76-2", "a-ml-sequential-data", 3, "make_windows on a series of 20 values with window 5 and horizon 1 gives how many examples?",
      ["15", "20 − 5 − 1 + 1."],
      [["20", "The first windows need 5 past values."],
       ["16", "The last window still needs a target after it."],
       ["4", "That divides instead of sliding."]]),
    q("mlq76-3", "a-ml-time-series", 2, "Strong autocorrelation at lag 12 in monthly data suggests...",
      ["Yearly seasonality", "Each month resembles the same month a year earlier."],
      [["No pattern at all", "Strong autocorrelation is a pattern."],
       ["A data-entry error", "It is a common, real pattern."],
       ["Daily seasonality", "Lag 12 in monthly data is a year."]]),
    q("mlq76-4", "a-ml-time-series", 3, "What does seasonal differencing (value minus the value 12 months earlier) remove from a monthly series?",
      ["The yearly seasonal pattern, leaving the year-on-year change", "The trend shows up as the average difference."],
      [["All the noise", "Noise remains, even amplified."],
       ["The trend only", "First differencing targets trend; seasonal differencing targets the season."],
       ["Nothing", "It cancels the repeating pattern."]]),
  ]),

  ...check("ml-l77-rnn-lstm-gru", [
    q("mlq77-1", "a-ml-rnn", 2, "What lets one RNN process sequences of any length?",
      ["The same weights are applied at every time step", "Weight sharing through time."],
      [["It has one layer per time step with different weights", "The weights are shared."],
       ["It pads every sequence to 1,000 steps", "Not required."],
       ["It ignores the order of the inputs", "Order is central to RNNs."]]),
    q("mlq77-2", "a-ml-rnn", 3, "What is backpropagation through time?",
      ["Backpropagation applied to the RNN unrolled across its time steps", "Gradients flow back through every step."],
      [["Training on time-ordered batches only", "Not the definition."],
       ["Predicting past values", "Unrelated."],
       ["A way to avoid gradients", "It computes them."]]),
    q("mlq77-3", "a-ml-lstm", 3, "What does an LSTM's forget gate do?",
      ["Decides how much of the previous cell state to keep, multiplying it by values between 0 and 1", "0 erases, 1 keeps."],
      [["Deletes training examples", "It acts on the cell state."],
       ["Chooses the learning rate", "Unrelated."],
       ["Outputs the final prediction", "That is the output layer."]]),
    q("mlq77-4", "a-ml-gru", 2, "How does a GRU differ from an LSTM?",
      ["It has two gates and no separate cell state, so fewer parameters", "Often similar accuracy, faster training."],
      [["It has more gates", "It has fewer."],
       ["It cannot learn long dependencies at all", "It handles them much better than a plain RNN."],
       ["It is not a recurrent network", "It is recurrent."]]),
  ]),

  ...check("ml-l78-forecasting-limitations", [
    q("mlq78-1", "a-ml-sequence-prediction", 2, "What does the seasonal naive forecast predict for next December?",
      ["This December's value", "The value one season ago."],
      [["Last month's value", "That is the naive forecast."],
       ["The average of all months", "That is a mean forecast."],
       ["Zero", "Not a forecast method."]]),
    q("mlq78-2", "a-ml-forecasting", 3, "Why is shuffled k-fold cross-validation wrong for forecasting?",
      ["It trains on future data to predict the past, leaking information", "Use time-based or walk-forward validation."],
      [["It is too slow", "Speed is not the problem."],
       ["Time series have too few rows", "Not the reason."],
       ["It cannot compute MAE", "It can, misleadingly."]]),
    q("mlq78-3", "a-ml-forecasting", 2, "In a monthly sales model, what do lag1 and lag12 features capture?",
      ["Recent level (and trend), and last year's same-month value (season)", "Together, trend and seasonality."],
      [["The month name and year", "Those are calendar features."],
       ["Future sales", "Lags look backwards."],
       ["Noise only", "They carry the main structure."]]),
    q("mlq78-4", "a-ml-rnn-limitations", 3, "Why did Transformers replace RNNs for language tasks?",
      ["Attention links any two positions directly and processes sequences in parallel, avoiding vanishing gradients and slow sequential steps", "No fixed-size bottleneck either."],
      [["RNNs cannot process text", "They can, with limits."],
       ["Transformers need no data", "They need a great deal."],
       ["RNNs have too few parameters", "Not the main reason."]]),
  ]),
};
