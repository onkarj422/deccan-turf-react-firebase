module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb',
        'airbnb/hooks',
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    plugins: ['react', 'react-hooks', 'jsx-a11y', '@typescript-eslint', 'import'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            alias: {
                map: [
                    ['@', './src'],
                    ['@components', './src/components'],
                    ['@hooks', './src/hooks'],
                    ['@utils', './src/utils'],
                    ['@assets', './src/assets'],
                    ['@routes', './src/routes'],
                    ['@pages', './src/pages'],
                    ['@layouts', './src/layouts'],
                    ['@context', './src/context'],
                    ['@lib', './src/lib'],
                    ['@styles', './src/styles'],
                    ['@theme', './src/theme'],
                    ['@constants', './src/constants'],
                    ['@types', './src/types'],
                    ['@stores', './src/stores'],
                    ['@services', './src/services'],
                    ['@config', './src/config'],
                    ['@auth', './src/auth'],
                ],
                extensions: ['.js', '.jsx', '.ts', '.tsx'], // extensions that should be resolved
            },
        },
    },
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.ts', '.jsx', '.js'] }],
        'import/no-unresolved': 'error', // Enforces no unresolved imports
        'import/extensions': ['error', 'ignorePackages', {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
        }],
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        'react/jsx-max-props-per-line': [1, { maximum: 1, when: 'always' }],
        'linebreak-style': 'off',
        indent: ['error', 4], // for JS/JSX
        'react/jsx-indent': ['error', 4], // for JSX
        'react/jsx-indent-props': ['error', 4], // for JSX props
        'max-len': ['error', { code: 160 }],
        'react/function-component-definition': [
            'error',
            {
                named: 'any', // Allow both function declarations and arrow functions for named components
                anonymous: 'never',
            },
        ],
        'import/prefer-default-export': 'off', // Disable the rule that prefers default exports
    },
};
