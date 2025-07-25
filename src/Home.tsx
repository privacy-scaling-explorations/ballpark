import "./Home.css";
import Ctx from "./Ctx";
import logoSrc from "./assets/ballpark-logo-text.svg";

export default function Home() {
  const ctx = Ctx.use();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flexGrow: 1 }}>
      <div style={{ flexGrow: 1 }} />
      <img src={logoSrc} style={{ width: "80%", alignSelf: "center" }} />
      <div className="subtitle">
        The better way to compare compensation.
      </div>
      <div style={{ flexGrow: 2 }} />
      <button onClick={() => ctx.page.set("HostOrJoin")} style={{ width: "100%" }}>
        Start
      </button>
      <button className="secondary" onClick={() => ctx.page.set("About")} style={{ width: "100%" }}>
        About
      </button>
      <button className="secondary" onClick={() => ctx.page.set("Share")} style={{ width: "100%" }}>
        Share
      </button>
    </div>
  );
}
