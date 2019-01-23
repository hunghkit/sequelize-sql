# Sequelize sql blog example
The command is extention of `Sequelizejs`. It allows to call `Sequelize` functions from a terminal.

[![npm version](https://img.shields.io/npm/v/sequelize-sql.svg)](https://www.npmjs.com/package/sequelize-sql)
[![npm downloads](https://img.shields.io/npm/dm/sequelize-sql.svg)](https://www.npmjs.com/package/sequelize-sql)
![node](https://img.shields.io/node/v/sequelize-sql.svg)
![License](https://img.shields.io/npm/l/sequelize-sql.svg?maxAge=2592000?style=plastic)

## Install
```
git clone git@github.com:hunghkit/sequelize-sql.git
cd examples/blog
yarn install or npm install
// create database
node_modules/.bin/sequelize db:create
// create table
node_modules/.bin/sequelize db:migrate
```

## Demo command
```
node_modules/.bin/sequelize-sql
```

-   **create user**

<p>
  <img src="images/1.png">
</p>


-   **find user**

<p>
  <img src="images/2.png">
</p>


-   **create post**

<p>
  <img src="images/3.png">
</p>

-   **find post**

<p>
  <img src="images/4.png">
</p>

-   **counting post of author**

<p>
  <img src="images/5.png">
</p>

## Resources
- [Sequelizejs](http://docs.sequelizejs.com)

## License

MIT License
