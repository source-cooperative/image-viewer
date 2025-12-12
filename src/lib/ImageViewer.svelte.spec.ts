import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";

import ImageViewer from "./ImageViewer.svelte";

describe("ImageViewer", () => {
  it("should render image viewer canvas element", async () => {
    render(ImageViewer, {
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/d/db/Tree_of_Life_-_Shaker_-_painted_by_Hannah_Cohoon.JPG",
    });

    const canvas = page.getByClassName("openseadragon-canvas");
    await expect.element(canvas).toBeInTheDocument();
  });

  it("should render toolbar element", async () => {
    render(ImageViewer, {
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/d/db/Tree_of_Life_-_Shaker_-_painted_by_Hannah_Cohoon.JPG",
    });

    const toolbar = page.getById("toolbar");
    await expect.element(toolbar).toBeInTheDocument();
  });
});
