// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Add additional module resolution
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'mjs'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf'];

// Block Node.js-specific Firebase modules
config.resolver.blockList = [
  /.*\/node_modules\/@firebase\/.*\/dist\/.*\.node\.cjs\.js$/,
  /.*\/node_modules\/@firebase\/.*\/dist\/.*\.node\.esm\.js$/
];

// Add resolver to handle modules
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  // Provide empty implementations for Node.js modules
  'crypto': require.resolve('crypto-browserify'),
  'stream': require.resolve('stream-browserify'),
  'util': require.resolve('util/'),
};

// Add resolver to handle Firebase modules
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle Firebase Node.js modules
  if (moduleName.includes('@firebase') && moduleName.includes('index.node.cjs.js')) {
    // Replace Node.js version with React Native version
    const rnVersion = moduleName
      .replace('index.node.cjs.js', 'index.rn.js')
      .replace('/dist/', '/dist/rn/');
    
    return context.resolveRequest(context, rnVersion, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config; 