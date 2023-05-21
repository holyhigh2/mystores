/* eslint-disable max-len */
const banner2 = require('rollup-plugin-banner2')
const copy = require('rollup-plugin-copy')
const json = require('@rollup/plugin-json')
const typescript = require('rollup-plugin-typescript2')
const clear = require('rollup-plugin-clear')
const terser = require('@rollup/plugin-terser')
const pkg = require('./package.json')

export default [
  {
    input: './src/index.ts',
    external: ['@holyhigh/func.js'],
    plugins: [
      clear({
        targets: ['dist'],
      }),
      typescript({
        clean: true
      }),
      terser(),
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
      {file: 'dist/index.js', format: 'esm', name:'mystore', sourcemap: true, plugins: [terser()]},
    ],
  }
]