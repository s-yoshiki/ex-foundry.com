import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const indexHtml = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

describe("Google tag bootstrap", () => {
  it("queues gtag commands using the Arguments object expected by gtag.js", () => {
    expect(indexHtml).toContain("dataLayer.push(arguments);");
    expect(indexHtml).not.toContain("dataLayer.push(args);");
  });
});
