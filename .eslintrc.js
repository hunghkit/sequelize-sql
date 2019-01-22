module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "airbnb-base",
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "plugins": [
    "react",
    "import",
    "jsx-a11y"
  ],
  "env": {
    "es6": true,
    "node": true,
    "jest": true,
    "browser": true
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "no-console": 0,
    "import/no-dynamic-require": 0,
  }
};
