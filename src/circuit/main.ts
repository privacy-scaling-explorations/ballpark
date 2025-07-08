export default (io: Summon.IO) => {
  const tolerancePct = io.inputPublic('tolerancePct', summon.number());
  const party0Comp = io.input('party0', 'party0Comp', summon.number());
  const party1Comp = io.input('party1', 'party1Comp', summon.number());

  io.outputPublic('result', compare(party0Comp, party1Comp, tolerancePct));
};

const oneTrillion = 1_000_000_000_000;

function compare(party0Comp: number, party1Comp: number, tolerancePct: number) {
  if (party0Comp > oneTrillion) {
    party0Comp = oneTrillion;
  }

  if (party1Comp > oneTrillion) {
    party1Comp = oneTrillion;
  }

  const ordered = party0Comp < party1Comp;

  const [small, large] = ordered
    ? [party0Comp, party1Comp]
    : [party1Comp, party0Comp];

  const isSignificant = large * 100 > small * (100 + tolerancePct);

  if (!isSignificant) {
    return 2;
  }

  if (ordered) {
    // If the comps are in order, then party1 has the higher comp.
    return 1;
  }

  // Otherwise, party0 has the higher comp.
  return 0;
}
