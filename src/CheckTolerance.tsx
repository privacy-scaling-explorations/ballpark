import "./Home.css";
import Ctx from "./Ctx";
import ToleranceSettings from "./ToleranceSettings";

export default function CheckTolerance() {
  const ctx = Ctx.use();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flexGrow: 1 }}>
      <div className="title">Check</div>
      <div style={{ flexGrow: 1 }} />
      <div>
        This session has been created with the following meaning of "about the
        same":
      </div>
      <ToleranceSettings />
      <div>
        Proceed?
      </div>
      <div style={{ flexGrow: 2 }} />
      <button style={{ width: "100%" }} onClick={() => ctx.page.set('Choose')}>Ok</button>
      <button className="secondary" style={{ width: "100%" }} onClick={() => ctx.page.set('Home')}>Cancel</button>
    </div>
  );
}
