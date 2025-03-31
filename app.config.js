module.exports = {
  expo: {
    name: "3Chords",
    slug: "3chords",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    scheme: "com.hamhammer.threechords",
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.hamhammer.threechords",
      googleServicesFile: "./GoogleService-Info.plist",
      googleSignInConfig: {
        reservedClientId: "com.googleusercontent.apps.85339006592-oe2n2n96tps7j6nve4elsqq0ah488rso"
      }
    },
    android: {
      package: "com.hamhammer.threechords",
      googleServicesFile: "./google-services.json"
    },
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static"
          }
        }
      ]
    ],
    extra: {
      projectId: "hamhammer-3chords",
      prebuildCommand: "npx expo prebuild --clean",
      eas: {
        projectId: "hamhammer-3chords"
      }
    }
  }
}; 