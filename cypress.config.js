const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "s4gsr1",
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "mochawesome-report",
    charts: true,
    reportPageTitle: "Cypress Test Report",
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  e2e: {
    // 자동 테스트 코드 생성 설정
    experimentalStudio: true,
    // 🔥 여기만 바꿔서 사용
    baseUrl: "http://localhost:3000",

    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      return config;
    },
  },
});
