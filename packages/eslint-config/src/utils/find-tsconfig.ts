import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

/**
 * Attempts to find a TypeScript configuration file in the current working directory.
 *
 * @param cwd - The current working directory to search from (defaults to process.cwd())
 * @returns The path to the tsconfig file if found, undefined otherwise
 */
export function findTsConfig(cwd: string = process.cwd()): string | undefined {
  // Common TypeScript config file names in order of preference
  const configNames = [
    'tsconfig.json',
    'tsconfig.eslint.json',
    'tsconfig.lint.json',
    'jsconfig.json', // For JavaScript projects with TypeScript-style config
  ];

  for (const configName of configNames) {
    const configPath = resolve(cwd, configName);
    if (existsSync(configPath)) {
      return configPath;
    }
  }

  return undefined;
}
