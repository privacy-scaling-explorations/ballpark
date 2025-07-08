import { useState } from "react";
import Ctx from "./Ctx";

export default function Start() {
  const ctx = Ctx.use();
  const tolerancePct = ctx.tolerancePct.use();
  const [aComp, setAComp] = useState(100);

  const sameRange = calculateSameRange(aComp, tolerancePct);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        flexGrow: 1,
      }}
    >
      <div className="title">Setup</div>
      <div style={{ flexGrow: 1 }} />
      <div>
        Choose the meaning of "about the same".
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          className="inc-dec-btn"
          style={{ marginRight: "0.5rem" }}
          onClick={() => {
            ctx.tolerancePct.set(Math.max(0, tolerancePct - 1));
          }}
        >
          <div style={{ transform: "scaleX(1.5)" }}>-</div>
        </div>
        <input
          style={{
            flexGrow: 1,
            zoom: 1.5,
          }}
          type="range"
          min="0"
          max="100"
          value={tolerancePct}
          step="1"
          onChange={(e) => {
            ctx.tolerancePct.set(Number((e.target as HTMLInputElement).value));
          }}
        />
        <div
          className="inc-dec-btn"
          style={{ marginLeft: "0.5rem" }}
          onClick={() => {
            ctx.tolerancePct.set(Math.min(100, tolerancePct + 1));
          }}
        >
          <div>+</div>
        </div>
      </div>
      <div style={{ textAlign: "center", fontSize: "2rem" }}>
        {tolerancePct}%
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <table cellSpacing={0} className="example-table">
          <thead>
            <tr>
              <th>
                <a
                  href="#"
                  onClick={() => {
                    const answer = prompt(
                      "Change the compensation of A in these examples.",
                      aComp.toString(),
                    );

                    if (!/^\s*[1-9]\d*\s*$/.test(answer ?? "")) {
                      return;
                    }

                    const newA = Number(answer);

                    if (
                      !isFinite(newA) || newA !== Math.round(newA) || newA < 0
                    ) {
                      return;
                    }

                    setAComp(newA);
                  }}
                >
                  A
                </a>
              </th>
              <th>B</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{aComp}</td>
              <td>{sameRange.low - 1}</td>
              <td>B earns less.</td>
            </tr>
            <tr>
              <td>{aComp}</td>
              <td>{sameRange.low}</td>
              <td>About the same.</td>
            </tr>
            <tr>
              <td>{aComp}</td>
              <td>{sameRange.high}</td>
              <td>About the same.</td>
            </tr>
            <tr>
              <td>{aComp}</td>
              <td>{sameRange.high + 1}</td>
              <td>A earns less.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        We recommend setting this value to be just enough so that a "less"
        result would motivate you to do something about it.
      </div>
      <div style={{ flexGrow: 2 }} />
      <button
        onClick={() => ctx.page.set("Host")}
        style={{ width: "100%" }}
      >
        Continue
      </button>
    </div>
  );
}

function calculateSameRange(otherComp: number, tolerancePct: number) {
  let low = Math.ceil(otherComp * 100 / (100 + tolerancePct)) - 5;
  let high = Math.floor(otherComp * (100 + tolerancePct) / 100) + 5;

  if (
    calculateResult(low, otherComp, tolerancePct) !== "less" ||
    calculateResult(high, otherComp, tolerancePct) !== "more"
  ) {
    throw new Error("Starting value(s) invalid during calculateSameRange");
  }

  while (calculateResult(low, otherComp, tolerancePct) === "less") {
    low++;
  }

  while (calculateResult(high, otherComp, tolerancePct) === "more") {
    high--;
  }

  if (
    calculateResult(low, otherComp, tolerancePct) !== "same" ||
    calculateResult(high, otherComp, tolerancePct) !== "same"
  ) {
    throw new Error("Failed to get low/high to be 'same'");
  }

  return { low, high };
}

function calculateResult(
  comp: number,
  otherComp: number,
  tolerancePct: number,
): "less" | "same" | "more" {
  const c = BigInt(comp);
  const other = BigInt(otherComp);
  const tol = BigInt(tolerancePct);

  const isLess = c < other;

  const [small, large] = isLess ? [c, other] : [other, c];

  const isSignificant = large * 100n > small * (100n + tol);

  if (!isSignificant) {
    return "same";
  }

  return isLess ? "less" : "more";
}
