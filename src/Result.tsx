import calculateSameRange from "./calculateSameRange";
import Ctx from "./Ctx";
import never from "./never";

export default function Result() {
  const ctx = Ctx.use();
  const result = ctx.result.use();
  const comp = ctx.comp.use();
  const tolerancePct = ctx.tolerancePct.use();

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
    case 'less': {
      msg = 'You earn less.';
      detail = `They earn ${sameRange.high + 1} or more.`;
      break;
    }

    case 'same': {
      msg = 'You earn about the same.';
      detail = `Their compensation is ${sameRange.low} - ${sameRange.high}.`
      break;
    }

    case 'more': {
      msg = 'You earn more.';
      detail = `They earn ${sameRange.low - 1} or less.`;
      break;
    }

    default:
      never(result);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '1rem' }}>
      <div className='title'>Result</div>
      <div style={{ flexGrow: 1 }} />
      <div style={{ textAlign: 'center', fontSize: '2rem' }}>{msg}</div>
      <div style={{ textAlign: 'center' }}>{detail}</div>
      <div style={{ flexGrow: 2 }} />
      <button style={{ width: '100%' }} onClick={() => ctx.reset()}>Home</button>
    </div>
  );
}
