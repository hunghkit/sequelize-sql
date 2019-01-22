#!/usr/bin/env node
const co = require('co');
const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize'); // eslint-disable-line
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
            message: 'sql>:',
          });

          if (query === 'exit') {
            process.exit(1);
          }

          const sequelizePath = path.join(process.cwd(), '.sequelizerc');

          if (!fs.existsSync(sequelizePath)) {
            return Promise.reject('Sequelizerc not found');
          }

          const sequelizerc = require(sequelizePath);

          if (sequelizerc.extension) {
            require(sequelizerc.extension);
          }

          const [table, ...others] = query.split('.');
          const sqlPath = others.join('.');

          if (query === 'config') {
            console.log(JSON.stringify(sequelizerc, null, 2));
          } else if (table && sqlPath) {
            const modelPath = sequelizerc['models-path'];
            const Model = require(modelPath);

            if (!Model[table]) {
              throw new Error('LOL: Table is not exist');
            } else {
              const sqlString = sqlPath.toString().replace(/;$/, '');
              const argsString = (sqlString.match(/\(.*\)/) || [])[0];
              const fun = sqlString.replace(argsString, '');
              eval(`global.args = ${argsString === '()' ? '{}' : argsString}`);

              console.log(JSON.stringify(yield Model[table][fun](global.args), null, 2));
            }
          } else {
            throw new Error('LOL: Please add a query');
          }
          yield sql();
        } catch (e) {
          console.log('Error:', e);
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
