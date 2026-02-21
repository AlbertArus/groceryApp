const { execSync } = require("child_process");

module.exports = {
  appId: "com.tuapp.grocery",
  appName: "GroceryApp",
  webDir: "build",
  bundledWebRuntime: false,
  // server: {
  //   url: process.env.REACT_APP_CAPACITOR_SERVER_URL || "http://localhost:3000",
  //   cleartext: true
  // },
  plugins: {
    StatusBar: {
      overlaysWebView: true, // ESTO es lo que hace que tu CSS "suba" al reloj
      style: "DARK" // "DARK" pone los iconos (hora/batería) en negro. Usa "LIGHT" si tu cabecera es oscura.
    }
  },
  ios: {
    contentInset: "always"
  }
};
