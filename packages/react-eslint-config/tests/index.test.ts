import type { ConfigOptions } from '@internal/types';
import { describe, expect, it, vi } from 'vitest';
import configFunc from '../src/index';

// Mock config to test merge behavior
vi.mock('@pixpilot/eslint-config', () => ({
  default: (options: any) => options,
}));

describe('configFunc', () => {
  it('should merge default react/jsx options with user options, allowing user override', () => {
    const userOptions: ConfigOptions = {
      jsx: { a11y: false },
      react: false,
    };
    const result = configFunc(userOptions) as any;
    // Assuming defaults are true for both react and jsx.a11y
    expect(result.react).toBe(false); // user override wins
    expect(result.jsx.a11y).toBe(false); // user override wins
  });

  it('should allow user to disable react/jsx', () => {
    const userOptions = {
      react: false,
      jsx: false,
    };
    const result = configFunc(userOptions) as any;
    expect(result.react).toBe(false); // user override wins
    expect(result.jsx).toBe(false); // user override wins
  });

  it('should merge deeply for jsx.a11y property', () => {
    const userOptions: ConfigOptions = {
      jsx: { a11y: { overrides: { 'jsx-a11y/alt-text': 'off' } } },
    };

    const result = configFunc(userOptions) as any;

    expect(result.jsx).toEqual({
      a11y: {
        overrides: {
          'jsx-a11y/alt-text': 'off',
          'jsx-a11y/no-static-element-interactions': 'warn',
        },
      },
    });
  });
});
