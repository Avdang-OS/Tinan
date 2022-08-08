import type { Config } from "jest";

const config: Config = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": `ts-jest`,
  },
  moduleNameMapper: {
    "^@src/(.*)$": "./src/$1"
  }
}

export default config;
