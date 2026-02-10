<script lang="ts">
  // @ts-ignore
  import { enableGeoTIFFTileSource } from "geotiff-tilesource";
  import { Maximize2, Minimize2, Minus, Plus, RotateCw } from "lucide-svelte";
  import OpenSeadragon, { Viewer } from "openseadragon";
  import { onMount } from "svelte";

  import Button from "$lib/Button.svelte";

  let { imageUrl } = $props();

  let container: HTMLElement;
  let viewer: Viewer;
  let toolbar: HTMLElement;
  let zoomInButton = $state<HTMLButtonElement>();
  let zoomOutButton = $state<HTMLButtonElement>();
  let rotateRightButton = $state<HTMLButtonElement>();
  let rotateLeftButton = $state<HTMLButtonElement>();
  let fullPageButton = $state<HTMLButtonElement>();

  let isFullPage = $state(false);

  onMount(async () => {
    if (!imageUrl) {
      return;
    }

    // Enable TIFF support via geotiff-tilesource
    let tileSources: any;
    const imageUrlFilename = new URL(imageUrl).pathname.split("/").pop()?.toLowerCase();
    if (imageUrlFilename?.endsWith(".tif") || imageUrlFilename?.endsWith(".tiff")) {
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

    if (fullPageButton) {
      fullPageButton.title = "Toggle full screen";
    }
    viewer.addHandler("full-page", () => {
      isFullPage = viewer.isFullPage();
    });
    isFullPage = viewer.isFullPage();
  });
</script>

<div id="toolbar" bind:this={toolbar} class="absolute top-0 left-0 z-1 flex flex-col m-2 gap-1">
  <Button bind:element={zoomInButton} icon={Plus} />
  <Button bind:element={zoomOutButton} icon={Minus} />
  <Button bind:element={rotateRightButton} icon={RotateCw} />
  <Button bind:element={fullPageButton} icon={isFullPage ? Minimize2 : Maximize2} />
  <Button bind:element={rotateLeftButton} hidden={true} />
</div>

<div id="viewer" bind:this={container} class="absolute w-full h-full z-0 bg-source-950"></div>
