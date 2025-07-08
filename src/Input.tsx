import { useState } from 'react';
import calculateSameRange from './calculateSameRange';
import Ctx from './Ctx';

export default function Input() {
  const ctx = Ctx.use();
  const tolerancePct = ctx.tolerancePct.use();
  const [comp, setComp] = useState<number | "">("");
  const [compTooLarge, setCompTooLarge] = useState(false);
  const sameRange = calculateSameRange(Number(comp), tolerancePct);

  return (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, gap: "1rem" }}>
      <div className="title">Input</div>
      <div style={{ flexGrow: 1 }} />
      <div>
        Enter your compensation:
        <input
          type="text"
          inputMode="numeric"
          style={{
            width: "100%",
            boxSizing: "border-box",
            fontSize: "2rem",
            textAlign: "center",
          }}
          value={comp}
          onInput={e => {
            const inputEl = e.target as HTMLInputElement;
            const newValue = inputEl.value;
            console.log({ newValue })

            if (newValue === "") {
              setComp("");
              setCompTooLarge(false);
              return;
            }
            
            let newNumber = Number(newValue);

            if (!Number.isFinite(newNumber) || newNumber < 0) {
              inputEl.value = comp.toString();
              return;
            }

            if (newNumber === 0) {
              setComp("");
              return;
            }

            if (newNumber > 1_000_000_000_000) {
              newNumber = 1_000_000_000_000;
              setCompTooLarge(true);
            }

            setComp(newNumber);
          }}
        />
      </div>
      <div>
        About the same: {comp === "" ? "(pending)" : `${sameRange.low} - ${sameRange.high}`}.
      </div>
      <div>
        Make sure you are using the same definition of "compensation". This
        should be easy if you have similar circumstances, but if you have
        different kinds of roles it might be important to discuss things like
        tax, working hours, currency, and benefits.
      </div>
      <div style={{ fontSize: '0.7rem', color: compTooLarge ? '#cc4488' : '' }}>
        Due to arithmetic limitations, this number is capped at one trillion.
        If somehow this could be a possibility (eg estimating corporate
        valuations), then you should discuss N&nbsp;=&nbsp;$N,000,000 or
        similar.
      </div>
      <div style={{ flexGrow: 2 }} />
      <button
        style={{ width: '100%' }}
        onClick={() => {
          alert("todo");
        }}
      >Calculate</button>
    </div>
  );
}
