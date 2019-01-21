#!/usr/bin/env node
const co = require('co');
const fs = require('fs');
const path = require('path');
const prompt = require('co-prompt');
const program = require('commander');

program.arguments('')
  .action(() => {
    co(function *() {
      function *sql () {
        try {
          const query = yield prompt('sql>: ');

          if (query === 'exit') {
            process.exit(1);
          }

          const sequelizePath = path.join(process.cwd(), '.sequelizerc');

          if (!fs.existsSync) {
            return Promise.reject('Sequelizerc not found');
          }

          const sequelizerc = require(sequelizePath);

          if (sequelizerc.extension) {
            require(sequelizerc.extension);
          }

          const [table, sqlPath] = query.split('.');

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
              eval(`var args = ${argsString === '()' ? '{}' : argsString}`);
              const a = yield Model[table][fun](args);
              console.log(JSON.stringify(a, null, 2));
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
