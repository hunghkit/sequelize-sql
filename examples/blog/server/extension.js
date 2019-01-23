process.env.BABEL_ENV = process.env.BABEL_ENV || process.env.NODE_ENV || 'development';
require('@babel/register');
require('@babel/polyfill');

const moduleAlias = require('module-alias');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // eslint-disable-line
}

moduleAlias.addAlias('@server', __dirname);
