import deepmergeUtil from '@fastify/deepmerge';

const baseMerge = deepmergeUtil({ all: true });

interface WithRules {
  rules?: Record<string, any>;
}

/**
 * Recursively finds and extracts all 'overrides' properties at any nesting level
 */
function extractOverridesRecursively(obj: any): Record<string, any> {
  const overrides: Record<string, any> = {};

  function traverse(current: any, path: string[] = []): void {
    if (current && typeof current === 'object' && !Array.isArray(current)) {
      for (const [key, value] of Object.entries(current)) {
        const currentPath = [...path, key];

        if (key === 'overrides') {
          // Store the path to this overrides property
          const pathKey = currentPath.slice(0, -1).join('.');
          overrides[pathKey] = value;
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          traverse(value, currentPath);
        }
      }
    }
  }

  traverse(obj);
  return overrides;
}

/**
 * Recursively sets overrides properties back into the object structure
 */
function setOverridesRecursively(obj: any, overridesMap: Record<string, any>): void {
  for (const [path, value] of Object.entries(overridesMap)) {
    const pathParts = path === '' ? [] : path.split('.');
    let current = obj;

    // Navigate to the parent object, creating objects as needed
    for (const part of pathParts) {
      if (
        !current[part] ||
        typeof current[part] !== 'object' ||
        Array.isArray(current[part])
      ) {
        current[part] = {};
      }
      current = current[part];
    }

    // Set the overrides property only if current is an object
    if (current && typeof current === 'object' && !Array.isArray(current)) {
      current.overrides = { ...value };
    }
  }
}

/**
 * Custom deep merge that handles 'rules' and 'overrides' properties with shallow merge
 * while deep merging all other properties.
 *
 * - 'rules' properties at the top level are shallow merged
 * - 'overrides' properties at any nesting level (e.g., react.overrides, jsx.a11y.overrides) are shallow merged
 * - All other properties are deep merged using the standard @fastify/deepmerge behavior
 */
function mergeOptions(target: any, ...sources: any[]): any {
  if (sources.length === 0) 
return target;

  // First, do the normal deep merge for everything
  const normalMergeResult = baseMerge(target, ...sources);

  // Now handle the rules property specially with shallow merge
  const result = { ...normalMergeResult };

  // Start with the target's rules
  const targetWithRules = target as WithRules;
  if (targetWithRules.rules) {
    (result as WithRules).rules = { ...targetWithRules.rules };
  }

  // Apply rules from each source with shallow merge
  for (const source of sources) {
    if (!source) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const sourceWithRules = source as WithRules;
    if (sourceWithRules.rules) {
      if ((result as WithRules).rules) {
        (result as WithRules).rules = {
          ...(result as WithRules).rules,
          ...sourceWithRules.rules,
        };
      } else {
        (result as WithRules).rules = { ...sourceWithRules.rules };
      }
    }
  }

  // Handle overrides properties with shallow merge
  // Collect all overrides from target and sources
  const allOverrides: Record<string, any> = {};

  // Start with target overrides
  const targetOverrides = extractOverridesRecursively(target);
  Object.assign(allOverrides, targetOverrides);

  // Apply overrides from each source
  for (const source of sources) {
    if (!source) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const sourceOverrides = extractOverridesRecursively(source);
    for (const [path, overrides] of Object.entries(sourceOverrides)) {
      if (allOverrides[path]) {
        // Shallow merge overrides
        allOverrides[path] = {
          ...allOverrides[path],
          ...overrides,
        };
      } else {
        allOverrides[path] = { ...overrides };
      }
    }
  }

  // Set all overrides back into the result
  setOverridesRecursively(result, allOverrides);

  return result;
}

export { mergeOptions };
