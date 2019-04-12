#!/usr/bin/env node
const co = require('co');
const fs = require('fs');
const path = require('path');
const program = require('commander');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

program.arguments('')
  .action(() => {
    co(function *() {
      function *sql () {
        try {
          const query = yield (new Promise((resolve) => readline.question('> ', (input) => resolve(input))));

          if (query === 'exit') {
            readline.close();
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
              const paramsString = ((sqlString.match(/\(.*\)/) || [])[0] || '').trim();
              const fun = sqlString.replace(paramsString, '').trim();
              const argsString = paramsString.replace(/^\(/, "[").replace(/\)$/, "]")
              eval(`global.args = ${['()', ''].includes(argsString.replace(/\s/g, '')) ? '[{}]' : argsString};`);

              if (typeof $model[table][fun] !== 'function') {
                throw new Error(`LOL: ${table}.${fun} is not a function`);
              } else {
                console.log(JSON.stringify(yield $model[table][fun](...global.args), null, 2));
              }

            }
          }

          yield sql();
        } catch (e) {
          console.log('Error:', JSON.stringify(typeof e === "object" && e.name === "Error" ? e.message : e, null, 2));
          yield sql();
        }
      }

      yield sql();
    })
    .catch((e) => {
      console.log('Error:', JSON.stringify(typeof e === "object" && e.name === "Error" ? e.message : e, null, 2));
      process.exit(1);
    });
  })
  .parse(process.argv);
