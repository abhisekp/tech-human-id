module.exports = {
  clearMocks: true,
  restoreMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["index.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/*.test.ts"],
  transform: { "^.+\\.tsx?$": ["ts-jest", {}] },
};
