const { execSync } = require("child_process");

module.exports = {
  appId: "com.tuapp.grocery",
  appName: "GroceryApp",
  webDir: "build",
  bundledWebRuntime: false,
  server: {
    url: process.env.REACT_APP_CAPACITOR_SERVER_URL || "http://localhost:3000",
    cleartext: true
  },
  ios: {
    contentInset: "always"
  }
};
