import { toPascalCase } from "./feature-name";

export type GeneratedFile = {
  contents: string;
  /** Path relative to the feature directory. */
  path: string;
};

/**
 * Renders the starter files for a feature.
 *
 * Only the layers that need code on day one are created: a domain type, a pure
 * function with its test, and a component that renders them. `hooks/` is added
 * by hand once the feature actually holds state — see docs/adding-a-feature.md.
 */
export function buildFeatureFiles(name: string): readonly GeneratedFile[] {
  const pascal = toPascalCase(name);
  const typeName = `${pascal}Item`;

  return [
    {
      contents: `export type ${typeName} = {
  id: string;
  label: string;
};
`,
      path: `types/${name}.ts`,
    },
    {
      contents: `import type { ${typeName} } from "../types/${name}";

export function get${pascal}Items(): readonly ${typeName}[] {
  return [];
}
`,
      path: `functions/get-${name}-items.ts`,
    },
    {
      contents: `import { describe, expect, it } from "vitest";
import { get${pascal}Items } from "./get-${name}-items";

describe("get${pascal}Items", () => {
  it("starts empty", () => {
    expect(get${pascal}Items()).toEqual([]);
  });
});
`,
      path: `functions/get-${name}-items.test.ts`,
    },
    {
      contents: `import { get${pascal}Items } from "../functions/get-${name}-items";

export function ${pascal}() {
  const items = get${pascal}Items();

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  );
}
`,
      path: `components/${name}.tsx`,
    },
  ];
}
