import type { ESLint } from 'eslint';
import {
  preferTimestamptzRule,
  requireEnableRlsRule,
  requireUserIdCascadeRule,
} from './rules';

export const drizzlePlugin = {
  meta: {
    name: 'drizzle',
    version: '1.0.0',
  },
  rules: {
    'prefer-timestamptz': preferTimestamptzRule,
    'require-enable-rls': requireEnableRlsRule,
    'require-user-id-cascade': requireUserIdCascadeRule,
  },
} satisfies ESLint.Plugin;
