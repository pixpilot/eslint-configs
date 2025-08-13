import process from 'node:process';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as utils from '../../src/utils';
import { resolveOptions } from '../../src/utils/resolve-options';

const baseOptions = { typescript: {} };
const originalNodeEnv = process.env['NODE_ENV'];

// Helper to reset NODE_ENV after each test
beforeEach(() => {
  process.env['NODE_ENV'] = originalNodeEnv;
});

function getTsconfigPath(obj: any): unknown {
  return obj &&
    typeof obj.typescript === 'object' &&
    obj.typescript !== null &&
    'tsconfigPath' in obj.typescript
    ? obj.typescript.tsconfigPath
    : undefined;
}

describe('resolveOptions', () => {
  it('should set tsconfigPath if shouldSetTsconfigPath returns true and not in test env', () => {
    vi.spyOn(utils, 'shouldSetTsconfigPath').mockReturnValue(true);
    vi.spyOn(utils, 'findTsConfig').mockReturnValue('tsconfig.json');
    process.env['NODE_ENV'] = 'production';
    const result = resolveOptions(baseOptions, {});
    expect(getTsconfigPath(result)).toBe('tsconfig.json');
  });

  it('should not set tsconfigPath if shouldSetTsconfigPath returns false', () => {
    vi.spyOn(utils, 'shouldSetTsconfigPath').mockReturnValue(false);
    const result = resolveOptions(baseOptions, {});
    expect(getTsconfigPath(result)).toBeUndefined();
  });

  it('should not set tsconfigPath in test env unless user provides typescript options', () => {
    vi.spyOn(utils, 'shouldSetTsconfigPath').mockReturnValue(true);
    vi.spyOn(utils, 'findTsConfig').mockReturnValue('tsconfig.json');
    process.env['NODE_ENV'] = 'test';
    const result = resolveOptions(baseOptions, {});
    expect(getTsconfigPath(result)).toBeUndefined();
  });

  it('should respect user-provided typescript options even in test env', () => {
    vi.spyOn(utils, 'shouldSetTsconfigPath').mockReturnValue(true);
    vi.spyOn(utils, 'findTsConfig').mockReturnValue('tsconfig.json');
    process.env['NODE_ENV'] = 'test';
    const userOptions = { typescript: { tsconfigPath: 'custom.json' } };
    const result = resolveOptions(baseOptions, userOptions);
    expect(result.typescript).toEqual({ tsconfigPath: 'custom.json' });
  });

  it('should merge options with user overrides', () => {
    vi.spyOn(utils, 'shouldSetTsconfigPath').mockReturnValue(false);
    const userOptions = { typescript: { tsconfigPath: 'bar.json' } };
    const result = resolveOptions(baseOptions, userOptions);
    expect(getTsconfigPath(result)).toBe('bar.json');
  });

  it('should handle typescript as boolean', () => {
    const options = { typescript: true };
    const result = resolveOptions(options, {});
    expect(typeof result.typescript).toBe('boolean');
  });
});
