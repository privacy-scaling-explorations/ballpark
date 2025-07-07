import Ctx from "./Ctx";

export default function Start() {
  const ctx = Ctx.use();
  const tolerancePct = ctx.tolerancePct.use();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="title">Setup</div>
      <div />
      <div>
        Choose the meaning of "about the same".
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          className="inc-dec-btn"
          style={{ marginRight: "0.5rem" }}
          onClick={() => {
            ctx.tolerancePct.set(Math.max(1, tolerancePct - 1));
          }}
        >
          <div style={{ transform: "scaleX(1.5)" }}>-</div>
        </div>
        <input
          style={{
            flexGrow: 1,
          }}
          type="range"
          min="1"
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
          <div style={{ transform: "translateY(-0.06rem)" }}>+</div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        100 ≈ {100 + tolerancePct}
        <br />
        Further apart is different.
      </div>
      <div />
      <button
        onClick={() => ctx.page.set("Home")}
        style={{ width: "70%", alignSelf: "center" }}
      >
        Continue
      </button>
    </div>
  );
}
