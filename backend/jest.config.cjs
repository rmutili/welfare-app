module.exports = {
  testEnvironment: "node",
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
    "**/?(*.)+(spec|test).cjs"
  ],
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  }
};
