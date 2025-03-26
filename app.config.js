module.exports = {
  expo: {
    name: "3Chords",
    slug: "3chords",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    scheme: "com.yourcompany.threechords",
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.threechords",
      config: {
        googleSignIn: {
          reservedClientId: "com.googleusercontent.apps.85339006592-oe2n2n96tps7j6nve4elsqq0ah488rso"
        }
      }
    },
    android: {
      package: "com.yourcompany.threechords",
      googleServicesFile: "./google-services.json"
    },
    plugins: [
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
      eas: {
        projectId: "your-project-id"
      }
    }
  }
} 