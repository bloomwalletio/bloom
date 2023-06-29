const config = {
    globals: {
        '@swc/jest': {
            tsconfig: 'tsconfig.test.json',
        },
        features: {},
    },
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {
        '@auxiliary/(.*)': '<rootDir>/src/lib/auxiliary/$1',
        '@contexts/(.*)': '<rootDir>/src/lib/contexts/$1',
        '@core/(.*)': '<rootDir>/src/lib/core/$1',
        '@features/features': '<rootDir>/src/lib/features/features',
        '@lib/(.*)': '<rootDir>/src/lib/$1',
        '@mocks/(.*)': '<rootDir>/test/mocks/$1',
    },
    setupFilesAfterEnv: ['./test/setup.ts'],
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['./node_modules/'],
    transform: {
        '^.+\\.(t|j)s$': [
            '@swc/jest',
            {
                jsc: {
                    target: 'es2021',
                },
            },
        ],
    },
    transformIgnorePatterns: ['./node_modules/@walletconnect'],
    verbose: true,
}

module.exports = config
