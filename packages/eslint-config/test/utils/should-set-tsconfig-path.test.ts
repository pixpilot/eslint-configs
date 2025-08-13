import { describe, expect, it } from 'vitest';
import { shouldSetTsconfigPath } from '../../src/utils/should-set-tsconfig-path';

describe('shouldSetTsconfigPath', () => {
  it('returns false when typescript is false', () => {
    expect(shouldSetTsconfigPath({ typescript: false })).toBe(false);
  });

  it('returns true when typescript is true', () => {
    expect(shouldSetTsconfigPath({ typescript: true })).toBe(true);
  });

  it('returns true when typescript is undefined', () => {
    expect(shouldSetTsconfigPath({})).toBe(true);
  });

  it('returns true when typescript is an empty object', () => {
    expect(shouldSetTsconfigPath({ typescript: {} })).toBe(true);
  });

  it('returns false when typescript.tsconfigPath is a string', () => {
    expect(shouldSetTsconfigPath({ typescript: { tsconfigPath: 'some/path' } })).toBe(
      false,
    );
  });
});
