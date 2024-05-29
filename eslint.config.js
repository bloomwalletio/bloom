const jsEslint = require('@eslint/js')
const securityPlugin = require('eslint-plugin-security')
const babelParser = require('@babel/eslint-parser')
const tsEslint = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const sveltePlugin = require('eslint-plugin-svelte')
const svelteParser = require('svelte-eslint-parser')

const parserOptions = {
    ecmaVersion: 6,
    sourceType: 'module',
}

const eslintRules = {
    'arrow-body-style': 'off', // OFF b/c blocks style allows for readability and ensure scope
    'arrow-spacing': 'error',
    'eol-last': 'error',
    eqeqeq: 'error',
    'func-call-spacing': 'error',
    indent: 'off', // OFF b/c causes problems between Prettier and ESLint
    'linebreak-style': 'off', // OFF b/c Windows (Git) puts CRLF line endings
    'missing-declaration': 'off', // OFF b/c throws errors on imports / require statements
    'multiline-ternary': 'off', // OFF b/c causes problems between Prettier and ESLint
    'no-alert': 'off', // OFF b/c we use confirm windows for preventing close of popup
    'no-async-promise-executor': 'error',
    'no-case-declarations': 'error',
    'no-console': ['error', { allow: ['error', 'warn'] }],
    'no-control-regex': 'error',
    'no-dupe-keys': 'error',
    'no-empty': 'error',
    'no-extra-boolean-cast': 'error',
    'no-extra-parens': 'off', // OFF b/c reactive dependencies in .svelte files (mostly for errors)
    'no-extra-semi': 'error',
    'no-fallthrough': 'error',
    'no-import-assign': 'error',
    'no-irregular-whitespace': 'error',
    'no-prototype-builtins': 'error',
    'no-return-await': 'off', // OFF b/c it is sometimes necessary when using try/catch blocks
    'no-trailing-spaces': 'error',
    'no-useless-escape': 'error',
    'no-undef': 'error',
    'no-underscore-dangle': 'off', // OFF b/c this syntax is used for defining local callback methods
    'no-unreachable': 'error',
    'no-unused-export-let': 'off', // OFF b/c troublesome with some .js files in packages/shared
    'no-unused-vars': 'off', // OFF b/c the typescript linter rule is used
    'no-var': 'error',
    'prefer-arrow-callback': 'warn',
    'prefer-const': 'warn',
    'prefer-destructuring': 'off', // OFF b/c it's not really correct
    quotes: ['error', 'single'],
    semi: 'off', // OFF b/c we aren't using semicolons
    'space-before-function-paren': 'off', // OFF b/c we aren't using spaces before function parameters / signatures
    'spaced-comment': 'error',
}

const eslintRulesOnlyTypescript = {
    'no-undef': 'off', // Typescript handles undefined variables better than eslint
}

const typescriptEslintRules = {
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'warn', // Warn b/c return types are not supported in Svelte markdown
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-empty-function': 'off', // OFF b/c we use empty functions a lot (esp. for initialization)
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    '@typescript-eslint/no-extra-semi': 'error',
    '@typescript-eslint/no-floating-promises': 'warn', // Warn b/c we have existing code in migration that I don't want to touch to pass new linting rules
    '@typescript-eslint/no-implied-eval': 'error',
    '@typescript-eslint/no-inferrable-types': 'off', // OFF b/c this errors on some useful code annotations for function signatures
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-redundant-type-constituents': 'warn',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'off', // OFF b/c used in Svelte components for UI logic
    '@typescript-eslint/no-unsafe-call': 'off', // OFF b/c used in Svelte components for UI logic
    '@typescript-eslint/no-unsafe-member-access': 'off', // OFF b/c there are simply too many linting errors
    '@typescript-eslint/no-unsafe-return': 'off', // OFF b/c used in Svelte components for UI logic
    '@typescript-eslint/no-unsafe-argument': 'off', // OFF b/c ESlint resolves types of the absolute imports as any
    '@typescript-eslint/unused-export-let': 'off', // OFF b/c used in Svelte components for UI logic
    '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],

    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/prefer-regexp-exec': 'error',
    '@typescript-eslint/restrict-plus-operands': 'off', // OFF b/c not entirely accurate despite proper typings
    '@typescript-eslint/restrict-template-expressions': 'off', // OFF b/c using any is useful in template expressions
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/unbound-method': 'error',
    '@typescript-eslint/no-namespace': 'off', // OFF b/c used in Svelte components for exporting types inside of a namespace
}

const linterRules = {
    ...eslintRules,
    ...eslintRulesOnlyTypescript,
    ...typescriptEslintRules,
}

const svelteRules = {
    '@typescript-eslint/no-explicit-any': 'off', // OFF b/c used for callback methods in Svelte components
}

const svelteSettings = {
    'svelte/typescript': () => require('typescript'),
    'svelte/ignore-styles': () => true,
    'svelte/ignore-warnings': () => false,
}

const ignores = [
    // Repository
    '.vscode/',
    'patches/',

    // Desktop (packages/desktop)
    'packages/desktop/electron-builder-config.js',
    'packages/desktop/out/',
    'packages/desktop/public/',
    'packages/desktop/electron/lib/keychain.js',

    // Shared (packages/shared)
    'packages/shared/src/assets/',
    '!packages/shared/src/lib/tests/',
    'packages/shared/src/locales/',
    '!packages/shared/src/locales/en.json',

    // Common files and folders
    '**/node_modules/',
    '**/out/',
    '**/tests/',
]

module.exports = [
    // Global ignores
    {
        ignores,
    },
    // Load predefined configs
    jsEslint.configs.recommended,
    // securityPlugin.configs.recommended,
    ...sveltePlugin.configs['flat/recommended'],
    {
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                ...parserOptions,
                requireConfigFile: false,
            },
            globals: {
                require: 'readonly',
                module: 'readonly',
            },
        },
        rules: {
            ...eslintRules,
        },
    },
    {
        files: ['**/*.ts'],
        // extends: [jsEslint.configs.recommended, tsEslint.configs.recommended],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ...parserOptions,
                // extraFileExtensions: ['.svelte'],
                project: './tsconfig.lint.json',
                tsconfigRootDir: './',
            },
        },
        plugins: { '@typescript-eslint': tsEslint },
        rules: linterRules,
        // settings: svelteSettings,
    },
    {
        files: ['**/*.svelte'],
        settings: svelteSettings,
        // extends: [jsEslint.configs.recommended],
        languageOptions: {
            parser: svelteParser,
            parserOptions: {
                parser: tsParser,
                extraFileExtensions: ['.svelte'],
                project: './tsconfig.lint.json',
                tsconfigRootDir: './',
            },
        },
        rules: {
            // ...linterRules,
            ...svelteRules,
        },
    },
]
