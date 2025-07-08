/* 
Jest is configured in jest.config.js to run in a Node environment with ts-jest transforms 
and support for root‑based module imports. The test script simply runs jest

Other tests use mockingoose to simulate MongoDB models when testing calculateAvgRating, 
spy on the email service for swap logic, and check the authentication guard middleware

*/
const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  coverageProvider: "v8",
  clearMocks: true,
  moduleDirectories: [
    "node_modules",
    "",
  ],
  rootDir: "./",
};
