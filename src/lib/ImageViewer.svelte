<script lang="ts">
  // @ts-ignore
  import { enableGeoTIFFTileSource } from "geotiff-tilesource";
  import { Maximize2, Minimize2, Minus, Plus, RotateCw } from "lucide-svelte";
  import OpenSeadragon, { Viewer } from "openseadragon";
  import { onMount } from "svelte";

  let { imageUrl } = $props();

  let container: HTMLElement;
  let viewer: Viewer;
  let toolbar: HTMLElement;
  let zoomInButton: HTMLButtonElement;
  let zoomOutButton: HTMLButtonElement;
  let rotateRightButton: HTMLButtonElement;
  let rotateLeftButton: HTMLButtonElement;
  let fullPageButton: HTMLButtonElement;

  let isFullPage = $state(false);

  onMount(async () => {
    if (!imageUrl) {
      return;
    }

    // Enable TIFF support via geotiff-tilesource
    let tileSources: any;
    if (imageUrl.toLowerCase().endsWith(".tif") || imageUrl.toLowerCase().endsWith(".tiff")) {
      enableGeoTIFFTileSource(OpenSeadragon);
      tileSources = await (OpenSeadragon as any).GeoTIFFTileSource.getAllTileSources(imageUrl);
    } else {
      tileSources = {
        type: "image",
        url: imageUrl
      };
    }

    viewer = new Viewer({
      element: container,
      tileSources: tileSources,
      maxZoomLevel: 2.5,
      minZoomLevel: 0.25,
      showHomeControl: false,
      showRotationControl: true,

      // Custom bindings
      toolbar: toolbar,
      zoomInButton: zoomInButton,
      zoomOutButton: zoomOutButton,
      rotateLeftButton: rotateLeftButton,
      rotateRightButton: rotateRightButton,
      fullPageButton: fullPageButton
    });

    viewer.addHandler("full-page", () => {
      isFullPage = viewer.isFullPage();
    });
    isFullPage = viewer.isFullPage();
  });

  const buttonClasses = `
    bg-source-100 text-source-900 border-source-200
    hover:bg-source-200 hover:border-source-300
    dark:bg-source-900 dark:text-source-100 dark:border-source-800
    dark:hover:bg-source-800 dark:hover:border-source-700
    p-2 border-1
  `.trim();
  const iconSize = 24;
</script>

<div id="toolbar" bind:this={toolbar} class="absolute top-0 left-0 z-1 flex flex-col m-2 gap-1">
  <button bind:this={zoomInButton} class={buttonClasses}>
    <Plus size={iconSize} strokeWidth={2} />
  </button>
  <button bind:this={zoomOutButton} class={buttonClasses}>
    <Minus size={iconSize} strokeWidth={2} />
  </button>
  <button bind:this={rotateRightButton} class={buttonClasses}>
    <RotateCw size={iconSize} strokeWidth={2} />
  </button>
  <button bind:this={fullPageButton} class={buttonClasses}>
    {#if isFullPage}
      <Minimize2 size={iconSize} strokeWidth={2} />
    {:else}
      <Maximize2 size={iconSize} strokeWidth={2} />
    {/if}
  </button>
  <button bind:this={rotateLeftButton} class="hidden" disabled aria-hidden="true"></button>
</div>

<div id="viewer" bind:this={container} class="absolute w-full h-full z-0"></div>
