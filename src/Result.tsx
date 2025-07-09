import { useEffect, useState } from "react";
import calculateSameRange from "./calculateSameRange";
import Ctx from "./Ctx";
import never from "./never";

export default function Result() {
  const ctx = Ctx.use();
  const result = ctx.result.use();
  const comp = ctx.comp.use();
  const tolerancePct = ctx.tolerancePct.use();
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const listener = () => setShowDetail(false);
    window.addEventListener("pointerup", listener);

    return () => {
      window.removeEventListener("pointerup", listener);
    };
  }, [setShowDetail]);

  if (result === undefined) {
    return <>Error: result undefined</>;
  }

  if (comp === undefined) {
    return <>Error: comp undefined</>;
  }

  let msg: string;
  let detail: string;

  const sameRange = calculateSameRange(comp, tolerancePct);

  switch (result) {
    case "less": {
      msg = "You earn less.";
      detail = `They earn ${sameRange.high + 1} or more.`;
      break;
    }

    case "same": {
      msg = "You earn about the same.";
      detail = `They earn ${sameRange.low} - ${sameRange.high}.`;
      break;
    }

    case "more": {
      msg = "You earn more.";
      detail = `They earn ${sameRange.low - 1} or less.`;
      break;
    }

    default:
      never(result);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        gap: "1rem",
      }}
    >
      <div className="title">Result</div>
      <div style={{ flexGrow: 1 }} />
      <div style={{ textAlign: "center", fontSize: "1.5rem" }}>{msg}</div>
      <div
        className="no-select"
        onPointerDown={(e) => {
          setShowDetail(true);
          e.preventDefault();
        }}
        onTouchEnd={() => setShowDetail(false)}
        style={{
          textAlign: "center",
          border: "2px dashed black",
          padding: "1rem",
        }}
      >
        <div
          className="no-select"
          style={{
            color: "blue",
            cursor: "pointer",
            marginBottom: "2rem",
          }}
        >
          Hold to see their implied range.
        </div>
        <div style={{ visibility: showDetail ? "visible" : "hidden" }}>
          <div>{detail}</div>
          <div style={{ fontSize: "0.7rem", textWrap: "balance" }}>
            <span style={{ color: "red" }}>Danger</span>: Sharing this would
            reveal your <i>exact</i> compensation.
          </div>
        </div>
      </div>
      <div style={{ flexGrow: 2 }} />
      <button style={{ width: "100%" }} onClick={() => ctx.reset()}>
        Home
      </button>
    </div>
  );
}
