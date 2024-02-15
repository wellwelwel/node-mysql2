#!/usr/bin/env node

'use strict';

const { poku } = require('poku');

poku(['./test/unit', './test/integration'], {
  filter: /\.(js)$/,
});
