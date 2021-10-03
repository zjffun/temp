import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import NpmImport from 'less-plugin-npm-import';
import externalGlobals from 'rollup-plugin-external-globals';
import { terser } from 'rollup-plugin-terser';

const presets = () => {
  const externals = {};
  return [
    typescript({
      tsconfig: './tsconfig.build.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'ESNext',
          declaration: false,
        },
      },
    }),
    resolve(),
    commonjs(),
    externalGlobals(externals),
  ];
};

export default (filename, targetName, ...plugins) => [
  {
    input: 'src/index.ts',
    output: {
      format: 'umd',
      file: `dist/${filename}.umd.development.js`,
      name: targetName,
    },
    plugins: [...presets(filename, targetName), ...plugins],
  },
  {
    input: 'src/index.ts',
    output: {
      format: 'umd',
      file: `dist/${filename}.umd.production.js`,
      name: targetName,
    },
    plugins: [...presets(filename, targetName), terser(), ...plugins],
  },
];
