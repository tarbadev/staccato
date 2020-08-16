module.exports = {
    "preset": "ts-jest",
    "verbose": true,
    "displayName": "Server Tests",
    "errorOnDeprecated": true,
    "moduleNameMapper": {
        '^@config/(.*)$': '<rootDir>../config/$1'
    }
};