import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// `@testing-library/jest-dom/vitest` imports `vitest` from its own package
// directory, which pnpm's isolated node_modules does not expose. Registering the
// standalone matchers avoids that resolution problem.
expect.extend(matchers);

// Testing Library only auto-registers cleanup when Vitest globals are enabled.
afterEach(cleanup);
