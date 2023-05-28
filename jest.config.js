/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  transformIgnorePatterns: [
    "<rootDir>node_modules/(?!(myfuncs)/)"
  ],
  // globals: {
  //   'ts-jest': {
  //     useESM: true,
  //     isolatedModules: true,
  //   },
  // },
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js)$": "babel-jest",
  }
};