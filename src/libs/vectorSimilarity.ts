export function vectorSimilarity(x: number[], y: number[]): number {
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    // @ts-expect-error
    sum += x[i] * y[i];
  }
  return sum;
}
