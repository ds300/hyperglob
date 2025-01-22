export default {
  transform: {
    '^.+\\.(j|t)s?$': '@swc/jest',
  },
  transformIgnorePatterns: ['ckafojisfew'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules'],
  moduleNameMapper: {
    '^(..?/.+).js?$': '$1',
  },
}
