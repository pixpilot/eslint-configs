import { describe, expect, it } from 'vitest';
import { deepMerge } from '../../src/utils/deep-merge';

describe('deepMerge', () => {
  it('merges two flat objects', () => {
    const a = { foo: 1, bar: 2 };
    const b = { bar: 3, baz: 4 };
    const result = deepMerge(a, b);
    expect(result).toEqual({ foo: 1, bar: 3, baz: 4 });
  });

  it('merges nested objects', () => {
    const a = { foo: { bar: 1, baz: 2 } };
    const b = { foo: { baz: 3, qux: 4 } };
    const result = deepMerge(a, b);
    expect(result).toEqual({ foo: { bar: 1, baz: 3, qux: 4 } });
  });

  it('merges more than two objects', () => {
    const a = { foo: 1 };
    const b = { bar: 2 };
    const c = { foo: 3, baz: 4 };
    const result = deepMerge(a, b, c);
    expect(result).toEqual({ foo: 3, bar: 2, baz: 4 });
  });

  it('concatenates arrays by default', () => {
    const a = { arr: [1, 2] };
    const b = { arr: [3, 4] };
    const result = deepMerge(a, b);
    expect(result).toEqual({ arr: [1, 2, 3, 4] });
  });

  it('handles merging with primitives and edge cases', () => {
    expect(deepMerge({}, { foo: 1 })).toEqual({ foo: 1 });
    expect(deepMerge({ foo: 1 }, {})).toEqual({ foo: 1 });
    expect(deepMerge({}, {})).toEqual({});
    expect(deepMerge({ foo: 1 }, { foo: null })).toEqual({ foo: null });
    expect(deepMerge({ foo: 1 }, { foo: undefined })).toEqual({ foo: undefined });
    expect(deepMerge({ foo: 1 }, { foo: 2 }, { foo: 3 })).toEqual({ foo: 3 });
  });

  it('does not mutate input objects', () => {
    const a = { foo: { bar: 1 } };
    const b = { foo: { baz: 2 } };
    const aCopy = JSON.parse(JSON.stringify(a));
    const bCopy = JSON.parse(JSON.stringify(b));
    deepMerge(a, b);
    expect(a).toEqual(aCopy);
    expect(b).toEqual(bCopy);
  });
});
