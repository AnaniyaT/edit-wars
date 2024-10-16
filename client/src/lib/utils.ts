import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export type Comparable = number | string | Date;

export type Comparator<T> = (a: T, b: T) => -1 | 0 | 1;

export class BisectError extends Error {}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function compareArrays(arr1: Comparable[], arr2: Comparable[]): -1 | 0 | 1 {
  for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
    if (arr1[i] < arr2[i]) return -1;
    if (arr1[i] > arr2[i]) return 1;
  }

  if (arr1.length < arr2.length) return -1;
  if (arr1.length > arr2.length) return 1;

  return 0;
}

export function bisect_left<C>(
    arr: C[],
    target: C,
    cmp: Comparator<C>,
    lo: number = 0,
    hi: number = arr.length
): number {
  if (lo < 0)
    throw new BisectError(`low parameter must be >= 0, received ${lo}`);

  let lowIx = lo;
  let highIx = hi;
  let midIx;

  while (lowIx < highIx) {
    midIx = lowIx + ((highIx - lowIx) >>> 1);
    const mKey = arr[midIx];
    if (cmp(mKey, target) < 0) {
      lowIx = midIx + 1;
    } else {
      highIx = midIx;
    }
  }
  return lowIx;
}

export function bisect_right<C>(
    arr: C[],
    target: C,
    cmp: Comparator<C>,
    lo: number = 0,
    hi: number = arr.length
): number {
  if (lo < 0)
    throw new BisectError(`low parameter must be >= 0, received ${lo}`);

  let lowIx = lo;
  let highIx = hi;
  let midIx;

  while (lowIx < highIx) {
    midIx = lowIx + ((highIx - lowIx) >>> 1);
    const mKey = arr[midIx];
    if (cmp(mKey, target) < 0) {
      highIx = midIx;
    } else {
      lowIx = midIx + 1;
    }
  }

  return lowIx;
}

export function insort_left<C>(
    arr: C[],
    target: C,
    cmp: Comparator<C>,
    lo: number = 0,
    hi: number = arr.length
): void {
  const ix = bisect_left(arr, target, cmp, lo, hi);
  arr.splice(ix, 0, target);
}

export function insort_right<C>(
    arr: C[],
    target: C,
    cmp: Comparator<C>,
    lo: number = 0,
    hi: number = arr.length
): void {
  const ix = bisect_right(arr, target, cmp, lo, hi);
  arr.splice(ix, 0, target);
}
