module.exports = {
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/snack-sdk54/', '<rootDir>/dist/'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
