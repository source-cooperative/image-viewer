<script lang="ts">
  import prettyBytes from "pretty-bytes";
  import { onMount } from "svelte";
  import { page } from "$app/state";

  import ImageViewer from "$lib/ImageViewer.svelte";

  const MAX_CONTENT_LENGTH_MB = 200;

  let searchParams: URLSearchParams = page.url.searchParams;
  let urlParam: string | null = $state(searchParams.get("url"));
  let errorMessage: string | null = $state(null);

  const validateImageUrl = async (url: string) => {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) {
      errorMessage = `Image URL is not valid: ${url}. Status: ${response.status}.`;
      console.error(errorMessage);
      return false;
    }

    const contentLength = parseInt(response.headers.get("Content-Length") ?? "-1");
    const maxContentLength = MAX_CONTENT_LENGTH_MB * 1024 * 1024;
    if (contentLength > maxContentLength) {
      errorMessage = `Image file is too large to display (${prettyBytes(contentLength).toLocaleUpperCase()}).`;
      console.error(errorMessage);
      return false;
    }

    return true;
  };

  onMount(async () => {
    if (!urlParam) {
      urlParam = null;
    } else {
      const imageUrlIsValid = await validateImageUrl(urlParam);
      if (!imageUrlIsValid) {
        urlParam = null;
      }
    }
  });
</script>

{#if urlParam && !errorMessage}
  <ImageViewer imageUrl={urlParam} />
{:else}
  <div class="h-screen w-screen flex flex-col items-center justify-center">
    <div class="max-w-200 p-8">
      {#if errorMessage}
        <p class="text-3xl font-semibold mb-4">Error</p>
        <p class="text-xl">
          {errorMessage}
        </p>
      {:else}
        <p class="text-3xl font-semibold mb-4">Valid image file URL required</p>
        <p class="text-xl">
          Please provide a valid image file URL via query parameter <code
            class="bg-source-200 dark:bg-source-800 text-source-800 dark:text-source-200 p-1 rounded-sm"
          >
            url
          </code>. Supported image formats include JPEG, PNG, GIF, SVG, WebP, AVIF, and BMP.
          Maximum allowed file size is {MAX_CONTENT_LENGTH_MB} MB.
        </p>
      {/if}
    </div>
  </div>
{/if}
