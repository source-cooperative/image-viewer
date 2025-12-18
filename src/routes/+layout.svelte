<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <title>Image Viewer</title>
</svelte:head>

{@render children()}
