#!/usr/bin/env node

const createApp = require('../index.js');

createApp(process.env.NODE_ENV)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
