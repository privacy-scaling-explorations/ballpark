import "./Home.css";
import Ctx from "./Ctx";

export default function About() {
  const ctx = Ctx.use();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <p>
          This app helps you compare your compensation. People are
          understandably reluctant to share their compensation, but these
          comparisons can be extremely valuable. If you earn much less than your
          peer, then learning this gives you an opportunity to do something
          about it. It's also possible that there is tension because you suspect
          the pay is very different, and learning that you actually earn about
          the same can ease this tension.
        </p>
        <p>
          Ballpark helps enable these comparisons by removing the need to share
          your exact compensation number with anyone. Ballpark uses cryptography
          to only reveal one of three outcomes:
          <ol>
            <li>You earn less</li>
            <li>You earn about the same</li>
            <li>You earn more</li>
          </ol>
        </p>
      </div>
      <h2>How it Works</h2>
      <ol style={{ margin: 0 }}>
        <li>
          <a
            href="#"
            onClick={() => {
              ctx.page.set("Share");
            }}
          >
            Share
          </a>
          &nbsp;this app with your friend.
        </li>
        <li>Host a session.</li>
        <li>Choose the meaning of 'about the same'.</li>
        <li>Get your friend to join.</li>
        <li>Input your compensation.</li>
        <li>Result will be calculated.</li>
      </ol>
      <h2>Cryptography</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.7em" }}>
        <div>
          This&nbsp;
          <a href="https://github.com/privacy-scaling-explorations/ballpark/">
            open source
          </a>{" "}
          app uses&nbsp;
          <a href="https://github.com/privacy-scaling-explorations/mpc-framework/">
            secure MPC
          </a>{" "}
          to calculate the result while keeping your input secret.
        </div>
      </div>
      <div className="main buttons">
        <button onClick={() => ctx.page.set("Home")}>
          Home
        </button>
      </div>
    </div>
  );
}
