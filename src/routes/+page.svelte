<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import ImageViewer from "$lib/ImageViewer.svelte";

  const MAX_CONTENT_LENGTH_MB = 200;

  let searchParams: URLSearchParams = page.url.searchParams;
  let urlParam: string | null = searchParams.get("url");

  const validateImageUrl = async (url: string) => {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) {
      console.error(`Image URL is not valid: ${url}. Status: ${response.status}.`);
      return false;
    }

    const contentLength = parseInt(response.headers.get("Content-Length") ?? "-1");
    const maxContentLength = MAX_CONTENT_LENGTH_MB * 1024 * 1024;
    if (contentLength > maxContentLength) {
      console.error(
        `Image file is too large: ${contentLength} bytes. Max allowed: ${maxContentLength} bytes.`
      );
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

{#if urlParam}
  <ImageViewer imageUrl={urlParam} />
{:else}
  <div class="h-screen w-screen flex flex-col items-center justify-center">
    <div class="max-w-200 p-8">
      <p class="text-3xl font-semibold mb-4">Valid image URL required</p>
      <p class="text-xl">
        Please provide a valid image URL via query parameter <code
          class="bg-source-200 dark:bg-source-800 text-source-800 dark:text-source-200 p-1 rounded-sm"
        >
          url
        </code>. Supported image formats include JPEG, PNG, GIF, SVG, WebP, TIFF, AVIF, and BMP. Maximum allowed file size is {MAX_CONTENT_LENGTH_MB} MB.
      </p>
    </div>
  </div>
{/if}
