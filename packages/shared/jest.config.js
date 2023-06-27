const config = {
    globals: {
        '@swc/jest': {
            tsconfig: 'tsconfig.test.json',
        },
        features: {},
    },
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {
        '@auxiliary/(.*)': '<rootDir>/lib/auxiliary/$1',
        '@contexts/(.*)': '<rootDir>/lib/contexts/$1',
        '@core/(.*)': '<rootDir>/lib/core/$1',
        '@features/features': '<rootDir>/lib/features/features',
        '@lib/(.*)': '<rootDir>/lib/$1',
        '@mocks/(.*)': '<rootDir>/test/mocks/$1',
    },
    setupFilesAfterEnv: ['./test/setup.ts'],
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['./node_modules/'],
    transform: {
        '^.+\\.ts$': [
            '@swc/jest',
            {
                jsc: {
                    target: 'es2021',
                },
            },
        ],
    },
    verbose: true,
}

module.exports = config
