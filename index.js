#!/usr/bin/env node
const co = require('co');
const fs = require('fs');
const path = require('path');
const prompt = require('prompts');
const program = require('commander');

program.arguments('')
  .action(() => {
    co(function *() {
      function *sql () {
        try {
          const { query } = yield prompt({
            type: 'text',
            name: 'query',
            message: 'sql',
          });

          if (query === 'exit') {
            process.exit(1);
          }

          const sequelizePath = path.join(process.cwd(), '.sequelizerc');

          if (!fs.existsSync(sequelizePath)) {
            return Promise.reject('Sequelizerc not found');
          }

          const sequelizerc = require(sequelizePath);
          const config = require(sequelizerc.config);

          if ((config || {}).extension) {
            require(config.extension);
          }

          const [table, ...others] = query.split('.');
          const sqlPath = others.join('.');

          if (query === 'config') {
            console.log(JSON.stringify(sequelizerc, null, 2));
          } else if (table && sqlPath) {
            const modelPath = sequelizerc['models-path'];

            const $model = require(modelPath);
            const $sequelize = $model.sequelize;
            const $fn = $sequelize.fn; // eslint-disable-line
            const $op = $sequelize.Op; // eslint-disable-line
            const $literal = $sequelize.literal; // eslint-disable-line

            if (!$model[table]) {
              throw new Error(`LOL: ${table} is not exist`);
            } else {
              const sqlString = sqlPath.toString().replace(/;$/, '');
              const argsString = (sqlString.match(/\(.*\)/) || [])[0] || '';
              const fun = sqlString.replace(argsString, '');
              eval(`global.args = ${['()', ''].includes(argsString.replace(/\s/g, '')) ? '{}' : argsString};`);

              if (typeof $model[table][fun] !== 'function') {
                throw new Error(`LOL: ${table}.${fun} is not a function`);
              } else {
                console.log(JSON.stringify(yield $model[table][fun](global.args), null, 2));
              }

            }
          }

          yield sql();
        } catch (e) {
          console.log(e);
          yield sql();
        }
      }

      yield sql();
    })
    .catch((e) => {
      if (e !== 'Exit') {
        console.log('Error:', e);
      }

      process.exit(1);
    });
  })
  .parse(process.argv);
