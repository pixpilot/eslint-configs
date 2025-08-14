import type config from '@pixpilot/antfu-eslint-config';
import type {
  Awaitable,
  OptionsConfig,
  TypedFlatConfigItem,
} from '@pixpilot/antfu-eslint-config';
import type { Linter } from 'eslint';
import type { FlatConfigComposer } from 'eslint-flat-config-utils';

type ConfigOptionsBase = NonNullable<Parameters<ConfigFuncType>[0]>;

export type ConfigFuncType = typeof config;

export type UserConfigs = Awaitable<
  | TypedFlatConfigItem
  | TypedFlatConfigItem[]
  | FlatConfigComposer<any, any>
  | Linter.Config[]
>[];

export type ReturnTypeOfConfigFunc = ReturnType<ConfigFuncType>;

export type ConfigOptions = OptionsConfig &
  Omit<TypedFlatConfigItem, 'files'> & {
    prettier?: boolean;
    test?: ConfigOptionsBase['test'] & { relaxed?: boolean };
    turbo?: boolean;
  };

export type UserOption = Awaitable<
  | TypedFlatConfigItem
  | TypedFlatConfigItem[]
  | FlatConfigComposer<any, any>
  | Linter.Config[]
>;

export type UserOptions = UserOption[];

export type { TypedFlatConfigItem };
