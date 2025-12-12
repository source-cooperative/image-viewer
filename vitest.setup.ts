import { locators, type Locator } from "vitest/browser";

locators.extend({
  getByClassName(className: string) {
      return `[class*="${className}"]`;
  },

  getById(id: string) {
    return `#${id}`;
  },
});

declare module "vitest/browser" {
  interface LocatorSelectors {
    getByClassName(className: string): Locator;
    getById(id: string): Locator;
  }
}
