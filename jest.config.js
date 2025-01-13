/* eslint-disable github/unescaped-html-literal */

"use strict";

/**
 * @type {import('jest').Config}
 */
export default {
  roots: ["<rootDir>/src"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/src/matchers/test-matchers.ts"],
};
