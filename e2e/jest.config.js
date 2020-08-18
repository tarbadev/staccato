module.exports = {
    preset: 'jest-puppeteer',
    transform: {
        "^.+\\.ts?$": "ts-jest"
    },
    "verbose": true,
    "displayName": "E2E Tests",
    "errorOnDeprecated": true,
    "moduleNameMapper": {
        '^@shared/(.*)$': '<rootDir>../shared/$1',
        '^@config/(.*)$': '<rootDir>../config/$1'
    },
    testTimeout: 15000,
};