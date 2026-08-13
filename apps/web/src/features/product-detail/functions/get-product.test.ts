import { describe, expect, it } from "vitest";
import { getApplications } from "../../app-directory/functions/get-applications";
import { getProduct, getProductSlug } from "./get-product";

describe("getProduct", () => {
  it("returns undefined for an unknown slug", () => {
    expect(getProduct("does-not-exist")).toBeUndefined();
  });

  it("resolves the application and its posts for every known slug", () => {
    for (const application of getApplications()) {
      const product = getProduct(application.slug);

      expect(product?.application).toEqual(application);
      expect(product?.posts.every((post) => post.product === application.slug)).toBe(true);
    }
  });

  it("groups posts by content type and drops empty groups", () => {
    const product = getProduct(getApplications()[0].slug);

    expect(product).toBeDefined();
    for (const group of product?.groups ?? []) {
      expect(group.posts.length).toBeGreaterThan(0);
      expect(group.posts.every((post) => post.contentType === group.type)).toBe(true);
    }
  });
});

describe("getProductSlug", () => {
  it("extracts the slug from a product path", () => {
    expect(getProductSlug("/products/kusoge")).toBe("kusoge");
    expect(getProductSlug("/products/kusoge/")).toBe("kusoge");
  });

  it("returns undefined for a non-product path", () => {
    expect(getProductSlug("/apps")).toBeUndefined();
  });
});
