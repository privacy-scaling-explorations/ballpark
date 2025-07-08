import "./Home.css";
import Ctx from "./Ctx";

export default function About() {
  const ctx = Ctx.use();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="title">About</div>
      <div>
        <p>
          Comparing compensation is tricky. It's so valuable to know where you
          stand, but most people don't really want other people to know their
          compensation:
          <ul>
            <li>
              If the difference is small, it's still unnecessarily awkward
            </li>
            <li>
              If the difference is very large, it could be a social disaster
            </li>
          </ul>
        </p>
        <p>
          Ballpark proposes to solve this problem using MPC cryptography.
          No one has to share their exact compensation. Instead each of you will
          learn only one of the following:
          <ol>
            <li>You earn less</li>
            <li>You earn about the same</li>
            <li>You earn more</li>
          </ol>
        </p>
        <p>
          Discovering a significant difference might still be painful, but
          hopefully the upside of learning this information makes it worthwhile.
          The size of the difference remains secret, which should limit the
          social impact.
        </p>
        <p>
          The result is calculated in an entirely peer to peer way. No servers
          are involved in the cryptography or can otherwise see your input. Only
          your peer can see anything meaningful, and the only meaningful
          information they can get is the result, even if they use a modified
          app.
        </p>
        <p>
          Ballpark is powered by <a href="https://mpc.pse.dev/">MPC Framework</a> which is an R&D project funded by
          the <a href="https://ethereum.org/">Ethereum</a> Foundation.
        </p>
      </div>
      <button
        onClick={() => ctx.page.set("Home")}
        style={{ width: "100%", marginBottom: "3rem" }}
      >
        Home
      </button>
    </div>
  );
}
