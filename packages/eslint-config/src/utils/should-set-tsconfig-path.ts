// Utility to check if TypeScript is present and tsconfigPath needs to be set
import type { ConfigOptions } from '../types';

/**
 * Determines if TypeScript is present and tsconfigPath should be set.
 */
export function shouldSetTsconfigPath(options: ConfigOptions): boolean {
  if (options.typescript === false) return false;

  if (typeof options.typescript === 'object' && 'tsconfigPath' in options.typescript) {
    if (options.typescript.tsconfigPath !== undefined) return false;
  }

  return true;
}
