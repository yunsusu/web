const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // 🔥 여기만 바꿔서 사용
    baseUrl: "http://localhost:3000",
    // baseUrl: "https://your-app.vercel.app",

    setupNodeEvents(on, config) {
      return config;
    },
  },
});
