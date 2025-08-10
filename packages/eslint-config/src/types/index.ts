import type config from '@pixpilot/antfu-eslint-config';

export type ConfigFuncType = typeof config;
export type ConfigOptions = Parameters<ConfigFuncType>[0] & { prettier?: boolean };
