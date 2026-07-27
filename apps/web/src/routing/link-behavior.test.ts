import { describe, expect, it } from "vitest";
import { type LinkActivation, shouldLetBrowserHandle } from "./link-behavior";

const plainClick: LinkActivation = {
  altKey: false,
  button: 0,
  ctrlKey: false,
  defaultPrevented: false,
  metaKey: false,
  shiftKey: false,
};

describe("shouldLetBrowserHandle", () => {
  it("intercepts a plain left click", () => {
    expect(shouldLetBrowserHandle(plainClick)).toBe(false);
  });

  it("leaves modified clicks to the browser", () => {
    for (const modifier of ["altKey", "ctrlKey", "metaKey", "shiftKey"] as const) {
      expect(shouldLetBrowserHandle({ ...plainClick, [modifier]: true }), modifier).toBe(true);
    }
  });

  it("leaves non-primary buttons to the browser", () => {
    expect(shouldLetBrowserHandle({ ...plainClick, button: 1 })).toBe(true);
  });

  it("respects a click another handler already cancelled", () => {
    expect(shouldLetBrowserHandle({ ...plainClick, defaultPrevented: true })).toBe(true);
  });

  it("leaves links with a foreign target to the browser", () => {
    expect(shouldLetBrowserHandle(plainClick, "_blank")).toBe(true);
    expect(shouldLetBrowserHandle(plainClick, "_self")).toBe(false);
    expect(shouldLetBrowserHandle(plainClick, "")).toBe(false);
  });
});
