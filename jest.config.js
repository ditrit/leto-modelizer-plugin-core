/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  globals: {
    __DEV__: true,
  },
  // Jest assumes we are testing in node environment, specify jsdom environment instead
  testEnvironment: 'jsdom',
  // Needed in JS codebases too because of feature flags
  coveragePathIgnorePatterns: ['/node_modules/', '.d.ts$'],
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.js',
  ],
  moduleFileExtensions: ['js'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^tests/(.*)$': '<rootDir>/tests/$1',
    '^package\\.json$': '<rootDir>/package.json',
  },
  // transform: {
  //   ".*\\.js$": "babel-jest",
  // },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!d3|d3-array|internmap|delaunator|robust-predicates)'],
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['lcov', 'cobertura', 'text-summary', 'text'],
  coverageDirectory: './reports',
};
