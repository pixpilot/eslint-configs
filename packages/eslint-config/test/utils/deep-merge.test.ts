import { describe, expect, it } from 'vitest';
import { mergeOptions } from '../../src/utils/deep-merge';

describe('mergeOptions', () => {
  it('merges two flat objects', () => {
    const a: Record<string, any> = { foo: 1, bar: 2 };
    const b: Record<string, any> = { bar: 3, baz: 4 };
    const result = mergeOptions(a, b);
    expect(result).toEqual({ foo: 1, bar: 3, baz: 4 });
  });

  it('merges nested objects', () => {
    const a: Record<string, any> = { foo: { bar: 1, baz: 2 } };
    const b: Record<string, any> = { foo: { baz: 3, qux: 4 } };
    const result = mergeOptions(a, b);
    expect(result).toEqual({ foo: { bar: 1, baz: 3, qux: 4 } });
  });

  it('merges more than two objects', () => {
    const a: Record<string, any> = { foo: 1 };
    const b: Record<string, any> = { bar: 2 };
    const c: Record<string, any> = { foo: 3, baz: 4 };
    const result = mergeOptions(a, b, c);
    expect(result).toEqual({ foo: 3, bar: 2, baz: 4 });
  });

  it('concatenates arrays by default', () => {
    const a = { arr: [1, 2] };
    const b = { arr: [3, 4] };
    const result = mergeOptions(a, b);
    expect(result).toEqual({ arr: [1, 2, 3, 4] });
  });

  it('handles merging with primitives and edge cases', () => {
    expect(mergeOptions({}, { foo: 1 })).toEqual({ foo: 1 });
    expect(mergeOptions({ foo: 1 }, {})).toEqual({ foo: 1 });
    expect(mergeOptions({}, {})).toEqual({});
    expect(mergeOptions({ foo: 1 }, { foo: null })).toEqual({ foo: null });
    expect(mergeOptions({ foo: 1 }, { foo: undefined })).toEqual({ foo: undefined });
    expect(mergeOptions({ foo: 1 }, { foo: 2 }, { foo: 3 })).toEqual({ foo: 3 });
  });

  it('does not mutate input objects', () => {
    const a: Record<string, any> = { foo: { bar: 1 } };
    const b: Record<string, any> = { foo: { baz: 2 } };
    const aCopy = JSON.parse(JSON.stringify(a));
    const bCopy = JSON.parse(JSON.stringify(b));
    mergeOptions(a, b);
    expect(a).toEqual(aCopy);
    expect(b).toEqual(bCopy);
  });

  it('handles rules property with shallow merge instead of deep merge', () => {
    const a: Record<string, any> = {
      other: { nested: { value: 1 } },
      rules: {
        'rule-a': 'error',
        'rule-b': ['error', { option: 'old' }],
      },
    };
    const b: Record<string, any> = {
      other: { nested: { newValue: 2 } },
      rules: {
        'rule-b': ['warn', { option: 'new' }],
        'rule-c': 'off',
      },
    };

    const result = mergeOptions(a, b);

    // Other properties should be deep merged
    expect(result['other']).toEqual({
      nested: { value: 1, newValue: 2 },
    });

    // Rules should be shallow merged (rule-b should be completely replaced, not deep merged)
    expect(result['rules']).toEqual({
      'rule-a': 'error',
      'rule-b': ['warn', { option: 'new' }], // Completely replaced, not merged
      'rule-c': 'off',
    });
  });

  it('handles nested overrides properties with shallow merge', () => {
    const a: Record<string, any> = {
      other: { nested: { value: 1 } },
      react: {
        overrides: {
          'react/prop-types': 'off',
          'react/no-unused-prop-types': ['error', { skipShapeProps: true }],
        },
        someOtherProp: { deep: { value: 'old' } },
      },
      jsx: {
        a11y: {
          overrides: {
            'jsx-a11y/alt-text': 'warn',
          },
        },
      },
    };

    const b: Record<string, any> = {
      other: { nested: { newValue: 2 } },
      react: {
        overrides: {
          'react/no-unused-prop-types': ['warn', { skipShapeProps: false }], // Should replace completely
          'react/jsx-uses-vars': 'error',
        },
        someOtherProp: { deep: { newValue: 'new' } },
      },
      jsx: {
        a11y: {
          overrides: {
            'jsx-a11y/click-events-have-key-events': 'error',
          },
        },
      },
    };

    const result = mergeOptions(a, b);

    // Other properties should be deep merged
    expect(result['other']).toEqual({
      nested: { value: 1, newValue: 2 },
    });

    // Deep properties should still be deep merged
    expect(result['react'].someOtherProp).toEqual({
      deep: { value: 'old', newValue: 'new' },
    });

    // But overrides should be shallow merged
    expect(result['react'].overrides).toEqual({
      'react/prop-types': 'off',
      'react/no-unused-prop-types': ['warn', { skipShapeProps: false }], // Completely replaced
      'react/jsx-uses-vars': 'error',
    });

    expect(result['jsx'].a11y.overrides).toEqual({
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/click-events-have-key-events': 'error',
    });
  });
});
