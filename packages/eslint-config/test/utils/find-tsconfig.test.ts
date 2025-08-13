import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { findTsConfig } from '../../src/utils/find-tsconfig';

describe('findTsConfig', () => {
  let testDir: string;

  beforeEach(() => {
    // Create a temporary directory for testing
    testDir = join(tmpdir(), `eslint-config-test-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should find tsconfig.json when it exists', () => {
    const tsconfigPath = join(testDir, 'tsconfig.json');
    writeFileSync(tsconfigPath, '{}');

    const result = findTsConfig(testDir);
    expect(result).toBe(tsconfigPath);
  });

  it('should find tsconfig.eslint.json when tsconfig.json does not exist', () => {
    const tsconfigPath = join(testDir, 'tsconfig.eslint.json');
    writeFileSync(tsconfigPath, '{}');

    const result = findTsConfig(testDir);
    expect(result).toBe(tsconfigPath);
  });

  it('should find jsconfig.json when no tsconfig files exist', () => {
    const jsconfigPath = join(testDir, 'jsconfig.json');
    writeFileSync(jsconfigPath, '{}');

    const result = findTsConfig(testDir);
    expect(result).toBe(jsconfigPath);
  });

  it('should prefer tsconfig.json over other config files', () => {
    const tsconfigPath = join(testDir, 'tsconfig.json');
    const eslintTsconfigPath = join(testDir, 'tsconfig.eslint.json');

    writeFileSync(eslintTsconfigPath, '{}');
    writeFileSync(tsconfigPath, '{}');

    const result = findTsConfig(testDir);
    expect(result).toBe(tsconfigPath);
  });

  it('should return undefined when no config files exist', () => {
    const result = findTsConfig(testDir);
    expect(result).toBeUndefined();
  });

  it('should use process.cwd() when no directory is provided', () => {
    // This test assumes the current working directory has a tsconfig file
    // We'll just verify the function doesn't throw an error
    expect(() => findTsConfig()).not.toThrow();
  });
});
