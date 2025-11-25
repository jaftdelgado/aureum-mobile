module.exports = function (api) {
  api.cache(true);
  let plugins = [];

  plugins.push('react-native-worklets/plugin');

  plugins.push([
    'module-resolver',
    {
      root: ['./src'],
      alias: {
        '@': './',
        '@app': './src/app',
        '@core': './src/core',
        '@domain': './src/domain',
        '@infra': './src/infra',
        '@features': './src/features',
      },
    },
  ]);

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins,
  };
};
