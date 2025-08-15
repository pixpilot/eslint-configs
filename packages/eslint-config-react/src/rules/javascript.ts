import type { TypedFlatConfigItem } from '@pixpilot/eslint-config';
import { javascriptConfigs } from '@pixpilot/eslint-config';

export async function jsConfigs(): Promise<TypedFlatConfigItem[]> {
  // Get the base no-underscore-dangle rule configuration
  const javascriptConf = await javascriptConfigs();

  const baseDangleRule = javascriptConf.find(
    (item): boolean =>
      typeof item.rules !== 'undefined' &&
      typeof item.rules['no-underscore-dangle'] !== 'undefined',
  );

  return [
    {
      rules: {
        'no-underscore-dangle':
          baseDangleRule && Array.isArray(baseDangleRule.rules?.['no-underscore-dangle'])
            ? [
                baseDangleRule.rules['no-underscore-dangle'][0], // severity
                {
                  ...(typeof baseDangleRule.rules['no-underscore-dangle'][1] ===
                    'object' && baseDangleRule.rules['no-underscore-dangle'][1] !== null
                    ? baseDangleRule.rules['no-underscore-dangle'][1]
                    : {}),
                  allow: [
                    ...(Array.isArray(
                      baseDangleRule.rules['no-underscore-dangle'][1]?.allow,
                    )
                      ? baseDangleRule.rules['no-underscore-dangle'][1].allow
                      : []),
                    '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__',
                  ],
                },
              ]
            : (baseDangleRule?.rules?.['no-underscore-dangle'] ?? [
                2,
                { allow: ['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] },
              ]),
      },
    },
  ];
}
