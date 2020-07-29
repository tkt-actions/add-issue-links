module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: {
    "src(.*)$": "<rootDir>/src/$1",
  },
  coverageDirectory: "../coverage",
  testEnvironment: "node",
};
