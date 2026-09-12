import type { Linter } from 'eslint';

export interface DrizzleOptions {
  /**
   * Glob patterns the Drizzle rules apply to.
   *
   * @default undefined (all linted files)
   */
  files?: string[];

  /**
   * Severity used for the Drizzle rules.
   *
   * @default 'error'
   */
  level?: 'error' | 'warn';

  /**
   * Rule overrides appended after the Drizzle rules.
   */
  overrides?: Linter.RulesRecord;
}
