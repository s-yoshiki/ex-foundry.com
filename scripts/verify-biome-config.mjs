/* biome-ignore-all lint/correctness/noNodejsModules: this repository-level policy check runs in Node.js. */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

const configPath = resolve(import.meta.dirname, "../configs/biome/biome.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));

const expectedDomains = {
  drizzle: "none",
  next: "none",
  playwright: "none",
  project: "none",
  qwik: "none",
  react: "all",
  reactNative: "none",
  solid: "none",
  svelte: "none",
  tailwind: "all",
  test: "all",
  turborepo: "all",
  types: "all",
  vue: "none",
};

const actualDomains = config.linter?.domains;
const errors = [];

if (config.linter?.rules?.preset !== "all") {
  errors.push('linter.rules.preset must remain "all".');
}

for (const [domain, expectedLevel] of Object.entries(expectedDomains)) {
  const actualLevel = actualDomains?.[domain];
  if (actualLevel !== expectedLevel) {
    errors.push(
      `linter.domains.${domain} must be "${expectedLevel}" (found ${String(actualLevel)}).`,
    );
  }
}

for (const domain of Object.keys(actualDomains ?? {})) {
  if (!(domain in expectedDomains)) {
    errors.push(`linter.domains.${domain} is not covered by the Biome domain policy.`);
  }
}

if (errors.length > 0) {
  process.stderr.write("Biome configuration policy check failed:\n");
  for (const error of errors) {
    process.stderr.write(`- ${error}\n`);
  }
  process.exitCode = 1;
} else {
  process.stdout.write("Biome configuration policy is valid.\n");
}
