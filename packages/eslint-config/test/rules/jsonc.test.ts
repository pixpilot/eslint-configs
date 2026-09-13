import { ESLint } from 'eslint';
import { beforeAll, describe, expect, it } from 'vitest';
import defineConfig from '../../src/factory';

const withComment = `{
  // a comment
  "compilerOptions": {}
}
`;

let eslint: ESLint;

beforeAll(async () => {
  const configs = await defineConfig();

  eslint = new ESLint({
    overrideConfig: configs as ESLint.Options['overrideConfig'],
    overrideConfigFile: true,
  });
}, 60_000);

async function lintJson(filePath: string) {
  const [result] = await eslint.lintText(withComment, { filePath });

  return (result?.messages ?? []).filter(
    (message) => message.ruleId === 'jsonc/no-comments',
  );
}

describe('jsonc rules', () => {
  it('reports comments in plain json', async () => {
    expect(await lintJson('data.json')).toHaveLength(1);
  });

  it.each([
    'tsconfig.json',
    'tsconfig.build.json',
    'jsconfig.json',
    '.vscode/settings.json',
  ])('allows comments in %s', async (filePath) => {
    expect(await lintJson(filePath)).toHaveLength(0);
  });

  it('allows comments in .jsonc', async () => {
    expect(await lintJson('data.jsonc')).toHaveLength(0);
  });
});
