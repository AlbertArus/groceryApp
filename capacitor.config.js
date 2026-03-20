const { execSync } = require("child_process");

module.exports = {
  appId: "com.tuapp.grocery",
  appName: "GroceryApp",
  webDir: "build",
  bundledWebRuntime: false,

  plugins: {
    StatusBar: {
      overlaysWebView: true,
      style: "DARK"
    }
  },
  ios: {
    contentInset: "always"
  }
};
