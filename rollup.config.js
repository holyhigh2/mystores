/* eslint-disable max-len */
const banner2 = require('rollup-plugin-banner2')
const copy = require('rollup-plugin-copy')
const json = require('@rollup/plugin-json')
const typescript = require('rollup-plugin-typescript2')
const clear = require('rollup-plugin-clear')
const terser = require('@rollup/plugin-terser')
const pkg = require('./package.json')
const nodeResolve = require('@rollup/plugin-node-resolve')

export default [
  {
    input: './src/index.ts',
    external: ['myfx'],
    plugins: [
      clear({
        targets: ['dist'],
      }),
      typescript({
        clean: true
      }),
      banner2(
        () => `/**
   * ${pkg.name} v${pkg.version}
   * ${pkg.description}
   * @${pkg.author}
   * ${pkg.repository.url}
   */
  `
      ),
      json(),
      copy({
        targets: [
          {
            src: [
              'CHANGELOG.md',
              'LICENSE',
              'README.md',
              'README_ZH.md',
              'package.json',
              '.npmignore',
            ],
            dest: 'dist',
          },
        ],
      }),
    ],
    output: [
      {file: 'dist/index.esm.js', format: 'esm', sourcemap: true,plugins:[terser()]},
    ],
  },
  {
    input: './src/index.ts',
    external: ['myfx'],
    plugins: [
      typescript(),
      nodeResolve(),
      banner2(
        () => `/**
   * ${pkg.name} v${pkg.version}
   * ${pkg.description}
   * @${pkg.author}
   * ${pkg.repository.url}
   */
  `
      ),
      json(),
      copy({
        targets: [
          {
            src: [
              'CHANGELOG.md',
              'LICENSE',
              'README.md',
              'README_ZH.md',
              'package.json',
              '.npmignore',
            ],
            dest: 'dist',
          },
        ],
      }),
    ],
    output: [
      {file: 'dist/index.js', format:'umd', name:'myss', sourcemap: true,plugins:[terser()]
    },
    ],
  }
]