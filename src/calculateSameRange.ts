export default function calculateSameRange(otherComp: number, tolerancePct: number) {
  let low = Math.ceil(otherComp * 100 / (100 + tolerancePct)) - 5;
  let high = Math.floor(otherComp * (100 + tolerancePct) / 100) + 5;

  if (
    calculateResult(low, otherComp, tolerancePct) !== "less" ||
    calculateResult(high, otherComp, tolerancePct) !== "more"
  ) {
    throw new Error("Starting value(s) invalid during calculateSameRange");
  }

  while (calculateResult(low, otherComp, tolerancePct) === "less") {
    low++;
  }

  while (calculateResult(high, otherComp, tolerancePct) === "more") {
    high--;
  }

  if (
    calculateResult(low, otherComp, tolerancePct) !== "same" ||
    calculateResult(high, otherComp, tolerancePct) !== "same"
  ) {
    throw new Error("Failed to get low/high to be 'same'");
  }

  return { low, high };
}

function calculateResult(
  comp: number,
  otherComp: number,
  tolerancePct: number,
): "less" | "same" | "more" {
  const c = BigInt(comp);
  const other = BigInt(otherComp);
  const tol = BigInt(tolerancePct);

  const isLess = c < other;

  const [small, large] = isLess ? [c, other] : [other, c];

  const isSignificant = large * 100n > small * (100n + tol);

  if (!isSignificant) {
    return "same";
  }

  return isLess ? "less" : "more";
}