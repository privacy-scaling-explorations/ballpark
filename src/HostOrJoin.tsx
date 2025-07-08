import "./Home.css";
import Ctx from "./Ctx";

export default function HostOrJoin() {
  const ctx = Ctx.use();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flexGrow: 1 }}>
      <div className="title">Start</div>
      <div style={{ flexGrow: 1 }} />
      <div>
        This is a peer to peer app. To connect to each other, one of you needs
        to host a session, and the other needs to join that session.
      </div>
      <div style={{ flexGrow: 2 }} />
      <button style={{ width: "100%" }} onClick={() => ctx.page.set('Setup')}>Host</button>
      <button style={{ width: "100%" }} onClick={() => ctx.page.set('Join')}>Join</button>
    </div>
  );
}
