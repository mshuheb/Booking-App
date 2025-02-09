module.exports = {
    preset: 'react-native',
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
      'node_modules/(?!(firebase|@firebase|react-native|@react-native|@expo|expo(-.*)?)/)',
    ],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  };
  