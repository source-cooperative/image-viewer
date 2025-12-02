<script lang="ts">
  import OpenSeadragon from "openseadragon";
  import type { Viewer } from "openseadragon";
  import { onMount, onDestroy } from "svelte";

  let { imageUrl } = $props();

  let element: HTMLDivElement;
  let viewer: Viewer;

  onMount(() => {
    if (!imageUrl) {
      return;
    }

    viewer = OpenSeadragon({
      element: element,
      tileSources: {
        type: "image",
        url: imageUrl
      },
      maxZoomLevel: 2.5,
      minZoomLevel: 0.25,
      prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/5.0.1/images/"
    });
  });

  onDestroy(() => {
    viewer?.destroy();
  });
</script>

<div bind:this={element} class="absolute w-full h-full"></div>
