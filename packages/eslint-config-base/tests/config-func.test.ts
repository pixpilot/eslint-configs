import { describe, expect, it } from 'vitest';
import configFunc from '../src/index';

describe('configFunc', () => {
  it('should return a config object', () => {
    const result = configFunc({});
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });
});
