export function signle<T>(v: T | T[]): T;
export function signle<T>(v: T | T[] | undefined): T | undefined;
export function signle<T>(v: T | T[] | undefined): T | undefined {
  if (!isDef(v)) {
    return undefined
  }
  if (!Array.isArray(v)) {
    return v;
  }
  throw new Error('Expected single value');
}

export function isDef<T>(v: T): v is NonNullable<T> {
  return v !== undefined && v !== null;
}

export function assertDef<T>(v: T): asserts v is NonNullable<T> {
  if (!isDef(v)) {
    throw new Error('Expected value');
  }
}
