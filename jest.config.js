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
