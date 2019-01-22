# Sequelize sql commander
The command is extention of `Sequelizejs`. It allows to call `Sequelize` functions from a terminal. 

[![npm version](https://img.shields.io/npm/v/sequelize-sql.svg)](https://www.npmjs.com/package/sequelize-sql)
[![npm downloads](https://img.shields.io/npm/dm/sequelize-sql.svg?maxAge=2592000)](https://www.npmjs.com/package/sequelize-sql)
![node](https://img.shields.io/node/v/sequelize-sql.svg)
![License](https://img.shields.io/npm/l/sequelize-sql.svg?maxAge=2592000?style=plastic)

## v0.0.1 Beta Release
- Install globally:
```
npm install -g sequelize-sql or yarn global add sequelize-sql
```

- Install in dependence
```
npm install --save sequelize-sql or yarn add sequelize-sql
```

## Install Note
- If you're using `module-alias` or custom prototype, you should add a file and put path file to `.sequelizerc`.


```
const path = require('path');

module.exports = {
  "config": '...',
  "models-path": '...',
  "seeders-path": '...',
  "migrations-path": '...',
  "extension": 'put it in here',
};

```

## Command default

```bash
-   Exit: exit
-   Config: config - see .sequelizerc config
-   Sequelize Function: it's similar you call on model
```

## Documentation
- If you installed as global just run `sequelize-sql`
- If you installed as dependence just run `node_modules/.bin/sequelize-sql`

```bash
[Model].[Sequelize Function]

Exmaple:
-   Find something
    User.findAll({ limit: 10, order: [['createdAt', 'desc']] })
-   Create something
    Post.create({ title: 'Your title', content: 'Something in this' })
```

## Resources
- [Sequelizejs](http://docs.sequelizejs.com)

## License

MIT License
