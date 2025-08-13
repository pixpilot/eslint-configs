import type { ConfigOptions } from '../types';
import process from 'node:process';
import { findTsConfig, mergeOptions, shouldSetTsconfigPath } from './index';

/**
 * Resolves ESLint config options, handling TypeScript config path and user overrides.
 * If shouldSetTsconfigPath returns true, sets typescript.tsconfigPath unless in test env.
 * If user provides typescript options, they are respected even in test env.
 * Merges options with user overrides.
 */
export function resolveOptions(
  options: ConfigOptions,
  op?: Partial<ConfigOptions>,
): ConfigOptions {
  let resolvedOptions = { ...options };

  if (shouldSetTsconfigPath(op || {})) {
    const tsconfig = findTsConfig();
    if (tsconfig != null && tsconfig !== '') {
      if (process.env['NODE_ENV'] !== 'test') {
        resolvedOptions = {
          ...resolvedOptions,
          typescript: {
            tsconfigPath: tsconfig,
          },
        };
      }
    }
  }

  // If user explicitly provided TypeScript options, respect them even in test environment
  if (op && typeof op.typescript === 'object' && op.typescript !== null) {
    resolvedOptions = {
      ...resolvedOptions,
      typescript: op.typescript,
    };
  }

  return mergeOptions(resolvedOptions, op || {}) as ConfigOptions;
}
