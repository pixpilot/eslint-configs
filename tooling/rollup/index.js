import path from 'node:path';
import process from 'node:process';

import { nodeResolve } from '@rollup/plugin-node-resolve';
// import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

// For all TypeScript files in 'src', excluding declaration files.
// const entryPoints = globSync('src/**/*.ts', {
//   ignore: ['src/**/*.d.ts', 'src/**/__tests__/**'], // Ignore declaration files and all __tests__ folders
// });

const entryPoints = 'src/index.ts';

// Ensure output directory is relative to the current working directory (package being built)
const outputDir = path.resolve(process.cwd(), 'dist');

/** @type {import('rollup').RollupOptions} */
const config = {
  input: entryPoints,
  external: (id) => {
    // Bundle internal packages (anything starting with @internal/)
    if (id.startsWith('@internal/')) {
      return false;
    }
    // Keep external packages as external but not relative imports
    if (!id.startsWith('.') && !path.isAbsolute(id)) {
      return true;
    }
    return false;
  },
  output: [
    {
      dir: outputDir,
      entryFileNames: '[name].cjs',
      format: 'cjs',
      exports: 'named',
      // Preserve the original module structure.
      preserveModules: true,
      // Set 'src' as the root. This strips 'src/' from the output path.
      // e.g., 'src/configs/main.ts' becomes 'dist/configs/main.cjs'
      preserveModulesRoot: 'src',
    },
    {
      dir: outputDir,
      entryFileNames: '[name].js',
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  ],
  plugins: [
    nodeResolve({
      // Resolve modules from node_modules and workspace packages
      preferBuiltins: false,
      // Resolve TypeScript files
      extensions: ['.ts', '.js', '.mjs', '.json'],
    }),
    typescript({
      tsconfig: './tsconfig.build.json',
      /*
       * Enabling incremental compilation may cause errors and sometimes prevent .d.ts file generation.
       * It can also cause the creation of a .rollup.cache folder, which sometimes results in .d.ts files not being copied.
       */
      incremental: false,
    }),
    // Custom plugin to rename internal package directories
    (() => {
      const internalPackageFiles = new Map(); // Track files and their package names
      const internalImports = new Set(); // Track @internal/* imports

      return {
        name: 'rename-internal-packages',
        resolveId(id, _importer) {
          // Track when we resolve @internal/* imports
          if (id.startsWith('@internal/')) {
            internalImports.add(id);
          }
          return null; // Don't change the resolution
        },
        load(id) {
          // Check if this file is from an @internal package by checking the resolved path
          // Only match files that actually come from workspace packages, not local files
          for (const internalImport of internalImports) {
            // Check if the resolved path contains the workspace package structure
            // Look for patterns like: ../../../packages/utils/src/... or node_modules/@internal/utils/...
            const packageName = internalImport.replace('@internal/', '');

            if (
              (id.includes(`\\packages\\${packageName}\\`) ||
                id.includes(`/packages/${packageName}/`) ||
                id.includes(`node_modules/@internal/${packageName}`)) &&
              !id.includes(process.cwd())
            ) {
              // This file comes from an internal package (not current package)
              internalPackageFiles.set(id, packageName);
              break;
            }
          }
          return null; // Don't change the loading
        },
        generateBundle(options, bundle) {
          const renamedPaths = new Map(); // Track old -> new path mappings

          // First pass: rename files from internal packages
          for (const [fileName, chunk] of Object.entries(bundle)) {
            if (chunk.type === 'chunk') {
              // Check if any of the modules in this chunk come from internal packages
              let isInternalPackageFile = false;
              let internalPackageName = null;

              if (chunk.moduleIds) {
                for (const moduleId of chunk.moduleIds) {
                  if (
                    typeof moduleId === 'string' &&
                    internalPackageFiles.has(moduleId)
                  ) {
                    isInternalPackageFile = true;
                    internalPackageName = internalPackageFiles.get(moduleId);
                    break;
                  }
                }
              }

              if (isInternalPackageFile && internalPackageName) {
                const pathSegments = fileName.split('/');
                if (pathSegments.length >= 1) {
                  const currentPackageName = pathSegments[0];

                  if (
                    currentPackageName &&
                    currentPackageName === internalPackageName &&
                    !currentPackageName.startsWith('internal-')
                  ) {
                    const newFileName = fileName.replace(
                      new RegExp(`^${currentPackageName}/`),
                      `internal-${currentPackageName}/`,
                    );

                    // Store the mapping for updating imports later - be more specific
                    renamedPaths.set(fileName, newFileName);

                    // Rename the file in the bundle
                    bundle[newFileName] = chunk;
                    delete bundle[fileName];
                    chunk.fileName = newFileName;
                  }
                }
              }
            }
          }

          // Second pass: update import paths in all chunks
          for (const chunk of Object.values(bundle)) {
            if (chunk.type === 'chunk' && chunk.code) {
              let updatedCode = chunk.code;

              // Update import statements for each renamed file
              for (const [oldPath, newPath] of renamedPaths) {
                // Update ES6 import statements - match exact paths
                updatedCode = updatedCode.replace(
                  new RegExp(
                    `from ['"]\\.\/${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
                    'g',
                  ),
                  `from './${newPath}'`,
                );

                // Update dynamic import statements - match exact paths
                updatedCode = updatedCode.replace(
                  new RegExp(
                    `import\\(['"]\\.\/${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
                    'g',
                  ),
                  `import('./${newPath}'`,
                );
              }

              chunk.code = updatedCode;
            }
          }
        },
      };
    })(),
    // terser(),
  ],
};

export default config;
