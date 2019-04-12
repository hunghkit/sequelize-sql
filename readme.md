# Sequelize sql commander
The command is extention of `Sequelizejs`. It allows to call `Sequelize` functions from a terminal.

[![npm version](https://img.shields.io/npm/v/sequelize-sql.svg)](https://www.npmjs.com/package/sequelize-sql)
[![npm downloads](https://img.shields.io/npm/dm/sequelize-sql.svg)](https://www.npmjs.com/package/sequelize-sql)
![node](https://img.shields.io/node/v/sequelize-sql.svg)
![License](https://img.shields.io/npm/l/sequelize-sql.svg?maxAge=2592000?style=plastic)

## v0.0.6 Beta Release
- Install in dependence
```
npm install --save sequelize-sql or yarn add sequelize-sql
```

## Install Note
- If you're using `module-alias` or custom prototype, you should add a file and put path file to config of `.sequelizerc`.


```
// config content
const path = require('path');

module.exports = {
  "test": '...',
  "production": '...',
  "development": '...',
  "extension": 'put it in here',
};

```

## Demo - Example

[Blog example](https://github.com/hunghkit/sequelize-sql/tree/master/examples/blog)


## Command default

```bash
-   Exit: exit
-   Config: config - see .sequelizerc config
-   Sequelize Function: it's similar you call on model
```

## Documentation
- Run `node_modules/.bin/sequelize-sql`
- `$model` - model as root
- `$fn` - sequelize.fn
- `$op` - sequelize.Op
- `$literal` - sequelize.literal
- `$sequelize` - sequelize as `sequelize` lib

```bash
[Model].[Sequelize Function]

Exmaple:
-   Find something
    User.findAll({ limit: 10, order: [['createdAt', 'desc']] })
-   Create something
    Post.create({ title: 'Your title', content: 'Something in this', authorId: 1 })
-   Include model
    Post.findAll({ include: [{ model: $model.User, as: 'author' }] })
-   Counting
    Post.findAll({
        group: ['authorId'],
        attributes: ['authorId', [$literal('COUNT(authorId)'), 'total']]
    })
    or
    Post.findAll({
        group: ['authorId'],
        attributes: ['authorId', [fn('COUNT', '*'), 'total']]
    })
```

## Resources
- [Sequelizejs](http://docs.sequelizejs.com)

## License

MIT License
