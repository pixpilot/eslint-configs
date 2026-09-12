import type { Linter } from 'eslint';
import { ESLint } from 'eslint';
import { drizzleConfigs } from '../../src';

/**
 * Lints a code sample with the Drizzle configs and returns the reported
 * messages.
 */
export async function lint(
  code: string,
  configs: Linter.Config[] = drizzleConfigs(),
  filePath = 'schema.js',
): Promise<Linter.LintMessage[]> {
  const eslint = new ESLint({
    overrideConfig: configs as ESLint.Options['overrideConfig'],
    overrideConfigFile: true,
  });

  const [result] = await eslint.lintText(code, { filePath });

  return result?.messages ?? [];
}

/**
 * Messages reported by a single `drizzle/*` rule.
 */
export function messagesFor(
  messages: Linter.LintMessage[],
  ruleName: string,
): Linter.LintMessage[] {
  return messages.filter((message) => message.ruleId === `drizzle/${ruleName}`);
}

/**
 * Messages reported by any `drizzle/*` rule.
 */
export function drizzleMessages(messages: Linter.LintMessage[]): Linter.LintMessage[] {
  return messages.filter((message) => message.ruleId?.startsWith('drizzle/') === true);
}
