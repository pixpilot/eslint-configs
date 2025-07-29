import type config from '@pixpilot/eslint-config';

export type ConfigFuncType = typeof config;
export type ConfigOptions = Parameters<ConfigFuncType>[0];
