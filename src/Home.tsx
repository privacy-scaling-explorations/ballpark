import "./Home.css";
import Ctx from "./Ctx";

export default function Home() {
  const ctx = Ctx.use();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="title">Ballpark</div>
      <div className="subtitle">
        The better way to compare compensation.
      </div>
      <div />
      <div />
      <button onClick={() => ctx.page.set("About")} style={{ width: "70%", alignSelf: "center" }}>
        About
      </button>
      <button onClick={() => ctx.page.set("Start")} style={{ width: "70%", alignSelf: "center" }}>
        Start
      </button>
    </div>
  );
}
