// @ts-check

'use strict';

const { coverage } = require('@pokujs/coverage');
const { multiSuite } = require('@pokujs/multi-suite');
const { defineConfig, listFiles } = require('poku');
const { hasPrivileges } = require('./tools/common.js');

const commonConfig = defineConfig({
  reporter: 'compact',
  deno: {
    allow: ['all'],
  },
});

const parallel = defineConfig({
  ...commonConfig,
  include: ['test/unit', 'test/integration'],
  timeout: 30000,
  concurrency: 8,
});

const sequential = defineConfig({
  ...commonConfig,
  timeout: 60000,
  sequential: true,
  plugins: [
    {
      async discoverFiles() {
        if (!(await hasPrivileges())) {
          console.log('\n› Skipping global tests: insufficient privileges');
          return [];
        }

        return listFiles('test/global');
      },
    },
  ],
});

module.exports = defineConfig({
  plugins: [
    coverage({
      requireFlag: true,
      all: true,
      include: ['index.js', 'promise.js', 'lib/**/*.js'],
      exclude: ['mysqldata/**', 'node_modules/**', 'test/**'],
      reporter: ['text', 'lcov', 'cobertura'],
      clean: true,
      hyperlinks: 'vscode',
      extension: ['.js'],
      // checkCoverage: true,
      // statements: 80,
      // branches: 80,
      // functions: 77,
      // lines: 80,
    }),
    multiSuite([parallel, sequential]),
  ],
});
