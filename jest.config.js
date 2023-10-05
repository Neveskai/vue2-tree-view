module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  setupFiles: ['./tests/setup.js'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/assets',
    '/tests/utils.js',
    'componentsBaseMixin.js',
    '.stories.js$',
    'i18n.js',
    'main.js',
    'App.vue',
    'components/Example',
    'componentsBaseOptions.js',
    'componentsBaseProps.js',
    'vuetify.js',
  ],
  collectCoverageFrom: ['src/components/**/*.{js,vue}', '!**/node_modules/**'],
  testMatch: ['**/unit/*.spec.js'],
  transformIgnorePatterns: ['/node_modules/(?!vuetify)'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue2-jest',
  },
  moduleFileExtensions: ['js', 'json', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
