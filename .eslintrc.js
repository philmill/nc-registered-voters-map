module.exports = {
  env: {
    node: true,
    amd: true,
    browser: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  rules: {},
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
};
