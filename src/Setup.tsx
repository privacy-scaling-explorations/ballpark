import Ctx from "./Ctx";
import ToleranceSettings from "./ToleranceSettings";

export default function Start() {
  const ctx = Ctx.use();
  const tolerancePct = ctx.tolerancePct.use();

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
      <ToleranceSettings />
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
