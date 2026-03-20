module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "require-jsdoc": "off", // Deshabilita esta regla
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    "max-len": ["error", {
      "code": 120, // Nuevo límite de caracteres para el código (por ejemplo, 120 o 150)
      "ignoreComments": true, // Ignorar la longitud de línea en los comentarios
      "ignoreStrings": true, // Ignorar la longitud de línea en las cadenas de texto
      "ignoreTemplateLiterals": true, // Ignorar la longitud en template literals
      "ignoreUrls": true, // Ignorar la longitud en URLs
    }],
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
