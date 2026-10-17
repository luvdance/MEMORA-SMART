import { useMemo, useState } from "react";
import {
  ORDER_TYPES,
  checkOrder,
  fillPrice,
  marginRequired,
  pipSize,
  pipValue,
  sideOf,
} from "../../../lib/academy/forex/engine";

/**
 * ORDER TICKET — placing a trade, practised before it costs anything.
 *
 * Laid out like MetaTrader 5's "New Order" window, on purpose: the learner
 * should open a real demo platform in Week 2 and recognise every field. As
 * they type, the ticket shows what the order MEANS — where it fills, how many
 * pips and dollars it risks, its reward-to-risk and the margin it locks —
 * because the commonest beginner error is submitting an order whose risk they
 * never looked at.
 *
 * Graded against `expect`; the validator proves `expect` is an order a real
 * platform would accept and, where the exercise states a risk percentage,
 * that its lot size is the correct position size.
 *
 *   pair, bid, ask      the quote on screen
 *   balance, leverage   the demo account
 *   quoteToUsd          for crosses (EUR/GBP): the GBP→USD rate
 *   baseToUsd           for crosses: the EUR→USD rate, for margin
 *   expect              { type, side, lots, entry?, sl, tp }
 *   tolerancePips       how far a typed price may be from the expected one
 */
export default function OrderTicket({
  task,
  pair,
  bid,
  ask,
  balance,
  leverage,
  quoteToUsd,
  baseToUsd,
  expect,
  tolerancePips = 0.5,
  explain,
  onSolved,
  alreadySolved = false,
}) {
  const dp = pipSize(pair) === 0.01 ? 3 : 5;
  const [type, setType] = useState(alreadySolved ? expect.type : "market");
  const [side, setSide] = useState(alreadySolved ? expect.side : null);
  const [lots, setLots] = useState(alreadySolved ? String(expect.lots) : "0.01");
  const [entry, setEntry] = useState(alreadySolved && expect.entry ? String(expect.entry) : "");
  const [sl, setSl] = useState(alreadySolved ? String(expect.sl) : "");
  const [tp, setTp] = useState(alreadySolved ? String(expect.tp) : "");
  const [result, setResult] = useState(() =>
    alreadySolved ? { ok: true, message: "You already placed this order correctly." } : null
  );

  const num = (v) => (v === "" || v == null ? null : Number(String(v).replace(/,/g, "")));
  const pending = type !== "market";
  const effSide = pending ? sideOf(type) : side;

  const live = useMemo(() => {
    const L = num(lots);
    const e = pending ? num(entry) : null;
    if (!effSide || !L || L <= 0) return null;
    const fill = fillPrice({ type, side: effSide, bid, ask, entry: e });
    if (fill == null || !Number.isFinite(fill)) return null;
    const pv = pipValue({ pair, lots: L, price: fill, quoteToUsd });
    const s = num(sl);
    const t = num(tp);
    const stopPips = s != null ? Math.abs(fill - s) / pipSize(pair) : null;
    const targetPips = t != null ? Math.abs(t - fill) / pipSize(pair) : null;
    return {
      fill,
      stopPips,
      targetPips,
      risk: stopPips != null ? stopPips * pv : null,
      reward: targetPips != null ? targetPips * pv : null,
      rr: stopPips && targetPips ? targetPips / stopPips : null,
      margin: marginRequired({ pair, lots: L, price: fill, leverage, baseToUsd }),
      problems: checkOrder({ type, side: effSide, bid, ask, entry: e, sl: s, tp: t }),
    };
  }, [type, effSide, lots, entry, sl, tp, bid, ask, pair, leverage, quoteToUsd, baseToUsd, pending]);

  const reset = () => !result?.ok && setResult(null);
  const close = (a, b) => a != null && Math.abs(a - b) / pipSize(pair) <= tolerancePips + 1e-9;

  const submit = () => {
    if (result?.ok) return;
    if (!effSide) return setResult({ ok: false, message: "Choose Sell or Buy." });
    if (live?.problems.length) {
      return setResult({ ok: false, message: `The platform would reject this order. ${live.problems[0]}` });
    }
    if (type !== expect.type || effSide !== expect.side) {
      const want = expect.type === "market" ? `a market ${expect.side}` : `a ${ORDER_TYPES[expect.type]}`;
      return setResult({
        ok: false,
        message: `This order is valid, but it is not what the plan asks for. Re-read the task: it calls for ${want}.`,
      });
    }
    if (Math.abs(num(lots) - expect.lots) > 1e-9) {
      return setResult({
        ok: false,
        message: `Volume is wrong. The ticket says this risks $${live?.risk?.toFixed(2) ?? "?"}. Work the position size from the account risk and the stop distance.`,
      });
    }
    if (pending && !close(num(entry), expect.entry)) {
      return setResult({ ok: false, message: "The pending entry price is not where the plan puts it." });
    }
    if (!close(num(sl), expect.sl)) {
      return setResult({ ok: false, message: "The stop-loss is not at the level the plan names." });
    }
    if (!close(num(tp), expect.tp)) {
      return setResult({ ok: false, message: "The take-profit is not at the level the plan names." });
    }
    setResult({ ok: true, message: explain || "Order placed exactly to plan." });
    onSolved?.();
  };

  const field = (label, value, set, props = {}) => (
    <label className="ac-ticket__field">
      <span>{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        disabled={result?.ok}
        onChange={(e) => {
          set(e.target.value);
          reset();
        }}
        {...props}
      />
    </label>
  );

  return (
    <div className="ac-ticket">
      <div className="ac-ticket__task">
        <span className="ac-note__label">Place the order</span>
        <p>{task}</p>
      </div>

      <div className="ac-ticket__body">
        <div className="ac-ticket__form">
          <div className="ac-ticket__account">
            <span>Demo account</span>
            <strong>${balance.toLocaleString("en-US")}</strong>
            <span>Leverage 1:{leverage}</span>
          </div>

          <label className="ac-ticket__field">
            <span>Symbol</span>
            <input type="text" value={pair} disabled readOnly />
          </label>

          <label className="ac-ticket__field">
            <span>Type</span>
            <select
              value={type}
              disabled={result?.ok}
              onChange={(e) => {
                setType(e.target.value);
                reset();
              }}
            >
              {Object.entries(ORDER_TYPES).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          {field("Volume (lots)", lots, setLots)}
          {pending && field("Price", entry, setEntry, { placeholder: "Entry price" })}
          {field("Stop Loss", sl, setSl, { placeholder: "Price" })}
          {field("Take Profit", tp, setTp, { placeholder: "Price" })}

          {pending ? (
            <button className="ac-ticket__place" onClick={submit} disabled={result?.ok}>
              Place
            </button>
          ) : (
            <div className="ac-ticket__sides">
              <button
                type="button"
                className={`ac-ticket__sell ${side === "sell" ? "is-picked" : ""}`}
                disabled={result?.ok}
                onClick={() => {
                  setSide("sell");
                  reset();
                }}
              >
                Sell by Market
                <strong>{bid.toFixed(dp)}</strong>
              </button>
              <button
                type="button"
                className={`ac-ticket__buy ${side === "buy" ? "is-picked" : ""}`}
                disabled={result?.ok}
                onClick={() => {
                  setSide("buy");
                  reset();
                }}
              >
                Buy by Market
                <strong>{ask.toFixed(dp)}</strong>
              </button>
            </div>
          )}
        </div>

        <dl className="ac-ticket__readout" aria-live="polite">
          <div>
            <dt>Fills at</dt>
            <dd>{live ? live.fill.toFixed(dp) : "—"}</dd>
          </div>
          <div>
            <dt>Stop distance</dt>
            <dd>{live?.stopPips != null ? `${live.stopPips.toFixed(1)} pips` : "—"}</dd>
          </div>
          <div>
            <dt>Money at risk</dt>
            <dd>
              {live?.risk != null
                ? `$${live.risk.toFixed(2)} (${((live.risk / balance) * 100).toFixed(2)}%)`
                : "—"}
            </dd>
          </div>
          <div>
            <dt>Target</dt>
            <dd>
              {live?.reward != null ? `${live.targetPips.toFixed(1)} pips · $${live.reward.toFixed(2)}` : "—"}
            </dd>
          </div>
          <div>
            <dt>Reward : risk</dt>
            <dd>{live?.rr != null ? `${live.rr.toFixed(2)} : 1` : "—"}</dd>
          </div>
          <div>
            <dt>Margin required</dt>
            <dd>{live ? `$${live.margin.toFixed(2)}` : "—"}</dd>
          </div>
          {live?.problems.length > 0 && (
            <p className="ac-ticket__warn">
              <i className="fas fa-triangle-exclamation" aria-hidden="true" /> {live.problems[0]}
            </p>
          )}
        </dl>
      </div>

      <div className="ac-ticket__check">
        {pending && (
          <span className="ac-ticket__quote">
            Bid {bid.toFixed(dp)} · Ask {ask.toFixed(dp)}
          </span>
        )}
        {!pending && (
          <button className="ac-decide__btn" onClick={submit} disabled={result?.ok}>
            {result?.ok ? "Placed" : "Send order"}
          </button>
        )}
        {result && (
          <p className={`ac-decide__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
            {result.message}
          </p>
        )}
      </div>
    </div>
  );
}
