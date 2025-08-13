/* eslint-disable no-magic-numbers */
import type { Rules } from '@pixpilot/antfu-eslint-config';

export const jsOverrideRules: Rules = {
  'arrow-body-style': [
    'error',
    'as-needed',
    {
      requireReturnForObjectLiteral: false,
    },
  ],
  'style/arrow-parens': ['error', 'always'],
  'style/arrow-spacing': [
    'error',
    {
      after: true,
      before: true,
    },
  ],
  complexity: ['off', 20],
  'consistent-return': ['error'],
  curly: ['error', 'multi-line'],
  'style/dot-location': ['error', 'property'],
  'for-direction': 'error',
  'func-call-spacing': ['error', 'never'],
  'style/generator-star-spacing': [
    'error',
    {
      after: true,
      before: false,
    },
  ],
  'getter-return': [
    'error',
    {
      allowImplicit: true,
    },
  ],
  'grouped-accessor-pairs': 'error',
  'guard-for-in': 'error',
  'max-classes-per-file': ['error', 6],
  'no-await-in-loop': 'error',
  'no-bitwise': 'error',
  'style/no-confusing-arrow': [
    'error',
    {
      allowParens: true,
    },
  ],
  'no-constructor-return': 'error',
  'no-continue': 'error',
  'no-div-regex': ['error'],
  'no-dupe-else-if': 'error',
  'no-else-return': [
    'error',
    {
      allowElseIf: false,
    },
  ],
  'no-empty-static-block': ['error'],
  'no-eq-null': 'off',
  'no-extra-label': 'error',
  'style/no-extra-semi': 'error',
  'style/no-floating-decimal': 'error',
  'no-implicit-coercion': ['error'],
  'no-implicit-globals': ['error'],
  'no-inner-declarations': 'error',
  'no-label-var': 'error',
  'no-lonely-if': 'error',
  'no-magic-numbers': [
    'warn',
    {
      enforceConst: true,
      ignore: [-1, 0, 1],
      ignoreArrayIndexes: true,
      ignoreEnums: true,
    },
  ],
  'no-multi-assign': 'error',
  'no-nested-ternary': 'error',
  'no-new-object': 'error',
  'no-nonoctal-decimal-escape': 'error',
  'no-object-constructor': ['error'],
  'no-param-reassign': [
    'error',
    {
      ignorePropertyModificationsFor: [
        'acc',
        'accumulator',
        'e',
        'ctx',
        'context',
        'req',
        'request',
        'res',
        'response',
        '$scope',
        'staticContext',
      ],
      props: true,
    },
  ],
  'no-promise-executor-return': 'error',
  'no-restricted-exports': [
    'error',
    {
      restrictedNamedExports: ['default', 'then'],
    },
  ],
  'no-return-assign': ['error', 'always'],
  'no-script-url': ['error'],
  'no-setter-return': 'error',
  'no-underscore-dangle': [
    'error',
    {
      allowAfterSuper: true,
      allowAfterThis: true,
      allowFunctionParams: true,
      allowInArrayDestructuring: true,
      allowInObjectDestructuring: true,
    },
  ],
  'no-unsafe-optional-chaining': [
    'error',
    {
      disallowArithmeticOperators: true,
    },
  ],
  'no-unused-labels': 'error',
  'no-useless-concat': 'error',
  'no-useless-escape': 'error',
  'no-void': 'error',
  'no-warning-comments': [
    'warn',
    {
      location: 'start',
      terms: ['todo', 'fixme', 'xxx'],
    },
  ],
  'prefer-destructuring': [
    'error',
    {
      AssignmentExpression: {
        array: true,
        object: false,
      },
      VariableDeclarator: {
        array: false,
        object: true,
      },
    },
    {
      enforceForRenamedProperties: false,
    },
  ],
  'prefer-named-capture-group': 'error',
  'prefer-numeric-literals': 'error',
  'prefer-object-has-own': 'error',
  'prefer-object-spread': 'error',
  radix: 'error',
  'require-unicode-regexp': 'error',
  // eslint-config-prettier disables this rule
  'style/wrap-iife': [
    'error',
    'outside',
    {
      functionPrototypeMethods: false,
    },
  ],
  'node/global-require': 'error',
  'no-buffer-constructor': 'error',
  'no-unused-private-class-members': 'error',
};

export const tsOverrideRules: Rules = {
  'ts/default-param-last': ['error'],
  'ts/no-empty-function': [
    'error',
    {
      allow: ['constructors', 'arrowFunctions'],
    },
  ],
  'ts/no-invalid-this': 'off',
  'ts/no-loop-func': 'error',
  'ts/no-shadow': 'error',
};

export const overrideRules: Rules = { ...jsOverrideRules, ...tsOverrideRules };
