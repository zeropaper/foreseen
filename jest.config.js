/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  maxWorkers: 3,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  moduleNameMapper: {
    '\\.module\\.css\\?(raw|url)$': '<rootDir>/__mocks__/css-module.ts',
  },
};
