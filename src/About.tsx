import "./Home.css";
import Ctx from "./Ctx";

export default function About() {
  const ctx = Ctx.use();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="title">About</div>
      <div>
        <p>
          Comparing compensation is tricky. On the one hand, it could be
          extremely valuable to learn how your compensation stacks up. On the
          other, most people don't really want other people to know their
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
          Ballpark proposes to solve this problem using advanced cryptography.
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
          Ballpark is&nbsp;
          <a href="https://github.com/privacy-scaling-explorations/ballpark/">
            open source
          </a>{" "}
          and uses&nbsp;
          <a href="https://github.com/privacy-scaling-explorations/mpc-framework/">
            secure MPC
          </a>{" "}
          to calculate the result while keeping your input secret. It's entirely
          peer to peer and all of the cryptography occurs on your personal
          devices. You are not trusting any servers when using Ballpark.
        </p>
      </div>
      <button
        onClick={() => ctx.page.set("Home")}
        style={{ width: "70%", alignSelf: "center" }}
      >
        Home
      </button>
      <div />
      <div />
      <div />
    </div>
  );
}
