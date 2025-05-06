module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "google",
    ],
    ignorePatterns: [
        "/lib/**/*", // Ignore built files.
        "/generated/**/*", // Ignore generated files.
    ],
    plugins: [
        "import",
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows ES6+ syntax including arrow functions
    },
    rules: {
        "quotes": ["error", "double"],
        "import/no-unresolved": 0,
        "indent": ["error", 4],
        "max-len": ["error", { "code": 160 }],
        "linebreak-style": "off",
        "object-curly-spacing": ["error", "always"],
    },
};
