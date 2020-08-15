module.exports = {
  preset: 'jest-puppeteer',
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  "verbose": true,
  "displayName": "E2E Tests",
  "errorOnDeprecated": true,
};