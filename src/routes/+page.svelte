<script lang="ts">
  import { page } from "$app/state";
  import ImageViewer from "$lib/ImageViewer.svelte";

  let searchParams: URLSearchParams = page.url.searchParams;
  let urlParam: string | null = searchParams.get("url");
</script>

<ImageViewer imageUrl={urlParam} />
