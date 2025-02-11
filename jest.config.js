module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
    },
    testMatch: ['**/*.test.ts'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'
        }
    }
} 