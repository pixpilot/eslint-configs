import type config from '@pixpilot/antfu-eslint-config';

type ConfigOptionsBase = NonNullable<Parameters<ConfigFuncType>[0]>;

export type ConfigFuncType = typeof config;
export type ConfigOptions = ConfigOptionsBase & {
  prettier?: boolean;
  test?: ConfigOptionsBase['test'] & { relaxed?: boolean };
};
