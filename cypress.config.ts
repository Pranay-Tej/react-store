import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalSessionAndOrigin: true
    // baseUrl: process.env.CYPRESS_baseUrl || 'http://localhost:8888'
  },
  experimentalStudio: true,
  defaultCommandTimeout: 10000, // 10 seconds
  video: false
});
