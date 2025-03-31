const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'ttf'],
    sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs'],
    resolverMainFields: ['react-native', 'browser', 'main'],
    platforms: ['ios', 'android', 'web'],
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
    blockList: [
      /.*\/node_modules\/@firebase\/.*\/dist\/.*\.node\.cjs\.js$/,
      /.*\/node_modules\/@firebase\/.*\/dist\/.*\.node\.esm\.js$/
    ],
    extraNodeModules: {
      '@expo/vector-icons': require.resolve('@expo/vector-icons')
    },
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName.includes('@expo/vector-icons') || moduleName.includes('react-native-vector-icons')) {
        return context.resolveRequest(context, moduleName.replace('./vendor/', ''), platform);
      }
      if (moduleName.includes('@firebase') && moduleName.includes('index.node.cjs.js')) {
        return context.resolveRequest(
          context,
          moduleName.replace('index.node.cjs.js', 'index.rn.js').replace('/dist/', '/dist/rn/'),
          platform
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    }
  },
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    })
  }
};

module.exports = mergeConfig(defaultConfig, config);

// // Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config');
// const path = require('path');

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname);

// // Ensure proper resolution of React Native modules
// config.resolver = {
//   ...config.resolver,
//   sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json', 'cjs', 'mjs'],
//   assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf'],
//   resolverMainFields: ['react-native', 'browser', 'main'],
//   // Ensure node_modules are included in the lookup
//   nodeModulesPaths: [path.resolve(__dirname, 'node_modules')]
// };

// // Block Node.js-specific Firebase modules
// config.resolver.blockList = [
//   /.*\/node_modules\/@firebase\/.*\/dist\/.*\.node\.cjs\.js$/,
//   /.*\/node_modules\/@firebase\/.*\/dist\/.*\.node\.esm\.js$/
// ];

// // Add resolver to handle modules
// config.resolver.extraNodeModules = {
//   ...config.resolver.extraNodeModules,
//   // Provide empty implementations for Node.js modules
//   'crypto': require.resolve('crypto-browserify'),
//   'stream': require.resolve('stream-browserify'),
//   'util': require.resolve('util/'),
// };

// // Add resolver to handle Firebase modules
// config.resolver.resolveRequest = (context, moduleName, platform) => {
//   // Handle Firebase Node.js modules
//   if (moduleName.includes('@firebase') && moduleName.includes('index.node.cjs.js')) {
//     // Replace Node.js version with React Native version
//     const rnVersion = moduleName
//       .replace('index.node.cjs.js', 'index.rn.js')
//       .replace('/dist/', '/dist/rn/');

//     return context.resolveRequest(context, rnVersion, platform);
//   }

//   return context.resolveRequest(context, moduleName, platform);
// };

// module.exports = config; 