/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/test/__mocks__/styleMock.js', // sets up routing to mocks style sheet
    '^@pages(.*)$': '<rootDir>/src/pages$1', //allows module imports of page components
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@styles(.*)$': '<rootDir>/styles$1',
  },
  setupFilesAfterEnv: [
    '<rootDir>/tests/jest.setup.js',
    '<rootDir>/tests/jest-i18n.ts',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  }, //transfrom typescript files to common js for jest compiler
  transformIgnorePatterns: [
    '/.next/',
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testRegex: '(/tests/.*(test|spec))\\.[jt]sx?$',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.ts-jest.json',
    },
  },
}
