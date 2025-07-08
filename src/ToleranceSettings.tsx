import { useState } from "react";
import calculateSameRange from "./calculateSameRange";
import Ctx from "./Ctx";

export default function ToleranceSettings() {
  const ctx = Ctx.use();
  const tolerancePct = ctx.tolerancePct.use();

  const [aComp, setAComp] = useState(100);
  const sameRange = calculateSameRange(aComp, tolerancePct);

  return <>
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
  </>;
}