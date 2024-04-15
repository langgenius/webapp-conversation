import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  // testEnvironment: "jsdom",
  // preset: "ts-jest",
  testEnvironment: "node",
  // moduleNameMapper: {
  //   "^axios$": "<rootDir>/node_modules/axios/dist/node/axios.cjs"
  // },
  transformIgnorePatterns: [
    "node_modules/(?!axios)",
  ]
};

export default createJestConfig(config)
